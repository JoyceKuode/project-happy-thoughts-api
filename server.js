import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Thought } from "./models/Thought";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Define the root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Joyce's Happy Thoughts API!",
    endpoints: {
      getThoughts: "GET /thoughts",
      postThought: "POST /thoughts",
      likeThought: "PATCH /thoughts/:thoughtId/like",
    },
  });
});

// Fetch the 20 most recent thoughts, sorted by createdAt in descending order
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching thoughts" });
  }
});

// Post a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    // Validation of message before saving
    if (!message || message.length < 5 || message.length > 140) {
      throw new Error("Message must be between 5 and 140 characters");
    }

    // Create and save a new thought
    const newThought = await new Thought({ message }).save();

    // Send success response with saved thought
    res.status(201).json({
      success: true,
      response: newThought,
      message: "Thought was successfully created!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "Failed to create thought",
    });
  }
});

// Increment the hearts count of a specific thought
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Find the thought by ID and increment its hearts
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } }, // Increment the hearts field by 1
      { new: true } // Return the update
    );

    // If no thought is found, throw an error
    if (!updatedThought) {
      throw new Error("Thought not found");
    }

    // Send a success response with the updated thought
    res.status(200).json({
      success: true,
      response: updatedThought,
      message: "Successfully liked the thought!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "Failed to like the thought",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
