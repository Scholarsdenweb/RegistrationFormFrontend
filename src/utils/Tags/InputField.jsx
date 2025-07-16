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
          className="border-b-2 text-black  p-2  w-full  bg-white focus:outline-none rounded-lg appearance-none"
        />
        {error && <span className="text-[#ffdd00] text-sm mt-1">{error}</span>}
      </div>
    </div>
  );
};

export default InputField;
