import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import { fetchExistingUserFormEnquiryDetails } from "../redux/slices/existingStudentSlice";
import { useNavigate } from "react-router-dom";
import ProfileBar from "./ProfileBar";
const EnquiryData = () => {
  const { userData } = useSelector((state) => state.existingStudentDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Enquiry userData", userData.userData);
    console.log("Enquiry userData", userData);
  }, [userData]);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchExistingUserFormEnquiryDetails());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const continueWithExistingStudent = async (enquiry) => {
    try {
      console.log("userData", enquiry);

      const response = await axios.post(
        "/students/continueWithExistingStudent",
        {
          userData: enquiry,
        }
      );

      // Overwrite the token cookie with the new token
      document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
      navigate("/registration/basicDetailsForm");

      console.log("response data from continueWithExistingStudent", response);
    } catch (error) {
      console.error("Error in continueWithExistingStudent", error);
    }
  };

  const createNewStudent = async () => {
    const response = await axios.post("/students/createNewStudent");
    console.log("response", response);
    document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
    navigate("/registration/basicDetailsForm");
  };

  return (
    <div className="p-5 bg-[#c61d23] min-h-screen flex flex-col gap-4">
      <div className="flex ">
        <h2 className="text-xl flex-grow sm:text-4xl font-bold text-center  text-white">
          Enquiry Details
        </h2>
        <div>
          <ProfileBar />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {userData?.length > 0 ? (
          userData?.map((enquiry, index) => (
            <div
              key={index}
              className="relative w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-black mb-4 border-b pb-2">
                Enquiry #{enquiry.enquiryNumber}
              </h3>

              <div
                className="absolute top-2 right-2 p-2 bg-[#ffdd00] rounded-xl"
                onClick={() => {
                  continueWithExistingStudent(enquiry);
                }}
              >
                <button>Continue Registration</button>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                {Object.entries(enquiry).map(([key, value]) => {
                  if (["_id", "__v"].includes(key)) return null;

                  let label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());

                  if (key === "howToKnowAboutUs") {
                    label = "How did you hear about us?";
                  }

                  if (key === "createdAt" || key === "updatedAt") {
                    return (
                      <div
                        key={key}
                        className="flex justify-between border-b py-1"
                      >
                        <span className="font-medium">{label}:</span>
                        <span>{formatDate(value)}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={key}
                      className="flex justify-between border-b py-1"
                    >
                      <span className="font-medium">{label}:</span>
                      <span>{value || "N/A"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No enquiry data available.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <button
          className="px-6 py-3 bg-[#ffdd00] text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition"
          onClick={continueWithExistingStudent}
        >
          Continue with the existing profile
        </button>
        <button
          className="px-6 py-3 bg-[#ffdd00] text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
          onClick={createNewStudent}
        >
          Create New
        </button>
      </div>
    </div>
  );
};

export default EnquiryData;
