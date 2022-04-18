const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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

const register = async function (req, res) {
  const { email, password, cpassword } = req.body;

  const response = await userdata.findOne({ email: email });
  if (response) {
    return res.json({ code: "400", mess: "email already exist" });
  }

  const data = new userdata({
    email: email,
    password: password,
    cpassword: cpassword,
  });

  try {
    const registered = await data.save();
    var table = [];

    for (var i = 1; i <= 5; i++) {
      var t = { tableNo: i, name: null, fill: false };
      table.push(t);
    }
    var tableD = new tableData({
      id: registered._id,
      table: table,
    });
    var ans = await tableD.save();

    return res.json({ code: 200, table: ans });
  } catch (error) {
    res.json(error);
  }
};

const login = async (req, res) => {
  // var { email } = req.query;

  // var id = await userdata.findOne({ email: email });
  res.cookie("token", token, {
    expires: new Date(Date.now() + 6000000),
  });
  var id = await auth.verifyToken(token);

  return res.json({ code: "200", token: token, id: id._id });
};
const home = function (req, res) {
  res.json({ code: 200 });
};

const loginget = (req, res) => {
  res.send("loginget page");
};

const about = (req, res) => {
  // res.cookie("about", "valueeeee");
  const email = req.user;
  // console.log(req.user, "about page");
  return res.json({ code: 200, email: email });
};
var testing = (req, res) => {
  console.log(req.headers);
};
const dashboard = async (req, res) => {
  orderData
    .find()
    .then((data) => {
      console.log(data, "order data");
      return res.json(data);
    })
    .catch((e) => {
      console.log(e);
      return res.json(e);
    });
};

