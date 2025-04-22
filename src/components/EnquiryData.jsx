import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import { fetchExistingUserFormEnquiryDetails } from "../redux/slices/existingStudentSlice";
const EnquiryData = () => {
  const { userData } = useSelector((state) => state.existingStudentDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Enquiry userData", userData.userData);
    console.log("Enquiry userData", userData);
  }, [userData]);

  useEffect(() => {
    dispatch(fetchExistingUserFormEnquiryDetails());
  }, [dispatch]);





  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const continueWithExistingStudent = async () => {
    const response = await axios.post("/students/continueWithExistingStudent", {
      userData,
    });

    console.log("response data from continueWithExistingStudent", response);
  };

  return (
    <div className="p-5 bg-[#c61d23] min-h-screen flex flex-col gap-4">
      <h2 className="text-4xl font-bold text-center  text-white">
        Enquiry Details
      </h2>

      <div className="flex flex-col gap-8">
        {userData?.length > 0 ? (
          userData?.map((enquiry, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-black mb-4 border-b pb-2">
                Enquiry #{enquiry.enquiryNumber}
              </h3>

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
        <button className="px-6 py-3 bg-[#ffdd00] text-black font-semibold rounded-lg hover:bg-yellow-600 transition">
          Create New
        </button>
      </div>
    </div>
  );
};

export default EnquiryData;
