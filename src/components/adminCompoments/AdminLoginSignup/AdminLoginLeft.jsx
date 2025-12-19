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
  const { login } = useAuth();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password : ""
  });
  const [errors, setErrors] = useState({
    contactNumber: "",
  });

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [submitMessage, setSubmitMessage] = useState("");
  // const [loading, setLoading] = useState(false);

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

    // if (!formData.contactNumber) {
    //   formErrors.contactNumber = "Contact Number is required";
    //   isValid = false;
    // }

     if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log("onSubmit function is working fine ");
        const response = await axios.post("/auth/employee_login", formData);
        setSubmitMessage("Login successful!");

        console.log("rsponse from login", response);
        login();
        document.cookie = `authToken=${response.data.token}`;
        navigate("/admin/dashboard");
      } catch (error) {
        setSubmitMessage(error?.response?.data || "An error occurred");
        setShowErrorMessage(true);

        console.log("Error logging in", error.response.data);
      } finally {
      }
    }
  };

  return (
    <div className="w-full bg-[#c61d23] flex items-center justify-center py-1">
      <form
        className="flex flex-col items-center justify-center gap-6 text-white w-full "
        onSubmit={onSubmit}
      >
        <div>
          <h2 className="text-3xl font-bold text-white ">Login</h2>
        </div>

        <div className="flex flex-col items-start w-3/4 ">
          {/* <InputField
            label="Contact Number"
            name="contactNumber"
            type="number"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.email}
            placeholder="Contact Number"
          /> */}
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col items-start w-3/4">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Password"
            />
          </div>

        {submitMessage && (
          <p
            className={`text-center text-sm ${
              submitMessage.includes("Login successful!")
                ? "text-green-500"
                : "text-white"
            }`}
          >
            {console.log("Submitmessage running")}
            {submitMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-3/4 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all"
          style={{ backgroundColor: "#c61d23" }}
        >
          Login
        </button>
      </form>

      {/* {showErrorMessage && <ErrorMessage message={submitMessage} closeErrorPopup={setShowErrorMessage} /> }  */}
    </div>
  );
}
