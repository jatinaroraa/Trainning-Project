var mongoose = require("mongoose");

var table = new mongoose.Schema({
  id: {
    require: true,
    type: String,
  },
  table: [],
});

var tableData = mongoose.model("tabledata", table);
module.exports = tableData;
