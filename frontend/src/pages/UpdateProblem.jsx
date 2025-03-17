import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://online-judge-backend-jj0q.onrender.com/backend";

const UpdateProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    rating: "",
    input: "",
    constraints: "",
    output: "",
    testCases: "",
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/problems/${problemId}`
        );
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem({ ...problem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/problems/${problemId}`, problem);
      navigate("/problems");
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  return (
    <div>
      <h2>Update Problem</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={problem.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          name="description"
          value={problem.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="rating"
          value={problem.rating}
          onChange={handleChange}
          placeholder="Rating"
        />
        <textarea
          name="input"
          value={problem.input}
          onChange={handleChange}
          placeholder="Input"
        />
        <textarea
          name="constraints"
          value={problem.constraints}
          onChange={handleChange}
          placeholder="Constraints"
        />
        <textarea
          name="output"
          value={problem.output}
          onChange={handleChange}
          placeholder="Output"
        />
        <textarea
          name="testCases"
          value={problem.testCases}
          onChange={handleChange}
          placeholder="Test Cases"
        />
        <button type="submit">Update Problem</button>
      </form>
    </div>
  );
};

export default UpdateProblem;
