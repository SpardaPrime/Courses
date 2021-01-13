const { Router } = require("express");
const { validationResult } = require("express-validator");
const Course = require("../models/course");
const router = Router();
const pathMiddleware = require("../middleware/auth");
const courseValidators = require("../utils/validators");

router.get("/", pathMiddleware, (req, res) => {
  res.render("add", {
    title: "add cource",
    isAdd: true,
  });
});

router.post("/", pathMiddleware, async (req, res) => {
  try {
    const { title, rubric, price, url, description } = req.body;

    const cource = new Course({
      title,
      rubric,
      price,
      img: url,
      description,
      userId: req.user,
      navBadge: req.navBadge,
    });

    await cource.save();
    res.redirect("/courses");
  } catch (e) {
    console.log("e,", e);
  }
});

module.exports = router;
