const express = require('express');
const { generateFile } = require('./Backend/generateFile.cjs');
const { generateInputFile } = require('./Backend/generateInputFile.cjs');
const { executeCpp } = require('./Backend/executeCpp.cjs');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Compiler server is running");
  res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
  const { language = 'cpp', code, input } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeCpp(filePath, inputPath);
console.log(filePath,inputPath,output);
    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const submitCode = async (language, code, testCases) => {
  try {
    const response = await axios.post('http://localhost:5001/submit', { language, code, testCases });
    return response.data; // Assuming response.data contains results or status from submit server
  } catch (error) {
    throw new Error(`Error submitting code: ${error.message}`);
  }
};

app.post('/run-and-submit', async (req, res) => {
  const { language, code, input } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: 'Empty code!' });
  }

  try {
    // Compile and run code as usual
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeCpp(filePath, inputPath);
    console.log(filePath, inputPath, output);

    // Prepare test cases
    const testCases = req.body.testCases; // Assuming testCases are passed in the request body

    // Submit code to submit server
    const submitResponse = await submitCode(language, code, testCases);

    // Return combined response if needed
    res.json({ filePath, inputPath, output, submitResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(5000, () => {
  console.log("Compiler server is listening on port 5000!");
});
