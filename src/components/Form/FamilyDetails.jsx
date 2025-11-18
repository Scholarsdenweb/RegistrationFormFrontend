// // src/components/FamilyDetails.js
// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFamilyDetails,
//   submitFamilyDetails,
//   updateFamilyDetails,
// } from "../../redux/slices/familyDetailsSlice";
// import Spinner from "../../api/Spinner";
// import FormHeader from "../LoginSugnup/FormHeader";
// import PageNumberComponent from "../PageNumberComponent";

// const FamilyDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathLocation = location.pathname;

//   const dispatch = useDispatch();
//   const { formData, dataExist, submitMessage, loading, error } = useSelector(
//     (state) => state.familyDetails
//   );

//   const [checkUrl, setCheckUrl] = useState("");
//   const [errors, setErrors] = useState({});
//   const [familyFormSubmit, setFamilyFormSubmit] = useState(false);
//   const [showReloading, setShowReloading] = useState(false);
//   const phoneRegex = /^[0-9]{10}$/;

//   const optionsForSelectInput = {
//     FamilyIncome: [
//       "Less than 1 Lakh",
//       "1 Lakh - 5 Lakhs",
//       "5 Lakhs - 10 Lakhs",
//       "10 Lakhs - 20 Lakhs",
//       "More than 20 Lakhs",
//     ],
//     FatherOccupation: [
//       "Engineer",
//       "Doctor",
//       "Teacher",
//       "Businessman",
//       "Farmer",
//       "Lawyer",
//       "Accountant",
//       "Driver",
//       "Police Officer",
//       "Soldier",
//       "Other",
//     ],

//     MotherOccupation: [
//       "Teacher",
//       "Homemaker",
//       "Nurse",
//       "Doctor",
//       "Businesswoman",
//       "Engineer",
//       "Accountant",
//       "Clerk",
//       "Farmer",
//       "Tailor",
//       "Other",
//     ],
//   };

//   // Form change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;


//     if (name === "MotherContactNumber" || name === "FatherContactNumber") {
//       if (value.length > 10) {
//         return;
//       }
//     }


//     dispatch(
//       updateFamilyDetails({
//         [name]: value,
//       })
//     );

//     if (name === "FatherContactNumber") {
//       if (!phoneRegex.test(value)) {
//         setErrors((prev) => ({
//           ...prev,
//           [name]: `${name.replace(
//             /([A-Z])/g,
//             " $1"
//           )} must be a valid 10-digit number`,
//         }));
//         return;
//       }
//     }

//     setErrors((prev) => ({
//       ...prev,
//       [name]: value.trim()
//         ? ""
//         : `${name.replace(/([A-Z])/g, " $1")} is required`,
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Object.keys(formData)
//     [
//       "FatherName",
//       "FatherContactNumber",
//       "FatherOccupation",
//       "MotherName",
   
//       "FamilyIncome",
//     ].forEach((key) => {
//       const value = formData[key]?.trim();

//       if (!value) {
//         newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
//       } else if (
//         (key === "FatherContactNumber" || key === "MotherContactNumber") &&
//         !phoneRegex.test(value)
//       ) {
//         newErrors[key] = `${key.replace(
//           /([A-Z])/g,
//           " $1"
//         )} must be a valid 10-digit number`;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setShowReloading(true);
//     try {
//       if (validateForm()) {
//         const result = await dispatch(
//           submitFamilyDetails({
//             familyFormData: formData,
//             familyDataExist: dataExist,
//             setFamilyFormSubmit,
//           })
//         ).unwrap();

//         if (result) {
//           navigate("/registration/payment");
//         }
//       }
//     } catch (error) {
//       console.log("error  ", error);
//     } finally {
//       setShowReloading(false);
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchFamilyDetails());
//     setCheckUrl(pathLocation === "/familyDetailsForm");
//   }, [dispatch, pathLocation]);

 

//   return (
//     <div className="min-h-screen w-full bg-[#fdf5f6] px-2 md:px-8 py-2 overflow-auto">
//       {/* {loading && <Spinner />} */}

//       <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
//         {/* <div className="text-3xl text-black text-center transform hover:-translate-y-1 transition duration-200">
//           RISE Registration
//         </div> */}

//          <div className="flex   ">
//           <FormHeader />
//         </div>


//         {/* <h1 className="text-3xl md:text-4xl font-semibold text-black text-center">
//           Registration Form for SDAT
//         </h1> */}
//         <form
//           autoComplete="off"
//           className="flex flex-col gap-4  w-full"
//           onSubmit={onSubmit}
//         >
//           {/* <h1
//             className="text-2xl font-bold text-center "
//             style={{ color: "#fdf5f6" }}
//           >
//             Family Details Form
//           </h1> */}

//           <PageNumberComponent />

