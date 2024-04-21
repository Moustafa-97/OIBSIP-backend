const mongoose = require("mongoose");

const RawItems = new mongoose.Schema([
  {
    ItemName: {
      type: String,
    },
    Count: {
      type: Number,
    },
  },
]);
const rawItem = mongoose.model("rawItem", RawItems);

module.exports = { rawItem };
