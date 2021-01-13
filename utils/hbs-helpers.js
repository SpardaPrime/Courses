module.exports = {
  ifeq: function (a, b, options) {
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  lowcase: function (str) {
    if (str == "Development") {
      return "develop";
    }
    return str.toLowerCase();
  },
};
