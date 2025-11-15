// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBatchDetails,
//   updateBatchDetails,
// } from "../../redux/slices/batchDetailsSlice"; // Adjust the path as necessary
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import Spinner from "../../api/Spinner";
// import FormHeader from "../LoginSugnup/FormHeader";
// import PageNumberComponent from "../PageNumberComponent";

// const BatchRelatedDetailsForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathLocation = location.pathname;
//   const [program, setProgram] = useState(""); // For dynamic courses

//   const dispatch = useDispatch();

//   const { formData, dataExist, loading, error } = useSelector(
//     (state) => state.batchDetails
//   );

//   const [showReloading, setShowReloading] = useState(false);

//   const [submitMessage, setSubmitMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const [checkUrl, setCheckUrl] = useState("");

//   useEffect(() => {
//     dispatch(fetchBatchDetails());
//     setCheckUrl(pathLocation === "/batchDetailsForm");
//   }, [dispatch, pathLocation]);

//   const validateForm = () => {
//     let formErrors = {};
//     let isValid = true;
//     console.log("FormData", formData);

//     Object.keys(formData).forEach(async (key) => {
//       if (!(key === "program" && formData.classForAdmission <= 10)) {
//         if (!formData[key]?.toString().trim()) {
//           formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
//           isValid = false;
//         }
//       }

//       if (key === "classForAdmission") {
//         console.log("normalizeValue(value)", normalizeValue(formData[key]));

//         const value = await normalizeValue(formData[key]);

//         console.log("value ", value);
//         console.log("key ", key);
//         dispatch(updateBatchDetails({ key: value }));
//       }
//     });

//     setErrors(formErrors);
//     return isValid;
//   };

//   const numberToRoman = (value) => {
//     const romanMap = {
//       1: "I",
//       2: "II",
//       3: "III",
//       4: "IV",
//       5: "V",
//       6: "VI",
//       7: "VII",
//       8: "VIII",
//       9: "IX",
//       10: "X",
//       11: "XI",
//       12: "XII",
//     };
//     return romanMap[value] || "Invalid";
//   };

//   const validRomans = new Set([
//     "I",
//     "II",
//     "III",
//     "IV",
//     "V",
//     "VI",
//     "VII",
//     "VIII",
//     "IX",
//     "X",
//     "XI",
//     "XII",
//   ]);

//   const normalizeValue = (data) => {
//     const parts = data.trim().split(/\s+/); // split into words
//     const first = parts[0].replace(/(st|nd|rd|th)$/i, "").toUpperCase(); // remove suffix if any
//     const rest = parts.slice(1).join(" "); // everything after the first word

//     let roman;
//     if (validRomans.has(first)) {
//       roman = first;
//     } else {
//       const num = parseInt(first);
//       roman = numberToRoman(num);
//     }

//     return rest ? `${roman} ${rest}` : roman;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     dispatch(updateBatchDetails({ [name]: value }));

//     if (name === "program") {
//       setProgram(value); // Update program selection
//     }

//     if (value.trim()) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setShowReloading(true);

//     if (validateForm()) {
//       try {
//         const url = dataExist
//           ? "/form/batchRelatedDetails/updateForm"
//           : "/form/batchRelatedDetails/addForm";
//         const method = dataExist ? axios.patch : axios.post;

//         await method(url, formData);

//         setSubmitMessage(
//           dataExist
//             ? "Batch related details updated successfully!"
//             : "Batch related details submitted successfully!"
//         );

//         navigate("/registration/educationalDetailsForm");
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setSubmitMessage("Error submitting form. Please try again.");
//       } finally {
//         setShowReloading(false);
//       }
//     }
//     setShowReloading(false);
//   };

//   useEffect(() => {
//     if (document.cookie === "") {
//       navigate("/");
//       return;
//     }
//     console.log("Running  ");
//     setProgram(formData.program || "");
//   }, [dataExist]);

//   const programOptions = {
//     "Foundation": ["VI", "VII", "VIII", "IX", "X"],
//     "JEE(Main & Adv)": [
//       "XI Engineering",
//       "XII Engineering",
//       "XII Passed Engineering",
//     ],

//     "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
//   };

