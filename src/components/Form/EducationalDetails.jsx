// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import {
//   fetchEducationalDetails,
//   fetchBoards,
//   updateEducationalDetails,
//   submitEducationalDetails,
// } from "../../redux/slices/educationalDetailsSlice";
// import { fetchUserDetails } from "../../redux/slices/userDeailsSlice";

// import { fetchFamilyDetails } from "../../redux/slices/familyDetailsSlice";
// import FormHeader from "../LoginSugnup/FormHeader";
// import { fetchBatchDetails } from "../../redux/slices/batchDetailsSlice";
// import PageNumberComponent from "../PageNumberComponent";

// const EducationalDetailsForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathLocation = location.pathname;

//   const [educationalErrors, setEducationalErrors] = useState({});

//   const [showReloading, setShowReloading] = useState(false);

//   const [yearList, setYearList] = useState([]);

//   // Redux state selectors
//   const { formData, boards, loading, dataExist } = useSelector(
//     (state) => state.educationalDetails
//   );

//   const { userData } = useSelector((state) => state.userDetails);

//   const { formData: batchRelatedDetails } = useSelector(
//     (state) => state.batchDetails
//   );

//   // Component state
//   const [submitMessage, setSubmitMessage] = useState("");
//   const [checkUrl, setCheckUrl] = useState(false);
//   const [errors, setErrors] = useState({});

//   const incomeRanges = [
//     "Less than 1 Lakh",
//     "1 Lakh - 5 Lakhs",
//     "5 Lakhs - 10 Lakhs",
//     "10 Lakhs - 20 Lakhs",
//     "More than 20 Lakhs",
//   ];

//   const phoneRegex = /^[0-9]{10}$/;

//   useEffect(() => {
//     dispatch(fetchBoards());
//     dispatch(fetchEducationalDetails());
//     dispatch(fetchFamilyDetails());
//     dispatch(fetchUserDetails());
//     dispatch(fetchBatchDetails());
//     setCheckUrl(pathLocation === "/educationalDetailsForm");
//   }, [dispatch, pathLocation]);

//   useEffect(() => {
//     dispatch(fetchBoards());
//     yearGeneration();
//     console.log("YearList", yearList);
//   }, []);

//   useEffect(() => {
//     console.log("borards", boards);
//   }, [boards]);

//   const handleChange = (e, updateAction, formData) => {
//     const { name, value } = e.target;
//     if (
//       ["MotherContactNumber", "FatherContactNumber"].includes(name) &&
//       value.length > 10
//     ) {
//       return;
//     }

//     dispatch(updateAction({ [name]: value }));
//     if (value.trim()) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   const validateForm = (
//     formData,
//     setErrorState,
//     additionalValidations = {}
//   ) => {
//     const formErrors = {};
//     let isValid = true;

//     // Object.keys(formData)
//     ["SchoolName", "Class", "YearOfPassing", "Board"].forEach((key) => {
//       const value = formData[key]?.toString().trim();

//       if (!value) {
//         formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
//         isValid = false;
//       } else if (
//         additionalValidations[key] &&
//         !additionalValidations[key](value)
//       ) {
//         formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is invalid`;
//         isValid = false;
//       }

//       // For Percentage
//       // if (key === "Percentage") {
//       //   const checkValueGreaterThenLimit = value > 50;

//       //   if (!checkValueGreaterThenLimit) {
//       //     formErrors[key] = `Percentage must be greater then 50`;
//       //     isValid = false;
//       //   }
//       // }
//     });

//     setErrorState(formErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setShowReloading(true);

//     const isEducationalValid = validateForm(formData, setEducationalErrors);

//     if (isEducationalValid) {
//       try {
//         const response = dispatch(
//           updateEducationalDetails({ Class: dataForClassInput()[0] })
//         );
//         console.log("response", response);

//         console.log("FormData Before Reqyuest", formData);
//         const result = await dispatch(
//           submitEducationalDetails({
//             educationalFormData: formData,
//             educationalDataExist: dataExist,
//             setEducationalFormSubmit,
//           })
//         ).unwrap();

//         console.log("Submission result:", result);
//         if (result) {
//           navigate("/registration/familyDetailsForm");
//         }
//       } catch (error) {
//         console.error("Error submitting educational details:", error);
//         setSubmitMessage("Error submitting form. Please try again.");
//       } finally {
//         setShowReloading(false);
//       }
//     }
//     setShowReloading(false);
//   };

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

//   const renderInputField = (
//     key,
//     value,
//     handleChange,
//     additionalProps = {},
//     errorsState
//   ) => {
//     const isPercentage = key === "Percentage";

