const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInputs = "/tmp/inputs";

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
  const jobID = uuid();
  const input_filename = `${jobID}.txt`;
  const input_filePath = path.join(dirInputs, input_filename);
  // console.log(jobID,input_filePath,input_filename);
  await fs.writeFileSync(input_filePath, input);
  return input_filePath;
};

module.exports = {
  generateInputFile,
};
