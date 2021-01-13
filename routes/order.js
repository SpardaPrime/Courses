const { Router } = require("express");
const router = Router();
const Order = require("../models/order");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();
    const courses = user.cart.items.map(({ count, courseId }) => {
      return {
        course: { ...courseId },
        count,
      };
    });
    console.log("ADDDD ORDER", courses);
    const order = new Order({
      user: {
        name: user.name,
        userId: user._id,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();
    res.redirect("/order");
  } catch (e) {
    console.log(e);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const data = await Order.find({ "user.userId": req.user._id }).lean();
  let total = data
    .map((item) => item.courses.map((item) => item.count * item.course.price))
    .map((item) => {
      if (item.length > 1) {
        let num = 0;
        item.forEach((i) => {
          num += i;
        });
        return num;
      } else {
        return +item.toString();
      }
    });
  data.forEach((item, i) => (data[i].total = total[i]));

  res.render("order", {
    title: "Order",
    isOrder: true,
    data,
  });
});

router.post("/delorderlist", authMiddleware, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.body.id);
    res.redirect("/order");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
