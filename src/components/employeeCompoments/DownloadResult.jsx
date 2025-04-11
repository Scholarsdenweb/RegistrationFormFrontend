import { useEffect, useRef, useState } from "react";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
// import Navbar from "../Form/Navbar";
import axios from "../../api/axios";


const DownloadResult = () => {

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
    <div className="w-full max-h-screen bg-[#c61d23]">
      <div className="grid grid-cols-5 h-full">
        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        {/* Right Content Area */}
        <div className="flex flex-col col-span-4 py-6">
          <div className="col-span-6 px-9 py-9 mb-3 mr-5 bg-white rounded-3xl flex flex-col items-center justify-center gap-6 shadow-lg max-h-[90vh] overflow-y-auto pt-6">
            <h1 className="text-3xl font-bold text-gray-700">Download Results</h1>

            {Object.keys(groupedResults).map((examDate) => (
              <div key={examDate} className="w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{examDate}</h2>
                <div className="grid grid-cols-4 gap-6">
                  {groupedResults[examDate].map((result) => (
                    <div key={result._id} className="p-4 border rounded-lg shadow-md flex flex-col items-center">
                      <iframe
                        src={result.resultUrl}
                        className="w-40 h-40 border rounded-md"
                        title="PDF Preview"
                      />
                      <p className="mt-2 text-gray-700 text-sm">Student ID: {result.StudentId}</p>
                      <a
                        href={result.resultUrl}
                        download
                        className="mt-2 text-blue-500 hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Loading indicator at the bottom */}
            {hasMore && <div ref={loader} className="text-center text-gray-500 mt-4">Loading...</div>}
          </div>
        </div>
      </div>
    </div>
);
};
 

export default DownloadResult;
