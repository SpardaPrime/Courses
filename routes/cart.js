const { Router } = require("express");
const Course = require("../models/course");
const User = require("../models/user");
const router = Router();
const authMiddle = require("../middleware/auth");

function mapCartItems(cart) {
  return cart.items.map((item) => {
    return {
      ...item.courseId,
      count: item.count,
    };
  });
}

function computePrice(courses) {
  return courses.reduce(
    (total, course) => total + course._doc.price * course.count,
    0
  );
}

router.post("/add", authMiddle, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/cart");
});

router.delete("/remove/:id", authMiddle, async (req, res) => {
  await req.user.deleteToCart(req.params.id);
  const cart = await req.user.populate("cart.items.courseId").execPopulate();

  res.status(200).json(cart);
});

router.put("/addone/:id", authMiddle, async (req, res) => {
  let id = {
    _id: req.params.id,
  };
  await req.user.addToCart(id);
  const cart = await req.user.populate("cart.items.courseId").execPopulate();

  res.status(200).json(cart);
});

router.get("/", authMiddle, async (req, res) => {
  const user = await req.user.populate("cart.items.courseId").execPopulate();
  const courses = mapCartItems(user.cart);

  res.render("cart", {
    title: "Cart",
    isCart: true,
    courses,
    price: computePrice(courses),
  });
});

router.post("/delAll", authMiddle, async (req, res) => {
  try {
    await req.user.clearCart();
    res.redirect("/cart");
  } catch (e) {
    console.log(e);
  }
});

router.get("/getcount", authMiddle, async (req, res) => {
  try {
    res.status(200).json(req.navBadge);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
