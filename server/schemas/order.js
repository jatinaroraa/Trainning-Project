const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const food = new mongoose.Schema({
  id: {},
  name: {
    require: true,
    type: String,
  },
  number: {
    require: true,
    type: Number,
  },
  items: [],
  amount: {
    required: true,
    type: Number,
  },
  status: {
    required: true,
    type: String,
  },
  date: {},
  time: {},
  tableNo: {},
  taxes: [],
  totalTax: {},
});
// status = 1 preparing
// status = 2 prepared
// status = 3 settled

const orderData = mongoose.model("addorders", food);
module.exports = orderData;
