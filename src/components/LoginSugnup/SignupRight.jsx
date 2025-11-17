// import { useEffect, useState } from "react";
// import axios from "../../api/axios";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { updateExistingUserDetails } from "../../redux/slices/existingStudentSlice";
// import { useAuth } from "../../../context/AuthContext";

// export default function SignupRight() {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const { userData } = useSelector((state) => state.existingStudentDetails);

//   // Regex pattern for phone number validation (+91 followed by 10 digits)
//   const phoneRegex = /^\+91[0-9]{10}$/;
//   const [codeVerified, setCodeVerified] = useState(true);
//   // const [codeVerified, setCodeVerified] = useState(false);
//   const [isSubmittingForm, setIsSubmittingForm] = useState(false);

//   const { checkAuth } = useAuth();

//   const [codeEntered, setCodeEntered] = useState(false);

//   const [showReloading, setShowReloading] = useState(false);

//   const [resendAttempts, setResendAttempts] = useState(0);
//   const [resendCooldown, setResendCooldown] = useState(30);
//   const [cooldownActive, setCooldownActive] = useState(false);

//   const [termsAndCondition, setTermsAndCondition] = useState(false);

//   // Terms and Conditions state
//   const [termsAccepted, setTermsAccepted] = useState(false);

//   // State hooks
//   const [formData, setFormData] = useState({
//     contactNumber: "",
//   });
//   const [code, setCode] = useState("");
//   const [errors, setErrors] = useState({
//     contactNumber: "",
//     terms: "",
//   });

//   const [showCodeBox, setShowCodeBox] = useState(false);

//   const [submitMessage, setSubmitMessage] = useState("");

//   const handleLogout = async () => {
//     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     document.cookie =
//       "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     navigate("/");
//   };

//   useEffect(() => {
//     handleLogout();
//   }, []);

//   useEffect(() => {
//     console.log("userData", userData);
//   }, [userData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "contactNumber") {
//       if (value.length > 10) {
//         return;
//       }
//     }

//     setFormData({ ...formData, [name]: value });
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: value ? "" : `${name} is required`,
//     }));
//   };

//   const handleTermsChange = (e) => {
//     setTermsAccepted(e.target.checked);
//     if (e.target.checked) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         terms: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const formErrors = {};
//     let isValid = true;

//     // Field validation
//     ["contactNumber"].forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = `Contact Number is required`;
//         isValid = false;
//       }
//     });

//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       formErrors.email = "Email must be valid";
//       isValid = false;
//     }

//     if (!phoneRegex.test(`+91${formData.contactNumber}`)) {
//       formErrors.contactNumber =
//         "Contact Number must be a valid 10-digit number";
//       isValid = false;
//     }

