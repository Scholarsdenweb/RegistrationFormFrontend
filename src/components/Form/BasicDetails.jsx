import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

import {
  fetchBasicDetails,
  updateBasicDetails,
} from "../../redux/slices/basicDetailsSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../api/Spinner";
import { setLoading } from "../../redux/slices/loadingSlice";
import {
  fetchUserDetails,
  updateUserDetails,
} from "../../redux/slices/userDeailsSlice";
import Navbar from "./Navbar";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import FormHeader from "../LoginSugnup/FormHeader";
import PageNumberComponent from "../PageNumberComponent";
import UploadDocumentField from "./UploadImage";

dayjs.extend(isSameOrAfter);

const BasicDetailsForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [allDates, setAllDates] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const [basicDetailsError, setBasicDetailsError] = useState({});
  const [showReloading, setShowReloading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const pathLocation = location.pathname;

  const {
    data: basicFormData,
    loading,
    error,
    dataExist,
  } = useSelector((state) => state.basicDetails);

  const { userData } = useSelector((state) => state.userDetails);

  // Dropdown options
  const genderOptions = ["Male", "Female"];

  const fetchAllDates = async () => {
    try {
      const response = await axios.get("/employees/getAllDates");
      const today = dayjs().startOf("day");

      const filteredDates = response.data.filter((date) => {
        const parsedDate = dayjs(date.examDate, "DD-MM-YYYY");
        return !parsedDate.isBefore(today);
      });

      setAllDates(response.data);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  useEffect(() => {
    dispatch(fetchBasicDetails());
    dispatch(fetchUserDetails());
  }, [dispatch, pathLocation]);

  const validateBasicForm = async () => {
    console.log("ValidateBasicForm called");
    const formErrors = {};
    let isValid = true;

    // Validate studentName
    if (!userData?.studentName?.trim()) {
      formErrors.studentName = "Student Name is required.";
      isValid = false;
    }

    // Validate email
    if (!userData?.email?.trim()) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      formErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate dob
    if (!basicFormData?.dob?.trim()) {
      formErrors.dob = "DATE OF BIRTH is required.";
      isValid = false;
    }

    // Validate gender
    if (!basicFormData?.gender?.trim()) {
      formErrors.gender = "GENDER is required.";
      isValid = false;
    }

    // Validate examDate
    if (!basicFormData?.examDate?.trim()) {
      formErrors.examDate = "EXAM DATE is required.";
      isValid = false;
    }

    // Set examName automatically
    await dispatch(updateBasicDetails({ examName: "SDAT" }));

    // Validate profile picture
    if (!userData?.profilePicture && !documentUrl) {
      formErrors.profilePicture = "Profile picture is required.";
      isValid = false;
    }

    console.log("formErrors in validation", formErrors);

    setBasicDetailsError(formErrors);
    return isValid;
  };

  const basicFormHandleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "studentName" || name === "email") {
      dispatch(updateUserDetails({ [name]: value }));
    } else {
      dispatch(updateBasicDetails({ [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (value.trim()) {
      setBasicDetailsError((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const addAndUpdateBasicFrom = async () => {
    setShowReloading(true);

    try {
      const response = await axios.patch("/students/editStudent", userData);

      const url = dataExist
        ? "/form/basicDetails/updateForm"
        : "/form/basicDetails/addForm";

      const method = dataExist ? axios.patch : axios.post;

      await method(url, basicFormData);

      navigate("/registration/batchDetailsForm");
    } catch (error) {
      if (error.response?.data) {
        setSubmitMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "An error occurred while submitting the form."
        );
      } else {
        setSubmitMessage("An error occurred. Please try again.");
      }
    } finally {
      setShowReloading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit Button Clicked");

    const isValid = await validateBasicForm();

    console.log("isValid from onSubmit", isValid);

    if (isValid) {
      console.log("Form is valid, submitting...");
      await addAndUpdateBasicFrom();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdf5f6] px-2 md:px-8 py-2 overflow-auto">
      {loading && <Spinner />}

      <div className="flex flex-col gap-1 max-w-screen-md mx-auto">
        <div className="flex">
          <FormHeader />
        </div>

        <PageNumberComponent />

        <form
          autoComplete="off"
          className="flex flex-col gap-4 w-full"
          onSubmit={onSubmit}
        >
          {/* Name Field */}
          <div className="flex flex-col w-full bg-white p-5 rounded-xl">
            <label
              htmlFor="studentName"
              className="text-sm font-medium text-black mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={userData?.studentName || ""}
              onChange={basicFormHandleChange}
              placeholder="Enter Your Name"
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.studentName && (
              <p className="text-red-500 text-xs mt-1">
                {basicDetailsError.studentName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col w-full bg-white p-5 rounded-xl">
            <label
              htmlFor="email"
              className="text-sm font-medium text-black mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData?.email || ""}
              placeholder="Enter Your Email"
              onChange={basicFormHandleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.email && (
              <p className="text-red-500 text-xs mt-1">
                {basicDetailsError.email}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="appearance-none flex flex-col w-full bg-white p-5 rounded-xl">
            <label
              htmlFor="dob"
              className="text-sm font-medium text-black mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={basicFormData?.dob || ""}
              onChange={basicFormHandleChange}
              max={new Date().toISOString().split("T")[0]}
              className="appearance-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.dob && (
              <p className="text-red-500 text-xs mt-1">
                {basicDetailsError.dob}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col w-full bg-white p-5 rounded-xl">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-black mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={basicFormData?.gender || ""}
              onChange={basicFormHandleChange}
              className="appearance-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {basicDetailsError.gender && (
              <p className="text-red-500 text-xs mt-1">
                {basicDetailsError.gender}
              </p>
            )}
          </div>

          {/* Exam Date */}
          <div className="flex flex-col w-full bg-white p-5 rounded-xl">
            <label
              htmlFor="examDate"
              className="text-sm font-medium text-black mb-1"
            >
              Exam Date
            </label>
            <select
              id="examDate"
              name="examDate"
              value={basicFormData?.examDate || ""}
              onChange={basicFormHandleChange}
              className="appearance-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Exam Date</option>
              {allDates?.map((option, index) => {
                const parsedDate = dayjs(option.examDate, "DD-MM-YYYY");
                return (
                  <option key={index} value={option.examDate}>
                    {parsedDate.isValid()
                      ? parsedDate.format("DD MMM YYYY")
                      : "Invalid Date"}
                  </option>
                );
              })}
            </select>
            {basicDetailsError.examDate && (
              <p className="text-red-500 text-xs mt-1">
                {basicDetailsError.examDate}
              </p>
            )}
          </div>

          {/* Upload Document Field */}
          <UploadDocumentField
            documentUrl={documentUrl}
            setDocumentUrl={setDocumentUrl}
            showPopup={(msg, type) => console.log(msg, type)}
          />
          {basicDetailsError.profilePicture && (
            <p className="text-red-500 text-xs -mt-2">
              {basicDetailsError.profilePicture}
            </p>
          )}

          {/* Loading Spinner */}
          {showReloading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
            </div>
          )}

          {/* Submit Message */}
          {submitMessage && (
            <div className="w-full text-center">
              <p className="text-sm text-center text-red-500">{submitMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="w-full sm:w-1/3 border bg-gray-300 rounded-xl text-gray-600 py-2 px-4 cursor-not-allowed"
              disabled
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 border bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={showReloading}
            >
              {showReloading ? "Submitting..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicDetailsForm;