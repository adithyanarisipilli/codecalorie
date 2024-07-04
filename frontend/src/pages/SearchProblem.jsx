import { Button, TextInput, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProblemCard from "../components/ProblemCard";

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
      const res = await fetch(`/backend/problem/getproblems?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProblems(data.problems);
      setLoading(false);
      if (data.problems.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
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
    const searchQuery = urlParams.toString();
    navigate(`/search-problems?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfProblems = problems.length;
    const startIndex = numberOfProblems;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/backend/problem/getproblems?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setProblems([...problems, ...data.problems]);
    if (data.problems.length === 9) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Problems results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && problems.length === 0 && (
            <p className="text-xl text-gray-500">No problems found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            problems &&
            problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
