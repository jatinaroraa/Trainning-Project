const mongoose = require("mongoose");

const menue = new mongoose.Schema({
  // id: {},
  category: {},

  superCategory: {},

  name: {
    require: true,
    type: String,
  },
  price: {
    require: true,
    type: Number,
  },
  tags: [],
  recomendation: [],

  taxes: [],
});

const menueData = mongoose.model("menuData", menue);
module.exports = menueData;
