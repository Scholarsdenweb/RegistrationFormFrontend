import { useEffect, useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
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
      const response = await axios.get("/employees/getAllDates");
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
    <div className="w-full h-full bg-[#c61d23] overflow-auto ">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Notifications */}

      <div className="grid grid-cols-5 h-full">
        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        {/* Right Content Area */}
        <div className="flex flex-col col-span-4 h-full py-6">
          {/* <Navbar /> */}

          {/* Main Content */}
          <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-white rounded-3xl flex flex-col items-center justify-center gap-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-700">Download Results</h1>

            {/* Date Selection Dropdown */}
            <div className="w-72">
              <label className="block text-gray-600 font-medium mb-2">
                Select Exam Date:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
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
              className={`flex items-center gap-2 p-3 px-5 text-white rounded-lg shadow-md transition duration-300 ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
