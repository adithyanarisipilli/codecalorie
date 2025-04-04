import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import problemRoutes from "./routes/problem.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import axios from "axios";
import cors from "cors";
import fs from "fs/promises";
import Problem from "./models/problem.model.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    // Send request to the compiler server
    const response = await axios.post("http://localhost:5000/run", {
      language,
      code,
      input,
    });
    const { filePath, inputPath, output } = response.data;

    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/compare", async (req, res) => {
  const { testCases } = req.body;

  try {
    // Read the Pout file
    const poutContent = await fs.readFile("Pout.txt", "utf8");
    const results = JSON.parse(poutContent);

    // Compare the outputs
    const comparisonResults = testCases.map((testCase, index) => {
      const result = results[index];
      const expectedOutput = testCase.output.trim();
      const actualOutput = result.actualOutput.trim();
      const verdict =
        actualOutput === expectedOutput ? "Correct Answer" : "Wrong Answer";

      return { input: testCase.input, expectedOutput, actualOutput, verdict };
    });

    // Print the comparison results before sending the response
    console.log("Comparison Results:", comparisonResults);

    res.json({ success: true, comparisonResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/backend/user", userRoutes);
app.use("/backend/auth", authRoutes);
app.use("/backend/post", postRoutes);
app.use("/backend/problem", problemRoutes);
app.use("/backend/comment", commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
