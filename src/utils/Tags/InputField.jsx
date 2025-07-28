// import { useState } from "react";
// import { updateUserDetails } from "../redux/formDataSlice";
// import { useDispatch, useSelector } from "react-redux";

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => {
  // console.log("name", name, value, onChange, error, placeholder);

  return (
    <div className="flex flex-col items-center w-full appearance-none">
      <div className="w-full">
        <label htmlFor={name} className="text-sm font-semibold mb-1">
          {label}
        </label>
        <input
          autoComplete="off"
          id={name}
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 block w-full px-3 text-black py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {error && <span className="text-[#ffdd00] text-sm mt-1">{error}</span>}
      </div>
    </div>
  );
};

export default InputField;
