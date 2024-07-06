import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ProblemPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`/backend/problem/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        setError("Failed to fetch problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleRun = async () => {
    try {
      const response = await axios.post("/run", {
        language: "cpp",
        code,
        input: customInput,
      });
      setOutput(response.data.output);
    } catch (err) {
      console.error(err);
      setOutput("Error running the code");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/submit", { language: "cpp", code });
      console.log(response.data.output); // You can add logic here to validate the output with test cases
      setOutput(response.data.output);
    } catch (err) {
      console.error(err);
      setOutput("Error submitting the code");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <p className="mt-4">{problem.description}</p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Input Format</h2>
          <p>{problem.inputType}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Output Format</h2>
          <p>{problem.outputType}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Constraints</h2>
          <p>{problem.constraints}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Rating</h2>
          <p>{problem.rating}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Test Cases</h2>
          {problem.testCases.map((testCase, index) => (
            <div key={index} className="mt-4 border rounded p-4">
              <div className="flex items-start mb-2">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">
                    Test Case {index + 1}
                  </h3>
                </div>
                <CopyToClipboard text={testCase.input}>
                  <button className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center">
                    Copy Input
                  </button>
                </CopyToClipboard>
              </div>
              <p>
                <strong>Input:</strong>
              </p>
              <div className="p-2 bg-black text-white rounded">
                <p>{testCase.input}</p>
              </div>
              <div className="flex items-start mt-2">
                <div className="flex-grow">
                  <CopyToClipboard text={testCase.output}>
                    <button className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center">
                      Copy Output
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              <p>
                <strong>Output:</strong>
              </p>
              <div className="p-2 bg-black text-white rounded mt-2">
                <p>{testCase.output}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:w-1/2 mt-4 md:mt-0 md:ml-4">
        <AceEditor
          mode="c_cpp"
          theme="monokai"
          name="editor"
          editorProps={{ $blockScrolling: true }}
          value={code}
          onChange={setCode}
          fontSize={14}
          width="100%"
          height="400px"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
        />
        <div className="flex mt-4">
          <button
            onClick={() => setIsConsoleVisible(!isConsoleVisible)}
            className="mr-4 bg-gray-500 text-white py-2 px-4 rounded"
          >
            Console
          </button>
          <button
            onClick={handleRun}
            className="mr-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
        {isConsoleVisible && (
          <div className="mt-4">
            <textarea
              className="w-full p-2 bg-gray-800 text-white border rounded"
              placeholder="Enter custom input"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={5}
            />
            <div className="mt-4 p-2 bg-gray-800 text-white rounded">
              <pre>{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
