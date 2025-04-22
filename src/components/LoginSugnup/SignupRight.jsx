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
  const [codeVerified, setCodeVerified] = useState(true);
  // const [loading, setLoading] = useState(false);
  // const [codeVerified, setCodeVerified] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [showReloading, setShowReloading] = useState(false);
  // State hooks
  const [formData, setFormData] = useState({
    phone: "",
  });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    phone: "",
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
  // phone: "",
  // password: "",

  const [showCodeBox, setShowCodeBox] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
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
    ["phone"].forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    if (!phoneRegex.test(`+91${formData.phone}`)) {
      formErrors.phone = "Phone must be a valid 10-digit number";
      isValid = false;
    }

    console.log("CheckData", formErrors);
    console.log("isValid", isValid);

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmittingForm(true);

      // let codeChecked = await checkVerificationCode();

      // console.log("codeChecked", codeChecked);
      // if (codeChecked === false) {
      //   setShowCodeBox(false);

      //   // Remove OTP
      //   setCodeVerified(false);
      //   setSubmitMessage("Please Verify Your Phone Number");
      //   setIsSubmittingForm(false); // ⬅️ reset if verification fails
      //   return;
      // }

      setSubmitMessage("");
      console.log("Button Clicked");
      console.log("setSubmitMessage3", submitMessage);

      console.log(
        "validationForm , codeVerified",
        validateForm(),
        codeVerified
      );

      if (validateForm()) {
        try {
          console.log("Response", formData);
          const response = await axios.post("/auth/student_signup", formData);

          console.log("response.message", response.data.message);

          if (response.data.message === "Student Already Exist") {
            console.log("response student data", response.data.student);

            dispatch(updateExistingUserDetails({userData: response.data.student }));

            navigate("/registration/existingStudent");
          }
          else if(response.data.message === "Student Exist in Enquiry Form"){


            console.log("responseData student from enquiry form", response.data.student);
            
            dispatch(updateExistingUserDetails({userData: response.data.student }));

            navigate("/registration/enquiryData");
          }

          console.log("response", response);
          setSubmitMessage("Form submitted successfully!");
          document.cookie = `token=${response.data.token}`;
          // navigate("/registration/basicDetailsForm");
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
    if (formData.phone.length != 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: `The length must be exactly 10.`,
      }));
      return;
    }

    setShowReloading(true);

    try {
      setShowCodeBox(true);

      const response = await axios.post("/students/sendVerification", {
        mobileNumber: `${formData.phone}`,
      });
      if (response.status === 200) {
        setShowCodeBox(true);
        setSubmitMessage("OTP sent successfully");
      }
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
      console.log("Error verifying phone number", error);
    } finally {
      // setLoading(false);
      setShowReloading(false);
    }
  };

  const checkVerificationCode = async () => {
    try {
      const response = await axios.post("/students/verifyNumber", {
        mobileNumber: `${formData.phone}`,
        otp: code,
      });
      if (response.status === 200) {
        setSubmitMessage("Phone number verified successfully!");

        console.log("ITs working ,,,,,,,,,,,,,");
        setCodeVerified(true);
        setShowCodeBox(false);
      }
      console.log("ITs working ,,,,,,,,,,,,,");

      console.log("codeVerified form checkVerification", codeVerified);
      // setCodeVerified(true);
      // setShowCodeBox(false);
      return true;
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
      console.log("Error verifying phone number", error);
      return false;
    }
  };

  return (
    <div className=" w-full bg-[#c61d23] flex items-center justify-center px-4 py-1">
      {/* {isSubmittingForm && showLoadingPage && <LoadingPage />} */}
      {/* {!isSubmittingForm && loading && <Spinner />} */}

      {/* {!loading && !showLoadingPage && ( */}
      <form
        className="bg-white/10 backdrop-blur-md shadow-lg p-6 rounded-xl w-full max-w-lg space-y-6 text-white "
        onSubmit={onSubmit}
      >
        <h2 className="text-center text-2xl md:text-3xl font-semibold">
          Phone Number Verification
        </h2>

        {/* Phone Field */}
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
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border-b-2 py-2 focus:outline-none w-full"
              style={{ backgroundColor: "#c61d23" }}
              maxLength={10}
              pattern="[0-9]{10}"
              inputMode="numeric"
            />
            {!showCodeBox && !codeVerified && (
              <button
                type="button"
                onClick={verifyPhoneNo}
                className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold "
              >
                Send OTP
              </button>
            )}
          </div>

          {console.log("Error in phone number", errors.phone)}
          {errors?.phone && (
            <p className="text-[#ffdd00] mt-1">{errors.phone}</p>
          )}
        </div>

        {console.log("Data showCodeBox", showCodeBox)}
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
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              className="w-full bg-white/5 text-white border border-white px-4 py-2 focus:outline-none placeholder-gray-400"
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

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-xl transition-all"
        >
          Next
        </button>
      </form>
    </div>
  );
}
