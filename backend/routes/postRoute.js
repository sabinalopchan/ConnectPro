const router = require("express").Router();
// const authGuard = require("../middleware/authGuard");
const postController = require("../controllers/postController");

// Create post API
router.post("/create_post", postController.createPost);

// Get all post API
router.get("/get_posts", postController.getAllPosts);
router.get("/get_posts_pagination", postController.getPosts);

// Like put API
router.put("/:id/like", postController.like_dislike_Post);

// Comment put API
router.put("/add_comment", postController.commentPost);

// Comment get API
router.get("/get_comments", postController.getAllComments);

module.exports = router;
