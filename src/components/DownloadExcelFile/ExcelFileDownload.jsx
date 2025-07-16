import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "../../api/axios";



export const downloadExcelForEnquiry = (showFilteredData) => {
  if (!showFilteredData || showFilteredData.length === 0) {
    alert("No data to export!");
    return;
  }

  // Helper function to format date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  console.log("showFilteredData", showFilteredData);


  const filteredExportData = showFilteredData.map((student) => ({
    "Enquiry Number": student.enquiryNumber,
    Name: student.studentName,
    "Father Contact": student.fatherContactNumber,
    "Father Name": student.fatherName,
    Program: student.program,
    Class: student.courseOfIntrested,
    "School Name": student.schoolName,
    City: student.city,
    State: student.state,
    "Course Of Intrested": student.courseOfIntrested,
    enquiryTakenBy: student.enquiryTakenBy,
    // Remarks: student.remarks,
    // "Student Contact Number": student.studentContactNumber,
    "Created At": formatDate(student.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "enquiry_data.xlsx");
};

const fetchStudentDetails = async (studentId) => {
  try {
    const response = await axios.get(`/students/${studentId}`);
    const student = response.data;

    return {
      ...student,
      ...student.basicDetails,
      ...student.batchDetails,
      ...student.familyDetails,
      ...student.educationalDetails,
    };
  } catch (error) {
    console.error("Error fetching student details:", error);
    // You might want to add error handling UI here
  }
};

// export const downloadExcelForSDAT = async(showFilteredData) => {
//   if (!showFilteredData || showFilteredData.length === 0) {
//     alert("No data to export!");
//     return;
//   }

//   // Helper function to format date
//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   console.log("showFilteredData", showFilteredData);

//   const filteredExportData =await showFilteredData.map(async (student) => {
//     console.log("studentData", student);
//     const response = await fetchStudentDetails(student.student_id);
//     console.log("Response data forem filteredExportData", response);

//     return {
//       StudentsId: response.StudentsId,
//       studentName: response.studentName,
//       contactNumber: response.contactNumber,
//       email: response.email,
//       enquiryNumber: response.enquiryNumber,
//       paymentId: response.paymentId,
//       admitCard: response.admitCard,
//       classForAdmission: response?.batchDetails.classForAdmission,
//       program: response?.batchDetails.program,
//       examDate: response.basicDetails.examDate,
//       FatherName: response.familyDetails.FatherName,
//       FatherOccupation: response.familyDetails.FatherOccupation,
//       SchoolName: response.educationalDetails.SchoolName,
//     };
//   });

//   console.log(" check data filteredExportData", filteredExportData);

//   const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });

//   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(data, "SDAT_data.xlsx");
// };

export const downloadExcelForSDAT = async (showFilteredData) => {
  if (!showFilteredData || showFilteredData.length === 0) {
    alert("No data to export!");
    return;
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  console.log("showFilteredData", showFilteredData);

  // Use Promise.all to wait for all async operations to complete
  const filteredExportData = await Promise.all(
    showFilteredData.map(async (student) => {
      const response = await fetchStudentDetails(student.student_id);

      return {
        StudentsId: response.StudentsId,
        studentName: response.studentName,
        contactNumber: response.contactNumber,
        email: response.email,
        enquiryNumber: response.enquiryNumber,
        paymentId: response.paymentId,
        admitCard: response.admitCard,
        classForAdmission: response?.batchDetails?.classForAdmission,
        program: response?.batchDetails?.program,
        examDate: response?.basicDetails?.examDate,
        FatherName: response?.familyDetails?.FatherName,
        FatherOccupation: response?.familyDetails?.FatherOccupation,
        SchoolName: response?.educationalDetails?.SchoolName,
      };
    })
  );

  // Now filteredExportData is a fully resolved array of objects
  const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "SDAT_data.xlsx");
};