//     return (
//       <div className="flex flex-col bg-white p-5 rounded-xl" key={key}>
//         <label htmlFor={key} className="text-sm font-medium text-black mb-1">
//           {key.replace(/([A-Z])/g, " $1")}{" "}
//           {isPercentage && " Obtained (Skip if result not declared)"}
//         </label>
//         <input
//           type={isPercentage ? "number" : "text"}
//           id={key}
//           name={key}
//           value={value}
//           onChange={(e) => {
//             const newValue = e.target.value;
//             console.log("newValue", newValue);

//             if (isPercentage) {
//               // Allow only numbers and up to two decimal places, block 'e', '+', '-'
//               const isValid =
//                 /^(\d{0,3})(\.\d{0,2})?$/.test(newValue) || newValue === "";

//               if (
//                 isValid &&
//                 (newValue === "" ||
//                   (Number(newValue) <= 100 && Number(newValue) >= 0))
//               ) {
//                 handleChange(e);
//               }
//             } else {
//               handleChange(e);
//             }
//           }}
//           placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
//           className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none w-full"
//           step="0.01" // Optional: allows for decimal precision up to 2 decimal places
//           {...additionalProps}
//         />

//         {errorsState[key] && (
//           <p className="text-[#ffdd00] text-xs mt-1">{errorsState[key]}</p>
//         )}
//       </div>
//     );
//   };

//   const yearGeneration = () => {
//     const currentYear = new Date().getFullYear();
//     console.log("CURRENT YEAR", currentYear);

//     for (let i = 0; i < 3; i++) {
//       setYearList((prev) => [...prev, currentYear - i]);
//     }
//   };

//   const romanClassLevels = [
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
//   ];

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

//   const dataForClassInput = () => {
//     const data = batchRelatedDetails?.classForAdmission.split(" ")[0];
//     const dataLength = batchRelatedDetails?.classForAdmission.split(" ").length;
//     console.log(
//       "batchRelatedDetails?.classForAdmission.split",
//       batchRelatedDetails?.classForAdmission.split(" ").length
//     );

//     console.log("Data for classInput", batchRelatedDetails);
//     console.log("Data for classInput", data);
//     const arrayofData = [];

//     if (data) {
//       const datavalue = normalizeValue(data);

//       // if (!validRomans.has(input)) {
//       //   datavalue = numberToRoman(parseInt(input));
//       // } else {
//       //   datavalue = input;
//       // }

//       const index = romanClassLevels.indexOf(datavalue);
//       if (index > 0) {
//         const value = dataLength === 3 ? index : index - 1;
//         const oneLessClass = romanClassLevels[value];
//         console.log("One less class:", oneLessClass);
//         arrayofData.push(oneLessClass);
//       } else {
//         console.log("No lower class exists for:", data);
//         return null;
//       }
//     }

//     return arrayofData;
//   };

//   useEffect(() => {
//     dataForClassInput();
//   }, [batchRelatedDetails]);

//   const renderSelectField = (
//     key,
//     value,
//     handleChange,
//     options,
//     errorsState
//   ) => {
//     return (
//       <div className="flex flex-col   bg-white p-5 rounded-xl " key={key}>
//         <label htmlFor={key} className="text-sm font-medium text-black mb-1">
//           {key === "Class"
//             ? "Class (Appeared/Appearing)"
//             : key.replace(/([A-Z])/g, " $1")}
//         </label>
//         <select
//           name={key}
//           value={value}
//           onChange={handleChange}
//           className=" appearance-none  border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none w-full"
//         >
//           <option value="" disabled>{`Select ${key.replace(
//             /([A-Z])/g,
//             " $1"
//           )}`}</option>
//           {options.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//         {errorsState[key] && (
//           <p className="text-[#ffdd00] text-xs mt-1">{errorsState[key]}</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#fdf5f6] px-2 md:px-8 py-2 overflow-auto">
//       {/* {loading && <Spinner />} */}

//       <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
//         <div className="flex   ">
//           <FormHeader />
//         </div>

//         <PageNumberComponent />

//         <form
//           autoComplete="off"
//           className="flex flex-col gap-4  w-full"
//           onSubmit={handleSubmit}
//         >
//           {/* <div className="flex flex-wrap"> */}
//           {Object.keys(formData).map((key) =>
//             key === "Class" || key === "YearOfPassing" || key === "Board"
//               ? renderSelectField(
//                   key,
//                   formData[key],
//                   (e) => handleChange(e, updateEducationalDetails, formData),
//                   key === "YearOfPassing"
//                     ? ["2025", "2024", "2023"]
//                     : key === "Class"
//                     ? dataForClassInput()
//                     : boards
//                     ? boards.map((board) => board.name)
//                     : [],
//                   educationalErrors
//                 )
//               : renderInputField(
//                   key,
//                   formData[key],
//                   (e) => handleChange(e, updateEducationalDetails, formData),
//                   {},
//                   educationalErrors
//                 )
//           )}
//           {/* </div> */}

