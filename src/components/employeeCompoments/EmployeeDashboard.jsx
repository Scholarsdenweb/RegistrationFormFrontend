import { useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
// import Navbar from "../Form/Navbar";
import axios from "../../api/axios";

const EmployeeDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [latestUrl, setLatestUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    setUploadStatus("⏳ Uploading and processing...");
    setLoading(true);

    try {
      const response = await axios.post("/employees/generateResult", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "text",
      });

      console.log("Response from server:", response);

      // ✅ Read response from `response.data`
      const textChunks = response.data.trim().split("\n");

      textChunks.forEach((chunk) => {
        if (!chunk) return;

        // ✅ Remove `data: ` prefix if present
        const cleanChunk = chunk.replace(/^data:\s*/, "");

        try {
          const data = JSON.parse(cleanChunk);

          if (data.complete) {
            setUploadStatus("✅ All results processed successfully!");
            setLoading(false);
          } else {
            setProgress({ current: data.index, total: data.total });
            setLatestUrl(data.url);
          }
        } catch (error) {
          console.error("Error parsing JSON chunk:", cleanChunk);
          console.log(error);
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("❌ Error uploading file.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#c61d23]">
      <div className="grid grid-cols-5 h-full">
        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-4 h-full py-6">
          {/* <Navbar /> */}

          {/* Main Content Area */}
          <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center gap-6 overflow-auto">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Upload CSV File 📂
            </h2>

            {/* File Input */}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Upload Button with Animation */}
            <button
              onClick={handleUpload}
              className={`px-6 py-2 rounded-md text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File 🚀"}
            </button>

            {/* Status Message */}
            {uploadStatus && (
              <p className="text-md text-gray-600 font-medium">{uploadStatus}</p>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            )}

            {/* Progress Bar */}
            {progress.total > 0 && (
              <div className="w-1/2 bg-gray-300 rounded-md h-4 relative mt-4">
                <div
                  className="bg-blue-500 h-4 rounded-md transition-all duration-500"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                ></div>
                <p className="text-center mt-2 text-gray-700 font-medium">
                  {`Results generated: ${progress.current} / ${progress.total}`}
                </p>
              </div>
            )}

            {/* Show latest generated report URL */}
            {latestUrl && (
              <p className="text-md text-blue-600 mt-3">
                📄 Latest Report:{" "}
                <a
                  href={latestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  View Report
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
