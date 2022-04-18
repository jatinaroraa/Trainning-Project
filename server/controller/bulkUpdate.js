const userdata = require("../schemas/schema");
const cookie = require("cookie-parser");
const orderData = require("../schemas/order");
const menueData = require("../schemas/menue");
const jwt = require("jsonwebtoken");
var tableData = require("../schemas/table");
var category = require("../schemas/category");
var superCata = require("../schemas/supercategories");
var auth = require("./auth");
var async = require("async");
var mongoose = require("../database/database");

var bulkupdate = (req, res) => {
  try {
    console.log(req.body, "data");
    var { id, status } = req.body;

    var bulk = orderData.collection.initializeUnorderedBulkOp();
    var newid = id.map((item) => {
      return new mongoose.Types.ObjectId(item);
    });

    bulk.find({ _id: { $in: newid } }).update({ $set: { status: status } });

    bulk.execute(function (err, result) {
      return res.json({ code: 200, result: result });
    });
  } catch (e) {
    console.log(e, "error in bulk file");
    return res.json({ code: 400, result: e });
  }
};
module.exports = bulkupdate;
