import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import { CopyToClipboard } from "react-copy-to-clipboard";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "https://online-judge-backend-jj0q.onrender.com/backend";
const COMPILER_URL = "https://online-judge-compiler.onrender.com";
const SUBMISSION_URL = "https://online-judge-submission.onrender.com";

const ProblemPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(`#include <iostream> 
using namespace std;
int main() { 
    //write code here  
    return 0;  
}`);
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState("input");
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/problem/${problemId}`
        );
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
      const response = await axios.post(`${COMPILER_URL}/run`, {
        language: "cpp",
        code,
        input: customInput,
      });
      setOutput(response.data.output);
      setVerdict(null);
      setActiveConsoleTab("output");
    } catch (err) {
      console.error(err);
      setOutput("Error running the code");
      setVerdict("Runtime Error");
      setActiveConsoleTab("output");
    }
  };

  const handleSubmit = async () => {
    const testCases = problem.testCases.map((testCase) => ({
      input: testCase.input,
      output: testCase.output,
    }));

    try {
      const { data } = await axios.post(`${SUBMISSION_URL}/submit`, {
        language: "cpp",
        code,
        testCases,
      });

      const comparisonResults = data.comparisionResults.comparisonResults;

      let allCorrect = comparisonResults.every(
        (result) => result.verdict === "Correct Answer"
      );
      setVerdict(allCorrect ? "Correct Answer" : "Wrong Answer");
      setActiveConsoleTab("verdict");
    } catch (err) {
      console.error(err);
      setOutput("Error submitting the code");
      setVerdict("Submission Error");
      setActiveConsoleTab("verdict");
    }
  };

  const handleVerdictClass = () => {
    switch (verdict) {
      case "Correct Answer":
        return "bg-green-500";
      case "Wrong Answer":
        return "bg-red-500";
      case "Runtime Error":
        return "bg-yellow-500";
      case "Submission Error":
        return "bg-gray-500";
      default:
        return "";
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
          <p>{problem.input}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Output Format</h2>
          <p>{problem.output}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Constraints</h2>
          <p>{problem.constraints}</p>
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
            onClick={handleRun}
            className="mr-4 bg-black text-white py-2 px-4 rounded border border-white"
          >
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="mr-4 bg-orange-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
        {isConsoleVisible && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded">
            {activeConsoleTab === "input" && (
              <textarea
                className="w-full p-2 bg-gray-800 text-white border rounded"
                placeholder="Enter custom input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={5}
              />
            )}
            {activeConsoleTab === "output" && <pre>{output}</pre>}
            {activeConsoleTab === "verdict" && (
              <div className={`p-2 rounded ${handleVerdictClass()}`}>
                {verdict}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