//           {Object.keys(formData).map((key) => {
//             if (
//               key === "FamilyIncome" ||
//               key === "FatherOccupation" ||
//               key === "MotherOccupation"
//             ) {
//               return (
//                 <div className="flex flex-col w-full bg-white p-5 rounded-xl " key={key}>
//                   <label
//                     htmlFor={key}
//                     className="text-sm font-medium text-black mb-1"
//                   >
//                       {key
//                     .replace(/([A-Z])/g, " $1")
//                     .trim()
//                     .replace(/^(\w+)/, "$1's")}
//                   </label>
//                   <select
//                     id={key}
//                     name={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     className=" appearance-none  border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                   >
//                     <option value="">{`Select ${key.replace(
//                       /([A-Z])/g,
//                       " $1"
//                     )}`}</option>
//                     {optionsForSelectInput[key].map((range, index) => (
//                       <option key={index} value={range}>
//                         {range}
//                       </option>
//                     ))}
//                   </select>
//                   {errors[key] && (
//                     <p className="text-[#ffdd00] text-xs mt-1">{errors[key]}</p>
//                   )}
//                 </div>
//               );
//             }

//             return (
//               <div className="flex flex-col bg-white p-5 rounded-xl " key={key}>
//                 <label
//                   htmlFor={key}
//                   className="text-sm font-medium text-black mb-1"
//                 >
//                   {key
//                     .replace(/([A-Z])/g, " $1")
//                     .trim()
//                     .replace(/^(\w+)/, "$1's")}
//                 </label>
//                 <input
//                   type={
//                     key === "FatherContactNumber" ||
//                     key === "MotherContactNumber"
//                       ? "number"
//                       : "text"
//                   }
//                   id={key}
//                   name={key}
//                   value={formData[key]}
//                   onChange={handleChange}
//                   placeholder={`Enter${key.replace(/([A-Z])/g, " $1")}`}
//                   className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                 />

//                 {errors[key] && (
//                   <p className="text-[#ffdd00] text-xs mt-1">{errors[key]}</p>
//                 )}
//               </div>
//             );
//           })}

//           {showReloading && (
//             <div className="flex justify-center items-center">
//               <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
//             </div>
//           )}

//           <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
//             <button
//               onClick={() => navigate("/registration/educationalDetailsForm")}
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

//           {/* {submitMessage && (
//             <p
//               className={`text-sm text-center mt-4 ${
//                 submitMessage.includes("successfully")
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//             >
//               {submitMessage}
//             </p>
//           )} */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FamilyDetails;


















// src/components/FamilyDetails.js
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFamilyDetails,
  submitFamilyDetails,
  updateFamilyDetails,
} from "../../redux/slices/familyDetailsSlice";
import Spinner from "../../api/Spinner";
import { ArrowRight, ArrowLeft, AlertCircle, Users, Briefcase, DollarSign, Phone } from "lucide-react";

const FamilyDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;

  const dispatch = useDispatch();
  const { formData, dataExist, submitMessage, loading, error } = useSelector(
    (state) => state.familyDetails
  );

  const [checkUrl, setCheckUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [familyFormSubmit, setFamilyFormSubmit] = useState(false);
  const [showReloading, setShowReloading] = useState(false);
  const phoneRegex = /^[0-9]{10}$/;

  const optionsForSelectInput = {
    FamilyIncome: [
      "Less than 1 Lakh",
      "1 Lakh - 5 Lakhs",
      "5 Lakhs - 10 Lakhs",
      "10 Lakhs - 20 Lakhs",
      "More than 20 Lakhs",
    ],
    FatherOccupation: [
      "Engineer",
      "Doctor",
      "Teacher",
      "Businessman",
      "Farmer",
      "Lawyer",
      "Accountant",
      "Driver",
      "Police Officer",
      "Soldier",
      "Other",
    ],
    MotherOccupation: [
      "Teacher",
      "Homemaker",
      "Nurse",
      "Doctor",
      "Businesswoman",
      "Engineer",
      "Accountant",
      "Clerk",
      "Farmer",
      "Tailor",
      "Other",
    ],
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "MotherContactNumber" || name === "FatherContactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    dispatch(
      updateFamilyDetails({
        [name]: value,
      })
    );

    if (name === "FatherContactNumber") {
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.replace(
            /([A-Z])/g,
            " $1"
          )} must be a valid 10-digit number`,
        }));
        return;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: value.trim()
        ? ""
        : `${name.replace(/([A-Z])/g, " $1")} is required`,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    [
      "FatherName",
      "FatherContactNumber",
      "FatherOccupation",
      "MotherName",
      "FamilyIncome",
    ].forEach((key) => {
      const value = formData[key]?.trim();

      if (!value) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      } else if (
        (key === "FatherContactNumber" || key === "MotherContactNumber") &&
        !phoneRegex.test(value)
      ) {
        newErrors[key] = `${key.replace(
          /([A-Z])/g,
          " $1"
        )} must be a valid 10-digit number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setShowReloading(true);
    try {
      if (validateForm()) {
        const result = await dispatch(
          submitFamilyDetails({
            familyFormData: formData,
            familyDataExist: dataExist,
            setFamilyFormSubmit,
          })
        ).unwrap();

        if (result) {
          navigate("/registration/payment");
        }
      }
    } catch (error) {
      console.log("error  ", error);
    } finally {
      setShowReloading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchFamilyDetails());
    setCheckUrl(pathLocation === "/familyDetailsForm");
  }, [dispatch, pathLocation]);

  const getFieldIcon = (key) => {
    const iconMap = {
      FatherName: <Users size={18} className="text-[#c61d23]" />,
      FatherContactNumber: <Phone size={18} className="text-[#c61d23]" />,
      FatherOccupation: <Briefcase size={18} className="text-[#c61d23]" />,
      MotherName: <Users size={18} className="text-[#c61d23]" />,
      MotherContactNumber: <Phone size={18} className="text-[#c61d23]" />,
      MotherOccupation: <Briefcase size={18} className="text-[#c61d23]" />,
      FamilyIncome: <DollarSign size={18} className="text-[#c61d23]" />,
    };
    return iconMap[key] || <Users size={18} className="text-[#c61d23]" />;
  };

  const renderSelectField = (key) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6" key={key}>
        <label htmlFor={key} className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          {getFieldIcon(key)}
          {key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .replace(/^(\w+)/, "$1's")}
        </label>
        <select
          id={key}
          name={key}
          value={formData[key] || ""}
          onChange={handleChange}
          className="w-full appearance-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all bg-white cursor-pointer"
        >
          <option value="">{`Select ${key.replace(/([A-Z])/g, " $1")}`}</option>
          {optionsForSelectInput[key].map((range, index) => (
            <option key={index} value={range} className="bg-white text-gray-900">
              {range}
            </option>
          ))}
        </select>
        {errors[key] && (
          <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
            <AlertCircle size={14} />
            {errors[key]}
          </div>
        )}
      </div>
    );
  };

  const renderInputField = (key) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6" key={key}>
        <label htmlFor={key} className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          {getFieldIcon(key)}
          {key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .replace(/^(\w+)/, "$1's")}
        </label>
        <input
          type={
            key === "FatherContactNumber" || key === "MotherContactNumber"
              ? "tel"
              : "text"
          }
          id={key}
          name={key}
          value={formData[key] || ""}
          onChange={handleChange}
          placeholder={`Enter ${key
  .replace(/([A-Z])/g, " $1")
  .trim()
  .replace(/\b\w/g, c => c.toUpperCase())
}`}

          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#c61d23] focus:border-transparent focus:outline-none transition-all"
          maxLength={key === "FatherContactNumber" || key === "MotherContactNumber" ? 10 : undefined}
        />

        {errors[key] && (
          <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
            <AlertCircle size={14} />
            {errors[key]}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Family Details
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Parent information</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Final Step</h2>
              <div className="text-sm text-gray-600">Family Information</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>

          {/* Form Container */}
          <form autoComplete="off" className="flex flex-col gap-5" onSubmit={onSubmit}>
            {/* Father's Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-gradient-to-r from-[#c61d23] to-[#ffdd00] rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Father's Details</h3>
              </div>
              
              {Object.keys(formData).map((key) => {
                if (key.startsWith("Father")) {
                  return key === "FatherOccupation"
                    ? renderSelectField(key)
                    : renderInputField(key);
                }
                return null;
              })}
            </div>

            {/* Mother's Section */}
            <div className="space-y-5 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-gradient-to-r from-[#c61d23] to-[#ffdd00] rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Mother's Details</h3>
              </div>
              
              {Object.keys(formData).map((key) => {
                if (key.startsWith("Mother")) {
                  return key === "MotherOccupation"
                    ? renderSelectField(key)
                    : renderInputField(key);
                }
                return null;
              })}
            </div>

            {/* Family Income Section */}
            <div className="space-y-5 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-gradient-to-r from-[#c61d23] to-[#ffdd00] rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
              </div>
              
              {Object.keys(formData).map((key) => {
                if (key === "FamilyIncome") {
                  return renderSelectField(key);
                }
                return null;
              })}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-[#fff5e6] to-[#ffedd5] border border-[#ffc107]/30 rounded-2xl p-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">👨‍👩‍👧</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Family Information</h3>
                  <p className="text-sm text-gray-700">
                    Please provide accurate details about your parents and family income. This information helps us understand your background better.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}

            {/* {submitMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitMessage}</p>
              </div>
            )} */}

            {/* Loading State */}
            {showReloading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-[#c61d23]"></div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate("/registration/educationalDetailsForm")}
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
                <span>{showReloading ? "Submitting..." : "Continue to Payment"}</span>
                {!showReloading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetails;