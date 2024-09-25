const router = require("express").Router();
const userController = require("../controllers/userController");
const authGuard = require("../middleware/authGuard");

// Create user API
router.post("/create", userController.createUser);

// cretae login api
router.post("/login", userController.loginUser);

// create getUser API
router.get("/get_users", userController.getAllUser);

// create profile API
router.get("/get_user/:id", userController.getuserById);

// update user profile API
router.put("/update_user/:id", userController.updateUserProfile);

// follow user route
router.put("/:id/follow", userController.followUser);

// unfollow user route
router.put("/:id/unfollow", userController.unFollowUser);

// search users
router.get("/search_user", authGuard, userController.searchUser);

module.exports = router;
