import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Sidebar from "./EmployeeeLoginSignup/Sidebar";
// import Navbar from "../Form/Navbar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const AddExamDate = () => {
  const [examDate, setExamDate] = useState("");
  const [allDates, setAllDates] = useState([]);
  const [editingDate, setEditingDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [dateToDelete, setDateToDelete] = useState(null);

  const addDate = async () => {
    if (!examDate) return alert("⚠️ Please select a valid date.");

    setLoading(true);
    try {
      if (editingDate) {
        await axios.patch("/employees/editDate", {
          _id: editingDate._id,
          changedDate: dayjs(examDate).format("DD-MM-YYYY"),
        });
        setMessage("✅ Exam date updated successfully!");
        setEditingDate(null);
      } else {
        await axios.post("/employees/addExamDate", {
          examDate: dayjs(examDate).format("DD-MM-YYYY"),
        });
        setMessage("✅ Exam date added successfully!");
      }

      setExamDate("");
      await fetchAllDates();
    } catch (error) {
      console.error("Error adding/editing date:", error);
      setMessage("❌ Failed to update exam date.");
    }
    setLoading(false);
  };

  const fetchAllDates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/employees/getAllDates");
      const filteredDates = response.data.filter((date) => {
        const examDate = dayjs(date.examDate, "DD-MM-YYYY", true);
        return (
          examDate.isValid() &&
          examDate.isAfter(dayjs().startOf("day")) &&
          examDate.isBefore(dayjs().add(3, "months").endOf("day"))
        );
      });

      setAllDates(filteredDates);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  const handleEdit = (date) => {
    setEditingDate(date);
    setExamDate(dayjs(date.examDate).format("YYYY-DD-MM"));
  };

  const confirmDelete = (id) => {
    setDateToDelete(id);
    setDeleteModal(true);
  };

  const deleteDate = async () => {
    setLoading(true);
    try {
      await axios.delete(`/employees/deleteDate/${dateToDelete}`);
      setMessage("✅ Exam date deleted successfully!");
      setDeleteModal(false);
      await fetchAllDates();
    } catch (error) {
      console.error("Error deleting date:", error);
      setMessage("❌ Failed to delete exam date.");
    }
    setLoading(false);
  };

  const minDate = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(3, "month").format("YYYY-MM-DD");

  return (
    <div className="w-full h-full overflow-auto bg-[#c61d23]">
      <div className="grid grid-cols-5 h-full">
        {/* Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-4 h-full py-6">
          {/* <Navbar /> */}

          {/* Main Content */}
          <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-white rounded-3xl flex flex-col items-center justify-center gap-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-700">
              {editingDate ? "✏️ Edit Exam Date" : "📅 Add Exam Date"}
            </h1>

            {/* Success/Error Message */}
            {message && (
              <p className="text-md font-medium text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                {message}
              </p>
            )}

            {/* Date Input */}
            <input
              type="date"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              value={examDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setExamDate(e.target.value)}
            />

            {/* Add/Update Button */}
            <button
              className={`p-3 text-white rounded-lg shadow-md transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={addDate}
              disabled={loading}
            >
              {loading ? "Processing..." : editingDate ? "Update Date" : "Add Date"}
            </button>

            {/* Exam Date List */}
            <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg shadow-inner ">
              <h2 className="text-lg font-semibold text-gray-600 p-2">
                📅 Upcoming Exam Dates
              </h2>
              <div className="overflow-auto h-60 border p-3 rounded-md">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  </div>
                ) : allDates.length > 0 ? (
                  allDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white shadow rounded-md mt-2 transition-all duration-300 hover:bg-gray-50"
                    >
                      <p className="text-gray-700 font-medium">{date.examDate}</p>
                      <div className="flex gap-4">
                        <button
                          className="text-sm bg-yellow-500 text-black px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition-all"
                          onClick={() => handleEdit(date)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition-all"
                          onClick={() => confirmDelete(date._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No upcoming exam dates.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">⚠️ Confirm Delete</h2>
            <p className="text-gray-600">Are you sure you want to delete this exam date?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={deleteDate}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddExamDate;
