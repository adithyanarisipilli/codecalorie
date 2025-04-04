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
            About Codecalorie
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              This website was created by Adithya Narisipilli as a personal
              project to foster a community of competitive programmers and
              coding enthusiasts. He is a passionate developer who loves solving
              challenging problems and sharing his knowledge with others.
            </p>

            <p>
              Here, you'll find technical blogs, coding challenges, and
              competitive contests designed to sharpen your problem-solving
              skills and deepen your programming expertise. Whether you're a
              beginner learning the fundamentals or an experienced coder looking
              to tackle advanced challenges, there's something for everyone.
            </p>

            <p>
              We encourage collaboration—engage with fellow programmers, discuss
              strategies, and share insights to learn and grow together. Join us
              to compete, learn, and achieve excellence in the world of
              programming!
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
