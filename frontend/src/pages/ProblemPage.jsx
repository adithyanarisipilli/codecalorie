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
      const response = await axios.post("http://localhost:3000/run", {
        language: "cpp",
        code,
        input: customInput,
      });
      setOutput(response.data.output);
      setVerdict(null); // Clear verdict on manual run
      setActiveConsoleTab("output");
    } catch (err) {
      console.error(err);
      setOutput("Error running the code or maybe infinite loop");
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
      const { data } = await axios.post("http://localhost:3000/submit", {
        language: "cpp",
        code,
        testCases,
      });

      const comparisonResults = data.comparisonResults;


      // Check each comparison result
      let allCorrect = true;
      for (const result of comparisonResults) {
        if (result.verdict !== "Correct Answer") {
          allCorrect = false;
          break; // Exit loop early on wrong answer
        }
      }

      // Set the verdict based on the check
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
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Rating</h2>
          <p>{problem.rating}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Test Cases</h2>
          {problem.testCases.map((testCase, index) => (
            <div key={index} className="mt-4 border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">Test Case {index + 1}</h3>
                <CopyToClipboard text={testCase.input}>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center">
                    Copy Input
                  </button>
                </CopyToClipboard>
              </div>
              <p>
                <strong>Input:</strong>
              </p>
              <textarea
                className="w-full p-2 bg-black text-white rounded"
                readOnly
                value={testCase.input}
              />
              <div className="flex justify-end mt-2">
                <CopyToClipboard text={testCase.output}>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center">
                    Copy Output
                  </button>
                </CopyToClipboard>
              </div>
              <p>
                <strong>Output:</strong>
              </p>
              <textarea
                className="w-full p-2 bg-black text-white rounded mt-2"
                readOnly
                value={testCase.output}
              />
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
          <div className="mt-4">
            <div className="flex mb-2">
              <button
                onClick={() => setActiveConsoleTab("input")}
                className={`flex-1 py-2 px-4 rounded-t ${
                  activeConsoleTab === "input"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Input
              </button>
              <button
                onClick={() => setActiveConsoleTab("output")}
                className={`flex-1 py-2 px-4 rounded-t ${
                  activeConsoleTab === "output"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Output
              </button>
              <button
                onClick={() => setActiveConsoleTab("verdict")}
                className={`flex-1 py-2 px-4 rounded-t ${
                  activeConsoleTab === "verdict"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Verdict
              </button>
            </div>
            <div className="p-4 bg-gray-800 text-white rounded-b">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
