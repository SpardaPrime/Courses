const User = require("../models/user");

module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  req.user = await User.findById(req.session.user._id);
  let count = req.user.cart.items.reduce(
    (total, item) => total + item.count,
    0
  );
  req.navBadge = count;
  next();
};
