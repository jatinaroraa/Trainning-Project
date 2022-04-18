const userdata = require("../schemas/schema");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const KEY = "tokenkeyforlogin";
const auth = async (req, res, next) => {
  try {
    const token = req.body.token;
    // console.log(req.headers.cookie);
    // const token = req.headers.cookie.split("=");
    const verify = await jwt.verify(token, KEY);

    const data = await userdata.findById({ _id: verify._id });

    if (!data) return res.json({ code: 400 });

    req.id = data._id;
    next();
  } catch (error) {
    return res.json({ code: 400, mess: "bad request" });
  }
};
var verifyToken = async (token) => {
  try {
    var verify = await jwt.verify(token, KEY);
    var id = await userdata.findById({ _id: verify._id });
    if (id) return id;
    return;
  } catch (e) {
    console.log("token not provided");
  }
};
module.exports = { verifyToken, auth };
