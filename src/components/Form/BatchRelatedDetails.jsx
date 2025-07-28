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

    Object.keys(formData).forEach(async (key) => {
      if (!(key === "program" && formData.classForAdmission <= 10)) {
        if (!formData[key]?.toString().trim()) {
          formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
          isValid = false;
        }
      }

      if (key === "classForAdmission") {
        console.log("normalizeValue(value)", normalizeValue(formData[key]));

        const value = await normalizeValue(formData[key]);

        console.log("value ", value);
        console.log("key ", key);
        dispatch(updateBatchDetails({ key: value }));
      }
    });

    setErrors(formErrors);
    return isValid;
  };

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
    const parts = data.trim().split(/\s+/); // split into words
    const first = parts[0].replace(/(st|nd|rd|th)$/i, "").toUpperCase(); // remove suffix if any
    const rest = parts.slice(1).join(" "); // everything after the first word

    let roman;
    if (validRomans.has(first)) {
      roman = first;
    } else {
      const num = parseInt(first);
      roman = numberToRoman(num);
    }

    return rest ? `${roman} ${rest}` : roman;
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
    "Foundation": ["VI", "VII", "VIII", "IX", "X"],
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

  const programConverter = (value) => {
    console.log("value for programConverTer", value);
    if (value === "JEE(Main & Adv.)") return "JEE(Main & Adv)";
    return value;
    // setProgram(value);
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
    <div className="min-h-screen w-full bg-[#fdf5f6] px-2 md:px-8 py-2 overflow-auto">
      {/* {loading && <Spinner />} */}

      <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
        {/* <div className="text-3xl text-black text-center transform hover:-translate-y-1 transition duration-200">
          RISE Registration
        </div> */}
                      <div className="flex   "><FormHeader /></div>


        {/* <h1 className="text-3xl md:text-4xl font-semibold text-black text-center">
          SDAT Registration Form
        </h1> */}

        <PageNumberComponent />

        <form
          autoComplete="off"
          className="flex flex-col gap-4  w-full"
          onSubmit={onSubmit}
        >
          {/* Subject Combination */}

          <div className="flex flex-col bg-white p-5 rounded-xl" >
            <label
              htmlFor="program"
              className="text-sm font-medium text-black mb-1"
            >
              Select Program
            </label>
            <select
              id="program"
              name="program"
              value={programConverter(formData?.program || "")}
              onChange={handleChange}
              className="appearance-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
          <div className="flex flex-col bg-white p-5 rounded-xl">
            <label
              htmlFor="classForAdmission"
              className="text-sm font-medium text-black mb-1"
            >
              Register For
            </label>

            <select
              id="classForAdmission"
              name="classForAdmission"
              value={normalizeValue(formData?.classForAdmission)}
              onChange={handleChange}
              placeholder="Select Class for adminssion"
              className=" appearance-none  border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option selected value="">
                Select Class for admission
              </option>
              
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
            <div className="flex justify-center items-center ">
              <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}

          {/* Preferred Batch */}
          {/* <div className="flex flex-col">
            <label
              htmlFor="preferredBatch"
              className="text-sm font-medium text-black mb-1"
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
              onClick={() => navigate("/registration/basicDetailsForm")}
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

export default BatchRelatedDetailsForm;
