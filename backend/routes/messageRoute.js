
const router = require("express").Router();
const authGuard = require("../middleware/authGuard");
const messageController = require("../controllers/messageController");


// create message API
router.post("/",authGuard, messageController.sendMessage);
router.get("/:chatId",authGuard, messageController.allMessages);

module.exports = router;