const { Router } = require("express");
const router = Router();
const Course = require("../models/course");

const sliceDescription = (item) => {
  if (item.description.length > 700) {
    const { _id, title, rubric, price, img, description, userId } = item;
    return {
      _id,
      title,
      rubric,
      price,
      img,
      description: description.slice(0, 700) + "...",
      userId,
    };
  } else {
    return item;
  }
};

router.get("/", async (req, res) => {
  let person = false;
  if (req.user) {
    person = req.user.name;
  }
  const courses = await Course.find().lean();
  const courses1 = courses
    .sort((a, b) => (a.title > b.title ? +1 : -1))
    .map(sliceDescription);
  const nav = [
    { title: "Develop", link: "/courses/develop" },
    { title: "Business", link: "/courses/business" },
    { title: "Design", link: "/courses/design" },
    { title: "Music", link: "/courses/music" },
    { title: "All", link: "/courses" },
  ];

  const dev = courses1.filter(
    ({ rubric }) => rubric.toUpperCase() === "DEVELOPMENT"
  );
  const buis = courses1.filter(
    ({ rubric }) => rubric.toUpperCase() === "Business".toUpperCase()
  );
  const design = courses1.filter(
    ({ rubric }) => rubric.toUpperCase() === "DESIGN"
  );
  const music = courses1.filter(
    ({ rubric }) => rubric.toUpperCase() === "MUSIC"
  );
  const latest = courses.filter((item, i) => i < 12);
  res.render("index", {
    title: "Main page",
    isHome: true,
    hello: person,
    courses: courses1,
    nav,
    dev,
    buis,
    design,
    music,
    latest,
  });
});

router.get("/course", async (req, res) => {
  const courses = await Course.find().lean();
  res.status(200).json(courses);
});

router.get("/sectionDev", async (req, res) => {
  const courses = await Course.find().lean();
  res
    .status(200)
    .json(
      courses.filter(({ rubric }) => rubric.toUpperCase() == "DEVELOPMENT")
        .length
    );
});

router.get("/sectionBus", async (req, res) => {
  const courses = await Course.find().lean();
  res
    .status(200)
    .json(
      courses.filter(({ rubric }) => rubric.toUpperCase() == "BUSINESS").length
    );
});

router.get("/sectionDesign", async (req, res) => {
  const courses = await Course.find().lean();
  res
    .status(200)
    .json(
      courses.filter(({ rubric }) => rubric.toUpperCase() == "DESIGN").length
    );
});

router.get("/sectionMusic", async (req, res) => {
  const courses = await Course.find().lean();
  res
    .status(200)
    .json(
      courses.filter(({ rubric }) => rubric.toUpperCase() == "MUSIC").length
    );
});

router.get("/latestAded", async (req, res) => {
  res.status(200).json(12);
});

module.exports = router;
