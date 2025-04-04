const express = require("express");
const axios = require("axios");
const { generateFile } = require("./generateFile.cjs");
const { generateInputFile } = require("./generateInputFile.cjs");
const { executeCpp } = require("./executeCpp.cjs");
const fs = require("fs").promises;
const cors = require("cors");

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
    // Compile and run for each test case
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const { input, output } = testCases[i];
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      const stdout = await executeCpp(filePath, inputPath);

      // Log the intermediate values
      console.log("Input:", input);
      console.log("Expected Output:", output);
      console.log("File Path:", filePath);
      console.log("Input Path:", inputPath);
      console.log("Stdout:", stdout);

      // Compare output with expected
      const actualOutput = stdout.trim();
      const expectedOutput = output.trim();
      const verdict =
        actualOutput === expectedOutput ? "Correct Answer" : "Wrong Answer";

      results.push({ verdict, actualOutput });
    }

    // Write results to Pout file
    await fs.writeFile("Pout.txt", JSON.stringify(results));

    // Compare Pout with hidden outputs (assuming this is handled by main server)
    const { data } = await axios.post("http://localhost:3000/compare", {
      testCases,
    });

    // Print the comparison results before sending the response
    console.log("Comparison Results:", data);

    res.json({ comparisionResults: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => {
  console.log("Submit server is listening on port 5001!");
});