//   // const programOptions = {
//   //   "Foundation (VI - X)": ["VI", "VII", "VIII", "IX", "X"],
//   //   "Engineering (XI - XII)": [
//   //     "XI",
//   //     "XII",
//   //     "XII Passed",
//   //   ],
//   //   "Medical (XI -XII)": ["XI", "XII", "XII Passed"],
//   // };

//   const convertToNumber = (romanNumeral) => {
//     const romanToNumber = {
//       VI: 6,
//       VII: 7,
//       VIII: 8,
//       IX: 9,
//       X: 10,
//       XI: 11,
//       XII: 12,
//     };

//     return romanToNumber[romanNumeral];
//   };

//   let subjectOptions =
//     convertToNumber(formData.classForAdmission) >= 6 &&
//     convertToNumber(formData.classForAdmission) <= 10
//       ? ["Foundation"]
//       : ["Engineering", "Medical"];
//   const convertToRoman = (num) => {
//     const romanNumerals = {
//       6: "VI",
//       7: "VII",
//       8: "VIII",
//       9: "IX",
//       10: "X",
//       11: "XI",
//       12: "XII",
//     };
//     return romanNumerals[num];
//   };

//   const programConverter = (value) => {
//     console.log("value for programConverTer", value);
//     if (value === "JEE(Main & Adv.)") return "JEE(Main & Adv)";
//     return value;
//     // setProgram(value);
//   };

//   // Fetch initial form data
//   useEffect(() => {
//     dispatch(fetchBatchDetails());
//     setCheckUrl(pathLocation === "/batchDetailsForm");
//   }, []);

//   useEffect(() => {}, []);

//   // Validate form fields

//   useEffect(() => {
//     console.log("formData form batchDetails ", formData);
//   }, [formData]);

//   // Handle form submission

//   return (
//     <div className="min-h-screen w-full bg-[#fdf5f6] px-2 md:px-8 py-2 overflow-auto">
//       {/* {loading && <Spinner />} */}

//       <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
//         {/* <div className="text-3xl text-black text-center transform hover:-translate-y-1 transition duration-200">
//           RISE Registration
//         </div> */}
//                       <div className="flex   "><FormHeader /></div>


//         {/* <h1 className="text-3xl md:text-4xl font-semibold text-black text-center">
//           SDAT Registration Form
//         </h1> */}

//         <PageNumberComponent />

//         <form
//           autoComplete="off"
//           className="flex flex-col gap-4  w-full"
//           onSubmit={onSubmit}
//         >
//           {/* Subject Combination */}

//           <div className="flex flex-col bg-white p-5 rounded-xl" >
//             <label
//               htmlFor="program"
//               className="text-sm font-medium text-black mb-1"
//             >
//               Select Program
//             </label>
//             <select
//               id="program"
//               name="program"
//               value={programConverter(formData?.program || "")}
//               onChange={handleChange}
//               className="appearance-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             >
//               <option disabled value="">
//                 Select Program
//               </option>

//               {Object.keys(programOptions).map((program) => (
//                 <option
//                   className="bg-white text-black"
//                   key={program}
//                   value={program}
//                 >
//                   {program === "Foundation"
//                     ? `${program} (VI - X)`
//                     : `${program} (XI - XII Passed)`}
//                 </option>
//               ))}
//             </select>
//             {errors.program && (
//               <p className="text-[#ffdd00] text-xs mt-1">{errors.program}</p>
//             )}
//           </div>

//           {/* Class  for admission*/}
//           <div className="flex flex-col bg-white p-5 rounded-xl">
//             <label
//               htmlFor="classForAdmission"
//               className="text-sm font-medium text-black mb-1"
//             >
//               Register For
//             </label>

//             <select
//               id="classForAdmission"
//               name="classForAdmission"
//               value={normalizeValue(formData?.classForAdmission)}
//               onChange={handleChange}
//               placeholder="Select Class for adminssion"
//               className=" appearance-none  border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             >
//               <option selected value="">
//                 Select Class for admission
//               </option>
              
//               {program &&
//                 programOptions[program]?.map((course) => (
//                   <option
//                     className="bg-white text-black"
//                     key={course}
//                     value={course}
//                   >
//                     {course}
//                   </option>
//                 ))}
//             </select>
//             {errors.classForAdmission && (
//               <p className="text-[#ffdd00] text-xs mt-1">
//                 {errors.classForAdmission}
//               </p>
//             )}
//           </div>

