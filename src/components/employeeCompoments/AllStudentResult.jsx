import React, { useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
import Navbar from "../Form/Navbar";
import axios from "../../api/axios";

const AllStudentResult = () => {
  const [date, setDate] = useState("");

  const handleDownloadResult = async () => {
    try {
      // const response = await axios.get("/employees/download-zip");

      console.log("Date form handleDownloadResult", date);
      // const response = await axios.get(`/employees/generate-zip`)
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/employees/generate-zip`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          method: "POST",
          body: JSON.stringify({date}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download ZIP file");
      }

      const blob = await response.blob(); // Convert response to binary blob
      const url = window.URL.createObjectURL(blob); // Create temporary URL
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_results.zip"; // Set download file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up URL
    } catch (error) {
      alert("Error downloading ZIP file.");
      console.error(error);
    }
  };

  return (
    <div
      className="w-full h-full overflow-auto "
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-5 h-full">
        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-4 h-full">
          <Navbar />

          {/* Main Content Area */}
          <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 overflow-auto">
            {/* File Input */}

            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
            ></input>

            <button
              className="p-3 bg-blue-500 text-white"
              onClick={handleDownloadResult}
            >
              Download All Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudentResult;
