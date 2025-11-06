import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFooter = () => {
  const navigate = useNavigate();

  const footerLinks = [
    {
      label: "Terms & Conditions",
      path: "/registration/termsAndCondition",
    },
    { label: "Privacy Policy", path: "/registration/privacyPolicy" },
    { label: "Contact Us", path: "/registration/contactUsPage" },
    {
      label: "Cancellations & Refunds",
      path: "/registration/cancellationsAndRefunds",
    },
  ];

  return (
    <footer className="bg-gradient-to-r from-[#fdf5f6] via-[#f3dee0] to-[#fdf5f6] text-gray-800 text-sm sm:text-base py-6 sm:py-8 px-6 rounded-3xl shadow-lg border-t border-pink-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0">
        
        {/* Left Section - Links */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5">
          {footerLinks.map((btn, i) => (
            <button
              key={i}
              onClick={() => navigate(btn.path)}
              className="border border-pink-300 text-gray-800 px-4 sm:px-5 py-2 rounded-full font-medium 
                         hover:bg-pink-600 hover:text-white transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Right Section - Copyright */}
        {/* <p className="text-center sm:text-right text-xs sm:text-sm text-gray-700 font-medium opacity-90">
          © {new Date().getFullYear()} SDAT. All Rights Reserved.
        </p> */}
      </div>
    </footer>
  );
};

export default PaymentFooter;
