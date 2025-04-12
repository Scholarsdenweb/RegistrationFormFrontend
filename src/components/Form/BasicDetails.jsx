import React, { useState, useEffect } from "react";
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
import { fetchUserDetails, updateUserDetails } from "../../redux/slices/userDeailsSlice";
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

  const {
    data: basicFormData,
    loading,
    error,
    dataExist: basicFormDataExist,
  } = useSelector((state) => state.basicDetails);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { formData: batchFormData, dataExist: batchFormDataExist } =
    useSelector((state) => state.batchDetails);

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
      setAllDates(filteredDates);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useEffect(() => {
    fetchAllDates();
  }, []);

  useEffect(()=>{
    console.log("userData", userData);
  },[userData])

  // const examDateOptions =allDates;
  const examDateOptions = ["15/02/2025", "02/20/2025", "10/03/2025"];

  useEffect(() => {
    setCheckUrl(location.pathname === "/basicDetailsForm");
    dispatch(fetchBasicDetails());
    dispatch(fetchBatchDetails());
    dispatch(fetchUserDetails());
  }, [dispatch, location.pathname]);

  // useEffect(() => {
  //   dispatch(setLoading(false));

  //   const examName = "examName";
  //   dispatch(updateBasicDetails({ [examName]: "SDAT" }));
  //   dispatch(fetchUserDetails())
  // }, []);

  const validateBasicForm = async () => {
    const formErrors = {};
    let isValid = true;

    ["dob", "gender", "examDate", "examName", "name", "email"].forEach(
      async (field) => {
        if (field === "name" || field === "email") {
          if (!field) {
            formErrors[field] = `${field
              .replace(/([A-Z])/g, " $1")
              .toUpperCase()} is required.`;
            isValid = false;
          }
        } else if (field === "examName") {
          const result = await dispatch(
            updateBasicDetails({ [field]: "SDAT" })
          );

          console.log("result form validationbasicform", result);
          console.log("basicFormData?.[field]", basicFormData?.[field]);
        } else if (!basicFormData?.[field]?.trim()) {
          formErrors[field] = `${field
            .replace(/([A-Z])/g, " $1")
            .toUpperCase()} is required.`;
          isValid = false;
        }
      }
    );

    console.log("formErrors in vaaalidation", formErrors);

    setBasicDetailsError(formErrors);
    return isValid;
  };

  const basicFormHandleChange = (e) => {
    const { name, value } = e.target;
    if(name === "name"  || name === "email"){
      dispatch(updateUserDetails({[name]: value}))
      return;
    }

    console.log("name", name, "value", value);
    dispatch(updateBasicDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const batchDetailsHandleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateBatchDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateBatchForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(batchFormData).forEach((key) => {
      if (!batchFormData[key]?.toString().trim()) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    setBatchDetailsError(formErrors);
    return isValid;
  };

  const addAndUpdatebatchForm = async () => {
    try {
      const url = batchFormDataExist
        ? "/form/batchRelatedDetails/updateForm"
        : "/form/batchRelatedDetails/addForm";
      const method = batchFormDataExist ? axios.patch : axios.post;

      await method(url, batchFormData);

      setSubmitMessage(
        batchFormDataExist
          ? "Batch related details updated successfully!"
          : "Batch related details submitted successfully!"
      );
      console.log("CHECKurl", checkUrl);

      navigate("/registration/batchDetailsForm");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage(error.response.data);
    }
  };

  const addAndUpdateBasicFrom = async () => {
    try {
      console.log("basicFormData form addAndUpdateBasicFrom", basicFormData);
      const url = basicFormDataExist
        ? "/form/basicDetails/updateForm"
        : "/form/basicDetails/addForm";
      const method = basicFormDataExist ? axios.patch : axios.post;

      await method(url, basicFormData);
      setSubmitMessage(
        basicFormDataExist
          ? "Basic details updated successfully!"
          : "Basic details submitted successfully!"
      );
      const response = await axios.patch(
        "/students/editStudent",
        userData
      );

      console.log("response for onSubmit in BasicDetails", response);

      console.log("response", response);
      navigate("/registration/batchDetailsForm");
    } catch (error) {
      console.log("Error submitting form:", error);
      setSubmitMessage(error.response.data);
    }
  };

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (validateBasicForm()) {
      // await addAndUpdatebatchForm();

      console.log("ITS workiong");
      await addAndUpdateBasicFrom();
    }

    const studetnDetails = {
      name,
      email,
    };
    try {
    
    } catch (error) {
      console.log("error", error);
    }
  };

  const pathLocation = location.pathname;

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

  // Options for select dropdowns
  const batchOptions =
    batchFormData.classForAdmission <= 10
      ? ["13/01/2025", "24/01/2025", "25/01/2025"]
      : ["17/01/2025", "28/01/2025", "29/01/2025"];

  let subjectOptions =
    convertToNumber(batchFormData.classForAdmission) >= 6 &&
    convertToNumber(batchFormData.classForAdmission) <= 10
      ? ["Foundation"]
      : ["Engineering", "Medical"];
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
    console.log("batchFormData", batchFormData);
    console.log("basicFormData", basicFormData);
  }, [batchFormData, basicFormData]);

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {loading && <Spinner />}

      <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
        <div className="text-3xl text-white text-center">
          {/* <FormHeader /> */}
          SDAT Registration
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
              id="name"
              name="name"
              value={userData.name}
              onChange={basicFormHandleChange}
              placeholder="Enter Your Name"
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {basicDetailsError.name && (
              <p className="text-black text-xs mt-1">
                {basicDetailsError.name}
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
              <p className="text-black text-xs mt-1">
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
              <p className="text-black text-xs mt-1">{basicDetailsError.dob}</p>
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
              <p className="text-black text-xs mt-1">
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
              <option value=""  disabled>
                Select Exam Date
              </option>

              {console.log("AllDates", allDates)}
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
              <p className="text-black text-xs mt-1">
                {basicDetailsError.examDate}
              </p>
            )}
          </div>

              {/* Submit Message */}
             <div className="w-full text-center">
               {submitMessage && (
                 <p
                   className={`text-sm text-center text-white`}
                 >
                   {submitMessage}
                 </p>
               )}
             </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="w-full sm:w-1/3 border bg-yellow-600 rounded-xl text-black  py-2 px-4  " disabled
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

  // return (
  //   <div
  //     className=" overflow-auto w-full h-screen"
  //     style={{ backgroundColor: "#c61d23" }}
  //   >
  //     <div className="grid grid-cols-7 ">
  //       <div className="col-span-1">
  //         <Sidebar />
  //       </div>

  //       <div className="flex flex-col col-span-6 ">
  //         {/* <div className=" pr-8 flex gap-12 justify-between items-center"> */}
  //         <Navbar />

  //         {/* </div> */}

  //         <div
  //           className={`px-9 py-4 mb-3 mr-5 bg-gray-200 rounded-3xl h-full overflow-auto`}
  //         >
  //           {
  //             // loading ? (
  //             //   // <Spinner />
  //             // ) :

  //             // (

  //             <div className=" w-full flex flex-col gap-4 bg-gray-200">
  //               <h3 className="text-2xl font-extrabold">User Details</h3>

  //               <div
  //                 className="rounded-2xl "
  //                 style={{ backgroundColor: "#c61d23" }}
  //               >
  //                 <h1 className="text-xl font-bold px-4 py-2 text-white ">
  //                   Basic Details
  //                 </h1>
  //                 <form
  //                   className="flex flex-wrap gap-4  w-full bg-white shadow-lg p-2 rounded-b-2xl"
  //                   onSubmit={onSubmit}
  //                 >
  //                   {/* <div className=" "> */}
  //                   {/* Date of Birth */}
  //                   <div className="flex flex-col w-2/5">
  //                     <label
  //                       htmlFor="dob"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Date of Birth
  //                     </label>
  //                     <input
  //                       type="date"
  //                       id="dob"
  //                       name="dob"
  //                       value={basicFormData?.dob || ""}
  //                       onChange={basicFormHandleChange}
  //                       max={new Date().toISOString().split("T")[0]}
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     />
  //                     {basicDetailsError.dob && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {basicDetailsError.dob}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* Gender */}
  //                   <div className="flex flex-col  w-2/5">
  //                     <label
  //                       htmlFor="gender"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Gender
  //                     </label>
  //                     <select
  //                       id="gender"
  //                       name="gender"
  //                       value={basicFormData?.gender || ""}
  //                       onChange={basicFormHandleChange}
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     >
  //                       <option value="" disabled>
  //                         Select Gender
  //                       </option>
  //                       {genderOptions.map((option, index) => (
  //                         <option key={index} value={option}>
  //                           {option}
  //                         </option>
  //                       ))}
  //                     </select>
  //                     {basicDetailsError.gender && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {basicDetailsError.gender}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* Exam Name */}
  //                   <div className="flex flex-col  w-2/5">
  //                     <label
  //                       htmlFor="examName"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Exam Name
  //                     </label>
  //                     <select
  //                       id="examName"
  //                       name="examName"
  //                       value={basicFormData?.examName || ""}
  //                       onChange={basicFormHandleChange}
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     >
  //                       <option value="" disabled>
  //                         Select Exam Name
  //                       </option>
  //                       {examNameOptions.map((option, index) => (
  //                         <option key={index} value={option}>
  //                           {option}
  //                         </option>
  //                       ))}
  //                     </select>
  //                     {basicDetailsError.examName && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {basicDetailsError.examName}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* Exam Date */}
  //                   <div className="flex flex-col  w-2/5">
  //                     <label
  //                       htmlFor="examDate"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Exam Date
  //                     </label>
  //                     <select
  //                       id="examDate"
  //                       name="examDate"
  //                       value={basicFormData?.examDate || ""}
  //                       onChange={basicFormHandleChange}
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     >
  //                       <option value="" disabled>
  //                         Select Exam Date
  //                       </option>

  //                       {console.log("AllDates", allDates)}
  //                       {allDates.map((option, index) => (
  //                         <option key={index} value={option.examDate}>
  //                           {dayjs(option.examDate, "DD-MM-YYYY").format(
  //                             "DD MMM YYYY"
  //                           )}
  //                         </option>
  //                       ))}
  //                     </select>
  //                     {basicDetailsError.examDate && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {basicDetailsError.examDate}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* </div> */}
  //                 </form>
  //               </div>
  //               <div
  //                 className="rounded-2xl "
  //                 style={{ backgroundColor: "#c61d23" }}
  //               >
  //                 <h1 className="text-xl font-bold px-4 py-2 text-white">
  //                   Batch Details
  //                 </h1>
  //                 <form
  //                   className="flex flex-wrap  gap-4  w-full bg-white shadow-lg p-2 rounded-b-2xl "
  //                   onSubmit={onSubmit}
  //                 >
  //                   {/* <div className=" "> */}
  //                   {/* Class  for admission*/}
  //                   <div className="flex flex-col w-2/5">
  //                     <label
  //                       htmlFor="classForAdmission"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Class
  //                     </label>
  //                     <select
  //                       id="classForAdmission"
  //                       name="classForAdmission"
  //                       value={batchFormData?.classForAdmission || ""}
  //                       onChange={batchDetailsHandleChange}
  //                       placeholder="Select Class for adminssion"
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     >
  //                       <option className="" disabled value="">
  //                         Select Class for admission
  //                       </option>
  //                       {Array.from({ length: 7 }, (_, i) => i + 6).map(
  //                         (classNum) => (
  //                           <option
  //                             key={classNum}
  //                             value={convertToRoman(classNum)}
  //                           >
  //                             {convertToRoman(classNum)}
  //                           </option>
  //                         )
  //                       )}
  //                     </select>
  //                     {batchDetailsError.classForAdmission && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {batchDetailsError.classForAdmission}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* Preferred Batch */}
  //                   <div className="flex flex-col  w-2/5">
  //                     <label
  //                       htmlFor="preferredBatch"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Preferred Batch
  //                     </label>
  //                     <select
  //                       id="preferredBatch"
  //                       name="preferredBatch"
  //                       value={batchFormData.preferredBatch || ""}
  //                       onChange={batchDetailsHandleChange}
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     >
  //                       <option disabled value="">
  //                         Select Preferred Batch
  //                       </option>
  //                       {batchOptions.map((batch, index) => (
  //                         <option key={index} value={batch}>
  //                           {batch}
  //                         </option>
  //                       ))}
  //                     </select>
  //                     {batchDetailsError.preferredBatch && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {batchDetailsError.preferredBatch}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* Subject Combination */}
  //                   <div className="flex flex-col  w-2/5">
  //                     <label
  //                       htmlFor="subjectCombination"
  //                       className="text-sm font-medium text-gray-600 mb-1"
  //                     >
  //                       Subject Combination
  //                     </label>
  //                     <select
  //                       id="subjectCombination"
  //                       name="subjectCombination"
  //                       value={batchFormData.subjectCombination || ""}
  //                       onChange={batchDetailsHandleChange}
  //                       className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //                     >
  //                       <option disabled value="">
  //                         Select Subject Combination
  //                       </option>
  //                       {console.log("subjectOptions", subjectOptions)}

  //                       {subjectOptions &&
  //                         subjectOptions.map((subject, index) => (
  //                           <option key={index} value={subject}>
  //                             {subject}
  //                           </option>
  //                         ))}
  //                     </select>
  //                     {batchDetailsError.subjectCombination && (
  //                       <p className="text-red-500 text-xs mt-1">
  //                         {batchDetailsError.subjectCombination}
  //                       </p>
  //                     )}
  //                   </div>

  //                   {/* </div> */}
  //                 </form>
  //               </div>
  //             </div>
  //             // )
  //           }
  //           {/* Submit Message */}
  //           <div className="w-full text-center">
  //             {submitMessage && (
  //               <p
  //                 className={`text-sm text-center ${
  //                   submitMessage.includes("successfully")
  //                     ? "text-green-500"
  //                     : "text-red-500"
  //                 }`}
  //               >
  //                 {submitMessage}
  //               </p>
  //             )}
  //           </div>

  //           {/* Submit and Previous Buttons */}
  //           <div className="flex justify-end mt-4 ">
  //             {pathLocation === "/batchDetailsForm" && (
  //               <button
  //                 type="button"
  //                 onClick={() => navigate(-1)}
  //                 className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
  //               >
  //                 Previous
  //               </button>
  //             )}

  //             <button
  //               type="button"
  //               onClick={onSubmit}
  //               className={`bg-red-600 hover:bg-red-700 text-white py-2 px-9 rounded-full`}
  //               style={{ backgroundColor: "#c61d23" }}
  //             >
  //               {checkUrl ? "Next" : "Update"}
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default BasicDetailsForm;
