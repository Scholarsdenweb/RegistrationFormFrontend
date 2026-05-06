import { useEffect, useState } from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
// import Navbar from "../Form/Navbar";
import axios from "../../api/axios";
import { FaDownload } from "react-icons/fa"; // Download icon
import { ClipLoader } from "react-spinners"; // Loading spinner
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const AllStudentResult = () => {
  const [date, setDate] = useState("");
  const [allDates, setAllDates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available exam dates
  const fetchAllDates = async () => {
    try {
      const response = await axios.get("/employees/allDates");
      console.log("Fetched dates:", response.data);
      setAllDates(response.data);
    } catch (error) {
      toast.error("Error fetching dates. Please try again.");
      console.error("Error fetching dates:", error);
    }
  };

  

  useEffect(() => {
    fetchAllDates();
  }, []);

  // Handle ZIP file download
  const handleDownloadResult = async () => {
    if (!date) {
      toast.warning("Please select a date before downloading.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/employees/generate-zip`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ date }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download ZIP file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Student_Results_${date}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started successfully!");
    } catch (error) {
      toast.error("Error downloading ZIP file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Notifications */}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader title="Bulk Result Download" subtitle="Export all student results for a selected exam date as a ZIP archive." />

          {/* Main Content */}
          <div className="w-full min-h-[70vh] bg-white/90 rounded-3xl border border-white flex flex-col items-center justify-center gap-6 shadow-[0_20px_50px_rgba(157,23,33,0.08)] p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center tracking-tight">Result ZIP Export</h1>
            <p className="text-sm text-gray-500 text-center -mt-3">Select an exam date and export all student results as a single archive.</p>

            {/* Date Selection Dropdown */}
            <div className="w-full max-w-sm">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Exam Date:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30"
                onChange={(e) => setDate(e.target.value)}
              >
                <option value="">-- Choose Date --</option>
                {allDates.map((date) => (
                  <option key={date._id} value={date.examDate}>
                    {date.examDate}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Button */}
            <button
              className={`flex items-center gap-2 p-3 px-5 text-white rounded-xl shadow-md transition duration-300 font-semibold ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[#c61d23] to-[#8f1515] hover:from-[#b01a20] hover:to-[#7d1212]"
              }`}
              onClick={handleDownloadResult}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : <FaDownload />}
              {loading ? "Downloading..." : "Download All Results"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudentResult;
