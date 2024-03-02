"use client";

// pages/index.js
import React, { useState, useEffect } from "react";

// Define a type for the summary object
type Summary = {
  isSafe: boolean;
  attackTime: string | null;
  attackDetails: string[];
};

const Home = () => {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/summary");
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div>
      <h1>Log Summary</h1>
      {summary && (
        <div>
          <p>Is Safe: {summary.isSafe ? "Yes" : "No"}</p>
          <p>Attack Time: {summary.attackTime || "N/A"}</p>
          <ul className="text-sm ">
            {summary.attackDetails &&
              summary.attackDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
