
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateExistingUserDetails } from "../../redux/slices/existingStudentSlice";
import { useAuth } from "../../../context/AuthContext";
import {
  Phone,
  Shield,
  CheckCircle2,
  Loader2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function SignupRight({ logoSrc }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.existingStudentDetails);

  const { checkAuth, loading: authLoading, logout } = useAuth();

  // State management
  const phoneRegex = /^\+91[0-9]{10}$/;
  // const [codeVerified, setCodeVerified] = useState(true);
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

        // const otpVerified = true;
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
    <div className="w-full h-full flex justify-center px-4 py-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Branding Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="relative pt-5">
              <div className="w-48 h-20 sm:w-48 sm:h-20  rounded-2xl shadow-xl border-4 border-[#ffdd00]/40 flex items-center justify-center bg-[#c61d23] p-2">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt="Scholar's Den"
                    className="w-full h-full object-contain "
                  />
                ) : (
                  <GraduationCap className="w-full h-full text-[#c61d23]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ffdd00] to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Student Registration
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Verify contact to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4">
          {/* Contact Number Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900">
              <Phone className="w-4 h-4 text-[#c61d23]" />
              Contact No.<span className="text-[#c61d23]">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-600 text-sm font-bold">+91</span>
                </div>
                <input
                  type="number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="10-digit Number"
                  className="w-full pl-12 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white disabled:bg-gray-50 font-medium"
                  maxLength={10}
                  disabled={showCodeBox || isSubmittingForm}
                />
              </div>

              {/* {!showCodeBox && !codeVerified && ( */}
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  disabled={
                    showReloading ||
                    isSubmittingForm ||
                    formData.contactNumber.length !== 10
                  }
                  className="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 text-sm rounded-lg bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
              {/* )} */}

              {codeVerified && (
                <div className="flex items-center justify-center px-4 py-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              )}
            </div>

            {errors?.contactNumber && (
              <div className="flex items-start gap-1.5 p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-xs font-medium">
                  {errors.contactNumber}
                </p>
              </div>
            )}
          </div>

          {/* OTP Input */}
          {showCodeBox && !codeVerified && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900">
                Verification Code <span className="text-[#c61d23]">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={handleOTPChange}
                placeholder="• • • •"
                className="w-full px-3 py-3 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white text-center tracking-[0.5em] font-bold"
                maxLength={4}
                disabled={isSubmittingForm}
                inputMode="numeric"
                autoFocus
              />

              {/* OTP Progress */}
              <div className="flex gap-1.5 justify-center">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 max-w-12 rounded-full transition-all ${
                      code.length > idx ? "bg-[#c61d23]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Terms */}

          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-start gap-2 bg-[#fdf5f6] p-3 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                disabled={isSubmittingForm}
                className="mt-0.5 h-4 w-4 rounded border-2 text-[#c61d23] focus:ring-2 focus:ring-[#c61d23] cursor-pointer accent-[#c61d23] flex-shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-xs text-gray-700 leading-snug"
              >
                I agree to the{" "}
                <Link
                  to="/registration/termsAndCondition"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#c61d23] underline font-semibold hover:text-[#a01818] transition-colors"
                >
                  Terms
                </Link>
                ,{" "}
                <Link
                  to="/registration/privacyPolicy"
                  // target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#c61d23] underline font-semibold hover:text-[#a01818] transition-colors"
                >
                  Privacy
                </Link>
                , and{" "}
                <Link
                  to="/registration/cancellationsAndRefunds"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#c61d23] underline font-semibold hover:text-[#a01818] transition-colors"
                >
                  Refunds
                </Link>{" "}
                policy
              </label>
            </div>
            {errors?.terms && (
              <div className="flex items-start gap-1.5 p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-xs font-medium">
                  {errors.terms}
                </p>
              </div>
            )}
          </div>

          {/* Message */}
          {submitMessage && (
            <div
              className={`text-xs sm:text-sm text-center font-semibold p-3 rounded-lg border-2 ${
                submitMessage.includes("success") ||
                submitMessage.includes("verified")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          {showCodeBox && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmittingForm || !code || code.length < 4}
              className={`w-full font-bold py-3 rounded-lg transition-all text-sm shadow-lg flex items-center justify-center gap-2 ${
                isSubmittingForm || !code || code.length < 4
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white hover:shadow-xl"
              }`}
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            )} 

          {/* Resend OTP */}
          {showCodeBox && !codeVerified && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-xs text-gray-600">Didn't receive code?</p>
              <button
                type="button"
                onClick={verifyPhoneNo}
                disabled={cooldownActive || isSubmittingForm}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                  cooldownActive || isSubmittingForm
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#ffdd00] hover:bg-amber-400 text-gray-900"
                }`}
              >
                {cooldownActive ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{resendCooldown}s</span>
                  </>
                ) : (
                  "Resend"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="text-center mt-4">
          <p className="text-xs text-gray-600">
            Need help?{" "}
            <Link
              to="/registration/contactUsPage"
              className="text-[#c61d23] hover:text-[#a01818] font-bold hover:underline cursor-pointer transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
