import React, { useState, useEffect, useReducer } from "react";
import axios from "../../api/axios";
import {
  fetchBasicDetails,
  updateBasicDetails,
} from "../../redux/slices/basicDetailsSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../api/Spinner";
import { setLoading } from "../../redux/slices/loadingSlice";
import Sidebar from "../Sidebar";
import {
  fetchBatchDetails,
  updateBatchDetails,
} from "../../redux/slices/batchDetailsSlice"; // Adjust the path as necessary
import { use } from "react";
import {
  fetchUserDetails,
  updateUserDetails,
} from "../../redux/slices/userDeailsSlice";
import Navbar from "./Navbar";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import FormHeader from "../LoginSugnup/FormHeader";
import PageNumberComponent from "../PageNumberComponent";

dayjs.extend(isSameOrAfter);
const BasicDetailsForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [allDates, setAllDates] = useState([]);

  const [basicDetailsError, setBasicDetailsError] = useState("");
  const [batchDetailsError, setBatchDetailsError] = useState("");
  const [showReloading, setShowReloading] = useState(false);
  const pathLocation = location.pathname;

  const {
    data: basicFormData,
    loading,
    error,
    dataExist,
  } = useSelector((state) => state.basicDetails);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log("basicFormData", basicFormData);
    console.log("dataExist", dataExist);
  }, [basicFormData]);

  const { userData } = useSelector((state) => state.userDetails);

  const [checkUrl, setCheckUrl] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  // Dropdown options
  const genderOptions = ["Male", "Female"];
  const examNameOptions = ["S.Dat", "Rise"];

  const fetchAllDates = async () => {
    try {
      const response = await axios.get("/employees/getAllDates");
      console.log("response fetchAllDates", response);

      const today = dayjs().startOf("day");

      const filteredDates = response.data.filter((date) => {
        const parsedDate = dayjs(date.examDate, "DD-MM-YYYY");
        return !parsedDate.isBefore(today); // includes today and future dates
      });

      console.log("filteredDates", filteredDates);
      setAllDates(response.data);
      // setAllDates(filteredDates);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  useEffect(() => {
    console.log("basicFormData", dataExist);
    console.log("basicFormData", basicFormData);
  }, [basicFormData]);

  // const examDateOptions =allDates;
  const examDateOptions = ["15/02/2025", "02/20/2025", "10/03/2025"];

  useEffect(() => {
    setCheckUrl(location.pathname === "/basicDetailsForm");
    dispatch(fetchBasicDetails());
    dispatch(fetchUserDetails());
  }, [dispatch, pathLocation]);

  // useEffect(() => {
  //   dispatch(setLoading(false));

  //   const examName = "examName";
  //   dispatch(updateBasicDetails({ [examName]: "SDAT" }));
  //   dispatch(fetchUserDetails())
  // }, []);

  // const validateBasicForm = async () => {
  //   const formErrors = {};
  //   let isValid = true;

  //   ["dob", "gender", "examDate", "examName", "studentName", "email"].forEach(
  //     async (field) => {
  //       if (field === "studentName" || field === "email") {
  //         if (!userData?.[field]?.trim()) {
  //           formErrors[field] = `${field
  //             .replace(/([A-Z])/g, " $1")
  //             .toUpperCase()} is required.`;
  //           isValid = false;
  //         }
  //       } else if (field === "examName") {
  //         const result = await dispatch(
  //           updateBasicDetails({ [field]: "SDAT" })
  //         );

  //       } else if (!basicFormData?.[field]?.trim()) {

  //         formErrors[field] = `${field
  //           .replace(/([A-Z])/g, " $1")
  //           .toUpperCase()} is required.`;
  //         isValid = false;
  //       }
  //     }
  //   );

  //   if(userData["examDate"]){
  //     console.log("testdata ", testdata);
  //   }

  //   console.log("formErrors in vaaalidation", formErrors);

  //   setBasicDetailsError(formErrors);
  //   return isValid;
  // };

  const validateBasicForm = async () => {
    const formErrors = {};
    let isValid = true;

    for (const field of [
      "dob",
      "gender",
      "examDate",
      "examName",
      "studentName",
      "email",
    ]) {
      if (field === "studentName" || field === "email") {
        if (!userData?.[field]?.trim()) {
          formErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
          isValid = false;
        }
      } else if (field === "examName") {
        await dispatch(updateBasicDetails({ [field]: "SDAT" }));
      } else if (!basicFormData?.[field]?.trim()) {
        formErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .toUpperCase()} is required.`;
        isValid = false;
      }
      // ✅ Check for future exam date

      // required changes it not working
      if (field === "examDate") {
        console.log(
          "formErrors from validationForm before",
          basicFormData.examDate
        );

        const examDateRaw = basicFormData?.examDate;
        // Corrected format
        const examDate = dayjs(examDateRaw, "DD-MM-YYYY", true);

        if (!examDate.isValid()) {
          console.log("examDate.isValid");
          formErrors.examDate = "Invalid date format.";
          isValid = false;
        } else {
          const today = dayjs().startOf("day"); // Gets today at 00:00
          const examDay = examDate.startOf("day"); // Converts to start of day for fair comparison

          console.log("examDate", examDay.toDate());
          console.log("today", today.toDate());

          if (examDay.isSame(today) || examDay.isBefore(today)) {
            formErrors.examDate = "Exam Date must be a future date.";
            isValid = false;
          }

          console.log("formErrors from validationForm", formErrors);
        }
      } else {
        console.log("examDate from validateBasicForm", basicFormData);
      }
    }

    console.log("formErrors in validation", formErrors);

    setBasicDetailsError(formErrors);
    return isValid;
  };



  const basicFormHandleChange = (e) => {
    const { name, value } = e.target;
    if (name === "studentName" || name === "email") {
      dispatch(updateUserDetails({ [name]: value }));
      return;
    }

    console.log("name", name, "value", value);
    dispatch(updateBasicDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // const batchDetailsHandleChange = (e) => {
  //   const { name, value } = e.target;
  //   dispatch(updateBatchDetails({ [name]: value }));

  //   if (value.trim()) {
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //   }
  // };

  // const validateBatchForm = () => {
  //   let formErrors = {};
  //   let isValid = true;

  //   Object.keys(batchFormData).forEach((key) => {
  //     if (!batchFormData[key]?.toString().trim()) {
  //       formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
  //       isValid = false;
  //     }
  //   });

  //   setBatchDetailsError(formErrors);
  //   return isValid;
  // };

  // const addAndUpdatebatchForm = async () => {
  //   try {
  //     const url = batchFormDataExist
  //       ? "/form/batchRelatedDetails/updateForm"
  //       : "/form/batchRelatedDetails/addForm";
  //     const method = batchFormDataExist ? axios.patch : axios.post;

  //     await method(url, batchFormData);

  //     setSubmitMessage(
  //       batchFormDataExist
  //         ? "Batch related details updated successfully!"
  //         : "Batch related details submitted successfully!"
  //     );
  //     console.log("CHECKurl", checkUrl);

  //     navigate("/registration/batchDetailsForm");
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     setSubmitMessage(error.response.data);
  //   }
  // };

  const addAndUpdateBasicFrom = async () => {
    setShowReloading(true);

    try {
      console.log("dataExist", dataExist);
      console.log("basicFormData form addAndUpdateBasicFrom", basicFormData);
      const url = dataExist
        ? "/form/basicDetails/updateForm"
        : "/form/basicDetails/addForm";
      // const url = "/form/basicDetails/updateForm"

      const method = dataExist ? axios.patch : axios.post;
      // const method =  axios.patch ;

      await method(url, basicFormData);
      // setSubmitMessage(
      //   dataExist
      //     ? "Basic details updated successfully!"
      //     : "Basic details submitted successfully!"
      // );

      console.log("userData before editStudent", userData);
      const response = await axios.patch("/students/editStudent", userData);

      console.log("response for onSubmit in BasicDetails", response);

      console.log("response", response);
      navigate("/registration/batchDetailsForm");
    } catch (error) {
      console.log("Error submitting form:", error);
      if (errors.length === 0) setSubmitMessage(error.response.data.message);
    } finally {
      setShowReloading(false);
    }
  };

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const isValid = await validateBasicForm();

    if (isValid) {
      // await addAndUpdatebatchForm();

      console.log("validateBasicForm", validateBasicForm());

      console.log("ITS workiong");
      await addAndUpdateBasicFrom();
    }
  };

  const convertToNumber = (romanNumeral) => {
    const romanToNumber = {
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
      X: 10,
      XI: 11,
      XII: 12,
    };

    return romanToNumber[romanNumeral];
  };

  const convertToRoman = (num) => {
    const romanNumerals = {
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
      11: "XI",
      12: "XII",
    };
    return romanNumerals[num];
  };

  useEffect(() => {
    console.log("basicFormData", basicFormData);
  }, [basicFormData]);

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {loading && <Spinner />}

      <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
        <div className="text-3xl text-white text-center transform hover:-translate-y-1 transition duration-200">
          S.DAT Registration
        </div>

        {/* <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
          Registration Form For SDAT
        </h1> */}

        <PageNumberComponent />

        <form
          autoComplete="off"
          className="flex flex-col gap-4  w-full"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col w-full">
            <label
              htmlFor="name"
              className="text-sm font-medium text-white mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={userData.studentName}
              onChange={basicFormHandleChange}
              placeholder="Enter Your Name"
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.studentName && (
              <p className="text-[#ffdd00] text-xs mt-1">
                {basicDetailsError.studentName}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="email"
              className="text-sm font-medium text-white mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              placeholder="Enter Your Email"
              onChange={basicFormHandleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.email && (
              <p className="text-[#ffdd00] text-xs mt-1">
                {basicDetailsError.email}
              </p>
            )}
          </div>

          {/* <div className=" "> */}
          {/* Date of Birth */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="dob"
              className="text-sm font-medium text-white mb-1"
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
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.dob && (
              <p className="text-[#ffdd00] text-xs mt-1">
                {basicDetailsError.dob}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col  w-full">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-white mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={basicFormData?.gender || ""}
              onChange={basicFormHandleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="" disabled>
                Select Gender
              </option>
              {genderOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {basicDetailsError.gender && (
              <p className="text-[#ffdd00] text-xs mt-1">
                {basicDetailsError.gender}
              </p>
            )}
          </div>

          {/* Exam Name */}
          {/* <div className="flex flex-col  w-full">
            <label
              htmlFor="examName"
              className="text-sm font-medium text-white mb-1"
            >
              Exam Name
            </label>
            <select
              id="examName"
              name="examName"
              value={basicFormData?.examName || ""}
              onChange={basicFormHandleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="" disabled>
                Select Exam Name
              </option>
              {examNameOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {basicDetailsError.examName && (
              <p className="text-black text-xs mt-1">
                {basicDetailsError.examName}
              </p>
            )}
          </div> */}

          {/* Exam Date */}
          <div className="flex flex-col  w-full">
            <label
              htmlFor="examDate"
              className="text-sm font-medium text-white mb-1"
            >
              Exam Date
            </label>
            <select
              id="examDate"
              name="examDate"
              value={basicFormData?.examDate || ""}
              onChange={basicFormHandleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="" disabled>
                Select Exam Date
              </option>

              {/* {console.log("AllDates", allDates)} */}
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
              <p className="text-[#ffdd00] text-xs mt-1">
                {basicDetailsError.examDate}
              </p>
            )}
          </div>

          {showReloading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}

          {/* Submit Message */}
          <div className="w-full text-center">
            {submitMessage && (
              <p className={`text-sm text-center text-white`}>
                {submitMessage}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="w-full sm:w-1/3 border bg-yellow-600 rounded-xl text-black  py-2 px-4   "
              disabled
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 border bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl transition-all"
            >
              Next
            </button>
          </div>
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
