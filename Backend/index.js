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
import { generateFile } from "./generateFile.cjs";
import { generateInputFile } from "./generateInputFile.cjs";
import { executeCpp } from "./executeCpp.cjs";

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
app.use(
  cors({
    origin: [
      "https://www.codecalorie-by-adithya-narisipilli.tech",
      "https://codecalorie-by-adithya-narisipilli.tech",
    ],
    credentials: true,
  })
);

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
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeCpp(filePath, inputPath);
    console.log(filePath, inputPath, output);
    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/submit", async (req, res) => {
  const { language = "cpp", code, testCases } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    const rawResults = [];

    // Step 1: Execute each test case
    for (let i = 0; i < testCases.length; i++) {
      const { input } = testCases[i];

      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      const stdout = await executeCpp(filePath, inputPath);

      const actualOutput = stdout.trim();

      // Collect raw actual outputs only for now
      rawResults.push({ actualOutput });
    }

    // Step 2: Write results to Pout.txt
    await fs.writeFile("Pout.txt", JSON.stringify(rawResults, null, 2));

    // Step 3: Read Pout.txt for comparison
    const poutContent = await fs.readFile("Pout.txt", "utf8");
    const parsedResults = JSON.parse(poutContent);

    // Step 4: Compare actual vs expected
    const comparisonResults = testCases.map((testCase, index) => {
      const result = parsedResults[index];
      const expectedOutput = testCase.output.trim();
      const actualOutput = result.actualOutput.trim();
      const verdict =
        actualOutput === expectedOutput ? "Correct Answer" : "Wrong Answer";

      return {
        input: testCase.input,
        expectedOutput,
        actualOutput,
        verdict,
      };
    });

    // Log and return final verdicts
    console.log("Comparison Results:", comparisonResults);
    res.json({ success: true, comparisonResults });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
