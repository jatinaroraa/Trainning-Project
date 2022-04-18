const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const user = new mongoose.Schema({
  email: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  cpassword: {
    require: true,
    type: String,
  },
  tokens: [
    {
      token: {
        require: true,
        type: String,
      },
    },
  ],
});
const KEY = "tokenkeyforlogin";

user.methods.generateToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

const userdata = mongoose.model("userdata", user);

module.exports = userdata;
