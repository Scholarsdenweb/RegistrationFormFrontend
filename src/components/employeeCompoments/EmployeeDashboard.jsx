
import React, { useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
import Navbar from "../Form/Navbar";
import axios from "axios";

const EmployeeDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };



  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("csvFile", file);
  
    formData.forEach((value, key) => {
      console.log("FormData Key:", key, "=>", value);
    });
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees/generateResult",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      if (response.status === 200) {
        setUploadStatus(`Upload successful: ${response.data.message}`);
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Error uploading file.");
    }
  };
  




  return (
    <div
      className="w-full h-full overflow-auto rounded-3xl shadow-2xl"
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
            <h2 className="text-xl font-bold mb-4">Upload CSV File</h2>

            {/* File Input */}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="p-2 border rounded-md"
            />

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Upload File
            </button>

            {/* Status Message */}
            {uploadStatus && (
              <p className="text-sm text-gray-700">{uploadStatus}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
