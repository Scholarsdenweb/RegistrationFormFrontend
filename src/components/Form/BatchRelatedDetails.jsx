import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBatchDetails,
  updateBatchDetails,
} from "../../redux/slices/batchDetailsSlice"; // Adjust the path as necessary
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../api/Spinner";
import FormHeader from "../LoginSugnup/FormHeader";
import PageNumberComponent from "../PageNumberComponent";

const BatchRelatedDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;
  const [program, setProgram] = useState(""); // For dynamic courses

  const dispatch = useDispatch();

  const { formData, dataExist, loading, error } = useSelector(
    (state) => state.batchDetails
  );

  const [showReloading, setShowReloading] = useState(false);

  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [checkUrl, setCheckUrl] = useState("");

  useEffect(() => {
    dispatch(fetchBatchDetails());
    setCheckUrl(pathLocation === "/batchDetailsForm");
  }, [dispatch, pathLocation]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    console.log("FormData", formData);

    Object.keys(formData).forEach((key) => {
      if (!(key === "program" && formData.classForAdmission <= 10)) {
        if (!formData[key]?.toString().trim()) {
          formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
          isValid = false;
        }
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateBatchDetails({ [name]: value }));

    if (name === "program") {
      setProgram(value); // Update program selection
    }

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setShowReloading(true);

    if (validateForm()) {
      try {
        const url = dataExist
          ? "/form/batchRelatedDetails/updateForm"
          : "/form/batchRelatedDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;

        await method(url, formData);

        setSubmitMessage(
          dataExist
            ? "Batch related details updated successfully!"
            : "Batch related details submitted successfully!"
        );

        navigate("/registration/educationalDetailsForm");
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      } finally {
        setShowReloading(false);
      }
    }
    setShowReloading(false);
  };

  useEffect(() => {
    if (document.cookie === "") {
      navigate("/");
      return;
    }
    console.log("Running  ");
    setProgram(formData.program || "");
  }, [dataExist]);

  const programOptions = {
    Foundation: ["VI", "VII", "VIII", "IX", "X"],
    "JEE(Main & Adv)": [
      "XI Engineering",
      "XII Engineering",
      "XII Passed Engineering",
    ],
    "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
  };

  // const programOptions = {
  //   "Foundation (VI - X)": ["VI", "VII", "VIII", "IX", "X"],
  //   "Engineering (XI - XII)": [
  //     "XI",
  //     "XII",
  //     "XII Passed",
  //   ],
  //   "Medical (XI -XII)": ["XI", "XII", "XII Passed"],
  // };

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

  let subjectOptions =
    convertToNumber(formData.classForAdmission) >= 6 &&
    convertToNumber(formData.classForAdmission) <= 10
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

  // Fetch initial form data
  useEffect(() => {
    dispatch(fetchBatchDetails());
    setCheckUrl(pathLocation === "/batchDetailsForm");
  }, []);

  useEffect(() => {}, []);

  // Validate form fields

  useEffect(() => {
    console.log("formData form batchDetails ", formData);
  }, [formData]);

  // Handle form submission

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {/* {loading && <Spinner />} */}

      <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
        <div className="text-3xl text-white text-center transform hover:-translate-y-1 transition duration-200">
          {/* <FormHeader /> */}
          S.DAT Registration
        </div>

        {/* <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
          SDAT Registration Form
        </h1> */}

        <PageNumberComponent />

        <form
          autoComplete="off"
          className="flex flex-col gap-4  w-full"
          onSubmit={onSubmit}
        >
          {/* Subject Combination */}

          <div className="flex flex-col">
            <label
              htmlFor="program"
              className="text-sm font-medium text-white mb-1"
            >
              Program
            </label>
            <select
              id="program"
              name="program"
              value={formData?.program || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option disabled value="">
                Select Program
              </option>

              {Object.keys(programOptions).map((program) => (
                <option
                  className="bg-white text-black"
                  key={program}
                  value={program}
                >
                  {program === "Foundation"
                    ? `${program} (VI - X)`
                    : `${program} (XI - XII Passed)`}
                </option>
              ))}
            </select>
            {errors.program && (
              <p className="text-[#ffdd00] text-xs mt-1">{errors.program}</p>
            )}
          </div>

          {/* Class  for admission*/}
          <div className="flex flex-col">
            <label
              htmlFor="classForAdmission"
              className="text-sm font-medium text-white mb-1"
            >
              Class
            </label>

            {console.log(
              "formData.classForAdmissson",
              formData.classForAdmission,
              typeof formData.classForAdmission
            )}
            <select
              id="classForAdmission"
              name="classForAdmission"
              value={formData?.classForAdmission}
              onChange={handleChange}
              placeholder="Select Class for adminssion"
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option className="" disabled value="">
                Select Class for admission
              </option>

              {console.log("program", program)}
              {program &&
                programOptions[program]?.map((course) => (
                  <option
                    className="bg-white text-black"
                    key={course}
                    value={course}
                  >
                    {course}
                  </option>
                ))}
            </select>
            {errors.classForAdmission && (
              <p className="text-[#ffdd00] text-xs mt-1">
                {errors.classForAdmission}
              </p>
            )}
          </div>

          {showReloading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}

          {/* Preferred Batch */}
          {/* <div className="flex flex-col">
            <label
              htmlFor="preferredBatch"
              className="text-sm font-medium text-white mb-1"
            >
              Preferred Batch
            </label>
            <select
              id="preferredBatch"
              name="preferredBatch"
              value={formData.preferredBatch || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option disabled value="">
                Select Preferred Batch
              </option>
              {batchOptions.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
            {errors.preferredBatch && (
              <p className="text-red-500 text-xs mt-1">
                {errors.preferredBatch}
              </p>
            )}
          </div> */}

          {/* Submit and Previous Buttons */}

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

  // return (
  //   <div
  //     className={`${
  //       pathLocation === "/batchDetailsForm" && "min-h-screen"
  //     } flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50`}
  //   >
  //     {loading ? (
  //       <Spinner />
  //     ) : (
  //       <form
  //         className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4 space-y-6"
  //         onSubmit={onSubmit}
  //       >
  //         <h1 className="text-2xl font-bold text-center " style={{ color: "#c61d23" }} >
  //           Batch Related Details Form
  //         </h1>

  //         {/* Class  for admission*/}
  //         <div className="flex flex-col">
  //           <label
  //             htmlFor="classForAdmission"
  //             className="text-sm font-medium text-white mb-1"
  //           >
  //             Class
  //           </label>
  //           <select
  //             id="classForAdmission"
  //             name="classForAdmission"
  //             value={formData?.classForAdmission || ""}
  //             onChange={handleChange}
  //             placeholder="Select Class for adminssion"
  //             className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //           >
  //             <option className="" disabled value="">
  //               Select Class for admission
  //             </option>
  //             {Array.from({ length: 7 }, (_, i) => i + 6).map((classNum) => (
  //               <option key={classNum} value={convertToRoman(classNum)}>
  //                 {convertToRoman(classNum)}
  //               </option>
  //             ))}
  //           </select>
  //           {errors.classForAdmission && (
  //             <p className="text-red-500 text-xs mt-1">
  //               {errors.classForAdmission}
  //             </p>
  //           )}
  //         </div>

  //         {/* Preferred Batch */}
  //         <div className="flex flex-col">
  //           <label
  //             htmlFor="preferredBatch"
  //             className="text-sm font-medium text-white mb-1"
  //           >
  //             Preferred Batch
  //           </label>
  //           <select
  //             id="preferredBatch"
  //             name="preferredBatch"
  //             value={formData.preferredBatch || ""}
  //             onChange={handleChange}
  //             className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //           >
  //             <option disabled value="">
  //               Select Preferred Batch
  //             </option>
  //             {batchOptions.map((batch, index) => (
  //               <option key={index} value={batch}>
  //                 {batch}
  //               </option>
  //             ))}
  //           </select>
  //           {errors.preferredBatch && (
  //             <p className="text-red-500 text-xs mt-1">
  //               {errors.preferredBatch}
  //             </p>
  //           )}
  //         </div>

  //         {/* Subject Combination */}
  //         {
  //           <div className="flex flex-col">
  //             <label
  //               htmlFor="subjectCombination"
  //               className="text-sm font-medium text-white mb-1"
  //             >
  //               Subject Combination
  //             </label>
  //             <select
  //               id="subjectCombination"
  //               name="subjectCombination"
  //               value={formData.subjectCombination || ""}
  //               onChange={handleChange}
  //               className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //             >
  //               <option disabled value="">
  //                 Select Subject Combination
  //               </option>
  //               {console.log("subjectOptions", subjectOptions)}

  //               {subjectOptions &&
  //                 subjectOptions.map((subject, index) => (
  //                   <option key={index} value={subject}>
  //                     {subject}
  //                   </option>
  //                 ))}
  //             </select>
  //             {errors.subjectCombination && (
  //               <p className="text-red-500 text-xs mt-1">
  //                 {errors.subjectCombination}
  //               </p>
  //             )}
  //           </div>
  //         }

  //         {/* Submit and Previous Buttons */}
  //         <div className="flex justify-between items-center">
  //           {pathLocation === "/batchDetailsForm" && (
  //             <button
  //               type="button"
  //               onClick={() => navigate(-1)}
  //               className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
  //             >
  //               Previous
  //             </button>
  //           )}
  //           <button
  //             type="submit"
  //             className={` ${
  //               pathLocation === "/batchDetailsForm" ? "w-2/3" : "w-full"
  //             }  hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200 ml-2`}

  //             style={{ backgroundColor: "#c61d23" }}
  //           >
  //             {checkUrl ? "Next" : "Update"}
  //           </button>
  //         </div>

  //         {/* Submit Message */}
  //         {submitMessage && (
  //           <p
  //             className={`text-sm text-center mt-4 ${
  //               submitMessage === "Batch related details updated successfully!"
  //                 ? "text-green-500"
  //                 : "text-red-500"
  //             }`}
  //           >
  //             {submitMessage}
  //           </p>
  //         )}
  //       </form>
  //     )}
  //   </div>
  // );
};

export default BatchRelatedDetailsForm;
