import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProblemCard from "../components/ProblemCard";
export default function Contests() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            Coming Soon.....
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              We are excited to announce that our platform will soon offer
              opportunities for you to create and host contests.
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
