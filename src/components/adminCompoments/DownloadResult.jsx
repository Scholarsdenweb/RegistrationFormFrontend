import { useEffect, useRef, useState } from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
// import Navbar from "../Form/Navbar";
import axios from "../../api/axios";


const DownloadResult = () => {

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedExamDate, setSelectedExamDate] = useState("");
  const loader = useRef(null);




  useEffect(() => {
    const allResults = async () => {
      try {
        const response = await axios.get(`/result?page=${page}&limit=20`);
        const data = response.data;
        console.log("data form allResults", data);
        if (data.length === 0) setHasMore(false);
        setResults(prev => {
          const existingIds = new Set(prev.map(item => item._id));
          const newResults = data.filter(item => !existingIds.has(item._id));
          return [...prev, ...newResults];
        });        console.log("response of allResults", response);
      } catch (error) {
        console.log(error);
      }
    };
    allResults();
  }, [page]);


  // Group results by exam date
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.examDate]) acc[result.examDate] = [];
    acc[result.examDate].push(result);
    return acc;
  }, {});

  const examDates = Object.keys(groupedResults).sort((a, b) => {
    const aDate = new Date(a.split("-").reverse().join("-"));
    const bDate = new Date(b.split("-").reverse().join("-"));
    return bDate - aDate;
  });

  useEffect(() => {
    if (!selectedExamDate && examDates.length > 0) {
      setSelectedExamDate(examDates[0]);
    }
  }, [examDates, selectedExamDate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        },
        { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
}, [hasMore]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader title="Result Repository" subtitle="Browse generated result files by exam date and download instantly." />
          <div className="w-full min-h-[70vh] bg-white/90 rounded-3xl border border-white flex flex-col gap-6 shadow-[0_20px_50px_rgba(157,23,33,0.08)] p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center tracking-tight">Result Library</h1>
            <p className="text-sm text-gray-500 text-center -mt-5">Browse generated result files and download them directly.</p>

            <div className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfb] p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Available Exam Dates</h2>
              {examDates.length > 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-2">
                  <div
                    role="tablist"
                    aria-label="Exam dates"
                    className="flex gap-2 overflow-x-auto whitespace-nowrap"
                  >
                  {examDates.map((examDate) => (
                    <button
                      key={examDate}
                      type="button"
                      onClick={() => setSelectedExamDate(examDate)}
                      role="tab"
                      aria-selected={selectedExamDate === examDate}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                        selectedExamDate === examDate
                          ? "bg-gradient-to-r from-[#c61d23] to-[#8f1515] text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#c61d23]/50"
                      }`}
                    >
                      {examDate}
                    </button>
                  ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No exam dates available yet.</p>
              )}
            </div>

            {selectedExamDate && groupedResults[selectedExamDate] && (
              <div role="tabpanel" className="w-full rounded-2xl border border-gray-200 bg-[#fcfbfb] p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  Results for {selectedExamDate}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                  {groupedResults[selectedExamDate].map((result) => (
                    <div key={result._id} className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white flex flex-col items-center hover:shadow-md transition">
                      <iframe
                        src={result.resultUrl}
                        className="w-full max-w-44 h-44 border border-gray-200 rounded-lg"
                        title="PDF Preview"
                      />
                      <p className="mt-3 text-gray-700 text-sm font-medium">Student ID: {result.StudentId}</p>
                      <a
                        href={result.resultUrl}
                        download
                        className="mt-2 inline-flex items-center rounded-lg bg-gradient-to-r from-[#c61d23] to-[#8f1515] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading indicator at the bottom */}
            {hasMore && <div ref={loader} className="text-center text-gray-500 mt-4">Loading...</div>}
          </div>
        </div>
      </div>
    </div>
);
};
 

export default DownloadResult;