const addOrder = async (req, res) => {
  var token = req.headers.token;
  var id = await auth.verifyToken(token);
  const { name, number, items, amount, status, tableNo, taxes, totalTax } =
    req.body;

  // return res.json({ id: id._id });
  // console.log(req.body);
  // return res.json({ mess: "check" });

  // return res.json({ body: req.body, headers: req.headers });
  // var response;
  // orderData
  //   .findOneAndUpdate({ number: number }, { $push: { items: items } })
  //   .then(function (ress) {
  //     console.log(ress, "add data");
  //     if (ress == null) newone();
  //     else return res.json({ code: 200 });
  //   });
  var date = new Date().toLocaleDateString();
  var time = new Date();

  const data = new orderData({
    id: id._id,
    name: name,
    number: number,
    items: items,
    amount: amount,
    status: status,
    date: date,
    time: time,
    tableNo: tableNo,
    taxes: taxes,
    totalTax: totalTax,
  });

  data
    .save()
    .then((saved) => {
      console.log(saved, "saved data");
      // update table no
      if (tableNo != null)
        tableData
          .findOneAndUpdate(
            { $and: [{ "table.tableNo": tableNo }, { id: id._id }] },
            { $set: { "table.$.id": saved._id, "table.$.fill": true } }
          )
          .then(function (it) {
            console.log(it, "table data saved");
          });
    })
    .catch((e) => {
      console.log(e);
      return res.json({ code: 400 });
    });

  // console.log(items, "add order");
  return res.json({ code: 200, data: data });
};
const preparingOrders = async (req, res) => {
  // const { status } = req.body;
  var token = req.headers.token;
  // console.log(req.headers);
  // return;
  var id = await auth.verifyToken(token);
  var { pageno = 1 } = req.query;
  var limit = 10;
  var length = await orderData.find({
    $and: [
      { $or: [{ status: "preparing" }, { status: "prepared" }] },
      { id: id._id },
    ],
  });

  var preparing = "preparing";
  orderData
    .find({
      $and: [
        { $or: [{ status: "preparing" }, { status: "prepared" }] },
        { id: id._id },
      ],
    })

    .limit(limit * 1)
    .skip((pageno - 1) * limit)
    .then((data) => {
      if (data)
        return res.json({ code: 200, length: length.length, data: data });
      return res.json({ code: 400 });
    })
    .catch((e) => {
      console.log(e);
      return res.json({ code: 400 });
    });
};
const preparedOrders = async (req, res) => {
  var token = req.headers.token;
  var id = await auth.verifyToken(token);
  var { limit = 10, page = 1 } = req.query;

  var length = await orderData.find({
    $and: [{ status: "settled" }, { id: id._id }],
  });
  var prepared = "prepared";
  orderData
    .find({
      $and: [{ status: "settled" }, { id: id._id }],
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .then((data) => {
      if (data)
        return res.json({ code: 200, length: length.length, data: data });
      return res.json({ code: 400 });
    })
    .catch((e) => {
      console.log(e);
      return res.json({ code: 400 });
    });
};
const menu = async (req, res) => {
  // fetch order
  try {
    superCata.find().then((superdata) => {
      category.find().then((catadata) => {
        menueData
          .find()
          .then((menudata) => {
            return [
              { superdata: superdata, catadata: catadata, menudata: menudata },
            ];
          })
          .then((data) => {
            // all data

            var result = data[0].superdata.map((sp) => {
              var cata = data[0].catadata.map((cd) => {
                if (sp._id.toString() == cd.superCategoryId) {
                  var menu = data[0].menudata.filter((menudata) => {
                    return cd._id.toString() == menudata.category.categoryId;
                  });

                  var arr = { category: cd, menu: menu };

                  return arr;
                }
              });
              var catadata = cata.filter((item) => {
                return item != null;
              });

              var arrp = { supercategory: sp, categoryData: catadata };
              return arrp;
            });
            const d = new Date();
            let hour = d.getHours();
            var recommend = [];
            result.map((item) => {
              if (item.supercategory.name == "south indian" && hour < 13) {
                recommend = item;
              } else if (
                item.supercategory.name == "chinese" &&
                hour > 13 &&
                hour <= 18
              ) {
                recommend = item;
              } else if (item.supercategory.name == "italian" && hour > 18) {
                recommend = item;
              }
            });
            return res.json({
              length: result.length,
              recommend: recommend,
              res: result,
            });
          });
      });
    });
  } catch (e) {
    return res.json({ code: 400, error: e });
  }
};
var addCategory = async function (req, res) {
  try {
    var { token } = req.headers;

    // return;
    var id = await auth.verifyToken(token);
    var { name, superCategoryId, superCategoryName } = req.body;
    var data = new category({
      id: id._id,
      name: name,
      superCategoryId: superCategoryId,
      superCategoryName: superCategoryName,
    });
    data.save();
    res.json({ mess: `category added ${name}` });
  } catch (error) {
    res.json({ error: error });
  }
};
const addMenue = async (req, res) => {
  // here id is category id
  const {
    name,
    price,
    taxes,
    tags,
    categoryName,
    categoryId,
    superCategoryId,
    superCategoryName,
    recomendation,
  } = req.body;
  // var id = await category.find({ name: Category });

  // return;
  const menue = new menueData({
    // id: id[0]._id,
    category: {
      categoryId: categoryId,
      categoryName: categoryName,
    },

    superCategory: {
      superCategoryId: superCategoryId,
      superCategoryName: superCategoryName,
    },
    recomendation: recomendation,
    name: name,
    price: price,
    tags: tags,
    taxes: taxes,
  });
  menue
    .save()
    .then((response) => {
      if (response) return res.json({ code: 200, mess: response });
      return res.json({ code: 400, mess: "data not saved" });
    })
    .catch((e) => {
      console.log(e);
      return res.json({ code: 400, mess: "data not saved" });
    });
};
const KEY = "tokenkeyforlogin";

const verifyy = (req, res) => {
  const { token } = req.body;
  // console.log(token);
  const ver = jwt.verify(token, KEY);
  // console.log(ver, "verify");
  if (ver) return res.json({ code: 200 });
  else return res.json({ code: 400 });
};
const orderstatus = (req, res) => {
  // var token = req.headers.token;
  // var idd = await auth.verifyToken(token);

  const { id, status, tableNo } = req.body;

  orderData
    .findByIdAndUpdate(id, { status: status })
    .then(function (user) {
      return res.json({ code: 200, mess: "status updated" });
    })
    .catch((e) => {
      console.log(e);
    });
};

var recommend = async (req, res) => {
  var date = new Date();
  date.setMonth(date.getMonth() - 4);

  // var cart = ["624406cd29337d6f3bfdc8cc"];
  var cart = JSON.parse(req.query.data);
  var cartLength = cart.length;
  var data = await orderData.aggregate([
    {
      $match: {
        $expr: { $setIsSubset: [cart, "$items.id"] },
        time: { $gt: date },
      },
    },
    // {
    //   $match: {
    //     items: { $elemMatch: { id: { $in: cart } } },
    //   },
    // },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.id",
        itemName: { $first: "$items.name" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $skip: cartLength },

    { $limit: 4 },
  ]);
  var finalResult = data.filter(function (val) {
    return !cart.includes(val);
  });

  return res.json({ data: finalResult });
};

var updateOrders = function (req, res) {
  var { name, number, items, amount, status, id, tableNo, taxes, totalTax } =
    req.body;
  var time = new Date();

  var updateObj = {
    name: name,
    number: number,
    items: items,
    amount: amount,
    status: status,
    time: time,
    tableNo: tableNo,
    taxes: taxes,
    totalTax: totalTax,
  };
  orderData
    .findByIdAndUpdate({ _id: id }, updateObj)
    .then(function (response) {
      console.log(response, "update values");
      if (response) return res.json({ data: response, code: 200 });
    })
    .catch(function (e) {
      return res.json({ code: 400, mess: e });
    });
};
var table = async function (req, res) {
  var { tableNo, name, number } = req.body;
  console.log(req.body);
  var data = new tableData({
    tableNo: tableNo,

    name: null,
    number: null,
    fill: false,
  });
  const save = await data.save();
  console.log(save);
  return res.json({ mess: save });
};
var tabledata = async function (req, res) {
  var token = req.headers.token;
  var id = await auth.verifyToken(token);
  tableData
    .find({ id: id._id })
    .then(function (data) {
      if (data) return res.json({ code: 200, data: data[0].table });
    })
    .catch(function (e) {
      return res.json({ code: 400, mess: e });
    });
};
var editTable = async function (req, res) {
  var { tableNo, id, fill } = req.body;
  var token = req.headers.token;
  var idd = await auth.verifyToken(token);
  console.log(req.body);
  tableData
    .findOneAndUpdate(
      { $and: [{ "table.tableNo": tableNo }, { id: idd._id }] },
      { $set: { "table.$.fill": fill, "table.$.id": id } }
    )
    .then(function (data) {
      return res.json({ code: 200, data: data });
    })
    .catch(function (e) {
      return res.json({ code: 400, mess: e });
    });
};
var filledtable = async function (req, res) {
  var { tableNo1, tableNo2, id1, id2 } = req.body;
  var token = req.headers.token;
  var id = await auth.verifyToken(token);
  console.log(req.body);
  try {
    var tab1 = await tableData.findOneAndUpdate(
      { $and: [{ "table.tableNo": tableNo1 }, { id: id._id }] },
      { $set: { "table.$.id": id2 } }
    );
    var tab2 = await tableData.findOneAndUpdate(
      { $and: [{ "table.tableNo": tableNo2 }, { id: id._id }] },
      { $set: { "table.$.id": id1 } }
    );
    var user1 = await orderData.findByIdAndUpdate(
      { _id: id1 },
      { tableNo: tableNo2 }
    );
    var user2 = await orderData.findByIdAndUpdate(
      { _id: id2 },
      { tableNo: tableNo1 }
    );
    if (!tab1 || !tab2 || !user1 || !user2) {
      // return res.json({code:400,mess:"something went wrong"})
      throw "error";
    }
    return res.json({ code: 200 });
  } catch (e) {
    return res.json({ code: 400 });
  }
};

module.exports = {
  register,
  login,
  home,
  loginget,
  about,
  dashboard,
  addOrder,
  menu,
  addCategory,
  addMenue,
  recommend,
  // getOrders,
  verifyy,
  orderstatus,

  preparedOrders,
  preparingOrders,
  updateOrders,
  table,
  tabledata,
  editTable,
  testing,
  filledtable,
};