//           {showReloading && (
//             <div className="flex justify-center items-center ">
//               <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
//             </div>
//           )}

//           {/* Preferred Batch */}
//           {/* <div className="flex flex-col">
//             <label
//               htmlFor="preferredBatch"
//               className="text-sm font-medium text-black mb-1"
//             >
//               Preferred Batch
//             </label>
//             <select
//               id="preferredBatch"
//               name="preferredBatch"
//               value={formData.preferredBatch || ""}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             >
//               <option disabled value="">
//                 Select Preferred Batch
//               </option>
//               {batchOptions.map((batch, index) => (
//                 <option key={index} value={batch}>
//                   {batch}
//                 </option>
//               ))}
//             </select>
//             {errors.preferredBatch && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.preferredBatch}
//               </p>
//             )}
//           </div> */}

//           {/* Submit and Previous Buttons */}

//           <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
//             <button
//               onClick={() => navigate("/registration/basicDetailsForm")}
//               type="button"
//               className="w-full sm:w-1/3 border bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black  py-2 px-4 "
//             >
//               Back
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-2/3 border bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl transition-all"
//             >
//               Next
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BatchRelatedDetailsForm;














// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBatchDetails,
//   updateBatchDetails,
// } from "../../redux/slices/batchDetailsSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import Spinner from "../../api/Spinner";
// import { ArrowRight, ArrowLeft, AlertCircle, BookOpen, GraduationCap, Layers } from "lucide-react";

// const BatchRelatedDetailsForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathLocation = location.pathname;
//   const [program, setProgram] = useState("");

//   const dispatch = useDispatch();

//   const { formData, dataExist, loading, error } = useSelector(
//     (state) => state.batchDetails
//   );

//   const [showReloading, setShowReloading] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const [checkUrl, setCheckUrl] = useState("");

//   useEffect(() => {
//     dispatch(fetchBatchDetails());
//     setCheckUrl(pathLocation === "/batchDetailsForm");
//   }, [dispatch, pathLocation]);

//   const validateForm = () => {
//     let formErrors = {};
//     let isValid = true;
//     console.log("FormData", formData);

//     Object.keys(formData).forEach(async (key) => {
//       if (!(key === "program" && formData.classForAdmission <= 10)) {
//         if (!formData[key]?.toString().trim()) {
//           formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
//           isValid = false;
//         }
//       }

//       if (key === "classForAdmission") {
//         console.log("normalizeValue(value)", normalizeValue(formData[key]));
//         const value = await normalizeValue(formData[key]);
//         console.log("value ", value);
//         console.log("key ", key);
//         dispatch(updateBatchDetails({ key: value }));
//       }
//     });

//     setErrors(formErrors);
//     return isValid;
//   };

//   const numberToRoman = (value) => {
//     const romanMap = {
//       1: "I",
//       2: "II",
//       3: "III",
//       4: "IV",
//       5: "V",
//       6: "VI",
//       7: "VII",
//       8: "VIII",
//       9: "IX",
//       10: "X",
//       11: "XI",
//       12: "XII",
//     };
//     return romanMap[value] || "Invalid";
//   };

//   const validRomans = new Set([
//     "I",
//     "II",
//     "III",
//     "IV",
//     "V",
//     "VI",
//     "VII",
//     "VIII",
//     "IX",
//     "X",
//     "XI",
//     "XII",
//   ]);

//   const normalizeValue = (data) => {
//     const parts = data.trim().split(/\s+/);
//     const first = parts[0].replace(/(st|nd|rd|th)$/i, "").toUpperCase();
//     const rest = parts.slice(1).join(" ");

//     let roman;
//     if (validRomans.has(first)) {
//       roman = first;
//     } else {
//       const num = parseInt(first);
//       roman = numberToRoman(num);
//     }

//     return rest ? `${roman} ${rest}` : roman;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     dispatch(updateBatchDetails({ [name]: value }));

//     if (name === "program") {
//       setProgram(value);
//     }

//     if (value.trim()) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setShowReloading(true);

//     if (validateForm()) {
//       try {
//         const url = dataExist
//           ? "/form/batchRelatedDetails/updateForm"
//           : "/form/batchRelatedDetails/addForm";
//         const method = dataExist ? axios.patch : axios.post;

