const Chat = require("../model/chatModel");
const Users = require("../model/userModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  if (!req.user._id) {
    console.log("No user logged in");
    return res.sendStatus(400);
  }

  console.log("Current User ID:", req.user._id);
  console.log("Target User ID:", userId);

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await Users.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName lastName email profileImageURL",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      res.status(500).json("Server Error");
    }
  }
};

// fetch chat users
const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Users.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName email profileImageURL",
        });
        res.json({
          success: true,
          message: "Chats fetched successfully",
          results: results,
        });
      });
  } catch (error) {
    res.status(500).json("Server Error");
  }
};

// create group chat
const createGroutChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({
      message: "Please fill all fields",
    });
  }

  var users = JSON.parse(req.body.users); //json stringfy
  if (users.length < 2) {
    return res.status(400).send({
      message: "More than 2 users are required for group chat",
    });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// rename group name
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    res.error("Chat not found");
  } else {
    res.json(updatedChat);
  }
};

// remove user from group
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    res.error("Chat Not Found");
  } else {
    res.json(removed);
  }
};

// add  user to group

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    res.error("Chat Not Found");
  } else {
    res.json(added);
  }
};
module.exports = {
  accessChat,
  fetchChats,
  createGroutChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
