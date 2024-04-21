const mongoose = require("mongoose");
const { type } = require("os");

const Orders = new mongoose.Schema({
  orderDetails: {
    type: Object,
  },
  totalPrice: {
    type: Number,
  },
  payment: {
    type: String,
  },
  _sessionId: {
    type: String,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

const order = mongoose.model("order", Orders);
module.exports = { order };