//         await method(url, formData);

//         // setSubmitMessage(
//         //   dataExist
//         //     ? "Batch related details updated successfully!"
//         //     : "Batch related details submitted successfully!"
//         // );

//         navigate("/registration/educationalDetailsForm");
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setSubmitMessage("Error submitting form. Please try again.");
//       } finally {
//         setShowReloading(false);
//       }
//     }
//     setShowReloading(false);
//   };

//   useEffect(() => {
//     if (document.cookie === "") {
//       navigate("/");
//       return;
//     }
//     console.log("Running");
//     setProgram(formData.program || "");
//   }, [dataExist]);

//   const programOptions = {
//     Foundation: ["VI", "VII", "VIII", "IX", "X"],
//     "JEE(Main & Adv)": [
//       "XI Engineering",
//       "XII Engineering",
//       "XII Passed Engineering",
//     ],
//     "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
//   };

//   const convertToNumber = (romanNumeral) => {
//     const romanToNumber = {
//       VI: 6,
//       VII: 7,
//       VIII: 8,
//       IX: 9,
//       X: 10,
//       XI: 11,
//       XII: 12,
//     };
//     return romanToNumber[romanNumeral];
//   };

//   let subjectOptions =
//     convertToNumber(formData.classForAdmission) >= 6 &&
//     convertToNumber(formData.classForAdmission) <= 10
//       ? ["Foundation"]
//       : ["Engineering", "Medical"];

//   const convertToRoman = (num) => {
//     const romanNumerals = {
//       6: "VI",
//       7: "VII",
//       8: "VIII",
//       9: "IX",
//       10: "X",
//       11: "XI",
//       12: "XII",
//     };
//     return romanNumerals[num];
//   };

//   const programConverter = (value) => {
//     console.log("value for programConverTer", value);
//     if (value === "JEE(Main & Adv.)") return "JEE(Main & Adv)";
//     return value;
//   };

//   useEffect(() => {
//     dispatch(fetchBatchDetails());
//     setCheckUrl(pathLocation === "/batchDetailsForm");
//   }, []);



//   if (loading) {
//     return <Spinner />;
//   }

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
//       {/* Navigation Bar */}
//       <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 sm:h-20">
//             <div className="flex items-center gap-3">
//               <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
//                 <Layers size={24} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
//                   Batch Details
//                 </h1>
//                 <p className="text-xs text-gray-500 hidden sm:block">Select your program and batch</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Decorative Background */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative py-8 sm:py-12">
//         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Progress Indicator */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-lg font-semibold text-gray-900">Step 2 of 4</h2>
//               <div className="text-sm text-gray-600">Program & Batch Selection</div>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full" style={{ width: "50%" }}></div>
//             </div>
//           </div>

//           {/* Form Container */}
//           <form autoComplete="off" className="flex flex-col gap-5" onSubmit={onSubmit}>
//             {/* Program Selection */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
//               <label htmlFor="program" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
//                 <BookOpen size={18} className="text-[#c61d23]" />
//                 Select Program
//               </label>
//               <select
//                 id="program"
//                 name="program"
//                 value={programConverter(formData?.program || "")}
//                 onChange={handleChange}
//                 className="w-full appearance-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer"
//               >
//                 <option disabled value="">
//                   Select your program
//                 </option>
//                 {Object.keys(programOptions).map((program) => (
//                   <option key={program} value={program} className="bg-white text-gray-900">
//                     {program === "Foundation"
//                       ? `${program} (VI - X)`
//                       : `${program} (XI - XII Passed)`}
//                   </option>
//                 ))}
//               </select>
//               {errors.program && (
//                 <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
//                   <AlertCircle size={14} />
//                   {errors.program}
//                 </div>
//               )}
//             </div>

//             {/* Class for Admission */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
//               <label htmlFor="classForAdmission" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
//                 <GraduationCap size={18} className="text-[#c61d23]" />
//                 Register For
//               </label>
//               <select
//                 id="classForAdmission"
//                 name="classForAdmission"
//                 // value={formData?.classForAdmission || ""}
//                 value={normalizeValue(formData?.classForAdmission || "")}
//                 onChange={handleChange}
//                 className="w-full appearance-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer"
//               >
//                 <option value="">
//                   Select class for admission
//                 </option>
//                 {program &&
//                   programOptions[program]?.map((course) => (
//                     <option key={course} value={course} className="bg-white text-gray-900">
//                       {course}
//                     </option>
//                   ))}
//               </select>
//               {errors.classForAdmission && (
//                 <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
//                   <AlertCircle size={14} />
//                   {errors?.classForAdmission}
//                 </div>
//               )}
//             </div>

