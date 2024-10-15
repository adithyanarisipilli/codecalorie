import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProblemCard from "../components/ProblemCard";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            Welcome to Codecalorie
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to Codecalorie! This website was created by Adithya
              Narisipilli as a personal project to foster a community of
              competitive programmers and coding enthusiasts. Adithya is a
              passionate developer who loves solving challenging problems and
              sharing his knowledge with others.
            </p>

            <p>
              On this platform, you'll find a variety of coding challenges,
              contests, and tutorials designed to help you improve your
              problem-solving skills. Whether you're a beginner looking to learn
              the basics or an experienced coder seeking to hone your skills,
              there's something here for everyone.
            </p>

            <p>
              We encourage you to participate in our contests, solve problems,
              and engage with other members of the community. You can discuss
              strategies, share insights, and learn from each other. We believe
              that a collaborative environment is key to growth and improvement.
            </p>
            <p>Happy coding!</p>
          </div>

          {/* Add margin-top to create space between the text and CallToAction */}
          <div className="mt-10 p-3 bg-amber-100 dark:bg-slate-700">
            <CallToAction />
          </div>
        </div>
      </div>
    </div>
  );
}
