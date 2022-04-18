const mongoose = require("mongoose");
// require("dotenv").config;
const DB =
  "mongodb+srv://newproject:newproject@cluster0.8blbf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(DB)
  .then((res) => {
    console.log("database connected");
  })
  .catch((e) => {
    console.log(e, "error");
  });

module.exports = mongoose;