//           {showReloading && (
//             <div className="flex justify-center items-center">
//               <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
//             </div>
//           )}

//           <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
//             <button
//               onClick={() => navigate("/registration/batchDetailsForm")}
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

// export default EducationalDetailsForm;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  fetchEducationalDetails,
  fetchBoards,
  updateEducationalDetails,
  submitEducationalDetails,
} from "../../redux/slices/educationalDetailsSlice";
import { fetchUserDetails } from "../../redux/slices/userDeailsSlice";
import { fetchFamilyDetails } from "../../redux/slices/familyDetailsSlice";
import { fetchBatchDetails } from "../../redux/slices/batchDetailsSlice";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  BookOpen,
  Award,
  Percent,
  Building2,
} from "lucide-react";

const EducationalDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;

  const [educationalErrors, setEducationalErrors] = useState({});
  const [showReloading, setShowReloading] = useState(false);
  const [yearList, setYearList] = useState([]);

  // Redux state selectors
  const { formData, boards, loading, dataExist } = useSelector(
    (state) => state.educationalDetails
  );

  const { userData } = useSelector((state) => state.userDetails);

  const { formData: batchRelatedDetails } = useSelector(
    (state) => state.batchDetails
  );

  // Component state
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkUrl, setCheckUrl] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchBoards());
    dispatch(fetchEducationalDetails());
    dispatch(fetchFamilyDetails());
    dispatch(fetchUserDetails());
    dispatch(fetchBatchDetails());
    setCheckUrl(pathLocation === "/educationalDetailsForm");
  }, [dispatch, pathLocation]);

  useEffect(() => {
    dispatch(fetchBoards());
    yearGeneration();
    console.log("YearList", yearList);
  }, []);

  useEffect(() => {
    console.log("boards", boards);
  }, [boards]);

  const handleChange = (e, updateAction, formData) => {
    const { name, value } = e.target;
    if (
      ["MotherContactNumber", "FatherContactNumber"].includes(name) &&
      value.length > 10
    ) {
      return;
    }

    dispatch(updateAction({ [name]: value }));
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = (
    formData,
    setErrorState,
    additionalValidations = {}
  ) => {
    const formErrors = {};
    let isValid = true;

    ["SchoolName", "Class", "YearOfPassing", "Board"].forEach((key) => {
      const value = formData[key]?.toString().trim();

      if (!value) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      } else if (
        additionalValidations[key] &&
        !additionalValidations[key](value)
      ) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is invalid`;
        isValid = false;
      }
    });

    setErrorState(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowReloading(true);

    console.log("Submit function nis running");


    const isEducationalValid = validateForm(formData, setEducationalErrors);

    console.log("ISEducationValid", isEducationalValid);

    if (isEducationalValid) {
      try {
        const response = dispatch(
          updateEducationalDetails({ Class: dataForClassInput()[0] })
        );
        console.log("response", response);

        console.log("FormData Before Request", formData);
        const result = await dispatch(
          submitEducationalDetails({
            educationalFormData: formData,
            educationalDataExist: dataExist,
            // setEducationalFormSubmit,
          })
        ).unwrap();

        console.log("Submission result:", result);
        if (result) {
          navigate("/registration/familyDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting educational details:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      } finally {
        setShowReloading(false);
      }
    }
    setShowReloading(false);
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

  const getFieldIcon = (key) => {
    const iconMap = {
      SchoolName: <Building2 size={18} className="text-[#c61d23]" />,
      Class: <BookOpen size={18} className="text-[#c61d23]" />,
      YearOfPassing: <Award size={18} className="text-[#c61d23]" />,
      Board: <Building2 size={18} className="text-[#c61d23]" />,
      Percentage: <Percent size={18} className="text-[#c61d23]" />,
    };
    return iconMap[key] || <BookOpen size={18} className="text-[#c61d23]" />;
  };

  const renderInputField = (
    key,
    value,
    handleChange,
    additionalProps = {},
    errorsState
  ) => {
    const isPercentage = key === "Percentage";

    return (
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6"
        key={key}
      >
        <label
          htmlFor={key}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
        >
          {getFieldIcon(key)}
          {key.replace(/([A-Z])/g, " $1")}
          {isPercentage && (
            <span className="text-xs text-gray-600 font-normal">
              (Optional)
            </span>
          )}
        </label>
        <input
          type={isPercentage ? "number" : "text"}
          id={key}
          name={key}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log("newValue", newValue);

            if (isPercentage) {
              const isValid =
                /^(\d{0,3})(\.\d{0,2})?$/.test(newValue) || newValue === "";

              if (
                isValid &&
                (newValue === "" ||
                  (Number(newValue) <= 100 && Number(newValue) >= 0))
              ) {
                handleChange(e);
              }
            } else {
              handleChange(e);
            }
          }}
          placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all"
          step="0.01"
          {...additionalProps}
        />

        {errorsState[key] && (
          <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
            <AlertCircle size={14} />
            {errorsState[key]}
          </div>
        )}
      </div>
    );
  };

  const yearGeneration = () => {
    const currentYear = new Date().getFullYear();
    console.log("CURRENT YEAR", currentYear);

    for (let i = 0; i < 3; i++) {
      setYearList((prev) => [...prev, currentYear - i]);
    }
  };

  const romanClassLevels = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  const numberToRoman = (value) => {
    const romanMap = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
      11: "XI",
      12: "XII",
    };
    return romanMap[value] || "Invalid";
  };

  const validRomans = new Set([
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ]);

  const normalizeValue = (data) => {
    const parts = data.trim().split(/\s+/);
    const first = parts[0].replace(/(st|nd|rd|th)$/i, "").toUpperCase();
    const rest = parts.slice(1).join(" ");

    let roman;
    if (validRomans.has(first)) {
      roman = first;
    } else {
      const num = parseInt(first);
      roman = numberToRoman(num);
    }

    return rest ? `${roman} ${rest}` : roman;
  };

  const dataForClassInput = () => {
    const data = batchRelatedDetails?.classForAdmission.split(" ")[0];
    const dataLength = batchRelatedDetails?.classForAdmission.split(" ").length;
    console.log(
      "batchRelatedDetails?.classForAdmission.split",
      batchRelatedDetails?.classForAdmission.split(" ").length
    );

    console.log("Data for classInput", batchRelatedDetails);
    console.log("Data for classInput", data);
    const arrayofData = [];

    if (data) {
      const datavalue = normalizeValue(data);

      const index = romanClassLevels.indexOf(datavalue);
      if (index > 0) {
        const value = dataLength === 3 ? index : index - 1;
        const oneLessClass = romanClassLevels[value];
        console.log("One less class:", oneLessClass);
        arrayofData.push(oneLessClass);
      } else {
        console.log("No lower class exists for:", data);
        return null;
      }
    }

    return arrayofData;
  };

  useEffect(() => {
    dataForClassInput();
  }, [batchRelatedDetails]);

  const renderSelectField = (
    key,
    value,
    handleChange,
    options,
    errorsState
  ) => {
    return (
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6"
        key={key}
      >
        <label
          htmlFor={key}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
        >
          {getFieldIcon(key)}
          {key === "Class"
            ? "Class (Appeared/Appearing)"
            : key.replace(/([A-Z])/g, " $1")}
        </label>
        <select
          name={key}
          value={value}
          onChange={handleChange}
          className="w-full appearance-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer"
        >
          <option value="" disabled>{`Select ${key.replace(
            /([A-Z])/g,
            " $1"
          )}`}</option>
          {options &&
            options.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-white text-gray-900"
              >
                {option}
              </option>
            ))}
        </select>
        {errorsState[key] && (
          <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
            <AlertCircle size={14} />
            {errorsState[key]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Educational Details
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Academic information
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
                Step 3 of 4
              </h2>
              <div className="text-sm text-gray-600">
                Educational Background
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          {/* Form Container */}
          <form
            autoComplete="off"
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {/* Form Fields */}
            {Object.keys(formData).map((key) =>
              key === "Class" || key === "YearOfPassing" || key === "Board"
                ? renderSelectField(
                    key,
                    formData[key],
                    (e) => handleChange(e, updateEducationalDetails, formData),
                    key === "YearOfPassing"
                      ? ["2025", "2024", "2023"]
                      : key === "Class"
                      ? dataForClassInput()
                      : boards
                      ? boards.map((board) => board.name)
                      : [],
                    educationalErrors
                  )
                : renderInputField(
                    key,
                    formData[key],
                    (e) => handleChange(e, updateEducationalDetails, formData),
                    {},
                    educationalErrors
                  )
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-br from-[#fff5e6] to-[#ffedd5] border border-[#ffc107]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">📚</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Educational Information
                  </h3>
                  <p className="text-sm text-gray-700">
                    Please provide accurate details about your previous/current
                    education. Percentage is optional if results are not yet
                    declared.
                  </p>
                </div>
              </div>
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

            {/* Loading State */}
            {showReloading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-[#c61d23]"></div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate("/registration/batchDetailsForm")}
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

export default EducationalDetailsForm;
