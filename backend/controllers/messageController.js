const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const Users = require("../model/userModel");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate(
      "sender",
      "firstName lastName profileImageURL"
    );
    message = await message.populate("chat");
    message = await Users.populate(message, {
      path: "chat.users",
      select: "firstName lastName email profileImageURL",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// Fectch All message
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName profileImageURL email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { sendMessage, allMessages };
