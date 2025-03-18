import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiLightBulb,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://online-judge-backend-jj0q.onrender.com/backend";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [problems, setProblems] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthProblems, setLastMonthProblems] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async (
      endpoint,
      setter,
      totalSetter,
      lastMonthSetter
    ) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}?limit=5`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
        }
        const data = await res.json();
        setter(data[endpoint]);
        totalSetter(
          data[`total${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`]
        );
        lastMonthSetter(
          data[
            `lastMonth${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`
          ]
        );
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchData("user/getusers", setUsers, setTotalUsers, setLastMonthUsers);
      fetchData("post/getposts", setPosts, setTotalPosts, setLastMonthPosts);
      fetchData(
        "comment/getcomments",
        setComments,
        setTotalComments,
        setLastMonthComments
      );
      fetchData(
        "problem/getproblems",
        setProblems,
        setTotalProblems,
        setLastMonthProblems
      );
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-orange-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
