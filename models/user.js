const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function ({ _id }) {
  const items = [...this.cart.items];
  const idx = items.findIndex(
    ({ courseId }) => courseId.toString() === _id.toString()
  );
  if (idx >= 0) {
    items[idx].count++;
  } else {
    items.push({
      courseId: _id,
      count: 1,
    });
  }
  this.cart = { items };
  this.save();
};

userSchema.methods.deleteToCart = function (id) {
  const items1 = [...this.cart.items];
  const idx = items1.findIndex(
    ({ courseId }) => courseId.toString() === id.toString()
  );
  let items;
  if (items1[idx].count > 1) {
    items = items1;
    items[idx].count--;
  } else {
    items = [...items1.slice(0, idx), ...items1.slice(idx + 1)];
  }
  this.cart = { items };
  this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  this.save();
};

module.exports = model("User", userSchema);
