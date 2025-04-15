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
import Sidebar from "../Sidebar";
import Navbar from "./Navbar";
import {
  fetchFamilyDetails,
  submitFamilyDetails,
  updateFamilyDetails,
} from "../../redux/slices/familyDetailsSlice";
import FormHeader from "../LoginSugnup/FormHeader";
import { fetchBatchDetails } from "../../redux/slices/batchDetailsSlice";
import PageNumberComponent from "../PageNumberComponent";

const EducationalDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;

  const [educationalErrors, setEducationalErrors] = useState({});

  const [showReloading, setShowReloading] = useState(false);
  const [familyErrors, setFamilyErrors] = useState({});
  const [educationalFormSubmit, setEducationalFormSubmit] = useState(false);
  const [familyFormSubmit, setFamilyFormSubmit] = useState(false);

  const [yearList, setYearList] = useState([]);

  // Redux state selectors
  const { formData, boards, loading, dataExist } = useSelector(
    (state) => state.educationalDetails
  );

  // const { formData: familyFormData, dataExist: familyDataExist } = useSelector(
  //   (state) => state.familyDetails
  // );

  const { userData } = useSelector((state) => state.userDetails);

  const { formData: batchRelatedDetails } = useSelector(
    (state) => state.batchDetails
  );

  // Component state
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkUrl, setCheckUrl] = useState(false);
  const [errors, setErrors] = useState({});

  const incomeRanges = [
    "Less than 1 Lakh",
    "1 Lakh - 5 Lakhs",
    "5 Lakhs - 10 Lakhs",
    "10 Lakhs - 20 Lakhs",
    "More than 20 Lakhs",
  ];

  const phoneRegex = /^[0-9]{10}$/;

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
    console.log("borards", boards);
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

  // const validateForm = (formData, additionalValidations = {}) => {
  //   const formErrors = {};
  //   let isValid = true;

  //   Object.keys(formData).forEach((key) => {
  //     const value = formData[key]?.toString().trim();

  //     console.log("value", value);
  //     console.log("key", key);

  //     if (!value) {
  //       formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
  //       isValid = false;
  //     } else if (additionalValidations[key] && !additionalValidations[key](value)) {
  //       formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is invalid`;
  //       isValid = false;
  //     }
  //   });

  //   console.log("formErrors", formErrors);
  //   console.log("errors", errors);

  //   setErrors(()=>formErrors);
  //   return isValid;
  // };

  const validateForm = (
    formData,
    setErrorState,
    additionalValidations = {}
  ) => {
    const formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
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

      if (key === "Percentage") {
        const checkValueGreaterThenLimit = value > 50;

        if (!checkValueGreaterThenLimit) {
          formErrors[key] = `Percentage must be greater then 50`;
          isValid = false;
        }
      }
    });

    setErrorState(formErrors);
    return isValid;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const isEducationalValid = validateForm(
  //     formData,
  //     setEducationalErrors
  //   );
  //   // const isFamilyValid = validateForm(familyFormData, setFamilyErrors, {
  //   //   FatherContactNumber: (value) => phoneRegex.test(value),
  //   //   MotherContactNumber: (value) => phoneRegex.test(value),
  //   // });

  //   if (isEducationalValid) {
  //     try {
  //       const url = educationalDataExist
  //         ? "/form/educationalDetails/updateForm"
  //         : "/form/educationalDetails/addForm";
  //       const method = educationalDataExist ? axios.patch : axios.post;

  //       await method(url, formData);

  //       setSubmitMessage(
  //         educationalDataExist
  //           ? "Educational details updated successfully!"
  //           : "Educational details submitted successfully!"
  //       );

  //       setEducationalFormSubmit(true);
  //     } catch (error) {
  //       console.error("Error submitting form:", error);
  //       setSubmitMessage("Error submitting form. Please try again.");
  //     }
  //   }

  //   if (validateForm()) {
  //     dispatch(
  //       submitEducationalDetails(formData, dataExist, setEducationalFormSubmit)
  //     );
  //     if (educationalFormSubmit) {
  //       navigate("/registration/familyForm");
  //     }
  //   }

  //   // if (isFamilyValid) {
  //   //   console.log("familyFormData", familyFormData);
  //   //   dispatch(
  //   //     submitFamilyDetails({
  //   //       familyFormData,
  //   //       familyDataExist,
  //   //       setFamilyFormSubmit,
  //   //     })
  //   //   );

  //   //   //   // Family details submission logic
  //   // }
  //   if (educationalFormSubmit) {
  //     console.log("DAta submited successfully");
  //     navigate("/registration/familyDetailsForm");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowReloading(true);

    const isEducationalValid = validateForm(formData, setEducationalErrors);

    if (isEducationalValid) {
      try {
       const response =  dispatch(updateEducationalDetails({ "Class": dataForClassInput()[0] }));
        console.log("response", response);

        console.log("FormData Before Reqyuest", formData);
        const result = await dispatch(
          submitEducationalDetails({
            educationalFormData: formData,
            educationalDataExist: dataExist,
            setEducationalFormSubmit,
          })
        ).unwrap();

        console.log("Submission result:", result);
        if (result) {
          navigate("/registration/familyDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting educational details:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      }finally{
        setShowReloading(false);
      }
    }
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

  const renderInputField = (
    key,
    value,
    handleChange,
    additionalProps = {},
    errorsState
  ) => {
    const isPercentage = key === "Percentage";

    return (
      <div className="flex flex-col px-2" key={key}>
        <label htmlFor={key} className="text-sm font-medium text-white mb-1">
          {key.replace(/([A-Z])/g, " $1")} {isPercentage && " Obtained"}
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
              // Allow only numbers and up to two decimal places, block 'e', '+', '-'
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
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none w-full"
          step="0.01" // Optional: allows for decimal precision up to 2 decimal places
          {...additionalProps}
        />

        {errorsState[key] && (
          <p className="text-[#ffdd00] text-xs mt-1">{errorsState[key]}</p>
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

  // const dataForClassInput = () => {
  //   const data = batchRelatedDetails?.classForAdmission;

  //   console.log("Data for classInput", batchRelatedDetails);
  //   console.log("Data for classInput", data);

  // }

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
      const index = romanClassLevels.indexOf(data);
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
      <div className="flex flex-col px-2" key={key}>
        <label htmlFor={key} className="text-sm font-medium text-white mb-1">
          {console.log("key", key)}
          {key.replace(/([A-Z])/g, " $1")}
        </label>
        <select
          name={key}
          value={value}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none w-full"
        >
          <option value="" disabled>{`Select ${key.replace(
            /([A-Z])/g,
            " $1"
          )}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorsState[key] && (
          <p className="text-[#ffdd00] text-xs mt-1">{errorsState[key]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {/* {loading && <Spinner />} */}

      <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
        <div className="text-3xl text-center text-white">
          {/* <FormHeader /> */}

          S.DAT Registration
        </div>

        {/* <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
          Enquiry Form
        </h1> */}

        <PageNumberComponent />

        <form
          autoComplete="off"
          className="flex flex-col gap-4  w-full"
          onSubmit={handleSubmit}
        >
          {/* <div className="flex flex-wrap"> */}
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
          {/* </div> */}

          {showReloading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}


          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="w-full sm:w-1/3 border bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black  py-2 px-4 "
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
        </form>
      </div>
    </div>
  );
};

export default EducationalDetailsForm;

// return (
//   <div
//     className="w-full h-screen overflow-auto  "
//     style={{ backgroundColor: "#c61d23" }}
//   >
//        <div className="grid grid-cols-7 ">
//       <div className="col-span-1">
//         <Sidebar />
//       </div>
//       <div className="flex flex-col col-span-6 ">
//                   <Navbar />

//         <div className="px-9 py-4 mb-3 mr-5 bg-gray-200 rounded-3xl  h-full overflow-auto">
//           <h3 className="text-2xl font-extrabold">User Details</h3>

//           <form
//             className="bg-white shadow-lg p-4 rounded-2xl"
//             onSubmit={handleSubmit}
//           >
//             <h1 className="text-xl font-bold text-white bg-red-600 p-2 rounded-t-2xl">
//               Educational Details
//             </h1>
//             <div className="flex flex-wrap">
//               {Object.keys(educationalFormData).map((key) =>
//                 key === "Class" || key === "YearOfPassing" || key === "Board"
//                   ? renderSelectField(
//                       key,
//                       educationalFormData[key],
//                       (e) =>
//                         handleChange(
//                           e,
//                           updateEducationalDetails,
//                           educationalFormData
//                         ),
//                       key === "YearOfPassing"
//                         ? [2024]
//                         : key === "Class"
//                         ? Array.from({ length: 7 }, (_, i) => i + 6).map(
//                             (classNum) => convertToRoman(classNum)
//                           )
//                         : boards
//                         ? boards.map((board) => board.name)
//                         : [],
//                       educationalErrors
//                     )
//                   : renderInputField(
//                       key,
//                       educationalFormData[key],
//                       (e) =>
//                         handleChange(
//                           e,
//                           updateEducationalDetails,
//                           educationalFormData
//                         ),
//                       {},
//                       educationalErrors
//                     )
//               )}
//             </div>

//             <h1 className="text-xl font-bold text-white bg-red-600 p-2 rounded-t-2xl mt-4">
//               Family Details
//             </h1>
//             <div className="flex flex-wrap">
//               {Object.keys(familyFormData).map((key) =>
//                 key === "FamilyIncome"
//                   ? renderSelectField(
//                       key,
//                       familyFormData[key],
//                       (e) =>
//                         handleChange(e, updateFamilyDetails, familyFormData),
//                       incomeRanges,
//                       familyErrors
//                     )
//                   : renderInputField(
//                       key,
//                       familyFormData[key],
//                       (e) =>
//                         handleChange(e, updateFamilyDetails, familyFormData),
//                       {},
//                       familyErrors
//                     )
//               )}
//             </div>

//             {submitMessage && (
//               <p
//                 className={`text-sm text-center mt-4 ${
//                   submitMessage.includes("successfully")
//                     ? "text-green-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 {submitMessage}
//               </p>
//             )}
//           </form>
//           <div className="flex justify-end mt-4">
//             {pathLocation === "/batchDetailsForm" && (
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
//               >
//                 Previous
//               </button>
//             )}
//             <button
//               onClick={handleSubmit}
//               className={` bg-red-600 hover:bg-red-700 text-white py-2 px-9 rounded-full`}
//             >
//               {checkUrl ? "Next" : "Update"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );
