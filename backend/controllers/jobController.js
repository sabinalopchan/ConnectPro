const Jobs = require("../model/jobModel");
const Users = require("../model/userModel");

const createJob = async (req, res) => {
  console.log(req.body);

  const { userId, title, description, skills } = req.body;

  try {
    const newJob = new Jobs({
      userId: userId,
      title: title,
      description: description,
      skills: skills,
    });
    await newJob.save();
    res.status(200).json({
      success: true,
      message: "Job Posted Successfully",
      job: newJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// get all jobs
const getAllJobs = async (req, res) => {
  try {
    const listOfJobs = await Jobs.find().populate(
      "userId",
      "firstName lastName profileImageURL skill position company university address"
    );
    res.json({
      success: true,
      jobs: listOfJobs,
      message: "Jobs fetched successfully",
    });
  } catch (e) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// get recommended jobs

const getRecommendedJobs = async (req, res) => {
  const id = req.params.id;

  const { userId } = req.body;

  try {
    // Assuming you have a middleware that attaches the user information to the request

    const matchingCriteria = {
      skills: { $in: Jobs.userId.skill },
    };

    // Find jobs that match the criteria
    const recommendedJobs = await Jobs.find(matchingCriteria);
    res.json({
      success: true,
      jobs: recommendedJobs,
      message: "Recommended jobs fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getRecommendedJobs,
};

module.exports = {
  createJob,
  getAllJobs,
  getRecommendedJobs,
};
