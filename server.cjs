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

app.listen(5000, () => {
  console.log("Compiler server is listening on port 5000!");
});
