const express = require("express");
const app = express();
const router = express.Router();
const userdata = require("../schemas/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const controllers = require("../controller/controllers");
const passport = require("passport");
const auth = require("../controller/auth");
var metrices = require("../controller/matrices");
var bulkUpdate = require("../controller/bulkUpdate");

router.post("/", auth.auth, controllers.home);
router.get("/login", controllers.loginget);
router.post("/login", passport.authenticate("local"), controllers.login);
router.post("/about", auth.auth, controllers.about);
router.post("/register", controllers.register);
router.get("/dashboard", auth.auth, controllers.dashboard);
router.post("/addorders", controllers.addOrder);
// router.get("/orders", controllers.getOrders);
router.get("/orders/preparing", controllers.preparingOrders);
router.get("/orders/prepared", controllers.preparedOrders);
router.patch("/updateorders", controllers.updateOrders);
router.get("/testing", controllers.testing);
router.patch("/bulkupdate", bulkUpdate);

router.post("/verify", controllers.verifyy);
router.post("/orderstatus", controllers.orderstatus);
router.get("/matrices", metrices);
//menu
router.get("/recommend", controllers.recommend);
router.get("/menue", controllers.menu);
router.post("/addcategory", controllers.addCategory);
router.post("/addmenue", controllers.addMenue);
router.post("/tabledata", controllers.table);
router.get("/tabledata", controllers.tabledata);
router.patch("/tabledata", controllers.editTable);
router.patch("/filledtable", controllers.filledtable);

// router.get("/", controllers.ordersocket);
module.exports = router;
