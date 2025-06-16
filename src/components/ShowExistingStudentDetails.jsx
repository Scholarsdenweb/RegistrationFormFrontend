import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExistingUserDetails } from "../redux/slices/existingStudentSlice";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const ShowExistingStudentDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.existingStudentDetails);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchExistingUserDetails());
  }, [dispatch]);

  const createNewStudent = async () => {
    const response = await axios.post("/students/createNewStudent");
    console.log("response", response);
    document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
    navigate("/registration/basicDetailsForm");
  };

  const continueWithExistingProfile = async (_id) => {
    const response = await axios.post("/students/continueRegistration", {
      _id,
    });
    document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
    // console.log("token", token);

    console.log("response coutinueWithExisting Profile", response);

    navigate("/registration/basicDetailsForm");
  };

  return (
    <div className=" p-1 sm:p-10 bg-gray-50 overflow-auto">
      <div className="w-full flex justify-end">
        <button
          className="border-2 shadow-lg p-3 rounded-xl"
          onClick={createNewStudent}
        >
          Create New
        </button>
      </div>
      <h2 className=" flex text-3xl font-bold text-center mb-10 text-black">
        Student Details
      </h2>

      {/* Cards */}
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {userData.data && userData?.data?.map((student, index) => (
          <div
            key={index}
            className=" relative bg-white rounded-xl shadow-md p-4 sm:p-6 flex items-center justify-start gap-6 hover:shadow-xl transition duration-300 cursor-pointer"
          >
            {!student.paymentId && (
              <div
                className="absolute right-2 top-2 bg-[#ffdd00] p-2  rounded-xl"
                onClick={() => continueWithExistingProfile(student._id)}
              >
                <button>Continue Registration</button>
              </div>
            )}

            {/* <div className="absolute right-2 bottom-2 bg-[#ffdd00] p-2  rounded-xl"  onClick={() => setSelectedStudent(student)} >
              <button>ViewDetails</button>
            </div> */}
            <img
              src={student.profilePicture || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-indigo-100"
            />
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {student.name}
              </h3>

              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-medium text-gray-900">
                    Student Id :
                  </span>{" "}
                  {student.StudentsId}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Email :</span>{" "}
                  {student.email}
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Contact Number :
                  </span>{" "}
                  {student.contactNumber}
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Payment ID :
                  </span>{" "}
                  {student.paymentId}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Role :</span>{" "}
                  {student.role}
                </p>
                {student.admitCard && (
                  <p>
                    <span className="font-medium text-gray-900">
                      Admit Card :
                    </span>{" "}
                    <a
                      href={student.admitCard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View PDF
                    </a>
                  </p>
                )}
              </div>
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
                <span className="font-medium text-gray-900">
                  Contact Number:
                </span>{" "}
                {selectedStudent.contactNumber}
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
