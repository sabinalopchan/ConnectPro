const router = require("express").Router();
const jobController =require("../controllers/jobController");

// create Job API
router.post("/create_job", jobController.createJob);

// get Job API
router.get("/get_jobs", jobController.getAllJobs);

// get recommended jobs
router.get("/get_recommended_jobs", jobController.getRecommendedJobs)

module.exports = router;