import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExistingUserDetails } from "../redux/slices/existingStudentSlice";

const ShowExistingStudentDetails = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.existingStudentDetails);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchExistingUserDetails());
  }, [dispatch]);

  return (
    <div className="p-10 bg-gray-50 ">
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        Student Details
      </h2>

      {/* Cards */}
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {userData?.data?.map((student, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex items-center gap-6 hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <img
              src={student.profilePicture || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-indigo-100"
            />
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {student.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Student ID: {student.StudentsId}
              </p>
            </div>
          </div>
        ))}
      </div>


    
      {/* Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedStudent(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <img
                src={
                  selectedStudent.profilePicture ||
                  "https://via.placeholder.com/150"
                }
                alt="profile"
                className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-100 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedStudent.StudentsId}
              </p>
            </div>

            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium text-gray-900">Email:</span>{" "}
                {selectedStudent.email}
              </p>
              <p>
                <span className="font-medium text-gray-900">Phone:</span>{" "}
                {selectedStudent.phone}
              </p>
              <p>
                <span className="font-medium text-gray-900">Payment ID:</span>{" "}
                {selectedStudent.paymentId}
              </p>
              <p>
                <span className="font-medium text-gray-900">Role:</span>{" "}
                {selectedStudent.role}
              </p>
              {selectedStudent.admitCard && (
                <p>
                  <span className="font-medium text-gray-900">Admit Card:</span>{" "}
                  <a
                    href={selectedStudent.admitCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View PDF
                  </a>
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}







    </div>
  );
};

export default ShowExistingStudentDetails;
