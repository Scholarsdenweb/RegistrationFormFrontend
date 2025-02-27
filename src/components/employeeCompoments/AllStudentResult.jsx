import React, { useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
import Navbar from "../Form/Navbar";
import axios from "../../api/axios";

const AllStudentResult = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGenerateResult = async () => {
    try {
      const responce = await axios.get("/employees/generate-zip");
      console.log("responce", responce);
    } catch (error) {
      console.log("error", error);
    }
  };
//   const handleDownloadResult = async () => {
//     try {
//       const response = await axios.get("/employees/download-zip");




    
//       const blob = await response.blob(); // Convert response to blob
//       console.log("blob",blob);
//       const url = window.URL.createObjectURL(blob); // Create download URL
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "student_results.zip"; // Set download file name
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url); // Clean up URL
//     } catch (error) {
//         console.log("error",error);
//       alert("Error downloading ZIP file.",error);
//     }
//   };




  const handleDownloadResult = async () => {
    try {
        // const response = await axios.get("/employees/download-zip");


        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/employees/generate-zip`, {
            method: "GET",
        })

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
      const response = await axios.post("/employees/generateResult", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response from employee dashboard", response);

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

            <button
              className="p-3 bg-blue-500 text-white"
              onClick={handleGenerateResult}
            >
              Generate All Result
            </button>

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
