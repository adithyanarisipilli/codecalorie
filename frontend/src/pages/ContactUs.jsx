import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProblemCard from "../components/ProblemCard";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            Contact Us
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>you can contact our founder directly via linkedin.</p>

            <p>He usually get back within 24-72 hours.</p>
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
