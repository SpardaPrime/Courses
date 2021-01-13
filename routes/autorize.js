const { Router } = require("express");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");
const router = Router();
const bcrypt = require("bcryptjs");

const registConf = require("../emails/registration");
const resetEmail = require("../emails/reset");
const { registerValidators } = require("../utils/validators");
const key = require('../keys');


const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: key.keyApiMail },
  })
);

router.get("/", (req, res) => {
  res.render("./aut/aut", {
    title: "Authorization",
    isAut: true,
    errorCandidate: req.flash("errorCandidate"),
    wrongUser: req.flash("wrongUser"),
    wrongPass: req.flash("wrongPass"),
    registError: req.flash("registError"),
  });
});

router.post("/enter", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    req.flash("wrongUser", "Wrong email");
    res.redirect("/authorization#test1");
  }
  const passTest = await bcrypt.compare(password, user.password);

  if (!passTest) {
    req.flash("wrongPass", "Wrong password");
    res.redirect("/authorization#test1");
  } else {
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/authorization");
  });
});

router.post("/registration", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = await req.body;
    const candidate = await User.findOne({ email }).lean();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registError", errors.array()[0].msg);
      return res.status(422).redirect("/authorization#test2");
    }

    if (candidate) {
      req.flash("errorCandidate", "Пользователь с таким email уже существует");
      res.redirect("/authorization");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashPassword,
        name,
        cart: { items: [] },
      });
      await user.save();

      await transporter.sendMail(registConf(email, password, name), (err) => {
        if (err) console.log(err);
      });
      res.redirect("/authorization#test1");
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/reset", (req, res) => {
  res.render("./aut/reset", {
    title: "Forgot password",
    error: req.flash("resetError"),
  });
});

router.post("/reset/email", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("resetError", "Ops, error. Please trye later again...");
        return res.redirect("/authorization/reset");
      }

      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));

        res.redirect("/authorization#test1");
      } else {
        req.flash("resetError", "Wrong email");
        res.redirect("/authorization/reset");
      }
    });
  } catch (e) {}
});

router.get("/reset/:token", async (req, res) => {
  if (!req.params.token) {
    return res.redirect("/authorization#test1");
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect("/authorization#test1");
    } else {
      res.render("./aut/password", {
        title: "Set new password",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/reset/resetpassword", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/authorization#test1");
    } else {
      req.flash("loginError", "Time of life token is gone");
      res.redirect("/authorization#test1");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
