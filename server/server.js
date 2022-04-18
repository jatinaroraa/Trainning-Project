const express = require("express");
const app = express();
// require("dotenv").config;
const http = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const controller = require("./controller/controllers");
const auth = require("./controller/auth");
const passp = require("./controller/passport");
var metrices = require("./controller/matrices");
var bulkupdate = require("./controller/bulkUpdate");

// const router = express.Router();
const port = 3000;
const cors = require("cors");
const file = require("./routes/routes");
const mongoose = require("./database/database");
const userdata = require("./schemas/schema");
const orderData = require("./schemas/order");
const menueData = require("./schemas/menue");
const cookieParser = require("cookie-parser");
const tableData = require("./schemas/table");
const path = require("path");
app.use(cors());
app.use("/", express.static(path.join(__dirname, "../", "/posist")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(file);
// app.use(controller);
app.use(userdata);
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const connection = require("./socket/socket");
// socket
app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});
// io.sockets.on("connection", function (socket) {
//   console.log("connection of socket");
//   socket.on("newcon", function (data) {
//     console.log(data);
//   });
// });
connection(io);
http.listen(port, () => {
  console.log(`port ${port}`);
});
