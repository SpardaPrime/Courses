const { Router } = require("express");
const router = Router();
const Course = require("../models/course");
const authMiddle = require("../middleware/auth");

const correctUserImg = (item) => {
  if (item.userId === null) {
    return item;
  } else {
    let { _id, title, price, img } = item;
    return {
      _id,
      title,
      price,
      img,
      userId: {
        ...item.userId,
        avatarUrl: "/" + item.userId.avatarUrl,
      },
    };
  }
};

const refactorTitle = (item) => {
  if (item.title.length > 35) {
    const { _id, title, rubric, price, img, description, userId } = item;
    return {
      _id,
      title: title.slice(0, 34) + "…",
      rubric,
      price,
      img,
      description,
      userId,
    };
  } else {
    return item;
  }
};

router.get("/", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name avatarUrl")
    .lean();
  const sortedCourse = courses
    .sort((a, b) => (a.title > b.title ? +1 : -1))
    .map(refactorTitle);
  res.render("courses", {
    title: "courses",
    isCourses: true,
    userId: req.user ? req.user._id.toString() : null,
    courses: sortedCourse,
    val: null,
    found: true,
  });
});

router.get("/business", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name avatarUrl")
    .lean();
  const dev = courses
    .filter((item) => item.rubric === "Business")
    .map(correctUserImg);
  const sortedCourse = dev
    .sort((a, b) => (a.title > b.title ? +1 : -1))
    .map(refactorTitle);

  res.render("courses", {
    title: "courses",
    isCourses: true,
    userId: req.user ? req.user._id.toString() : null,
    courses: sortedCourse,
    val: null,
    found: true,
  });
});

router.get("/design", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name avatarUrl")
    .lean();
  const dev = courses
    .filter((item) => item.rubric === "Design")
    .map(correctUserImg);
  const sortedCourse = dev
    .sort((a, b) => (a.title > b.title ? +1 : -1))
    .map(refactorTitle);
  res.render("courses", {
    title: "courses",
    isCourses: true,
    userId: req.user ? req.user._id.toString() : null,
    courses: sortedCourse,
    val: null,
    found: true,
  });
});

router.get("/music", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name avatarUrl")
    .lean();
  const dev = courses
    .filter((item) => item.rubric === "Music")
    .map(correctUserImg);
  const sortedCourse = dev
    .sort((a, b) => (a.title > b.title ? +1 : -1))
    .map(refactorTitle);

  res.render("courses", {
    title: "courses",
    isCourses: true,
    userId: req.user ? req.user._id.toString() : null,
    courses: sortedCourse,
    val: null,
    found: true,
  });
});

router.get("/develop", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name avatarUrl")
    .lean();
  const dev = courses
    .filter((item) => item.rubric === "Development")
    .map(correctUserImg);
  const sortedCourse = dev
    .sort((a, b) => (a.title > b.title ? +1 : -1))
    .map(refactorTitle);

  res.render("courses", {
    title: "courses",
    isCourses: true,
    userId: req.user ? req.user._id.toString() : null,
    courses: sortedCourse,
    val: null,
    found: true,
  });
});

router.get("/search", async (req, res) => {
  try {
    const data = await Course.find()
      .populate("userId", "email name avatarUrl")
      .lean();
    const courses = data.filter(({ title }) =>
      title.toUpperCase().includes(req.query.name.toUpperCase())
    );
    const sortedCourse = courses
      .sort((a, b) => (a.title > b.title ? +1 : -1))
      .map(refactorTitle);

    const exp = sortedCourse.map(correctUserImg);
    res.render("courses", {
      title: "courses",
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses: exp,
      val: req.query.name,
      found: false,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", authMiddle, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  try {
    const course = await Course.findById(req.params.id).lean();

    if (course.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/courses");
    }

    res.render("course-edit", {
      title: "Edit Course",
      course,
    });
  } catch (e) {
    console.log(e);
  }
});
router.post("/edit", authMiddle, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Course.findByIdAndUpdate(id, req.body);
  res.redirect("/courses");
});

router.post("/edit/delete/:id", authMiddle, async (req, res) => {
  const id = req.params.id;
  await Course.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });
  res.redirect("/courses");
});

router.get("/:id", async (req, res) => {
  let person = true;
  if (!req.user) {
    person = false;
  }
  const course = await Course.findById(req.params.id).populate("userId").lean();
  res.render("course", {
    layout: "empty",
    title: `Course ${course.title}`,
    course,
    person,
  });
});

router.post("/courseBuy", async (req, res) => {
  const id = req.body.id;
  const course = await Course.findById(id).populate("userId").lean();
  await req.user.addToCart(course);
  res.render("course", {
    layout: "empty",
    title: `Course ${course.title}`,
    course,
    buy: true,
  });
});

module.exports = router;
