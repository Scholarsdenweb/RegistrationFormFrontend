import React, { useEffect, useState, useMemo } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
import PaginatedList from "../../utils/PaginatedList";
import { downloadExcelForSDAT } from "../DownloadExcelFile/ExcelFileDownload";
import StudentFilterPanel from "./StudentFilterPanel"; // Adjust path as needed

const AllFormsMain = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [classValue, setClassValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showFilteredData, setShowFilteredData] = useState([]);
  const [showImageUrl, setShowImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [startingDate, setStartingDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const history = useNavigate();

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

  // Handle sort order change
  const handleSortChange = (order) => {
    console.log("handleSortChange", order);
    setSortOrder(order);
    // Re-fetch data with new sort order
    if (filterValue === "class") {
      fetchFilteredData({
        filterBy: "class",
        class: classValue,
        sortOrder: order,
      });
    } else if (filterValue === "id") {
      fetchFilteredData({
        filterBy: "id",
        studentId: inputValue,
        sortOrder: order,
      });
    } else if (filterValue === "name") {
      fetchFilteredData({
        filterBy: "name",
        name: inputValue,
        sortOrder: order,
      });
    } else {
      fetchAllStudents(order);
    }
  };

  const getCookieValue = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  // Unified filter function
  const fetchFilteredData = async (filterParams = {}) => {
    setIsLoading(true);
    console.log("filterParams from fetchFilteredData", filterParams, sortOrder);
    console.log(
      "filterParams from alldata",
      filterParams.class,
      filterParams.name,
      filterParams.startingDate,
      filterParams.lastDate,
      filterParams.sortOrder,
      sortOrder
    );

    const phone = getCookieValue("phone");
    try {
      // const response = await axios.post("/students/filter", filterParams);
      const response = await axios.post("students/filter", {
        filterBy: "multiple",
        class: filterParams.class || classValue,
        name: filterParams.name || inputValue,
        // studentId : filterParams.studentId ,

        startingDate: filterParams.startingDate || startingDate,
        lastDate: filterParams.lastDate || lastDate,
        sortOrder: filterParams.sortOrder,
      });

      console.log("Filtered students:", response.data);
      setShowFilteredData(response.data);
      setFilterValue("multiple");

      console.log("Filter for all response", response);
      setShowFilteredData(response.data);
      setFilterValue(filterParams.filterBy);
    } catch (error) {
      console.error("Error filtering students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced filter function
  const debouncedFilter = useMemo(() => debounce(fetchFilteredData, 500), []);

  // Handle class filter change
  const handleChangeClassFilter = async (e) => {
    const selectedClass = e.target.value;
    if (selectedClass === "Select Class") {
      fetchAllStudents();
      return;
    }
    setClassValue(selectedClass);
    fetchFilteredData({ filterBy: "class", class: selectedClass, sortOrder });
  };

  // Handle name/ID search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("value.length,,,,,,,,,,,,,,,,,,,,,,", value.length);
    // if (value.length < 1) {
    //   console.log("value.length.................", value.length);
    //    setInputValue(value);
    //   fetchAllStudents({ order: sortOrder });
    //   return;
    // } else {
    setInputValue(value);
    console.log("VAle from handleSearchChange", value);

    // Determine if input is likely an ID (numeric)
    const isIdSearch = /^\d+$/.test(value);

    // if (isIdSearch) {
    //   debouncedFilter({ filterBy: "id", studentId: value, sortOrder });
    // } else {
    debouncedFilter({ filterBy: "name", name: value, sortOrder });
    // }
    // }
  };
  const filerByDate = async () => {
    const response = await axios.post("students/fetchDataByDateRange", {
      startingDate,
      lastDate,
    });

    console.log("filterByDate response", response);

    setShowFilteredData(response.data.data);

    // setShowFilteredData(response.data.data);
    setFilterValue("daterangeData");
  };

  // Fetch all students when no filter is applied
  const fetchAllStudents = (order) => {
    fetchFilteredData({ filterBy: "all", sortOrder: order });
  };

  // Initialize with all students
  useEffect(() => {
    const phoneFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("phone="))
      ?.split("=")[1];

    if (phoneFromCookie) {
      setContactNumber(phoneFromCookie);
    }

    fetchAllStudents(sortOrder);
  }, []);

  const handleCardClick = (student, basic, batch, family) => {
    setSelectedStudent({
      ...student,
      ...basic,
      ...batch,
      ...family,
    });
    setIsModalOpen(true);
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      setIsLoading(true);
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
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const convertToDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const onClickShowImage = (imageUrl) => {
    setShowImage(true);
    setShowImageUrl(imageUrl);
  };

  const renderStudentCard = (student, index, onClick) => {
    const {
      studentName,
      basicDetails: basic = {},
      batchDetails: batch = {},
      familyDetails: family = {},
    } = student;

    return (
      <div
        key={index}
        className="bg-white/95 h-48 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-800">Student Name: {studentName}</h4>
          <h4>Father Name: {family?.FatherName}</h4>
          <h4>Class: {batch?.classForAdmission}</h4>
          <h4>Subject: {batch?.subjectCombination}</h4>
          <h4>Exam: {basic?.examName}</h4>
          <h4>Exam Date: {basic?.examDate}</h4>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    document.cookie = "phone=; max-age=0; path=/";
    history("/adminsignup");
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2); // get last two digits of year
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];

    // Add ordinal suffix to day
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return n + "th";
      switch (n % 10) {
        case 1:
          return n + "st";
        case 2:
          return n + "nd";
        case 3:
          return n + "rd";
        default:
          return n + "th";
      }
    };

    return `${getOrdinal(day)} ${month} ${year}`;
  }

  console.log(formatDate("2025-05-11")); // Output: "11th May 25"

  const filterApplied = () => {
    const filters = [];

    if (startingDate && lastDate) {
      filters.push(
        `Date Range: ${formatDate(startingDate)} to ${formatDate(lastDate)}`
      );
    }

    if (classValue) {
      filters.push(`Class: ${classValue}`);
    }

    // if (inputValue) {
    //   filters.push(`Student ID: ${inputValue}`);
    // }

    if (inputValue) {
      filters.push(`Student Name: ${inputValue}`);
    }

    if (filterValue === "all") {
      return "Showing all students";
    }

    if (filters.length === 0) {
      return "No filters applied";
    }

    return `Showing Data for ${filters.join(" | ")}`;
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* <div className="col-span-2 w-full bg-[#c61d23]">
        <Sidebar />
      </div> */}

      <div className="w-full py-2 sm:py-4">
        {/* <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Admin Dashboard
        </h2> */}

        <StudentFilterPanel
          classValue={classValue}
          setClassValue={setClassValue}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleChangeClassFilter={handleChangeClassFilter}
          handleSearchChange={handleSearchChange}
          sortOrder={sortOrder}
          handleSortChange={handleSortChange}
          startingDate={startingDate}
          setStartingDate={setStartingDate}
          lastDate={lastDate}
          setLastDate={setLastDate}
          fetchFilteredData={fetchFilteredData}
          classFilterOptions={classFilterOptions}
          filterApplied={filterApplied}
          filterValue={filterValue}
        />

        <div className="mb-8">
          {/* <span className="bg-[#ffdd00] p-2 rounded-sm ">{`Filter Applied on ${filterApplied}`}</span> */}
          <div className="w-full mt-2 p-3 sm:p-4 bg-white/85 border border-white rounded-2xl shadow-[0_16px_40px_rgba(157,23,33,0.06)]">
            <div className="overflow-x-auto">
              <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full bg-white">
                  <thead className="bg-gradient-to-r from-[#c61d23] to-[#8f1515] text-white sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left border-b">
                        StudentID
                      </th>
                      <th className="py-3 px-4 text-left border-b">Name</th>
                      <th className="py-3 px-4 text-left border-b">Class</th>
                      <th className="py-3 px-4 text-left border-b">Date</th>
                      <th className="py-3 px-4 text-left border-b">
                        Payment Id
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {
                      // isLoading ? (
                      //   <tr>
                      //     <td colSpan="4" className="py-4 text-center">
                      //       Loading...
                      //     </td>
                      //   </tr>
                      // ) :
                      showFilteredData.length > 0 ? (
                        showFilteredData.map((student, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              fetchStudentDetails(student.student_id)
                            }
                            className="hover:bg-rose-50 transition duration-150 ease-in-out cursor-pointer"
                          >
                            <td className="py-2 px-4 border-b">
                              {student?.StudentsId}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {student?.studentName}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {student?.classForAdmission}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {formatDate(student?.createdAt?.split("T")[0])}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {student?.paymentId}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-4 text-center">
                            No students found
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
              <button
                className="mt-4 bg-gradient-to-r from-[#0b8f4d] to-[#0a7b43] text-white px-4 py-2 rounded-lg hover:opacity-95 transition w-full sm:w-auto font-semibold shadow"
                onClick={() => downloadExcelForSDAT(showFilteredData)}
              >
                Download as Excel
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-3 mr-1 sm:mr-3">
            <span className="px-3 py-1.5 rounded-full bg-[#fcecee] text-[#8f1515] text-sm font-semibold border border-[#f7c8cc]">
              Total Count: {showFilteredData.length}
            </span>
          </div>
        </div>

        <PaginatedList
          apiEndpoint="/adminData/getData"
          queryParams={{ contactNumber }}
          renderItem={renderStudentCard}
          itemsPerPage={1}
          handleCardClick={(student) => {
            const basic = student.basicDetails || {};
            const batch = student.batchDetails || {};
            const family = student.familyDetails || {};
            handleCardClick(student, basic, batch, family);
          }}
        />

        {/* Modal */}
        {isModalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-3 sm:p-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-3xl overflow-auto max-h-[90vh]">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Student Details</h3>
              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {selectedStudent.studentName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedStudent.email}
                </p>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {selectedStudent.contactNumber}
                </p>
                {selectedStudent.profilePicture && (
                  <div className="my-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                    <p>Profile Picture</p>
                    <button
                      onClick={() =>
                        onClickShowImage(selectedStudent.profilePicture)
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View Image
                    </button>
                  </div>
                )}
                {selectedStudent.admitCard && (
                  <div className="my-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                    <p>Admit Card</p>
                    <button
                      onClick={() =>
                        window.open(selectedStudent.admitCard, "_blank")
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View Admit Card
                    </button>
                  </div>
                )}

                {showImage && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="relative">
                      <img
                        src={showImageUrl}
                        alt="Profile"
                        className="max-w-full max-h-screen rounded"
                      />

                      <button
                        onClick={() => setShowImage(false)}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <p>
                  <strong>Father Name:</strong> {selectedStudent.FatherName}
                </p>
                <p>
                  <strong>Father Contact:</strong>{" "}
                  {selectedStudent.FatherContactNumber}
                </p>
                <p>
                  <strong>Father Occupation:</strong>{" "}
                  {selectedStudent.FatherOccupation}
                </p>
                <p>
                  <strong>Mother Name:</strong> {selectedStudent.MotherName}
                </p>
                <p>
                  <strong>Mother Contact:</strong>{" "}
                  {selectedStudent.MotherContactNumber}
                </p>
                <p>
                  <strong>Mother Occupation:</strong>{" "}
                  {selectedStudent.MotherOccupation}
                </p>
                <p>
                  <strong>Class for Admission:</strong>{" "}
                  {selectedStudent.classForAdmission}
                </p>
                <p>
                  <strong>Subject Combination:</strong>{" "}
                  {selectedStudent.program}
                </p>
                <p>
                  <strong>Exam Name:</strong> {selectedStudent.examName}
                </p>
                <p>
                  <strong>Exam Date:</strong> {selectedStudent.examDate}
                </p>
                <p>
                  <strong>DOB:</strong> {convertToDate(selectedStudent.dob)}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {convertToDate(selectedStudent.created_at)}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            Logout
          </button>
        </div> */}
      </div>
    </div>
  );
};

// Debounce utility function
function debounce(func, delay) {
  let timeoutId;
  let abortController;

  return function (...args) {
    clearTimeout(timeoutId);
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    timeoutId = setTimeout(() => {
      func.apply(this, [...args, signal]);
    }, delay);
  };
}

export default AllFormsMain;
