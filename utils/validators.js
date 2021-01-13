const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Incorrect email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email adress is busy");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password must be min 6 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be min 3 symbols")
    .trim(),
];

exports.courseValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Min length of symbols 3")
    .trim(),
  body("price").isNumeric().withMessage("Input correct price"),
  body("url", "Input corect Url image").isURL(),
];
