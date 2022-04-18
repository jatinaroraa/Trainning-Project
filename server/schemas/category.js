const mongoose = require("mongoose");
var cata = new mongoose.Schema({
  id: {},
  superCategoryId: {},
  superCategoryName: {},
  name: {
    type: String,
    require: true,
  },
});

var category = mongoose.model("category", cata);
module.exports = category;
