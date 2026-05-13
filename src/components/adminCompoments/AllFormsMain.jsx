import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiEye, FiFileText, FiImage, FiUser, FiX } from "react-icons/fi";
import axios from "../../api/axios";
import { downloadExcelForSDAT } from "../DownloadExcelFile/ExcelFileDownload";
import StudentFilterPanel from "./StudentFilterPanel";

const classFilterOptions = [
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI Engineering",
  "XII Engineering",
  "XII Passed Engineering",
  "XI Medical",
  "XII Medical",
  "XII Passed Medical",
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DetailItem = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

const AllFormsMain = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [classValue, setClassValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [startingDate, setStartingDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const paidCount = useMemo(
    () => students.filter((student) => String(student.paymentId || "").trim()).length,
    [students],
  );

  const classCount = useMemo(() => {
    return new Set(students.map((student) => student.classForAdmission).filter(Boolean)).size;
  }, [students]);

  const filterApplied = () => {
    const filters = [];
    if (inputValue) filters.push(`Name: ${inputValue}`);
    if (classValue) filters.push(`Class: ${classValue}`);
    if (startingDate && lastDate) {
      filters.push(`Date: ${formatDate(startingDate)} to ${formatDate(lastDate)}`);
    }
    return filters.length ? `Showing ${filters.join(" | ")}` : "No filters applied";
  };

  const fetchFilteredData = async (filterParams = {}) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("students/filter", {
        filterBy: "multiple",
        class: filterParams.class ?? classValue,
        name: filterParams.name ?? inputValue,
        startingDate: filterParams.startingDate ?? startingDate,
        lastDate: filterParams.lastDate ?? lastDate,
        sortOrder: filterParams.sortOrder ?? sortOrder,
      });

      setStudents(response.data || []);
      setFilterValue(filterParams.filterBy || "multiple");
    } catch (error) {
      console.error("Error filtering students:", error);
      setErrorMessage("Unable to load SDAT forms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllStudents = (order = sortOrder) => {
    setIsLoading(true);
    setErrorMessage("");

    axios
      .post("students/filter", {
        filterBy: "all",
        sortOrder: order,
      })
      .then((response) => {
        setStudents(response.data || []);
        setFilterValue("all");
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setErrorMessage("Unable to load SDAT forms. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const phoneFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("phone="))
      ?.split("=")[1];

    if (phoneFromCookie) setContactNumber(phoneFromCookie);
    fetchAllStudents(sortOrder);
  }, []);

  useEffect(() => {
    if (!isModalOpen && !showImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen, showImage]);

  const handleSortChange = (order) => {
    setSortOrder(order);
    if (filterValue === "all") {
      fetchAllStudents(order);
    } else {
      fetchFilteredData({ filterBy: "multiple", sortOrder: order });
    }
  };

  const handleSearchChange = (event) => {
    setInputValue(event.target.value);
  };

  const fetchStudentDetails = async (studentId) => {
    if (!studentId) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`/students/${studentId}`);
      const student = response.data;
      setSelectedStudent({
        ...student,
        ...student.basicDetails,
        ...student.batchDetails,
        ...student.familyDetails,
        ...student.educationalDetails,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setErrorMessage("Unable to fetch this student form.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-5">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c61d23] border-t-transparent" />
        </div>
      )}

      <StudentFilterPanel
        classValue={classValue}
        setClassValue={setClassValue}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearchChange={handleSearchChange}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
        startingDate={startingDate}
        setStartingDate={setStartingDate}
        lastDate={lastDate}
        setLastDate={setLastDate}
        fetchFilteredData={fetchFilteredData}
        fetchAllStudents={fetchAllStudents}
        classFilterOptions={classFilterOptions}
        filterApplied={filterApplied}
        filterValue={filterValue}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Forms</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Paid Forms</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{paidCount}</p>
        </div>
        <div className="border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Classes</p>
          <p className="mt-1 text-2xl font-bold text-[#c61d23]">{classCount}</p>
        </div>
      </section>

      {errorMessage && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-gray-200 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Student Forms</h2>
            <p className="text-sm text-gray-500">{filterValue === "all" ? "Showing all students" : filterApplied()}</p>
          </div>
          <button
            type="button"
            onClick={() => downloadExcelForSDAT(students)}
            disabled={!students.length}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
              students.length ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FiDownload /> Download Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-bold">Student ID</th>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Class</th>
                <th className="px-4 py-3 font-bold">Registered</th>
                <th className="px-4 py-3 font-bold">Payment</th>
                <th className="px-4 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={`${student.student_id}-${index}`} className="hover:bg-[#fff8f8]">
                    <td className="px-4 py-3 font-semibold text-gray-900">{student.StudentsId || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{student.studentName || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{student.classForAdmission || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(student.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                          student.paymentId
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {student.paymentId ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => fetchStudentDetails(student.student_id)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No SDAT forms found for the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
                <p className="text-sm text-gray-500">{selectedStudent.studentName || "Student form"}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff5f5] text-[#c61d23]">
                    <FiUser size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedStudent.studentName || "-"}</p>
                    <p className="text-sm text-gray-500">{selectedStudent.StudentsId || "No Student ID"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.profilePicture && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowImage(true);
                        setShowImageUrl(selectedStudent.profilePicture);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
                    >
                      <FiImage /> Profile
                    </button>
                  )}
                  {selectedStudent.admitCard && (
                    <button
                      type="button"
                      onClick={() => window.open(selectedStudent.admitCard, "_blank")}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#c61d23] px-3 py-2 text-sm font-semibold text-white hover:bg-[#a8191e]"
                    >
                      <FiFileText /> Admit Card
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                <DetailItem label="Email" value={selectedStudent.email} />
                <DetailItem label="Contact Number" value={selectedStudent.contactNumber} />
                <DetailItem label="Class for Admission" value={selectedStudent.classForAdmission} />
                <DetailItem label="Program" value={selectedStudent.program} />
                <DetailItem label="Exam Name" value={selectedStudent.examName} />
                <DetailItem label="Exam Date" value={selectedStudent.examDate} />
                <DetailItem label="DOB" value={formatDate(selectedStudent.dob)} />
                <DetailItem label="Father Name" value={selectedStudent.FatherName} />
                <DetailItem label="Father Contact" value={selectedStudent.FatherContactNumber} />
                <DetailItem label="Father Occupation" value={selectedStudent.FatherOccupation} />
                <DetailItem label="Mother Name" value={selectedStudent.MotherName} />
                <DetailItem label="Mother Contact" value={selectedStudent.MotherContactNumber} />
                <DetailItem label="Mother Occupation" value={selectedStudent.MotherOccupation} />
                <DetailItem label="School" value={selectedStudent.SchoolName} />
                <DetailItem label="Board" value={selectedStudent.Board} />
                <DetailItem label="Percentage" value={selectedStudent.Percentage} />
                <DetailItem label="Payment ID" value={selectedStudent.paymentId} />
                <DetailItem label="Created At" value={formatDate(selectedStudent.createdAt || selectedStudent.created_at)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="relative">
            <img src={showImageUrl} alt="Profile" className="max-h-[90vh] max-w-full rounded-lg" />
            <button
              type="button"
              onClick={() => setShowImage(false)}
              className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFormsMain;
