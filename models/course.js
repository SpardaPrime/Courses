const { Schema, model } = require("mongoose");

const course = new Schema({
  title: {
    type: String,
    required: true,
  },
  rubric: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
  },
  description: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Course", course);
