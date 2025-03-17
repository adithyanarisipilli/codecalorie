import { Button, TextInput, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProblemCard from "../components/ProblemCard";

const API_BASE_URL = "https://online-judge-backend-jj0q.onrender.com"; // Change this to your API base URL

export default function SearchProblem() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
  });

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    if (searchTermFromUrl || sortFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
      });
    }

    const fetchProblems = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${API_BASE_URL}/backend/problem/getproblems?${searchQuery}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProblems(data.problems);
      setLoading(false);
      setShowMore(data.problems.length === 9);
    };

    fetchProblems();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    navigate(`/search-problems?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfProblems = problems.length;
    const startIndex = numberOfProblems;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(
      `${API_BASE_URL}/backend/problem/getproblems?${urlParams.toString()}`
    );
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setProblems([...problems, ...data.problems]);
    setShowMore(data.problems.length === 9);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-orange-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <TextInput
              type="text"
              placeholder="Search Term"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort By</label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <Button type="submit">Apply</Button>
        </form>
      </div>

      <div className="p-5 flex-1">
        {loading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : problems.length ? (
          <div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem) => (
                <ProblemCard key={problem._id} {...problem} />
              ))}
            </div>
            {showMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleShowMore}>Show More</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-2xl font-bold">No Problems Found!</div>
        )}
      </div>
    </div>
  );
}
