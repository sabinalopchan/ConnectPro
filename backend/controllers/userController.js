const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

const createUser = async (req, res) => {
  // res.send("Welcome to CREATE USER API")
  // step1 : Check upcomming data
  console.log(req.body);
  console.log(req.files);

  // step2 : destructuring the json data
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    university,
    degree,
    experience,
    company,
    position,
    skill,
  } = req.body;
  const { profileImage } = req.files;

  // step3 : validate the data
  if (!firstName || !lastName || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }
  // step4 : try catch
  try {
    // step 5: Check existing user
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // password encryption
    const generateSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, generateSalt);

    let uploadImageURL;

    // Check if profileImage exists before uploading
    if (profileImage) {
      const uploadImage = await cloudinary.v2.uploader.upload(
        profileImage.path,
        {
          folder: "users",
          crop: "scale",
        }
      );

      uploadImageURL = uploadImage.secure_url;
    } else {
      // Provide a default image URL or handle the case where no image is provided
      uploadImageURL =
        "https://res.cloudinary.com/dos1qtwvw/image/upload/v1705160600/user_cboknb.jpg";
    }

    // step 6: Create new user || modelName : Destructure name
    const newUser = new Users({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encryptedPassword,
      address: address,
      university: university,
      degree: degree,
      experience: experience,
      company: company,
      position: position,
      skill: skill,
      profileImageURL: uploadImageURL,
    });

    // step 7: Save the user
    await newUser.save();

    // step 8: Send the response
    res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  // Step 1 : Check if data is coming or not
  console.log(req.body);

  // Step 2 : Destruvture data
  const { email, password } = req.body;

  // Step 3 : Validate the incoming data
  if (!email || !password) {
    return req.json({
      success: false,
      message: "Please enter all fields",
    });
  }

  // Step 4 : try catch
  try {
    // Step 5 : Find User
    const user = await Users.findOne({ email: email }); //User store all data of user
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }
    // Step 6 : Check Password
    const passwordToCompare = user.password;

    const isMatch = await bcrypt.compare(password, passwordToCompare);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Password not match",
      });
    }
    // Step 7 : Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET);
    // STep 8 : Send Response
    res.status(200).json({
      success: true,
      token: token,
      userData: user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// get profile by id
const getuserById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "User Id is required",
    });
  }
  try {
    // Fetch profiles for the logged-in user
    const userById = await Users.findById(id);

    res.json({
      success: true,
      message: "User fetched successfully",
      users: userById,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// get all Userr
const getAllUser = async (req, res) => {
  try {
    // Fetch profiles for the logged-in user
    const listOfUser = await Users.find().populate(
      "_id",
      "firstName lastName profileImageURL position "
    );

    res.json({
      success: true,
      message: "Users fetched successfully",
      users: listOfUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};
// const getAllUser = async (req, res) => {
//   try {
//     let users = await Users.find();
//     users = users.map((user) => {
//       const { password, ...otherDetails } = user._doc;
//       return otherDetails;
//     });
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json("Server Error");
//   }
// };

// get single user

// update user profile
const updateUserProfile = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  // step2 : destructuring the json data
  const {
    firstName,
    lastName,
    address,
    university,
    degree,
    experience,
    company,
    position,
    skill,
  } = req.body;
  const { profileImage } = req.files || {};

  // destructure id from URl

  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "User Id is required",
    });
  }

  try {
    // Check if profileImage exists before uploading
    let uploadImageURL;

    if (profileImage) {
      const uploadImage = await cloudinary.v2.uploader.upload(
        profileImage.path,
        {
          folder: "users",
          crop: "scale",
        }
      );

      uploadImageURL = uploadImage.secure_url;
    } else {
      // If no new profile image is provided, check if the user already had a profile image
      const existingUser = await Users.findById(id);
      if (existingUser && existingUser.profileImageURL) {
        // Use the existing profile image if available
        uploadImageURL = existingUser.profileImageURL;
      } else {
        // Otherwise, provide a default image URL
        uploadImageURL =
          "https://res.cloudinary.com/dos1qtwvw/image/upload/v1705160600/user_cboknb.jpg";
      }
    }
    const updatedUserProfile = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      university: university,
      degree: degree,
      experience: experience,
      company: company,
      position: position,
      skill: skill,
      profileImageURL: uploadImageURL,
    };
    await Users.findByIdAndUpdate(id, updatedUserProfile);
    res.json({
      success: true,
      message: "Profile updated successfully",

      users: updatedUserProfile,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Follow a user
// const followUser = async (req,res) => {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await Users.findById(req.params.id);
//       const currentUser = await Users.findById(req.body.userId);
//       if (!user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $push: { followers: req.body.userId } });
//         await currentUser.updateOne({ $push: { followings: req.params.id } });
//         res.status(200).json("user has been followed");
//       } else {
//         res.status(403).json("you allready follow this user");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//       console.log(err)
//     }
//   } else {
//     res.status(403).json("you cant follow yourself");
//   }
// };
const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id);
  if (_id == id) {
    N;
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await Users.findById(id);
      const followingUser = await Users.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};
// }

// UnFollow a User

const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unFollowUser = await Users.findById(id);
      const unFollowingUser = await Users.findById(_id);

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } });
        await unFollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("Unfollowed Successfully!");
      } else {
        res.status(403).json("You are not following this User");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

// search user
// /api/user/search_user?search=user
const searchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await Users.find(keyword).find({ _id: { $ne: req.user._id } }); //filter the current loggedin user
  res.send(users);
};

// exporting
module.exports = {
  createUser,
  loginUser,
  getuserById,
  getAllUser,
  updateUserProfile,
  followUser,
  unFollowUser,
  searchUser,
};
