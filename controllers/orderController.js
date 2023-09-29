const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Order = require("./../models/orderModel");
const MenuItem = require("../models/menuModel");
const APIFeatures = require("../controllers/apiFeatures");
const CustomError = require("../customError");

// api/v1/orders/
exports.createOrder = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "customer") {
    req.body.user = req.user._id;
    const newOrder = await Order.create(req.body);
    if (!newOrder) {
      throw new CustomError("Failed to create the order", 500);
    }
    res.status(201).json(newOrder);
  } else {
    throw new CustomError("You are not allowed to place order", 403);
  }
});

// api/v1/orders/:id
exports.deleteOrder = asyncHandler(async (req, res) => {
  const currentOrder = await Order.findById(req.params.id);
  if (!currentOrder) {
    throw new CustomError("Order not found", 400);
  }
  // customer deletes the order
  if (
    req.user &&
    req.user.role == "customer" &&
    currentOrder.user.toString() == req.user._id
  ) {
    if (currentOrder.status != "pending") {
      throw new CustomError("You can't cancel order now!", 400);
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).json();
  }
  // waiter deletes the order
  else if (req.user && currentOrder.waiter.toString() == req.user._id) {
    if (
      currentOrder.status != "pending" &&
      currentOrder.status != "confirmed by waiter"
    ) {
      throw new CustomError("You can't cancel the order now", 400);
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).json();
  }
  // chef deletes the order
  else if (
    req.user &&
    currentOrder.chef.toString() == req.user._id &&
    (currentOrder.status == "confirmed by waiter" ||
      currentOrder.status == "confirmed by chef")
  ) {
    await Order.findByIdAndDelete(req.params.id);
    const message = "order deleted successfully";
    res.status(204).json();
  } else {
    throw new CustomError("You can't cancel the order now", 403);
  }
});

// api/v1/orders/:id
exports.updateOrder = asyncHandler(async (req, res) => {
  const currentOrder = await Order.findById(req.params.id);
  if (!currentOrder) {
    throw new CustomError("Order not found", 400);
  }

  // customer can update his order if it is in pending state
  if (req.user && req.user.role == "customer") {
    // ensuring if customer who created this order is updating and waiter hasn't confirmed it yet
    if (
      currentOrder.status == "pending" &&
      currentOrder.user.toString() == req.user._id
    ) {
      req.body.status = "pending";
      currentOrder.set(req.body);
      await currentOrder.save();
      res.status(201).json(currentOrder);
    } else {
      throw new CustomError("You can't change the order now, call waiter", 400);
    }
  }

  // waiter will go to that table number and click on confirm button
  else if (req.user && req.user.role == "waiter") {
    if (currentOrder.status == "confirmed by waiter") {
      throw new CustomError("Other waiter has picked up this order", 400);
    }
    req.body.waiter = req.user._id;
    req.body.status = "confirmed by waiter";
    currentOrder.set(req.body);
    await currentOrder.save();
    res.status(201).json(currentOrder);
  }

  // master chef will click on preparation started button
  // You should pass status key in the body for calling this API
  else if (req.user && req.user.role == "chef") {
    if (currentOrder.status == "confirmed by chef") {
      throw new CustomError("Other chef has started the preparation");
    }
    req.body.chef = req.user._id;
    // req.body.status can be "confirmed by chef" OR "order is ready"
    currentOrder.set(req.body);
    await currentOrder.save();
    res.status(201).json(currentOrder);
  } else {
    throw new CustomError("You are not allowed to update this order");
  }
});

// /api/v1/orders?status=pending
exports.getOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new CustomError("You are not alllowed to view the orders", 404);
  }
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let orders = [];
  orders = await features.query.find().populate({
    path: "menuItems.menuName", // Populate the 'menuName' field with MenuItem data
    select: "name price isVeg", // Select the fields you want from the MenuItem
  });
  res.status(200).json(orders);
});
