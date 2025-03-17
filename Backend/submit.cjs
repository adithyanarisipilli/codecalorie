const express = require("express");
const axios = require("axios");
const { generateFile } = require("./generateFile.cjs");
const { generateInputFile } = require("./generateInputFile.cjs");
const { executeCpp } = require("./executeCpp.cjs");
const fs = require("fs").promises;
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/submit", async (req, res) => {
  const { language = "cpp", code, testCases } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const { input, output } = testCases[i];
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      const stdout = await executeCpp(filePath, inputPath);

      console.log("Input:", input);
      console.log("Expected Output:", output);
      console.log("File Path:", filePath);
      console.log("Input Path:", inputPath);
      console.log("Stdout:", stdout);

      const actualOutput = stdout.trim();
      const expectedOutput = output.trim();
      const verdict =
        actualOutput === expectedOutput ? "Correct Answer" : "Wrong Answer";

      results.push({ verdict, actualOutput });
    }

    await fs.writeFile("Pout.txt", JSON.stringify(results));

    const { data } = await axios.post(
      `${process.env.VITE_BACKEND_URL}/compare`,
      { testCases }
    );

    console.log("Comparison Results:", data);

    res.json({ comparisionResults: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Submission server is online!" });
});

app.listen(5001, () => {
  console.log("Submit server is listening on port 5001!");
});
