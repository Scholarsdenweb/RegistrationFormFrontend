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
import FormHeader from "../LoginSugnup/FormHeader";
import PageNumberComponent from "../PageNumberComponent";

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

    console.log("name and value from handleChange", name , value)

    if (name === "MotherContactNumber" || name === "FatherContactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    console.log("handle change function is working", name, value);

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

    // Object.keys(formData)
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
          navigate("/registration/selfieCapture");
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

  useEffect(() => {
    console.log("Data from useEffect", formData);
  }, [formData]);

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {/* {loading && <Spinner />} */}

      <div className="flex flex-col gap-6 max-w-screen-md mx-auto">
        <div className="text-3xl text-white text-center transform hover:-translate-y-1 transition duration-200">
          {/* <FormHeader /> */}
          S.DAT Registration
        </div>

        {/* <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
          Registration Form for SDAT
        </h1> */}
        <form
          autoComplete="off"
          className="flex flex-col gap-4  w-full"
          onSubmit={onSubmit}
        >
          {/* <h1
            className="text-2xl font-bold text-center "
            style={{ color: "#c61d23" }}
          >
            Family Details Form
          </h1> */}

          <PageNumberComponent />

          {Object.keys(formData).map((key) => {
            if (
              key === "FamilyIncome" ||
              key === "FatherOccupation" ||
              key === "MotherOccupation"
            ) {
              return (
                <div className="flex flex-col w-full" key={key}>
                  <label
                    htmlFor={key}
                    className="text-sm font-medium text-white mb-1"
                  >
                      {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/^(\w+)/, "$1's")}
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="">{`Select ${key.replace(
                      /([A-Z])/g,
                      " $1"
                    )}`}</option>
                    {optionsForSelectInput[key].map((range, index) => (
                      <option key={index} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  {errors[key] && (
                    <p className="text-[#ffdd00] text-xs mt-1">{errors[key]}</p>
                  )}
                </div>
              );
            }

            return (
              <div className="flex flex-col" key={key}>
                <label
                  htmlFor={key}
                  className="text-sm font-medium text-white mb-1"
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/^(\w+)/, "$1's")}
                </label>
                <input
                  type={
                    key === "FatherContactNumber" ||
                    key === "MotherContactNumber"
                      ? "number"
                      : "text"
                  }
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter${key.replace(/([A-Z])/g, " $1")}`}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />

                {errors[key] && (
                  <p className="text-[#ffdd00] text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            );
          })}

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

          {/* {submitMessage && (
            <p
              className={`text-sm text-center mt-4 ${
                submitMessage.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {submitMessage}
            </p>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default FamilyDetails;
