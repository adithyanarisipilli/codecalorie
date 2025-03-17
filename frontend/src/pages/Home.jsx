import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProblemCard from "../components/ProblemCard";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import FeatureSection from "../components/FeatureSection"; // Import FeatureSection

const API_BASE_URL = "https://online-judge-backend-jj0q.onrender.com/backend";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/post/getPosts`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/problem/getProblems`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setProblems(data.problems);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Welcome to
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          CodeCalorie
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Elevate Your Coding Skills: Compete, Learn, and Achieve Excellence in
        Programming Challenges
      </p>

      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/4 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Link
        to="/search"
        className="text-xs sm:text-sm text-orange-500 font-bold hover:underline"
      >
        View all posts
      </Link>

      <Link
        to="/search-problems"
        className="text-xs sm:text-sm text-orange-500 font-bold hover:underline"
      >
        View all problems
      </Link>

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
              className="text-lg text-orange-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
