import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateExistingUserDetails } from "../../redux/slices/existingStudentSlice";

// import ScholarsDenLogo from "../../assets/scholarsDenLogo.png";

export default function SignupRight() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.existingStudentDetails);

  // const { userData } = useSelector((state) => state.userDetails);

  // Regex pattern for phone number validation (+91 followed by 10 digits)
  const phoneRegex = /^\+91[0-9]{10}$/;
  // const [loading, setLoading] = useState(false);
  const [codeVerified, setCodeVerified] = useState(true);
  // const [codeVerified, setCodeVerified] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [codeEntered, setCodeEntered] = useState(false);

  const [showReloading, setShowReloading] = useState(false);

  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(30); // initial cooldown in seconds
  const [cooldownActive, setCooldownActive] = useState(false);

  // State hooks
  const [formData, setFormData] = useState({
    contactNumber: "",
  });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    contactNumber: "",
  });

  const handleLogout = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  useEffect(() => {
    handleLogout();
  }, []);

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  // name: "",
  // email: "",
  // contactNumber: "",
  // password: "",

  const [showCodeBox, setShowCodeBox] = useState(false);

  const [submitMessage, setSubmitMessage] = useState("");

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Field validation
    ["contactNumber"].forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `Contact Number is required`;
        isValid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    if (!phoneRegex.test(`+91${formData.contactNumber}`)) {
      formErrors.contactNumber =
        "Contact Number must be a valid 10-digit number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };
  const checkVerificationCode = async () => {
    try {
      console.log("verifyNumber", formData.contactNumber);
      const response = await axios.post("/students/verifyNumber", {
        mobileNumber: formData.contactNumber,
        otp: code,
      });

      console.log("response", response);
      if (response.status === 200) {
        // setSubmitMessage("Contact number verified successfully!");

        console.log("ITs working ,,,,,,,,,,,,,");
        setCodeVerified(true);
        setShowCodeBox(false);
      }
      console.log("ITs working ,,,,,,,,,,,,,");

      console.log("codeVerified form checkVerification", codeVerified);

      setCodeVerified(true);
      setShowCodeBox(false);
      return true;
    } catch (error) {
      setSubmitMessage("Error verifying Contact Number number");
      console.log("Error verifying Contact Number number", error);
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();


    try {
      setIsSubmittingForm(true);

      // let codeChecked = await checkVerificationCode();
      let codeChecked = true;

      console.log("codeChecked", codeChecked);
      // if (codeChecked === false) {
      //   setShowCodeBox(false);

      //   // Remove OTP
      //   setCodeVerified(false);
      //   setSubmitMessage("Please Verify Your Contact Number Number");
      //   setIsSubmittingForm(false); // ⬅️ reset if verification fails
      //   return;
      // }
      if (!codeChecked) {
        setCodeVerified(false);
        setCodeEntered(false);
        setSubmitMessage("Invalid OTP. Please try again.");
        setCode(""); // Clear previous code
        setSubmittingOtp(false);
        return;
      }
      setSubmitMessage("");

      if (validateForm()) {
        try {
          console.log("Response beforew auth", formData);
          const response = await axios.post("/auth/student_signup", formData);

          console.log("response.message", response.data.message);

          if (response.data.message === "Student Already Exist") {
            console.log("response student data", response.data.student);

            dispatch(
              updateExistingUserDetails({ userData: response.data.student })
            );

            navigate("/registration/existingStudent");
          } else if (
            response.data.message === "Student Exist in Enquiry Form"
          ) {
            console.log(
              "responseData student from enquiry form",
              response.data.student
            );

            dispatch(
              updateExistingUserDetails({ userData: response.data.student })
            );

            navigate("/registration/enquiryData");
          } else {
            console.log("response", response);
            setSubmitMessage("Form submitted successfully!");
            // document.cookie = `token=${response.data.token}`;
            navigate("/registration/basicDetailsForm");
          }
          setSubmitMessage("Form submitted successfully!");
          document.cookie = `token=${response.data.token}`;
        } catch (error) {
          console.log("Error submitting form 2", error);
          setSubmitMessage(error.response.data);

          console.error("Error submitting form", error);
        }
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const verifyPhoneNo = async () => {
    // setLoading(true);
    if (formData.contactNumber.length != 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactNumber: `The length must be exactly 10.`,
      }));
      return;
    }
    if (cooldownActive) return;

    try {
      setShowReloading(true);

      const response = await axios.post("/students/sendVerification", {
        mobileNumber: `${formData.contactNumber}`,
      });
      if (response.status === 200) {
        setShowCodeBox(true);
        setSubmitMessage("OTP sent successfully");

        const nextCooldown = 30 * Math.pow(2, resendAttempts); // exponential backoff
        setResendCooldown(nextCooldown);
        setCooldownActive(true);
        setResendAttempts((prev) => prev + 1);
      }
    } catch (error) {
      setSubmitMessage("Error verifying Contact Number number");
      console.log("Error verifying Contact Number number", error);
    } finally {
      // setLoading(false);
      setShowReloading(false);
      setCode("");
    }
  };

  const handleOTPChange = async (e) => {
    if (e.target.value.length <= 4) {
      setCode(e.target.value);
    }

    if (e.target.value.length >= 4) {
      setCodeEntered(true);
      setSubmitMessage("");
      return;
    } else {
      setCodeEntered(false);
    }

    console.log("e.target.value", e.target.value.length);
  };

  useEffect(() => {
    let timer;
    if (cooldownActive && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setCooldownActive(false);
    }

    return () => clearInterval(timer);
  }, [cooldownActive, resendCooldown]);

  return (
    <div className=" w-full bg-[#fdf5f6] flex items-center justify-center px-4 py-1">
      {/* {isSubmittingForm && showLoadingPage && <LoadingPage />} */}
      {/* {!isSubmittingForm && loading && <Spinner />} */}

      {/* {!loading && !showLoadingPage && ( */}
      <form
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-lg space-y-6 text-black "
        onSubmit={onSubmit}
      >
        <h2 className="text-center text-2xl md:text-3xl font-semibold">
          Contact Number Verification
        </h2>

        {/* contactNumber Field */}
        <div className="space-y-4">
          <label
            htmlFor="fatherContactNumber"
            className="block text-sm font-medium"
          >
            *Contact Number (Parent)
          </label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="number"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter Contact Number"
              className="border-b-2 py-2 focus:outline-none w-full px-2"
              style={{ backgroundColor: "#fdf5f6" }}
              maxLength={10}
              pattern="[0-9]{10}"
              inputMode="numeric"
            />
            {/* {!showCodeBox && !codeVerified && (
              <button
                type="button"
                onClick={verifyPhoneNo}
                className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold "
              >
                Send OTP
              </button>
            )} */}
          </div>

          {errors?.contactNumber && (
            <p className="text-[#ffdd00] mt-1">{errors.contactNumber}</p>
          )}
        </div>

        {showCodeBox && (
          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium">
              *Verification Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={code}
              onChange={handleOTPChange}
              placeholder="Enter OTP"
              className="w-full bg-white/5 text-black border border-white px-4 py-2 focus:outline-none placeholder-gray-400"
            />
          </div>
        )}
        {showReloading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <p className={`text-sm text-center text-[#ffdd00]`}>
            {submitMessage}
          </p>
        )}

        {/* {showCodeBox && ( */}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-xl transition-all disabled:bg-yellow-800"
          // disabled={!codeEntered}
        >
          Next
        </button>
        {/* )} */}

        {showCodeBox && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
            <p className="text-sm text-gray-600">Didn't receive OTP?</p>
            <button
              type="button"
              onClick={verifyPhoneNo}
              disabled={cooldownActive}
              className={`ml-2 px-3 py-2 text-sm font-semibold rounded-md ${
                cooldownActive
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              {cooldownActive ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
