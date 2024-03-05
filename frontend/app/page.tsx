"use client";
import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface Summary {
  isSafe: boolean;
  attackTime: string;
  attackDetails: string[];
}

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setError("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<{ summary: Summary }>(
        "http://localhost:4000/upload",
        formData
      );

      const { summary: receivedSummary } = response.data;

      console.log("File uploaded successfully");
      console.log("Summary:", receivedSummary);

      setSummary(receivedSummary);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error uploading file:");
      setError("Error uploading file. Please try again."); // Set an error message
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center p-5">
      <div className="flex flex-col gap-4 justify-center items-center mt-5 ">
        <p className="text-6xl uppercase font-bold text-gray-300 mb-4">log summary generator</p>
        <div className="bg-gradient-to-r from-red-300 to-red-600 p-5 flex justify-center items-center rounded-lg">
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <button className="p-3  bg-gradient-to-r from-red-400 to-red-700 hover:scale-110 
          rounded-lg " onClick={handleUpload}>Upload File</button>
        </div>
        {error && <div>Error: {error}</div>}
      </div>
      <div>
        {summary && (
          <div className="flex flex-col gap-4 justify-center text-center">
            <div className="font-bold text-5xl">
              <h2 className="text-green-400 font-semibold">Summary</h2>
            </div>
            <div>
              <div className="flex justify-center">
                <p>Is Safe: </p>
                <p className="font-bold">{summary.isSafe ? <p className="text-green-500">Yes</p> : <p className="text-red-500">No</p>}</p>
              </div>
              <div>
                <p>Attack Time: </p>
                <p className="font-bold">{summary.attackTime}</p>
              </div>
            </div>
            <div>
              <p className="text-red-500 font-semibold">Attack Details:</p>
              <ul>
                {summary.attackDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