//     // Terms validation
//     if (!termsAccepted) {
//       formErrors.terms = "You must accept the Terms and Conditions to proceed";
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const checkVerificationCode = async () => {
//     try {
//       console.log("verifyNumber", formData.contactNumber);
//       const response = await axios.post("/students/verifyNumber", {
//         mobileNumber: formData.contactNumber,
//         otp: code,
//       });

//       console.log("response", response);
//       if (response.status === 200) {
//         console.log("ITs working ,,,,,,,,,,,,,");
//         setCodeVerified(true);
//         setShowCodeBox(false);
//       }
//       console.log("ITs working ,,,,,,,,,,,,,");

//       console.log("codeVerified form checkVerification", codeVerified);

//       setCodeVerified(true);
//       setShowCodeBox(false);
//       return true;
//     } catch (error) {
//       setSubmitMessage("Error verifying Contact Number number");
//       console.log("Error verifying Contact Number number", error);
//       return false;
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setIsSubmittingForm(true);

//       let codeChecked = true;
//       // let codeChecked = await checkVerificationCode();

//       console.log("codeChecked", codeChecked);

//       if (!codeChecked) {
//         setCodeVerified(false);
//         setCodeEntered(false);
//         setSubmitMessage("Invalid OTP. Please try again.");
//         setCode("");
//         setIsSubmittingForm(false);
//         return;
//       }
//       setSubmitMessage("");

//       if (validateForm()) {
//         try {
//           console.log("Response beforew auth", formData);
//           const response = await axios.post("/auth/student_signup", formData);
//           console.log("response form signupRight", response);

//           console.log("cookie", document.cookie);

//           console.log("response.message", response.data.message);

//           if (response.data.message === "Student Already Exist") {
//             console.log("response student data", response.data.student);

//             dispatch(
//               updateExistingUserDetails({ userData: response.data.student })
//             );

//             checkAuth();

//             console.log("response from signupRight", response);

//             navigate("/registration/existingStudent");
//           } else if (
//             response.data.message ===
//             "Student found in enquiry records. Complete your registration!"
//           ) {
//             console.log(
//               "responseData student from enquiry form",
//               response.data.student
//             );

//             dispatch(
//               updateExistingUserDetails({ userData: response.data.student })
//             );

//             navigate("/registration/existingenquiry");
//           } else {
//             console.log("response", response);
//             setSubmitMessage("Form submitted successfully!");
//             navigate("/registration/basicDetailsForm");
//           }
//           setSubmitMessage("Form submitted successfully!");
//           // document.cookie = `authToken=${response.data.token}`;
//         } catch (error) {
//           console.log("Error submitting form 2", error);
//           setSubmitMessage(error.response.data);

//           console.error("Error submitting form", error);
//         }
//       }
//     } catch (e) {
//       console.log("Error", e);
//     } finally {
//       setIsSubmittingForm(false);
//     }
//   };

//   const verifyPhoneNo = async () => {
//     if (formData.contactNumber.length != 10) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         contactNumber: `The length must be exactly 10.`,
//       }));
//       return;
//     }

//     // Check if terms are accepted before sending OTP
//     if (!termsAccepted) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         terms: "You must accept the Terms and Conditions before proceeding",
//       }));
//       return;
//     }

//     if (cooldownActive) return;

//     try {
//       setShowReloading(true);

//       const response = await axios.post("/students/sendVerification", {
//         mobileNumber: `${formData.contactNumber}`,
//       });
//       if (response.status === 200) {
//         setShowCodeBox(true);
//         setSubmitMessage("OTP sent successfully");

//         const nextCooldown = 30 * Math.pow(2, resendAttempts);
//         setResendCooldown(nextCooldown);
//         setCooldownActive(true);
//         setResendAttempts((prev) => prev + 1);
//       }
//     } catch (error) {
//       setSubmitMessage("Error verifying Contact Number number");
//       console.log("Error verifying Contact Number number", error);
//     } finally {
//       setShowReloading(false);
//       setCode("");
//     }
//   };

//   const handleOTPChange = async (e) => {
//     if (e.target.value.length <= 4) {
//       setCode(e.target.value);
//     }

//     if (e.target.value.length >= 4) {
//       setCodeEntered(true);
//       setSubmitMessage("");
//       return;
//     } else {
//       setCodeEntered(false);
//     }

//     console.log("e.target.value", e.target.value.length);
//   };

//   // Handle terms link click - save form data before opening
//   const handleTermsLinkClick = (e) => {
//     e.stopPropagation();
//     // Save form data to Redux before opening terms page
//     dispatch(
//       updateExistingUserDetails({
//         signupFormData: {
//           contactNumber: formData.contactNumber,
//           termsAccepted: termsAccepted,
//           codeVerified: codeVerified,
//           showCodeBox: showCodeBox,
//           code: code,
//         },
//       })
//     );
//   };

//   // Load form data from Redux if available
//   useEffect(() => {
//     if (userData?.signupFormData) {
//       setFormData({
//         contactNumber: userData.signupFormData.contactNumber || "",
//       });
//       setTermsAccepted(userData.signupFormData.termsAccepted || false);
//       setCodeVerified(userData.signupFormData.codeVerified || false);
//       setShowCodeBox(userData.signupFormData.showCodeBox || false);
//       setCode(userData.signupFormData.code || "");
//     }
//   }, []);

//   useEffect(() => {
//     let timer;
//     if (cooldownActive && resendCooldown > 0) {
//       timer = setInterval(() => {
//         setResendCooldown((prev) => prev - 1);
//       }, 1000);
//     } else if (resendCooldown === 0) {
//       setCooldownActive(false);
//     }

//     return () => clearInterval(timer);
//   }, [cooldownActive, resendCooldown]);

//   return (
//     <div className="w-full bg-[#fdf5f6] flex items-center justify-center px-4 py-1">
//       <form
//         className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-lg space-y-6 text-black"
//         onSubmit={onSubmit}
//       >
//         <h2 className="text-center text-2xl md:text-3xl font-semibold">
//           Contact Number Verification
//         </h2>

//         {/* contactNumber Field */}
//         <div className="space-y-4">
//           <label
//             htmlFor="fatherContactNumber"
//             className="block text-sm font-medium"
//           >
//             *Contact Number (Parent)
//           </label>
//           <div className="flex flex-col md:flex-row gap-2">
//             <input
//               type="number"
//               id="contactNumber"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               placeholder="Enter Contact Number"
//               className="border-b-2 py-2 focus:outline-none w-full px-2"
//               style={{ backgroundColor: "#fdf5f6" }}
//               maxLength={10}
//               pattern="[0-9]{10}"
//               inputMode="numeric"
//             />
//             {!showCodeBox && !codeVerified && (
//               <button
//                 type="button"
//                 onClick={verifyPhoneNo}
//                 className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
//               >
//                 Send OTP
//               </button>
//             )}
//           </div>

//           {errors?.contactNumber && (
//             <p className="text-[#ffdd00] mt-1">{errors.contactNumber}</p>
//           )}
//         </div>

//         {showCodeBox && (
//           <div className="space-y-2">
//             <label htmlFor="otp" className="block text-sm font-medium">
//               *Verification Code
//             </label>
//             <input
//               type="text"
//               id="otp"
//               name="otp"
//               value={code}
//               onChange={handleOTPChange}
//               placeholder="Enter 4-digit OTP"
//               className="w-full bg-white text-black border-b-2 border-gray-300 focus:border-yellow-500 px-4 py-2 focus:outline-none placeholder-gray-400 transition-colors"
//               style={{ backgroundColor: "#fdf5f6" }}
//             />
//           </div>
//         )}

//         {showReloading && (
//           <div className="flex justify-center items-center">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
//           </div>
//         )}

//         {/* Terms and Conditions Section - Show before OTP */}
//         <div className="space-y-4 border- border-gray-300 pt-5">
//           <div className="flex items-start gap-3">
//             <input
//               type="checkbox"
//               id="terms"
//               checked={termsAccepted}
//               onChange={handleTermsChange}
//               className="mt-1 h-4 w-4 rounded border-gray-400 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer accent-yellow-500"
//             />
//             <label
//               htmlFor="terms"
//               className="text-sm text-black leading-relaxed select-none cursor-pointer"
//             >
//               I agree to the{" "}
//               <Link
//                 to="/registration/termsAndCondition"
//                 rel="noopener noreferrer"
//                 className="text-yellow-600 hover:text-yellow-700 underline font-semibold transition-colors"
//                 onClick={handleTermsLinkClick}
//               >
//                 Terms and Conditions
//               </Link>
//               ,{" "}
//               <Link
//                 to="/registration/privacyPolicy"
//                 rel="noopener noreferrer"
//                 className="text-yellow-600 hover:text-yellow-700 underline font-semibold transition-colors"
//                 onClick={handleTermsLinkClick}
//               >
//                 Privacy Policy
//               </Link>
//               , and{" "}
//               <Link
//                 to="/registration/cancellationsAndRefunds"
//                 rel="noopener noreferrer"
//                 className="text-yellow-600 hover:text-yellow-700 underline font-semibold transition-colors"
//                 onClick={handleTermsLinkClick}
//               >
//                 Cancellations & Refunds
//               </Link>
//             </label>
//           </div>

//           {errors?.terms && (
//             <p className="text-red-600 text-sm font-medium">{errors.terms}</p>
//           )}

//           {/* Contact Us Link */}
//           <div className="text-center pt-2">
//             <span className="text-xs text-gray-600">Need help? </span>
//             <Link
//               to="/registration/contactUsPage"
//               rel="noopener noreferrer"
//               className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
//               onClick={(e) => e.stopPropagation()}
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>

//         {/* Submit Message */}
//         {submitMessage && (
//           <p className={`text-sm text-center text-[#ffdd00]`}>
//             {submitMessage}
//           </p>
//         )}

//         {/* {showCodeBox && ( */}
//         <button
//           type="submit"
//           // disabled={!termsAccepted || isSubmittingForm}
//           // className={`w-full font-semibold py-2 rounded-xl transition-all ${
//           //   termsAccepted && !isSubmittingForm
//           //     ? "bg-yellow-500 hover:bg-yellow-600 text-black"
//           //     : "bg-yellow-800 text-gray-400 cursor-not-allowed"
//           // }`}

//           className={`w-full font-semibold py-2 rounded-xl transition-all
//                 bg-yellow-500 hover:bg-yellow-600 text-black
//             `}
//         >
//           {isSubmittingForm ? "Processing..." : "Next"}
//         </button>
//         {/* )} */}

//         {showCodeBox && (
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
//             <p className="text-sm text-gray-600">Didn't receive OTP?</p>
//             <button
//               type="button"
//               onClick={verifyPhoneNo}
//               disabled={cooldownActive}
//               className={`ml-2 px-3 py-2 text-sm font-semibold rounded-md ${
//                 cooldownActive
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-yellow-500 hover:bg-yellow-600 text-black"
//               }`}
//             >
//               {cooldownActive ? `Resend in ${resendCooldown}s` : "Resend OTP"}
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import axios from "../../api/axios";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { updateExistingUserDetails } from "../../redux/slices/existingStudentSlice";
// import { useAuth } from "../../../context/AuthContext";

// export default function SignupRight() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.existingStudentDetails);

//   // ✅ Get checkAuth from useAuth hook
//   const { checkAuth, loading: authLoading, logout } = useAuth();

//   // State management
//   const phoneRegex = /^\+91[0-9]{10}$/;
//   // const [codeVerified, setCodeVerified] = useState(true);
//   const [codeVerified, setCodeVerified] = useState(false);
//   const [isSubmittingForm, setIsSubmittingForm] = useState(false);
//   const [codeEntered, setCodeEntered] = useState(false);
//   const [showReloading, setShowReloading] = useState(false);
//   const [resendAttempts, setResendAttempts] = useState(0);
//   const [resendCooldown, setResendCooldown] = useState(30);
//   const [cooldownActive, setCooldownActive] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);

//   const [formData, setFormData] = useState({
//     contactNumber: "",
//   });
//   const [code, setCode] = useState("");
//   const [errors, setErrors] = useState({
//     contactNumber: "",
//     terms: "",
//   });
//   const [showCodeBox, setShowCodeBox] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");

//   // Clear auth on mount
//   const handleLogout = async () => {
//     // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     // document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     logout();
//   };

//   useEffect(() => {
//     handleLogout();
//   }, []);

//   useEffect(() => {
//     console.log("userData", userData);
//   }, [userData]);

//   // Load saved form data
//   useEffect(() => {
//     if (userData?.signupFormData) {
//       setFormData({
//         contactNumber: userData.signupFormData.contactNumber || "",
//       });
//       setTermsAccepted(userData.signupFormData.termsAccepted || false);
//       setCodeVerified(userData.signupFormData.codeVerified || false);
//       setShowCodeBox(userData.signupFormData.showCodeBox || false);
//       setCode(userData.signupFormData.code || "");
//     }
//   }, []);

//   // Cooldown timer
//   useEffect(() => {
//     let timer;
//     if (cooldownActive && resendCooldown > 0) {
//       timer = setInterval(() => {
//         setResendCooldown((prev) => prev - 1);
//       }, 1000);
//     } else if (resendCooldown === 0) {
//       setCooldownActive(false);
//     }
//     return () => clearInterval(timer);
//   }, [cooldownActive, resendCooldown]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "contactNumber" && value.length > 10) return;

//     setFormData({ ...formData, [name]: value });
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: value ? "" : `${name} is required`,
//     }));
//   };

//   const handleTermsChange = (e) => {
//     setTermsAccepted(e.target.checked);
//     if (e.target.checked) {
//       setErrors((prevErrors) => ({ ...prevErrors, terms: "" }));
//     }
//   };

//   const validateForm = () => {
//     const formErrors = {};
//     let isValid = true;

//     if (!formData.contactNumber) {
//       formErrors.contactNumber = "Contact Number is required";
//       isValid = false;
//     }

//     if (
//       formData.contactNumber &&
//       !phoneRegex.test(`+91${formData.contactNumber}`)
//     ) {
//       formErrors.contactNumber =
//         "Contact Number must be a valid 10-digit number";
//       isValid = false;
//     }

//     if (!termsAccepted) {
//       formErrors.terms = "You must accept the Terms and Conditions to proceed";
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   // OTP Verification
//   const checkVerificationCode = async () => {
//     try {
//       console.log("🔍 Verifying OTP for:", formData.contactNumber);

//       const response = await axios.post("/students/verifyNumber", {
//         mobileNumber: formData.contactNumber,
//         otp: code,
//       });

//       console.log("✅ OTP verification response:", response);

//       if (response.status === 200) {
//         setCodeVerified(true);
//         setShowCodeBox(false);
//         setSubmitMessage("OTP verified successfully!");
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("❌ OTP verification failed:", error);
//       setSubmitMessage(error.response?.data?.message || "Error verifying OTP");
//       return false;
//     }
//   };

//   // ✅ FIXED: Form submission with proper error handling
//   const onSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form first
//     if (!validateForm()) {
//       console.log("❌ Form validation failed");
//       return;
//     }

//     try {
//       setIsSubmittingForm(true);
//       setSubmitMessage("");

//       // Check OTP if code box is shown and not yet verified
//       if (showCodeBox && !codeVerified) {
//         if (!code || code.length < 4) {
//           setSubmitMessage("Please enter the 4-digit OTP");
//           setIsSubmittingForm(false);
//           return;
//         }

//         const otpVerified = await checkVerificationCode();
//         // const otpVerified = true;
//         if (!otpVerified) {
//           setCodeVerified(false);
//           setCodeEntered(false);
//           setSubmitMessage("Invalid OTP. Please try again.");
//           setCode("");
//           setIsSubmittingForm(false);
//           return;
//         }
//       }

//       console.log("📤 Submitting signup form:", formData);

//       // Submit to backend
//       const response = await axios.post("/auth/student_signup", formData);

//       console.log("✅ Signup response:", response.data);

//       // ✅ FIXED: Check authentication after successful response
//       if (checkAuth && typeof checkAuth === "function") {
//         try {
//           await checkAuth();
//           console.log("✅ Authentication checked successfully");
//         } catch (authError) {
//           console.error("⚠️ Auth check failed, but continuing:", authError);
//         }
//       }

//       // Handle different response scenarios
//       if (response.data.message === "Student Already Exist") {
//         console.log("📋 Existing student found");

//         dispatch(
//           updateExistingUserDetails({
//             userData: response.data.student,
//           })
//         );

//         setSubmitMessage("Welcome back! Redirecting...");
//         setTimeout(() => {
//           navigate("/registration/existingStudent");
//         }, 500);
//       } else if (
//         response.data.message ===
//         "Student found in enquiry records. Complete your registration!"
//       ) {
//         console.log("📝 Enquiry student found");

//         dispatch(
//           updateExistingUserDetails({
//             userData: response.data.student,
//           })
//         );

//         setSubmitMessage("Account found! Redirecting...");
//         setTimeout(() => {
//           navigate("/registration/existingenquiry");
//         }, 500);
//       } else {
//         console.log("✅ New student created");
//         setSubmitMessage("Registration record created. Redirecting...");
//         setTimeout(() => {
//           navigate("/registration/basicDetailsForm");
//         }, 500);
//       }
//     } catch (error) {
//       console.error("❌ Signup error:", error);

//       // ✅ FIXED: Better error handling
//       let errorMsg = "Registration failed. Please try again.";

//       if (error.response?.data?.message) {
//         errorMsg = error.response.data.message;
//       } else if (error.message) {
//         errorMsg = error.message;
//       }

//       setSubmitMessage(errorMsg);
//     } finally {
//       setIsSubmittingForm(false);
//     }
//   };

//   // Send OTP
//   const verifyPhoneNo = async () => {
//     if (formData.contactNumber.length !== 10) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         contactNumber: "The length must be exactly 10 digits",
//       }));
//       return;
//     }

//     if (!termsAccepted) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         terms: "You must accept the Terms and Conditions before proceeding",
//       }));
//       return;
//     }

//     if (cooldownActive) return;

//     try {
//       setShowReloading(true);
//       setSubmitMessage("");
//       console.log("📱 Sending OTP to:", formData.contactNumber);

//       const response = await axios.post("/students/sendVerification", {
//         mobileNumber: formData.contactNumber,
//       });

//       if (response.status === 200) {
//         setShowCodeBox(true);
//         setCodeVerified(false);
//         setSubmitMessage("OTP sent successfully!");

//         const nextCooldown = 30 * Math.pow(2, resendAttempts);
//         setResendCooldown(nextCooldown);
//         setCooldownActive(true);
//         setResendAttempts((prev) => prev + 1);

//         console.log("✅ OTP sent successfully");
//       }
//     } catch (error) {
//       console.error("❌ Failed to send OTP:", error);
//       setSubmitMessage(
//         error.response?.data?.message || "Failed to send OTP. Please try again."
//       );
//     } finally {
//       setShowReloading(false);
//       setCode("");
//     }
//   };

//   const handleOTPChange = (e) => {
//     const value = e.target.value;
//     if (value.length <= 4 && /^\d*$/.test(value)) {
//       setCode(value);
//     }

//     if (value.length === 4) {
//       setCodeEntered(true);
//       setSubmitMessage("");
//     } else {
//       setCodeEntered(false);
//     }
//   };

//   const handleTermsLinkClick = (e) => {
//     e.stopPropagation();
//     dispatch(
//       updateExistingUserDetails({
//         signupFormData: {
//           contactNumber: formData.contactNumber,
//           termsAccepted: termsAccepted,
//           codeVerified: codeVerified,
//           showCodeBox: showCodeBox,
//           code: code,
//         },
//       })
//     );
//   };

//   return (
//     <div className="w-full bg-[#fdf5f6] flex items-center justify-center px-4 py-1">
//       <form
//         className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-lg space-y-6 text-black"
//         onSubmit={onSubmit}
//       >
//         <h2 className="text-center text-2xl md:text-3xl font-semibold">
//           Contact Number Verification
//         </h2>

//         {/* Contact Number Field */}
//         <div className="space-y-4">
//           <label htmlFor="contactNumber" className="block text-sm font-medium">
//             *Contact Number (Parent)
//           </label>
//           <div className="flex flex-col md:flex-row gap-2">
//             <input
//               type="number"
//               id="contactNumber"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               placeholder="Enter Contact Number"
//               className="border-b-2 py-2 focus:outline-none w-full px-2"
//               style={{ backgroundColor: "#fdf5f6" }}
//               maxLength={10}
//               disabled={showCodeBox || isSubmittingForm}
//             />
//             {!showCodeBox && !codeVerified && (
//               <button
//                 type="button"
//                 onClick={verifyPhoneNo}
//                 disabled={showReloading || isSubmittingForm}
//                 className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 {showReloading ? "Sending..." : "Send OTP"}
//               </button>
//             )}
//           </div>
//           {errors?.contactNumber && (
//             <p className="text-red-600 mt-1 text-sm">{errors.contactNumber}</p>
//           )}
//         </div>

//         {/* OTP Input */}
//         {showCodeBox && !codeVerified && (
//           <div className="space-y-2">
//             <label htmlFor="otp" className="block text-sm font-medium">
//               *Verification Code
//             </label>
//             <input
//               type="text"
//               id="otp"
//               name="otp"
//               value={code}
//               onChange={handleOTPChange}
//               placeholder="Enter 4-digit OTP"
//               className="w-full bg-white text-black border-b-2 border-gray-300 focus:border-yellow-500 px-4 py-2 focus:outline-none placeholder-gray-400 transition-colors"
//               style={{ backgroundColor: "#fdf5f6" }}
//               maxLength={4}
//               disabled={isSubmittingForm}
//               inputMode="numeric"
//             />
//           </div>
//         )}

//         {/* Loading Spinner */}
//         {showReloading && (
//           <div className="flex justify-center items-center">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
//           </div>
//         )}

//         {/* Terms and Conditions */}
//         <div className="space-y-4  border-gray-300 pt-5">
//           <div className="flex items-start gap-3">
//             <input
//               type="checkbox"
//               id="terms"
//               checked={termsAccepted}
//               onChange={handleTermsChange}
//               disabled={isSubmittingForm}
//               className="mt-1 h-4 w-4 rounded border-gray-400 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer accent-yellow-500"
//             />
//             <label
//               htmlFor="terms"
//               className="text-sm text-black leading-relaxed select-none cursor-pointer"
//             >
//               I agree to the{" "}
//               <Link
//                 to="/registration/termsAndCondition"
//                 className="text-yellow-600 hover:text-yellow-700 underline font-semibold"
//                 onClick={handleTermsLinkClick}
//               >
//                 Terms and Conditions
//               </Link>
//               ,{" "}
//               <Link
//                 to="/registration/privacyPolicy"
//                 className="text-yellow-600 hover:text-yellow-700 underline font-semibold"
//                 onClick={handleTermsLinkClick}
//               >
//                 Privacy Policy
//               </Link>
//               , and{" "}
//               <Link
//                 to="/registration/cancellationsAndRefunds"
//                 className="text-yellow-600 hover:text-yellow-700 underline font-semibold"
//                 onClick={handleTermsLinkClick}
//               >
//                 Cancellations & Refunds
//               </Link>
//             </label>
//           </div>
//           {errors?.terms && (
//             <p className="text-red-600 text-sm font-medium">{errors.terms}</p>
//           )}

//           {/* Contact Us */}
//           <div className="text-center pt-2">
//             <span className="text-xs text-gray-600">Need help? </span>
//             <Link
//               to="/registration/contactUsPage"
//               className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>

//         {/* Submit Message */}
//         {submitMessage && (
//           <div
//             className={`text-sm text-center font-medium p-3 rounded-lg ${
//               submitMessage.includes("success") ||
//               submitMessage.includes("Welcome") ||
//               submitMessage.includes("found")
//                 ? "bg-green-50 text-green-700 border border-green-200"
//                 : "bg-red-50 text-red-700 border border-red-200"
//             }`}
//           >
//             {submitMessage}
//           </div>
//         )}

//         {/* Submit Button */}
//         {showCodeBox && (
//           <button
//             type="submit"
//             disabled={isSubmittingForm || authLoading}
//             // className={`w-full font-semibold py-3 rounded-xl transition-all bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-lg
//             // `}

//             className={`w-full font-semibold py-3 rounded-xl transition-all ${
//               isSubmittingForm || authLoading
//                 ? "bg-gray-400 cursor-not-allowed text-gray-600"
//                 : "bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-lg"
//             }`}
//           >
//             {isSubmittingForm ? (
//               <span className="flex items-center justify-center gap-2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
//                 Processing...
//               </span>
//             ) : (
//               "Next"
//             )}
//           </button>
//         )}

//         {/* Resend OTP */}
//         {showCodeBox && !codeVerified && (
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
//             <p className="text-sm text-gray-600">Didn't receive OTP?</p>
//             <button
//               type="button"
//               onClick={verifyPhoneNo}
//               disabled={cooldownActive || isSubmittingForm}
//               className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
//                 cooldownActive || isSubmittingForm
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-yellow-500 hover:bg-yellow-600 text-black"
//               }`}
//             >
//               {cooldownActive ? `Resend in ${resendCooldown}s` : "Resend OTP"}
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }









