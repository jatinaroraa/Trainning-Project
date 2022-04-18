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

const matrices = async (req, res) => {
  var token = req.headers.token;
  var id = await auth.verifyToken(token);
  var preparing = await orderData.find({
    $and: [
      { $or: [{ status: "preparing" }, { status: "prepared" }] },
      { id: id._id },
    ],
  });
  var prepared = await orderData.find({
    $and: [{ status: "settled" }, { id: id._id }],
  });

  var topitem = await orderData.aggregate([
    { $unwind: "$items" },
    { $match: { id: id._id } },

    { $group: { _id: "$items.name", qty: { $sum: "$items.qty" } } },
    { $sort: { qty: -1 } },
  ]);

  var leastitem = await orderData.aggregate([
    { $unwind: "$items" },
    { $match: { id: id._id } },

    { $group: { _id: "$items.name", qty: { $sum: "$items.qty" } } },
    { $sort: { qty: 1 } },
  ]);

  var totalCustomers = await orderData.aggregate([
    { $match: { id: id._id } },
    { $group: { _id: "$number", totalCustomer: { $sum: 1 } } },
  ]);

  var topvisited = await orderData.aggregate([
    { $match: { id: id._id } },

    { $group: { _id: "$name", totalvisited: { $sum: 1 } } },
    { $sort: { totalvisited: -1 } },
  ]);

  var onceVisit = await orderData.aggregate([
    { $match: { id: id._id } },
    {
      $group: {
        _id: "$name",
        number: { $first: "$number" },
        totalvisited: { $sum: 1 },
      },
    },
    { $sort: { totalvisited: 1 } },
    { $match: { totalvisited: { $lt: 2 } } },
  ]);

  var today = new Date().toLocaleDateString().split("/");
  var setdate = `01/${today[1]}/${today[2]}`;

  var d = new Date();

  var monthly = await orderData.aggregate([
    { $match: { $and: [{ date: { $gte: setdate } }, { id: id._id }] } },
    {
      $group: {
        _id: "$name",

        monthlysale: { $sum: "$amount" },
      },
    },
  ]);
  var sale = 0;
  for (var i = 0; i < monthly.length; i++) {
    sale = sale + monthly[i].monthlysale;
  }

  var timeData = await orderData.aggregate([
    { $match: { id: id._id } },
    {
      $group: {
        // _id: { $hour: "$time" },
        _id: {
          $hour: {
            date: "$time",
            timezone: "-0630",
          },
        },
        table: { $first: "$name" },

        total: { $count: {} },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  var timeItem = await orderData.aggregate([
    { $unwind: "$items" },
    { $match: { id: id._id } },
    {
      $group: {
        _id: { $hour: { date: "$time", timezone: "-0630" } },
        item: { $first: "$items" },
        count: { $count: {} },
      },
    },
    { $sort: { count: -1 } },
  ]);

  var totalTax = await orderData.aggregate([
    { $unwind: "$taxes" },
    {
      $group: {
        _id: "$taxes.name",
        sum: { $sum: "$taxes.totalTax" },
        count: { $count: {} },
      },
    },
  ]);
  var itemData = await orderData.aggregate([
    { $unwind: "$items" },
    { $unwind: "$items.taxes" },
    {
      $group: {
        _id: {
          itemsname: "$items.name",
          taxname: "$items.taxes.name",
        },
        sum: { $sum: "$items.taxes.tax" },
      },
    },
    { $sort: { "_id.taxname": 1 } },
    {
      $group: {
        _id: {
          itemsname: "$_id.itemsname",
        },
        taxes: {
          $push: {
            taxName: "$_id.taxname",
            sum: "$sum",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        itemsName: "$_id.itemsname",
        taxes: "$taxes",
      },
    },
  ]);
  var tags = await menueData.aggregate([
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        dishname: { $push: "$name" },
      },
    },
  ]);

  var senddata = {
    topvisited: topvisited[0]._id,
    topitem: topitem[0]._id,
    monthlysale: sale,
    leastselling: leastitem[0]._id,
    onceVisit: onceVisit,
    totalCustomer: totalCustomers.length,
    timeData: timeData,
    preparing: preparing.length,
    prepared: prepared.length,
    timeItem: timeItem,
    itemsTaxes: itemData,
    dishesTags: tags,
    totalTax: totalTax,
  };

  return res.json(senddata);
};

var mat = function (req, res) {
  var token = req.headers.token;

  var id = auth.verifyToken(token).then((id) => {
    async.series(
      [
        function (callback) {
          orderData.aggregate(
            [
              { $unwind: "$items" },
              { $match: { id: id._id } },

              { $group: { _id: "$items.name", qty: { $sum: "$items.qty" } } },
              { $sort: { qty: -1 } },
            ],
            function (err, rs) {
              callback(null, { topitem: rs[0]._id });
            }
          );
        },
        function (callback) {
          orderData.aggregate(
            [
              { $unwind: "$items" },
              { $match: { id: id._id } },

              { $group: { _id: "$items.name", qty: { $sum: "$items.qty" } } },
              { $sort: { qty: 1 } },
            ],
            function (err, rs) {
              callback(null, {
                leastselling: rs[0]._id,
              });
            }
          );
        },
        function (callback) {
          // totalCustomers
          orderData.aggregate(
            [
              { $match: { id: id._id } },
              { $group: { _id: "$number", totalCustomer: { $sum: 1 } } },
            ],
            function (err, rs) {
              callback(null, {
                totalCustomer: rs.length,
              });
            }
          );
        },
        function (callback) {
          // topvisited
          orderData.aggregate(
            [
              { $match: { id: id._id } },

              { $group: { _id: "$name", totalvisited: { $sum: 1 } } },
              { $sort: { totalvisited: -1 } },
            ],
            function (err, rs) {
              callback(null, {
                topvisited: rs[0]._id,
              });
            }
          );
        },
        function (callback) {
          // oncevisit
          orderData.aggregate(
            [
              { $match: { id: id._id } },
              {
                $group: {
                  _id: "$name",
                  number: { $first: "$number" },
                  totalvisited: { $sum: 1 },
                },
              },
              { $sort: { totalvisited: 1 } },
              { $match: { totalvisited: { $lt: 2 } } },
            ],
            function (err, rs) {
              callback(null, { onceVisit: rs });
            }
          );
        },
        function (callback) {
          var today = new Date().toLocaleDateString().split("/");
          var setdate = `01/${today[1]}/${today[2]}`;

          var d = new Date();
          // monthly
          orderData.aggregate(
            [
              {
                $match: { $and: [{ date: { $gte: setdate } }, { id: id._id }] },
              },
              {
                $group: {
                  _id: "$name",

                  monthlysale: { $sum: "$amount" },
                },
              },
              { $group: { _id: null, sum: { $sum: "$monthlysale" } } },
            ],
            function (err, rs) {
              callback(null, { monthlysale: rs });
            }
          );
        },
        function (callback) {
          // time data
          orderData.aggregate(
            [
              { $match: { id: id._id } },
              {
                $group: {
                  // _id: { $hour: "$time" },
                  _id: {
                    $hour: {
                      date: "$time",
                      timezone: "-0630",
                    },
                  },
                  table: { $first: "$name" },

                  total: { $count: {} },
                },
              },
              { $sort: { _id: 1 } },
            ],
            function (err, rs) {
              callback(null, { timeData: rs });
            }
          );
        },
        function (callback) {
          // time item
          orderData.aggregate(
            [
              { $unwind: "$items" },
              { $match: { id: id._id } },
              {
                $group: {
                  _id: { $hour: { date: "$time", timezone: "-0630" } },
                  item: { $first: "$items" },
                  count: { $count: {} },
                },
              },
              { $sort: { count: -1 } },
            ],
            function (err, rs) {
              callback(null, { timeItem: rs });
            }
          );
        },
        function (callback) {
          // total tax
          orderData.aggregate(
            [
              { $unwind: "$taxes" },
              {
                $group: {
                  _id: "$taxes.name",
                  sum: { $sum: "$taxes.totalTax" },
                  count: { $count: {} },
                },
              },
            ],
            function (err, rs) {
              callback(null, { totalTax: rs });
            }
          );
        },
        function (callback) {
          // item data
          orderData.aggregate(
            [
              { $unwind: "$items" },
              { $unwind: "$items.taxes" },
              {
                $group: {
                  _id: {
                    itemsname: "$items.name",
                    taxname: "$items.taxes.name",
                  },
                  sum: { $sum: "$items.taxes.tax" },
                },
              },
              { $sort: { "_id.taxname": 1 } },
              {
                $group: {
                  _id: {
                    itemsname: "$_id.itemsname",
                  },
                  taxes: {
                    $push: {
                      taxName: "$_id.taxname",
                      sum: "$sum",
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  itemsName: "$_id.itemsname",
                  taxes: "$taxes",
                },
              },
            ],
            function (err, rs) {
              callback(null, { itemData: rs });
            }
          );
        },
        function (callback) {
          // tags
          menueData.aggregate(
            [
              { $unwind: "$tags" },
              {
                $group: {
                  _id: "$tags",
                  dishname: { $push: "$name" },
                },
              },
            ],
            function (err, rs) {
              callback(null, { tags: rs });
            }
          );
        },
        function (callback) {
          orderData.aggregate(
            [
              {
                $match: {
                  id: id._id,
                },
              },
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: -1 } },
            ],
            function (err, rs) {
              callback(null, { status: rs });
            }
          );
        },
      ],
      function (err, result) {
        var obj = {
          topitem: result[0].topitem,
          leastselling: result[1].leastselling,
          totalCustomer: result[2].totalCustomer,
          topvisited: result[3].topvisited,
          onceVisit: result[4].onceVisit,
          monthlysale: result[5].monthlysale[0].sum,
          timeData: result[6].timeData,
          timeItem: result[7].timeItem,
          totalTax: result[8].totalTax,
          itemsTaxes: result[9].itemData,
          dishesTags: result[10].tags,
          preparing: result[11].status[1].count,

          prepared: result[11].status[2].count,
        };
        return res.json(obj);
      }
    );
  });
};
module.exports = mat;
