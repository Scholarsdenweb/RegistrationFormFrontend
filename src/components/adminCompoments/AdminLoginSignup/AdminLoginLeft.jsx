import { useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import ScholarsDenLogo from "../../../assets/scholarsDenLogo.png";

import { useDispatch } from "react-redux";
import ErrorMessage from "../../ErrorMessage";
import InputField from "../../../utils/Tags/InputField";

export default function AdminLoginLeft() {
  const navigate = useNavigate();
  const { adminAuthLogin } = useAuth();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }
    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setShowErrorMessage(false);
      setSubmitMessage("");
      try {
        const response = await axios.post("/auth/employee_login", formData);
        setSubmitMessage("Login successful!");
        adminAuthLogin(formData);
        document.cookie = `authToken=${response.data.token}`;
        navigate("/admin/dashboard");
      } catch (error) {
        setSubmitMessage(error?.response?.data || "An error occurred");
        setShowErrorMessage(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center px-4 py-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Branding Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="relative pt-5">
              <div className="w-48 h-20 rounded-2xl shadow-xl border-4 border-[#ffdd00]/40 flex items-center justify-center bg-[#c61d23] p-2">
                <img src={ScholarsDenLogo} alt="Scholars Den Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Admin Login</h2>
          <p className="text-xs sm:text-sm text-gray-600">Enter your admin credentials</p>
        </div>
        {/* Form Card */}
        <div className="bg-white shadow-xl border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900">Email<span className="text-[#c61d23]">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white font-medium"
              autoFocus
              disabled={loading}
            />
            {errors.email && (
              <div className="flex items-start gap-1.5 p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-xs font-medium">{errors.email}</p>
              </div>
            )}
          </div>
          <div className="space-y-2 relative">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900">Password<span className="text-[#c61d23]">*</span></label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white font-medium"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-xs text-gray-400 hover:text-[#c61d23] focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <div className="flex items-start gap-1.5 p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-xs font-medium">{errors.password}</p>
              </div>
            )}
          </div>
          {submitMessage && (
            <div
              className={`text-xs sm:text-sm text-center font-semibold p-3 rounded-lg border-2 ${
                submitMessage.includes("success") || submitMessage.includes("Login successful!")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {submitMessage}
            </div>
          )}
          <button
            className="text-start text-gray-400 hover:underline my-2"
            onClick={() => navigate("/forgetPassword")}
            type="button"
            disabled={loading}
          >
            Forgot Password
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={`w-full font-bold py-3 rounded-lg transition-all text-sm shadow-lg flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white hover:shadow-xl"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}









