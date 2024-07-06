import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AceEditor from "react-ace";
import { Button, Spinner } from "flowbite-react";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";

const ProblemPage = () => {
  const { problemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your C++ code here");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/backend/problem/getproblems?problemId=${problemId}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setProblem(data.problem);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleRun = async () => {
    try {
      const res = await fetch("/backend/compiler/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || "Error running the code");
    } catch (error) {
      setOutput("Error running the code");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/backend/compiler/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.verdict || "Error submitting the code");
    } catch (error) {
      setOutput("Error submitting the code");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading problem details.</div>;
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-3">
          <h1 className="text-3xl mt-10 p-3 text-center font-serif lg:text-4xl">
            {problem.title}
          </h1>
          <div className="mt-10 p-3">
            <h3 className="font-bold">Description:</h3>
            <p>{problem.description}</p>
          </div>
          <div className="mt-5 p-3">
            <h3 className="font-bold">Rating:</h3>
            <p>{problem.rating}</p>
          </div>
          <div className="mt-5 p-3">
            <h3 className="font-bold">Input:</h3>
            <p>{problem.input}</p>
          </div>
          <div className="mt-5 p-3">
            <h3 className="font-bold">Constraints:</h3>
            <p>{problem.constraints}</p>
          </div>
          <div className="mt-5 p-3">
            <h3 className="font-bold">Output:</h3>
            <p>{problem.output}</p>
          </div>
          <div className="mt-5 p-3">
            <h3 className="font-bold">Test Cases:</h3>
            <ul>
              {problem.testCases.map((testCase, index) => (
                <li key={index}>
                  <strong>Input:</strong> {testCase.input} <br />
                  <strong>Output:</strong> {testCase.output}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:w-1/2 p-3">
          <AceEditor
            mode="c_cpp"
            theme="monokai"
            value={code}
            onChange={setCode}
            name="codeEditor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="500px"
          />
          <div className="mt-3">
            <Button color="success" onClick={handleRun}>
              Run
            </Button>
            <Button color="blue" className="ml-2" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <div className="mt-5 p-3 bg-gray-100">
            <h3 className="font-bold">Output:</h3>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProblemPage;
