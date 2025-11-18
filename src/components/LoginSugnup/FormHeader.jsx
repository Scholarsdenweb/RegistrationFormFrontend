import React from "react";
import LoginSugnupPageImg from "../../assets/LoginSugnupPageImg.png";
import { Shield } from "lucide-react";

const FormHeader = ({ logoSrc }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm shadow-md rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 sm:w-20 sm:h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-1.5 flex-shrink-0 border-2 border-[#ffdd00]/30">
            {logoSrc ? (
              <img src={logoSrc} alt="Scholar's Den" className="w-full h-full object-contain" />
            ) : (
              <GraduationCap className="w-full h-full text-[#c61d23]" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-[#c61d23] truncate">
              Scholar's Den
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
              Admission Test
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-700">Trust</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>

          <span className="text-xs font-semibold text-emerald-700"> Care</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>

          <span className="text-xs font-semibold text-emerald-700"> Honesty</span>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