import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateExistingUserDetails } from "../../redux/slices/existingStudentSlice";
import { useAuth } from "../../../context/AuthContext";
import { Phone, Shield, CheckCircle2, Loader2 } from "lucide-react";

export default function SignupRight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.existingStudentDetails);

  const { checkAuth, loading: authLoading, logout } = useAuth();

  // State management
  const phoneRegex = /^\+91[0-9]{10}$/;
  const [codeVerified, setCodeVerified] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);
  const [showReloading, setShowReloading] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    contactNumber: "",
  });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    contactNumber: "",
    terms: "",
  });
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Clear auth on mount
  const handleLogout = async () => {
    logout();
  };

  useEffect(() => {
    handleLogout();
  }, []);

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  // Load saved form data
  useEffect(() => {
    if (userData?.signupFormData) {
      setFormData({
        contactNumber: userData.signupFormData.contactNumber || "",
      });
      setTermsAccepted(userData.signupFormData.termsAccepted || false);
      setCodeVerified(userData.signupFormData.codeVerified || false);
      setShowCodeBox(userData.signupFormData.showCodeBox || false);
      setCode(userData.signupFormData.code || "");
    }
  }, []);

  // Cooldown timer
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber" && value.length > 10) return;

    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setErrors((prevErrors) => ({ ...prevErrors, terms: "" }));
    }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!formData.contactNumber) {
      formErrors.contactNumber = "Contact Number is required";
      isValid = false;
    }

    if (
      formData.contactNumber &&
      !phoneRegex.test(`+91${formData.contactNumber}`)
    ) {
      formErrors.contactNumber =
        "Contact Number must be a valid 10-digit number";
      isValid = false;
    }

    if (!termsAccepted) {
      formErrors.terms = "You must accept the Terms and Conditions to proceed";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // OTP Verification
  const checkVerificationCode = async () => {
    try {
      console.log("🔍 Verifying OTP for:", formData.contactNumber);

      const response = await axios.post("/students/verifyNumber", {
        mobileNumber: formData.contactNumber,
        otp: code,
      });

      console.log("✅ OTP verification response:", response);

      if (response.status === 200) {
        setCodeVerified(true);
        setShowCodeBox(false);
        setSubmitMessage("OTP verified successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ OTP verification failed:", error);
      setSubmitMessage(error.response?.data?.message || "Error verifying OTP");
      return false;
    }
  };

  // Form submission with proper error handling
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    try {
      setIsSubmittingForm(true);
      setSubmitMessage("");

      if (showCodeBox && !codeVerified) {
        if (!code || code.length < 4) {
          setSubmitMessage("Please enter the 4-digit OTP");
          setIsSubmittingForm(false);
          return;
        }

        const otpVerified = await checkVerificationCode();
        if (!otpVerified) {
          setCodeVerified(false);
          setCodeEntered(false);
          setSubmitMessage("Invalid OTP. Please try again.");
          setCode("");
          setIsSubmittingForm(false);
          return;
        }
      }

      console.log("📤 Submitting signup form:", formData);

      const response = await axios.post("/auth/student_signup", formData);

      console.log("✅ Signup response:", response.data);

      if (checkAuth && typeof checkAuth === "function") {
        try {
          await checkAuth();
          console.log("✅ Authentication checked successfully");
        } catch (authError) {
          console.error("⚠️ Auth check failed, but continuing:", authError);
        }
      }

      if (response.data.message === "Student Already Exist") {
        console.log("📋 Existing student found");

        dispatch(
          updateExistingUserDetails({
            userData: response.data.student,
          })
        );

        setSubmitMessage("Welcome back! Redirecting...");
        setTimeout(() => {
          navigate("/registration/existingStudent");
        }, 500);
      } else if (
        response.data.message ===
        "Student found in enquiry records. Complete your registration!"
      ) {
        console.log("📝 Enquiry student found");

        dispatch(
          updateExistingUserDetails({
            userData: response.data.student,
          })
        );

        setSubmitMessage("Account found! Redirecting...");
        setTimeout(() => {
          navigate("/registration/existingenquiry");
        }, 500);
      } else {
        console.log("✅ New student created");
        setSubmitMessage("Registration record created. Redirecting...");
        setTimeout(() => {
          navigate("/registration/basicDetailsForm");
        }, 500);
      }
    } catch (error) {
      console.error("❌ Signup error:", error);

      let errorMsg = "Registration failed. Please try again.";

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }

      setSubmitMessage(errorMsg);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Send OTP
  const verifyPhoneNo = async () => {
    if (formData.contactNumber.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactNumber: "The length must be exactly 10 digits",
      }));
      return;
    }

    if (!termsAccepted) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        terms: "You must accept the Terms and Conditions before proceeding",
      }));
      return;
    }

    if (cooldownActive) return;

    try {
      setShowReloading(true);
      setSubmitMessage("");
      console.log("📱 Sending OTP to:", formData.contactNumber);

      const response = await axios.post("/students/sendVerification", {
        mobileNumber: formData.contactNumber,
      });

      if (response.status === 200) {
        setShowCodeBox(true);
        setCodeVerified(false);
        setSubmitMessage("OTP sent successfully!");

        const nextCooldown = 30 * Math.pow(2, resendAttempts);
        setResendCooldown(nextCooldown);
        setCooldownActive(true);
        setResendAttempts((prev) => prev + 1);

        console.log("✅ OTP sent successfully");
      }
    } catch (error) {
      console.error("❌ Failed to send OTP:", error);
      setSubmitMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setShowReloading(false);
      setCode("");
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCode(value);
    }

    if (value.length === 4) {
      setCodeEntered(true);
      setSubmitMessage("");
    } else {
      setCodeEntered(false);
    }
  };

  const handleTermsLinkClick = (e) => {
    e.stopPropagation();
    dispatch(
      updateExistingUserDetails({
        signupFormData: {
          contactNumber: formData.contactNumber,
          termsAccepted: termsAccepted,
          codeVerified: codeVerified,
          showCodeBox: showCodeBox,
          code: code,
        },
      })
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0] flex items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg mb-4 sm:mb-5">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-2">
            Contact Verification
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Enter your parent's contact number to proceed
          </p>
        </div>

        {/* Form Card */}
        <form
          className="bg-white/90 backdrop-blur-lg shadow-xl border border-gray-100 p-5 sm:p-6 md:p-8 rounded-2xl space-y-5 sm:space-y-6"
          onSubmit={onSubmit}
        >
          {/* Contact Number Field */}
          <div className="space-y-2 sm:space-y-3">
            <label
              htmlFor="contactNumber"
              className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              Contact Number (Parent) <span className="text-red-500">*</span>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm sm:text-base font-medium">+91</span>
                </div>
                <input
                  type="number"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  maxLength={10}
                  disabled={showCodeBox || isSubmittingForm}
                />
              </div>
              
              {!showCodeBox && !codeVerified && (
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  disabled={showReloading || isSubmittingForm || formData.contactNumber.length !== 10}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {showReloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              )}

              {codeVerified && (
                <div className="flex items-center justify-center sm:justify-start px-4 py-2.5 bg-green-50 border-2 border-green-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>

            {errors?.contactNumber && (
              <p className="text-red-600 text-xs sm:text-sm font-medium flex items-start gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-red-600 mt-1.5"></span>
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* OTP Input */}
          {showCodeBox && !codeVerified && (
            <div className="space-y-2 sm:space-y-3 animate-fadeIn">
              <label
                htmlFor="otp"
                className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                Verification Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={code}
                onChange={handleOTPChange}
                placeholder="Enter 4-digit OTP"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all outline-none bg-white text-center tracking-widest font-semibold text-lg sm:text-xl disabled:bg-gray-50"
                maxLength={4}
                disabled={isSubmittingForm}
                inputMode="numeric"
                autoFocus
              />
              
              {/* OTP Progress Indicator */}
              <div className="flex gap-1.5 sm:gap-2 justify-center">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 sm:h-2 w-8 sm:w-10 rounded-full transition-all ${
                      code.length > idx ? "bg-yellow-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2.5 sm:gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                disabled={isSubmittingForm}
                className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 rounded border-2 border-gray-400 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer accent-yellow-500 flex-shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-700 leading-relaxed select-none cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  to="/registration/termsAndCondition"
                  className="text-yellow-600 hover:text-yellow-700 underline font-semibold"
                  onClick={handleTermsLinkClick}
                >
                  Terms and Conditions
                </Link>
                ,{" "}
                <Link
                  to="/registration/privacyPolicy"
                  className="text-yellow-600 hover:text-yellow-700 underline font-semibold"
                  onClick={handleTermsLinkClick}
                >
                  Privacy Policy
                </Link>
                , and{" "}
                <Link
                  to="/registration/cancellationsAndRefunds"
                  className="text-yellow-600 hover:text-yellow-700 underline font-semibold"
                  onClick={handleTermsLinkClick}
                >
                  Cancellations & Refunds
                </Link>
              </label>
            </div>
            
            {errors?.terms && (
              <p className="text-red-600 text-xs sm:text-sm font-medium flex items-start gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-red-600 mt-1.5"></span>
                {errors.terms}
              </p>
            )}
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div
              className={`text-xs sm:text-sm text-center font-medium p-3 sm:p-4 rounded-lg border-2 animate-fadeIn ${
                submitMessage.includes("success") ||
                submitMessage.includes("Welcome") ||
                submitMessage.includes("found")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          {showCodeBox && (
            <button
              type="submit"
              disabled={isSubmittingForm || authLoading || !code || code.length < 4}
              className={`w-full font-semibold py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 ${
                isSubmittingForm || authLoading || !code || code.length < 4
                  ? "bg-gray-300 cursor-not-allowed text-gray-600 shadow-none"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white hover:shadow-xl"
              }`}
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          )}

          {/* Resend OTP */}
          {showCodeBox && !codeVerified && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pt-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Didn't receive OTP?
              </p>
              <button
                type="button"
                onClick={verifyPhoneNo}
                disabled={cooldownActive || isSubmittingForm}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  cooldownActive || isSubmittingForm
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-300"
                }`}
              >
                {cooldownActive ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>
          )}
        </form>

        {/* Footer Help Link */}
        <div className="text-center mt-5 sm:mt-6 pb-4">
          <span className="text-xs sm:text-sm text-gray-600">Need help? </span>
          <Link
            to="/registration/contactUsPage"
            className="text-xs sm:text-sm text-yellow-600 hover:text-yellow-700 font-semibold hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}