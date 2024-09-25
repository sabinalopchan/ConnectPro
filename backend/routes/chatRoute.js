
const router = require("express").Router();
const chatController = require("../controllers/chatController");
const authGuard = require("../middleware/authGuard");


// create profile API
router.post("/",authGuard, chatController.accessChat);
router.get("/",authGuard, chatController.fetchChats);
router.post("/group",authGuard, chatController.createGroutChat);
router.put("/rename",authGuard, chatController.renameGroup);
router.put("/groupremove",authGuard, chatController.removeFromGroup);
router.put("/groupadd",authGuard, chatController.addToGroup);

module.exports = router;