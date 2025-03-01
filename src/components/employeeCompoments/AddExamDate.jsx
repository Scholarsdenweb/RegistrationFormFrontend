import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
import Navbar from "../Form/Navbar";
import dayjs from "dayjs";

const AddExamDate = () => {
  const [examDate, setExamDate] = useState("");
  const [allDates, setAllDates] = useState([]);
  const [editingDate, setEditingDate] = useState(null);

  const addDate = async () => {
    if (!examDate) return alert("Please select a valid date.");
    try {
      if (editingDate) {
        console.log("editingDate", editingDate);
        console.log("examDate", examDate);

        const response = await axios.patch("/employees/editDate", {
          _id: editingDate._id,
          changedDate: examDate,
        });
        console.log("response", response);
        setEditingDate(null);
      } else {
        await axios.post("/employees/addExamDate", { examDate });
      }
      setExamDate("");
      await fetchAllDates();
    } catch (error) {
      console.error("Error adding/editing date:", error);
    }
  };

  const fetchAllDates = async () => {
    try {
      const response = await axios.get("/employees/getAllDates");
      const filteredDates = response.data.filter(
        (date) =>
          dayjs(date.examDate).isAfter(dayjs().startOf("day")) &&
          dayjs(date.examDate).isBefore(dayjs().add(3, "month"))
      );

      console.log("filteredDates form FetchAllDates", filteredDates);
      setAllDates(filteredDates);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  const handleEdit = async (date) => {
    setEditingDate(date);
    setExamDate(dayjs(date.examDate).format("DD-MM-YYYY"));

    // setEditDatePopup(true);
  };


  const deleteDate =async (id) => {
    const response = await axios.delete(`/employees/deleteDate/${id}`);
    console.log("response", response);
    await fetchAllDates();
  };

  const minDate = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(3, "month").format("YYYY-MM-DD");

  return (
    <div className="w-full h-full overflow-auto bg-[#c61d23]">
      <div className="grid grid-cols-5 h-full">
        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-4 h-full">
          <Navbar />

          {/* Main Content */}
          <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-white rounded-3xl flex flex-col items-center justify-center gap-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-700">
              {editingDate ? "Edit Exam Date" : "Add Exam Date"}
            </h1>

            <input
              type="date"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              value={examDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setExamDate(e.target.value)}
            />

            <button
              className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              onClick={addDate}
            >
              {editingDate ? "Update Exam Date" : "Add Exam Date"}
            </button>

            <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg shadow-inner ">
              <h2 className="text-lg font-semibold text-gray-600 p-2">
                Upcoming Exam Dates
              </h2>
              <div className="overflow-auto h-60 border p-3 rounded-md">
                {allDates.length > 0 ? (
                  allDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white shadow rounded-md mt-2"
                    >
                      <p className="text-gray-700 font-medium">
                        {dayjs(date.examDate).format("DD MMM YYYY")}
                      </p>
                      <div className="flex gap-4">
                        <button
                          className="text-sm bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                          onClick={() => handleEdit(date)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                          onClick={() => deleteDate(date._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No upcoming exam dates.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExamDate;
