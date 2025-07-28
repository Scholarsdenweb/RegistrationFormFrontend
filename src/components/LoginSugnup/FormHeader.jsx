import React from "react";
import LoginSugnupPageImg from "../../assets/LoginSugnupPageImg.png";


const FormHeader = ({ heading = "" }) => {
  return (
    <div className="h-full w-full pt-2 ">
      <div className=" flex flex-col h-full w-full bg-white shadow-lg rounded-2xl px-2 sm:px-5 py-2">
        {heading === "" ? (
          <h3 className=" text-xl sm:text-3xl font-normal text-[#c61d23]">
            <strong className="  ">Welcome to</strong> Scholars Den{" "}
          </h3>
        ) : (
          <h3 className=" text-xl sm:text-3xl font-thin text-[#c61d23]">
            <strong className="font-semibold  ">{heading}</strong>{" "}
          </h3>
        )}
        <div className="flex">
          <div className="flex flex-col justify-between w-full text-xs sm:text-lg">
            <div className="">
              <h4 className=" ">Please fill your Registration Form</h4>
            </div>

            <div className="font-semibold">TRUST . CARE . HONESTY</div>
          </div>
          <div className="flex justify-end ">
            <img className=" w-4/5 " src={LoginSugnupPageImg} alt="Signup" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
