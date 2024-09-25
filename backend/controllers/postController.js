const Posts = require("../model/postModel");
const cloudinary = require("cloudinary");

const createPost = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const { userId, content } = req.body;
  const { postImage } = req.files;

  try {
    // Upload image to Cloudinary
    const uploadImage = await cloudinary.v2.uploader.upload(postImage.path, {
      folder: "posts",
      crop: "scale",
    });

    const newPost = new Posts({
      userId: userId,
      content: content,
      postImageURL: uploadImage.secure_url,
    });

    await newPost.save();

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// get all Posts
const getAllPosts = async (req, res) => {
  try {
    const listOfPosts = await Posts.find().populate("userId","firstName lastName profileImageURL position", );
    res.json({
      success: true,
      posts: listOfPosts,
      message: "Posts fetched successfully",
    });
  } catch (e) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// get Posts by pagination
const getPosts = async(req, res) =>{
  try{
   const page = req.query.page ? parseInt(req.query.page) : 1;
   const limit = req.query.limit ? parseInt(req.query.limit) : 1;
   const skip = (page -1) * limit;

   const total = await Posts.countDocuments();
   const listPosts = await Posts.find().skip(skip).limit(limit);

   res.json({
     success : true,
     posts: listPosts,
     message: "Posts fetched successfully by pagination",
     total,
     page,
     limit
   })

  }catch(error){
    console.log(error);
    res.status(500).json("Server Error");
  }
}
const like_dislike_Post = async (req, res) => {
  const id = req.params.id;

  const { userId } = req.body;

  try {//     post.likeCount = post.likes.length;

      const post = await Posts.findById(id);
      if (!post.likes.includes(userId)) {
          await post.updateOne({ $push: { likes: userId } })
              post.likeCount = post.likes.length;

          res.json({
            success: true,
            message : "Post Liked",
            posts : post
          })
      } else {
          await post.updateOne({ $pull: { likes: userId } })
          post.likeCount = post.likes.length;


          res.json({
            success: true,
            message : "Post Disliked",
            posts : post
          })
      }

  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");  }
}



//create comment  post
const commentPost = async(req, res)=>{
  try {
    const { postId, userId, comment } = req.body;

    // Create a new comment object
    const newComment = {
      postedBy: userId,
      comment: comment,
      created: new Date(),
    };

    // Use findByIdAndUpdate to push the new comment to the comments array
    const commentedPost = await Posts.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    )
    .populate('comments.postedBy', '_id firstName lastName position')
    .populate('userId', '_id firstName lastName')
    .exec();

    res.json({
      success: true,
      posts: commentedPost,
      messgae: "Comment added successfully"
      })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// get all comments
const getAllComments = async (req, res) => {
  try {
    const listOfComments = await Posts.find().populate("comments.postedBy");
    res.json({
      success: true,
      posts: listOfComments,
      message: "Comments fetched successfully",
    });
  } catch (e) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPosts,
  like_dislike_Post,
  commentPost,
  getAllComments

};