//             {/* Info Card */}
//             <div className="bg-gradient-to-br from-[#fff5e6] to-[#ffedd5] border border-[#ffc107]/30 rounded-2xl p-6">
//               <div className="flex items-start gap-3">
//                 <div className="text-3xl flex-shrink-0">ℹ️</div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Program Information</h3>
//                   <p className="text-sm text-gray-700">
//                     {program
//                       ? `You are registering for ${program}. ${program === "Foundation" ? "Available for classes VI to X." : "Available for classes XI to XII Passed."}`
//                       : "Select a program to see details."}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Error Message */}
//             {submitMessage && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
//                 <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm text-red-700">{submitMessage}</p>
//               </div>
//             )}

//             {/* Loading State */}
//             {showReloading && (
//               <div className="flex justify-center items-center py-4">
//                 <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-[#c61d23]"></div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-3 mt-8">
//               <button
//                 onClick={() => navigate("/registration/basicDetailsForm")}
//                 type="button"
//                 className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300"
//               >
//                 <ArrowLeft size={18} />
//                 <span className="hidden sm:inline">Back</span>
//               </button>
//               <button
//                 type="submit"
//                 disabled={showReloading}
//                 className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span>{showReloading ? "Submitting..." : "Next"}</span>
//                 {!showReloading && <ArrowRight size={18} />}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BatchRelatedDetailsForm;












import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBatchDetails,
  updateBatchDetails,
} from "../../redux/slices/batchDetailsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../api/Spinner";
import { ArrowRight, ArrowLeft, AlertCircle, BookOpen, GraduationCap, Layers } from "lucide-react";

const BatchRelatedDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;
  const [program, setProgram] = useState("");

  const dispatch = useDispatch();

  const { formData, dataExist, loading, error } = useSelector(
    (state) => state.batchDetails
  );

  const [showReloading, setShowReloading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  // ===== HELPER FUNCTIONS =====
  const numberToRoman = (value) => {
    const romanMap = {
      1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
      7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII",
    };
    return romanMap[value] || "Invalid";
  };

  const validRomans = new Set([
    "I", "II", "III", "IV", "V", "VI", "VII", 
    "VIII", "IX", "X", "XI", "XII",
  ]);

  const normalizeValue = (data) => {
    // Handle empty or null values
    if (!data || data.toString().trim() === "") {
      return "";
    }

    const parts = data.toString().trim().split(/\s+/);
    const first = parts[0].replace(/(st|nd|rd|th)$/i, "").toUpperCase();
    const rest = parts.slice(1).join(" ");

    let roman;
    if (validRomans.has(first)) {
      roman = first;
    } else {
      const num = parseInt(first);
      roman = isNaN(num) ? first : numberToRoman(num);
    }

    return rest ? `${roman} ${rest}` : roman;
  };

  const programConverter = (value) => {
    if (!value) return "";
    if (value === "JEE(Main & Adv.)") return "JEE(Main & Adv)";
    return value;
  };

  const programOptions = {
    Foundation: ["VI", "VII", "VIII", "IX", "X"],
    "JEE(Main & Adv)": [
      "XI Engineering",
      "XII Engineering",
      "XII Passed Engineering",
    ],
    "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
  };

  // ===== INITIALIZE FORM DATA =====
  useEffect(() => {
    // Check authentication
    if (document.cookie === "") {
      navigate("/");
      return;
    }

    // Fetch form data
    dispatch(fetchBatchDetails());
  }, [dispatch, navigate]);

  // ===== SYNC PROGRAM STATE WITH FORM DATA =====
  useEffect(() => {
    if (formData?.program) {
      const convertedProgram = programConverter(formData.program);
      setProgram(convertedProgram);
    }
  }, [formData?.program]);

  // ===== CLEAR CLASS WHEN PROGRAM CHANGES =====
  useEffect(() => {
    // If program changes and current class doesn't belong to new program
    if (program && formData?.classForAdmission) {
      const normalizedClass = normalizeValue(formData.classForAdmission);
      const validClasses = programOptions[program] || [];
      
      if (!validClasses.includes(normalizedClass)) {
        dispatch(updateBatchDetails({ classForAdmission: "" }));
      }
    }
  }, [program]);

  // ===== VALIDATION =====
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData?.program || !formData.program.trim()) {
      formErrors.program = "Program is required";
      isValid = false;
    }

    if (!formData?.classForAdmission || !formData.classForAdmission.trim()) {
      formErrors.classForAdmission = "Class for admission is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(updateBatchDetails({ [name]: value }));

    if (name === "program") {
      setProgram(value);
      // Clear class selection when program changes
      dispatch(updateBatchDetails({ classForAdmission: "" }));
    }

    // Clear error when user types
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // ===== FORM SUBMISSION =====
  const onSubmit = async (e) => {
    e.preventDefault();
    setShowReloading(true);
    setSubmitMessage("");

    if (!validateForm()) {
      setShowReloading(false);
      return;
    }

    try {
      const url = dataExist
        ? "/form/batchRelatedDetails/updateForm"
        : "/form/batchRelatedDetails/addForm";
      const method = dataExist ? axios.patch : axios.post;

      await method(url, formData);

      navigate("/registration/educationalDetailsForm");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage(
        error.response?.data?.message || 
        "Error submitting form. Please try again."
      );
    } finally {
      setShowReloading(false);
    }
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <Layers size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Batch Details
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Select your program and batch</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Step 2 of 5</h2>
              <div className="text-sm text-gray-600">Program & Batch Selection</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300" 
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>

          {/* Form Container */}
          <form autoComplete="off" className="flex flex-col gap-5" onSubmit={onSubmit}>
            {/* Program Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label 
                htmlFor="program" 
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <BookOpen size={18} className="text-[#c61d23]" />
                Select Program <span className="text-red-500">*</span>
              </label>
              <select
                id="program"
                name="program"
                value={programConverter(formData?.program || "")}
                onChange={handleChange}
                className={`w-full appearance-none border ${
                  errors.program ? 'border-red-300' : 'border-gray-200'
                } rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer`}
              >
                <option value="">
                  Select your program
                </option>
                {Object.keys(programOptions).map((programOption) => (
                  <option key={programOption} value={programOption} className="bg-white text-gray-900">
                    {programOption === "Foundation"
                      ? `${programOption} (VI - X)`
                      : `${programOption} (XI - XII Passed)`}
                  </option>
                ))}
              </select>
              {errors.program && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {errors.program}
                </div>
              )}
            </div>

            {/* Class for Admission */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <label 
                htmlFor="classForAdmission" 
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
              >
                <GraduationCap size={18} className="text-[#c61d23]" />
                Register For <span className="text-red-500">*</span>
              </label>
              <select
                id="classForAdmission"
                name="classForAdmission"
                value={formData?.classForAdmission || ""}
                onChange={handleChange}
                disabled={!program}
                className={`w-full appearance-none border ${
                  errors.classForAdmission ? 'border-red-300' : 'border-gray-200'
                } rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {program ? "Select class for admission" : "First select a program"}
                </option>
                {program &&
                  programOptions[program]?.map((course) => (
                    <option key={course} value={course} className="bg-white text-gray-900">
                      {course}
                    </option>
                  ))}
              </select>
              {errors.classForAdmission && (
                <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <AlertCircle size={14} />
                  {errors.classForAdmission}
                </div>
              )}
              {!program && (
                <p className="text-xs text-gray-500 mt-2">
                  Please select a program first
                </p>
              )}
            </div>

            {/* Info Card */}
            {program && (
              <div className="bg-gradient-to-br from-[#fff5e6] to-[#ffedd5] border border-[#ffc107]/30 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">ℹ️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Program Information</h3>
                    <p className="text-sm text-gray-700">
                      You are registering for <strong>{program}</strong>.{" "}
                      {program === "Foundation" 
                        ? "Available for classes VI to X." 
                        : "Available for classes XI to XII Passed."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitMessage}</p>
              </div>
            )}

            {/* Loading State */}
            {showReloading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-[#c61d23]"></div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate("/registration/basicDetailsForm")}
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

export default BatchRelatedDetailsForm;