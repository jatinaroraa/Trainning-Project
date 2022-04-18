const mongoose = require("mongoose");

var superCategories = new mongoose.Schema({
  name: {
    type: String,
  },
});

const superCata = mongoose.model("supercategories", superCategories);
module.exports = superCata;
