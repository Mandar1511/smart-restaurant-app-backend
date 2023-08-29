const asyncHandler = require("express-async-handler");
const MenuItem = require("../models/menuModel");
const APIFeatures = require("./apiFeatures");
const CustomError = require("../customError");
exports.addMenuItem = asyncHandler(async (req, res) => {
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    const newMenuItem = await MenuItem.create(req.body);
    if (!newMenuItem) {
      throw new CustomError("Failed to add this Item", 500);
    }
    res.status(201).json(newMenuItem);
  } else {
    throw new CustomError("You are not allowed to add menu items", 400);
  }
});

exports.getMenuItems = asyncHandler(async (req, res) => {
  const features = new APIFeatures(MenuItem.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let MenuItems = [];
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    MenuItems = await features.query.find();
    res.status(200).json(MenuItems);
  } else {
    MenuItems = await features.query.find({ availability: true });
    res.status(200).json(MenuItems);
  }
});

exports.deleteMenuItem = asyncHandler(async (req, res) => {
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    const newMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!newMenuItem) {
      throw new CustomError("Failed to delete this Item", 500);
    }
    res.status(204);
  } else {
    throw new CustomError("You are not allowed to delete menu items.", 403);
  }
});

exports.updateMenuItem = asyncHandler(async (req, res) => {
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    const newMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!newMenuItem) {
      throw new CustomError("Failed to update this Item", 500);
    }
    res.status(201).json(newMenuItem);
  } else {
    throw new CustomError("You are not allowed to update menu items.", 403);
  }
});
