import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
// import Navbar from "../Form/Navbar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const AddExamDate = () => {
  const [examDate, setExamDate] = useState("");
  // const [scholarshipValidation, setScholarshipValidation] = useState("");
  const [allDates, setAllDates] = useState([]);
  const [editingDate, setEditingDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [dateToDelete, setDateToDelete] = useState(null);

  const [examName, setExamName] = useState("");

  const [errors, setErrors] = useState({
    examDate: "",
    examType: "",
  });

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    ["examDate", "examType"].forEach((field) => {
      if (!field) {
        // Capitalize the first letter of the field and add spaces before capital letters
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        formErrors[field] = `${formattedField} is required`;
        isValid = false;
      }
    });
    setErrors(formErrors);
    return isValid;
  };

  const addDate = async () => {
    if (!validateForm()) return;

    // Required to Change Because it may cause error Ex - secound request not run because of any error so we need to handle this issue
    setLoading(true);
    try {
      if (editingDate) {
        await axios.patch("/employees/editDate", {
          _id: editingDate._id,
          changedDate: dayjs(examDate).format("DD-MM-YYYY"),
          newExamName: examName,
        });
        await axios.patch("/examList/updateExam");
        setMessage("✅ Exam date updated successfully!");
        setEditingDate(null);
      } else {
        console.log("ExamDate", examDate);
        await axios.post("/employees/addExamDate", {
          examDate: dayjs(examDate).format("DD-MM-YYYY"),
          examName,
          // scholarshipValidation: dayjs(scholarshipValidation).format(
          //   "DD-MM-YYYY"
          // ),
        });

        // await axios.post("/examList/addExam", {
        //   examName
        // })
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

      console.log("response", response);

      const filteredDates = response.data.filter((date) => {
        const examDate = dayjs(date.examDate, "DD-MM-YYYY", true);

        return {
          examDate:
            examDate.isValid() &&
            examDate.isAfter(dayjs().startOf("day")) &&
            examDate.isBefore(dayjs().add(3, "months").endOf("day")),
          examName: date.examName,
        };
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
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader title="Exam Date Management" subtitle="Create, edit, and maintain upcoming exam schedules." />

          {/* Main Content */}
          <div className="w-full min-h-[70vh] bg-white/90 rounded-3xl border border-white flex flex-col items-center justify-center gap-6 shadow-[0_20px_50px_rgba(157,23,33,0.08)] p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center tracking-tight">
              {editingDate ? "✏️ Edit Exam Date" : "📅 Add Exam Date"}
            </h1>

            {/* Success/Error Message */}
            {message && (
              <p className="text-md font-medium text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                {message}
              </p>
            )}

            {/* Date Input */}
            <form
              className="flex flex-col gap-4 w-full max-w-md bg-[#faf7f7] border border-gray-200 rounded-2xl p-4"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent the form from submitting the traditional way
                addDate(); // Call the addDate function
              }}
            >
              <input
                type="date"
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30"
                value={examDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
              {/* <input
                type="date"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                value={scholarshipValidation}
                min={minDate}
                max={maxDate}
                onChange={(e) => setScholarshipValidation(e.target.value)}
              /> */}
              <select
                name="AddExamDate"
                id="AddExamDate"
                value={examName || ""} // Ensure examName is defined or defaults to an empty string
                onChange={(e) => setExamName(e.target.value)} // Use the correct function to update state
                className="w-full border border-gray-300 rounded-lg text-black py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30 appearance-none bg-white"
              >
                <option value="" className="bg-white text-black" disabled>
                  Select Exam
                </option>
                <option value="SDAT" className="bg-white text-black">
                  SDAT
                </option>
                <option value="RISE" className="bg-white text-black">
                  RISE
                </option>
              </select>

              {/* Add/Update Button */}
              <button
                className={`p-3 text-white rounded-lg shadow-md transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#c61d23] to-[#8f1515] hover:opacity-95"
                }`}
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editingDate
                  ? "Update Date"
                  : "Add Date"}
              </button>
            </form>

            {/* Exam Date List */}
            <div className="w-full mt-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-600 p-2">
                📅 Upcoming Exam Dates
              </h2>
              <div className="overflow-auto h-60 border border-gray-200 p-3 rounded-xl bg-[#fcfbfb]">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  </div>
                ) : allDates.length > 0 ? (
                  allDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-white shadow-sm border border-gray-100 rounded-xl mt-2 transition-all duration-300 hover:shadow-md"
                    >
                      <p className="text-gray-700 font-medium">
                        {date.examDate}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {date.examName}
                      </p>
                      <div className="flex gap-4">
                        <button
                          className="text-sm bg-[#fff4de] text-[#7c5200] border border-[#f7d7a2] px-3 py-1 rounded-lg hover:bg-[#ffeac4] transition-all"
                          onClick={() => handleEdit(date)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="text-sm bg-[#fde9ea] text-[#9f1239] border border-[#f5c9cc] px-3 py-1 rounded-lg hover:bg-[#fbdadd] transition-all"
                          onClick={() => confirmDelete(date._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No upcoming exam dates.
                  </p>
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
            <h2 className="text-lg font-semibold text-gray-700">
              ⚠️ Confirm Delete
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete this exam date?
            </p>
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
