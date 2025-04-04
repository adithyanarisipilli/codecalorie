import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProblemCard from "../components/ProblemCard";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

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
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Welcome to
        <span className="bg-gradient-to-r from-teal-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          CodeCalorie
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        A one-stop platform for programmers, offering technical blogs, coding
        challenges, and competitive contests to enhance problem-solving skills
        and mastery in programming
      </p>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Elevate Your Coding Skills: Compete, Learn, and Achieve Excellence in
        Programming Challenges
      </p>

      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/4 border border-teal-700 shadow-sm shadow-teal-400 mx-2 my-4"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/4 border border-teal-700 shadow-sm shadow-teal-400 mx-2 my-4"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

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

      {/* <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div> */}
    </div>
  );
}
