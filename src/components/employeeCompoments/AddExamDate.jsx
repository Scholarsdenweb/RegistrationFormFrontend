import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
import Navbar from "../Form/Navbar";
import editExamDate from "./editExamDate";
const AddExamDate = () => {
  const [examDate, setExamDate] = useState();
  const [allDates, setAllDates] = useState([]);

  const [changeDatePopup, setChangeDatePopup] = useState(false);

  const [editDatePopup, setEditDatePopup] = useState(false);

  const addDate = async () => {
    console.log("examDate", examDate);
    const response = await axios.post("/employees/addExamDate", { examDate });
    console.log("response", response);
    await FetchAllDates();
  };

  const FetchAllDates = async () => {
    const response = await axios.get("/employees/getAllDates");
    setAllDates(response.data);
    console.log("response", response);
  };
  useEffect(() => {
    FetchAllDates();
  }, []);

  const editDate = async (date) => {
    const response = await axios.patch("/employees/editDate", date);
    console.log("response", response);
    await FetchAllDates();
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

            {editDatePopup && <editExamDate setEditDatePopup={setEditDatePopup} />}

            <h1 className="text-2xl font-semibold mb-1">Add Exam Date</h1>

            <input
              type="date"
              className="p-3 border border-gray-300 rounded-md"
              onChange={(e) => setExamDate(e.target.value)}
            />

            <button className="p-3 bg-blue-500 text-white" onClick={addDate}>
              Add Exam Date
            </button>
            {allDates &&
              allDates.map((date, index) => (
                <div className="flex justify-between gap-4">
                  <p key={index}>{date.examDate}</p>
                  <button onClick={() => setEditDatePopup(true)}>Edit</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExamDate;
