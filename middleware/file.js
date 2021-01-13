const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(path.join(__dirname, "../", "/images"))) {
      fs.mkdirSync(path.join(__dirname, "../", "/images"), (err) => {
        if (err) return console.log(err);
      });
    }
    cb(null, "images");
  },
  filename(req, file, cb) {
    cb(null, "avatar" + Date.now().toString() + "-" + file.originalname);
  },
});

const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
