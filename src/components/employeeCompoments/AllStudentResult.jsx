import React, { useEffect, useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
import Navbar from "../Form/Navbar";
import axios from "../../api/axios";
import dayjs from "dayjs";

const AllStudentResult = () => {
  const [date, setDate] = useState("");

  const [allDates, setAllDates] = useState([]);



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




  const fetchAllDates = async () => {
    try {
      const response = await axios.get("/employees/getAllDates");

      console.log("response", response);




      // const filteredDates = response.data.filter(
      //   (date) =>
      //     dayjs(date.examDate).isAfter(dayjs().startOf("day")) &&
      //     dayjs(date.examDate).isBefore(dayjs().add(3, "month"))
      // );
      setAllDates(response.data);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  


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

            {/* <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
            ></input> */}


            {allDates && (
              <select
                className="p-3 "
                onChange={(e) => setDate(e.target.value)}
              >
                <option value="">Select a date</option>
                {allDates.map((date) => (
                  <option key={date._id} value={date.examDate}>
                    {date.examDate}
                  </option>
                ))}
              </select>
            )}

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
