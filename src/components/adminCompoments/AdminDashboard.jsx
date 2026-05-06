import { useState } from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
// import Navbar from "../Form/Navbar";
import axios from "../../api/axios";

const AdminDashboard = () => {
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
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader title="Result Processing" subtitle="Upload CSV files and generate student results with progress tracking." />

          {/* Main Content Area */}
          <div className="w-full min-h-[70vh] bg-white/90 rounded-3xl border border-white shadow-[0_20px_50px_rgba(157,23,33,0.08)] flex flex-col items-center justify-center gap-6 p-6 sm:p-10 overflow-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center tracking-tight">
              Upload CSV File 📂
            </h2>
            <p className="text-sm text-gray-500 text-center -mt-2">
              Upload a CSV to generate student results in one flow.
            </p>

            {/* File Input */}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30"
            />

            {/* Upload Button with Animation */}
            <button
              onClick={handleUpload}
              className={`px-6 py-2 rounded-md text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#c61d23] to-[#8f1515] hover:from-[#b01a20] hover:to-[#7e1212]"
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
              <div className="w-full max-w-md bg-gray-200 rounded-full h-4 relative mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#c61d23] to-[#f97316] h-4 rounded-full transition-all duration-500"
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

export default AdminDashboard;
