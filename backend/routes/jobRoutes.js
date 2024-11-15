const express = require("express");
const router = express.Router();
const axios = require("axios");
const authenticateToken = require("../middleware/auth");

router.get("/jobs", authenticateToken, async (req, res) => {
  try {
    const { description, location, full_time } = req.query;

    // Fetch all jobs first
    const response = await axios.get("https://dev6.dansmultipro.com/api/recruitment/positions.json");
    let jobs = response.data;

    // Apply filters to the complete dataset
    if (jobs && jobs.length > 0) {
      if (description) {
        jobs = jobs.filter((job) => {
          const searchTerm = description.toLowerCase();
          return (job.title?.toLowerCase() || "").includes(searchTerm) || (job.description?.toLowerCase() || "").includes(searchTerm) || (job.company?.toLowerCase() || "").includes(searchTerm);
        });
      }

      if (location) {
        jobs = jobs.filter((job) => {
          const searchLocation = location.toLowerCase();
          const jobLocation = (job.location || "").toLowerCase();
          return jobLocation.includes(searchLocation);
        });
      }

      if (full_time === "true") {
        jobs = jobs.filter((job) => (job.type || "").toLowerCase() === "full time");
      }
    }

    // Log for debugging
    console.log(`Found ${jobs.length} jobs matching criteria:`);
    if (location)
      console.log(
        "Jobs locations:",
        jobs.map((job) => job.location)
      );

    res.json({
      status: "success",
      data: jobs,
      meta: {
        total: jobs.length,
        filters: {
          description: description || null,
          location: location || null,
          full_time: full_time === "true" || null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

//second router
router.get("/positions", authenticateToken, async (req, res) => {
  try {
    const { description, location, full_time } = req.query;

    // Fetch all jobs first
    const response = await axios.get("https://dev6.dansmultipro.com/api/recruitment/positions.json?page=1");
    let jobs = response.data;

    // Apply filters to the complete dataset
    if (jobs && jobs.length > 0) {
      if (description) {
        jobs = jobs.filter((job) => {
          const searchTerm = description.toLowerCase();
          return (job.title?.toLowerCase() || "").includes(searchTerm) || (job.description?.toLowerCase() || "").includes(searchTerm) || (job.company?.toLowerCase() || "").includes(searchTerm);
        });
      }

      if (location) {
        jobs = jobs.filter((job) => {
          const searchLocation = location.toLowerCase();
          const jobLocation = (job.location || "").toLowerCase();
          return jobLocation.includes(searchLocation);
        });
      }

      if (full_time === "true") {
        jobs = jobs.filter((job) => (job.type || "").toLowerCase() === "full time");
      }
    }

    // Log for debugging
    console.log(`Found ${jobs.length} jobs matching criteria:`);
    if (location)
      console.log(
        "Jobs locations:",
        jobs.map((job) => job.location)
      );

    res.json({
      status: "success",
      data: jobs,
      meta: {
        total: jobs.length,
        filters: {
          description: description || null,
          location: location || null,
          full_time: full_time === "true" || null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

//id
router.get("/positions/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the specific job by ID
    const response = await axios.get(`https://dev6.dansmultipro.com/api/recruitment/positions/${id}`);
    const job = response.data;

    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }

    res.json({
      status: "success",
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch job details",
      error: error.message,
    });
  }
});

module.exports = router;
