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

// ✅ FIXED CORS ISSUE
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://www.codecalorie-by-adithya-narisipilli.tech", // Deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins, // Allow only specific origins
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(cookieParser());
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
    const response = await axios.post(`${process.env.VITE_COMPILER_URL}/run`, {
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
    const poutContent = await fs.readFile("Pout.txt", "utf8");
    const results = JSON.parse(poutContent);

    const comparisonResults = testCases.map((testCase, index) => {
      const result = results[index];
      const expectedOutput = testCase.output.trim();
      const actualOutput = result.actualOutput.trim();
      const verdict =
        actualOutput === expectedOutput ? "Correct Answer" : "Wrong Answer";

      return { input: testCase.input, expectedOutput, actualOutput, verdict };
    });

    console.log("Comparison Results:", comparisonResults);

    res.json({ success: true, comparisonResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
