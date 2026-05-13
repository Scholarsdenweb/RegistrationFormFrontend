import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiEdit2, FiPlus, FiRefreshCcw, FiX } from "react-icons/fi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "../../api/axios";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";

dayjs.extend(customParseFormat);

const emptyForm = {
  examDate: "",
  examName: "",
};

const formatForApi = (value) => dayjs(value).format("DD-MM-YYYY");

const formatForInput = (value = "") => {
  const normalized = String(value).replace(/\./g, "-");
  const parsed = dayjs(normalized, ["DD-MM-YYYY", "DD.MM.YYYY", "YYYY-MM-DD"], true);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

const formatForDisplay = (value = "") => {
  const normalized = String(value).replace(/\./g, "-");
  const parsed = dayjs(normalized, ["DD-MM-YYYY", "DD.MM.YYYY", "YYYY-MM-DD"], true);
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : value || "-";
};

const AddExamDate = () => {
  const [allDates, setAllDates] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingDate, setEditingDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const minDate = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(3, "month").format("YYYY-MM-DD");

  const upcomingCount = useMemo(() => {
    return allDates.filter((item) => {
      const parsed = dayjs(String(item.examDate).replace(/\./g, "-"), "DD-MM-YYYY", true);
      return parsed.isValid() && !parsed.isBefore(dayjs().startOf("day"), "day");
    }).length;
  }, [allDates]);

  const fetchAllDates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/employees/allDates");
      setAllDates(response.data || []);
    } catch (error) {
      console.error("Error fetching dates:", error);
      setMessage("Failed to load exam dates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  const openAddModal = () => {
    setEditingDate(null);
    setFormData(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (date) => {
    setEditingDate(date);
    setFormData({
      examDate: formatForInput(date.examDate),
      examName: date.examName || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingDate(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.examDate) nextErrors.examDate = "Exam date is required.";
    if (!formData.examName) nextErrors.examName = "Exam name is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setMessage("");

    try {
      if (editingDate) {
        await axios.patch("/employees/editDate", {
          _id: editingDate._id,
          changedDate: formatForApi(formData.examDate),
          newExamName: formData.examName,
        });
        setMessage("Exam date updated successfully.");
      } else {
        await axios.post("/employees/addExamDate", {
          examDate: formatForApi(formData.examDate),
          examName: formData.examName,
        });
        setMessage("Exam date added successfully.");
      }

      closeModal();
      await fetchAllDates();
    } catch (error) {
      console.error("Error saving exam date:", error);
      setMessage(error?.response?.data?.message || "Failed to save exam date.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f3f3]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        <main className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader
            title="Exam Date Management"
            subtitle="Create and maintain SDAT/RISE exam schedules."
          />

          <section className="bg-white border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 p-4 sm:p-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Exam Dates</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {allDates.length} total dates · {upcomingCount} upcoming
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={fetchAllDates}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
                >
                  <FiRefreshCcw /> Refresh
                </button>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c61d23] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a8191e]"
                >
                  <FiPlus /> Add Exam Date
                </button>
              </div>
            </div>

            {message && (
              <div className="mx-4 mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 sm:mx-6">
                {message}
              </div>
            )}

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : allDates.length > 0 ? (
                <div className="overflow-x-auto border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-bold">Exam</th>
                        <th className="px-4 py-3 font-bold">Date</th>
                        <th className="px-4 py-3 font-bold">Stored Format</th>
                        <th className="px-4 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allDates.map((date) => (
                        <tr key={date._id} className="hover:bg-[#fff8f8]">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff5f5] px-3 py-1 text-xs font-bold text-[#c61d23]">
                              <FiCalendar /> {date.examName || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900">
                            {formatForDisplay(date.examDate)}
                          </td>
                          <td className="px-4 py-3 text-gray-500">{date.examDate || "-"}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(date)}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#f0c36d] bg-[#fff8e8] px-3 py-2 text-sm font-semibold text-[#7c5200] hover:bg-[#ffefc7]"
                              >
                                <FiEdit2 /> Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                  <p className="text-sm font-semibold text-gray-700">No exam dates have been added yet.</p>
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#c61d23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a8191e]"
                  >
                    <FiPlus /> Add First Exam Date
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-8">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingDate ? "Edit Exam Date" : "Add Exam Date"}
                </h2>
                <p className="text-sm text-gray-500">Fill the exam details and submit.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-7">
              <label className="block text-sm font-semibold text-gray-700">
                Exam Date
                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  min={minDate}
                  max={maxDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
                />
                {errors.examDate && <span className="mt-1 block text-xs text-red-600">{errors.examDate}</span>}
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Exam Name
                <select
                  name="examName"
                  value={formData.examName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
                >
                  <option value="">Select exam</option>
                  <option value="SDAT">SDAT</option>
                  <option value="RISE">RISE</option>
                </select>
                {errors.examName && <span className="mt-1 block text-xs text-red-600">{errors.examName}</span>}
              </label>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                    submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#c61d23] hover:bg-[#a8191e]"
                  }`}
                >
                  {submitting ? "Saving..." : editingDate ? "Update Exam Date" : "Add Exam Date"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddExamDate;
