import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/backend/problem/getproblems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data.problems);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Problems</h1>
      {problems.length === 0 ? (
        <div>No problems found.</div>
      ) : (
        <ul>
          {problems.map((problem) => (
            <li key={problem._id}>
              <Link to={`/problem/${problem._id}`}>
                <h2>{problem.title}</h2>
                <p>Rating: {problem.rating}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Problems;
