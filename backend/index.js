// Importing express
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const multiparty = require("connect-multiparty");

const connectDB = require("./database/db");
const cloudinary = require("cloudinary");

// Instance of Express
const app = express();

// dotenv config
dotenv.config();

// cors policy
const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

// multiParty middleware
app.use(multiparty());

// cloudinary confiig
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// mongodb connection
connectDB();

// json middleware (to accept json data)
app.use(express.json());

// user routes
app.use("/api/user", require("./routes/userRoute"));

// post routes
app.use("/api/post", require("./routes/postRoute"));

// job routes
app.use("/api/job", require("./routes/jobRoute"));

// chat routes
app.use("/api/chat", require("./routes/chatRoute"));

// message routes
app.use("/api/message", require("./routes/messageRoute"));

app.get("/test", (req, res) => {
  res.send("Hello");
});

// Define PORT and listen to app
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
