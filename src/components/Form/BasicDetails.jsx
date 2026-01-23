

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
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import UploadDocumentField from "./UploadImage";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Users,
} from "lucide-react";

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
    if (documentUrl)
      dispatch(updateUserDetails({ profilePicture: documentUrl }));
  }, [documentUrl]);

  useEffect(() => {
    dispatch(fetchBasicDetails());
    dispatch(fetchUserDetails());
  }, [dispatch, pathLocation]);

  const validateBasicForm = async () => {
    console.log("ValidateBasicForm called");
    const formErrors = {};
    let isValid = true;

    if (!userData?.studentName?.trim()) {
      formErrors.studentName = "Student Name is required.";
      isValid = false;
    }

    if (!userData?.email?.trim()) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      formErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!basicFormData?.dob?.trim()) {
      formErrors.dob = "Date of Birth is required.";
      isValid = false;
    }

    if (!basicFormData?.gender?.trim()) {
      formErrors.gender = "Gender is required.";
      isValid = false;
    }

    if (!basicFormData?.examDate?.trim()) {
      formErrors.examDate = "Exam Date is required.";
      isValid = false;
    }

    await dispatch(updateBasicDetails({ examName: "SDAT" }));

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

    if (value.trim()) {
      setBasicDetailsError((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const addAndUpdateBasicFrom = async () => {
    setShowReloading(true);

    try {
      console.log("DataExist", dataExist);
      console.log("userData", userData);

      const response = await axios.patch("/students/editStudent", userData);

      console.log("response", response);

      const url = dataExist
        ? "/form/basicDetails/updateForm"
        : "/form/basicDetails/addForm";

      const method = dataExist ? axios.patch : axios.post;

      await method(url, basicFormData);

      navigate("/registration/batchDetailsForm");
    } catch (error) {
      console.log("error from addandUpdateBasicForm", error);
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
    try {
      e.preventDefault();
      console.log("Submit Button Clicked");

      const isValid = await validateBasicForm();

      console.log("isValid from onSubmit", isValid);

      if (isValid) {
        console.log("Form is valid, submitting...");
        await addAndUpdateBasicFrom();
      }
    } catch (error) {
      console.log("error from basicDetails on Submit", error);
    }
  };

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Basic Details
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Complete your profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Step 1 of 4
              </h2>
              <div className="text-sm text-gray-600">Basic Information</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>

          {/* Form Container */}
          <form
            autoComplete="off"
            className="flex flex-col gap-5"
            onSubmit={onSubmit}
          >
            {/* Name Field */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label
                htmlFor="studentName"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <User size={18} className="text-[#c61d23]" />
                Full Name
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={userData?.studentName || ""}
                onChange={basicFormHandleChange}
                placeholder="Enter Your Full Name"
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all"
              />
              {basicDetailsError.studentName && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {basicDetailsError.studentName}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <Mail size={18} className="text-[#c61d23]" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData?.email || ""}
                placeholder="your.email@example.com"
                onChange={basicFormHandleChange}
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all"
              />
              {basicDetailsError.email && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {basicDetailsError.email}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label
                htmlFor="dob"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <Calendar size={18} className="text-[#c61d23]" />
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={basicFormData?.dob || ""}
                onChange={basicFormHandleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all"
              />
              {basicDetailsError.dob && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {basicDetailsError.dob}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label
                htmlFor="gender"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <Users size={18} className="text-[#c61d23]" />
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={basicFormData?.gender || ""}
                onChange={basicFormHandleChange}
                className="w-full appearance-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer"
              >
                <option value="">Select your gender</option>
                {genderOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {basicDetailsError.gender && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {basicDetailsError.gender}
                </div>
              )}
            </div>

            {/* Exam Date */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label
                htmlFor="examDate"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <Calendar size={18} className="text-[#c61d23]" />
                Exam Date
              </label>
              <select
                id="examDate"
                name="examDate"
                value={basicFormData?.examDate || ""}
                onChange={basicFormHandleChange}
                className="w-full appearance-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer"
              >
                <option value="">Select exam date</option>
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
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {basicDetailsError.examDate}
                </div>
              )}
            </div>

            {/* Upload Profile Picture */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <UploadDocumentField
                documentUrl={documentUrl}
                setDocumentUrl={setDocumentUrl}
                showPopup={(msg, type) => console.log(msg, type)}
              />
              {basicDetailsError.profilePicture && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-3">
                  <AlertCircle size={14} />
                  {basicDetailsError.profilePicture}
                </div>
              )}
            </div>

            {/* Error Message */}
            {submitMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-700">{submitMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                type="submit"
                disabled={showReloading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{showReloading ? "Submitting..." : "Next"}</span>
                {!showReloading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
