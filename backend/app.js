// app.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
//jobRoutes
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

//jobRoutes
app.use("/api", jobRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/jobportal")
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get job list API
app.get("/api/jobs", authenticateToken, async (req, res) => {
  try {
    const { description, location, full_time, page = 1 } = req.query;

    // Build the query URL
    let url = "https://dev6.dansmultipro.com/api/recruitment/positions.json";
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (description) queryParams.append("description", description);
    if (location) queryParams.append("location", location);
    if (full_time) queryParams.append("full_time", full_time);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Make request to the jobs API
    const response = await axios.get(url);

    // Return the jobs data
    res.json({
      success: true,
      data: response.data,
      page: parseInt(page),
      search_params: {
        description,
        location,
        full_time,
      },
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs data",
    });
  }
});

//------------------------- get for pagination
app.get("/api/positions", authenticateToken, async (req, res) => {
  try {
    const { description, location, full_time, page = 1 } = req.query;

    // Build the query URL (using the correct base URL)
    let url = "https://dev6.dansmultipro.com/api/recruitment/positions.json?page=1";
    const queryParams = new URLSearchParams();

    // Append query parameters for this new API route
    if (page) queryParams.append("page", page);
    if (description) queryParams.append("description", description);
    if (location) queryParams.append("location", location);
    if (full_time) queryParams.append("full_time", full_time);

    // Append query parameters to the URL if there are any
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Make request to the jobs API
    const response = await axios.get(url);

    // Return the jobs data
    res.json({
      success: true,
      data: response.data,
      page: parseInt(page),
      search_params: {
        description,
        location,
        full_time,
      },
    });
  } catch (error) {
    console.error("Error fetching positions data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching positions data",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
