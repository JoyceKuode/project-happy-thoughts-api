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

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching thoughts" });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    // Validation
    if (!message || message.length < 5 || message.length > 140) {
      throw new Error("Message must be between 5 and 140 characters");
    }

    // Create and save a new thought
    const newThought = await new Thought({ message }).save();

    res.status(201).json({
      success: true,
      response: newThought,
      message: "Thought was successfully created!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "Failed to crate thought",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
