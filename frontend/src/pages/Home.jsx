import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProblemCard from "../components/ProblemCard";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/backend/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await fetch("/backend/problem/getProblems");
      const data = await res.json();
      setProblems(data.problems);
    };
    fetchProblems();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to my Online Judge
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Elevate Your Coding Skills: Compete, Learn, and Achieve Excellence in
          Programming Challenges
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>

        <Link
          to="/search-problems"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all problems
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {problems && problems.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              Recent Problems
            </h2>
            <div className="flex flex-wrap gap-4">
              {problems.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))}
            </div>
            <Link
              to={"/search-problems"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all problems
            </Link>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
    </div>
  );
}
