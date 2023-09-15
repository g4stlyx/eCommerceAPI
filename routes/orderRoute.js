const {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder} = require("../controllers/orderController");

const {authenticateUser,authorizePermissions} = require("../middleware/authentication")

const express = require("express");
const router = express.Router();

router.route("/")
.get([authenticateUser,authorizePermissions("admin")],getAllOrders)
.post(authenticateUser,createOrder)

router.route("/showAllMyOrders")
.get(getCurrentUserOrders)

router.route("/:id")
.get(authenticateUser,getSingleOrder)
.patch(authenticateUser,updateOrder)

module.exports = router