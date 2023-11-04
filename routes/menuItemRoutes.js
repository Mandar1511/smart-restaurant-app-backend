const express = require("express");
const menuItemController = require("../controllers/menuItemController");
const authController = require("../controllers/authController");
const ratingController = require("../controllers/ratingController");
const router = express.Router();

router.use(authController.authenticate);

router
  .route("/")
  .get(menuItemController.getMenuItems)
  .post(menuItemController.addMenuItem);

router
  .route("/:id")
  .get(menuItemController.menuName) // Route for retrieving the menu name
  .delete(menuItemController.deleteMenuItem)
  .patch(menuItemController.updateMenuItem);

router.route("/rating/:id").post(ratingController.addMenuRating);
router.route("/rating").get(ratingController.getRating);

module.exports = router;
