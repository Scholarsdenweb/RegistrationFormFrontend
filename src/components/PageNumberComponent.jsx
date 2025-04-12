import React from "react";
import { Link, useLocation } from "react-router-dom";

const PageNumberComponent = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const pageUrls = [
      "registration/basicDetailsForm",
      "registration/batchDetailsForm",
    "registration/educationalDetailsForm",
    "registration/familyDetailsForm",
  ];

  return (
    <div className="flex justify-center gap-6 w-full">
      {pageUrls.map((url, index) => {
        const fullPath = `/${url}`;
        const isActive = currentPath === fullPath;

        return (
          <Link
            key={url}
            // to={fullPath}
            className={`rounded-full py-1 px-4 transition duration-200 font-semibold ${
              isActive ? "bg-[#ffdd00] text-black shadow-lg" : "bg-white text-black"
            }`}
          >
            {index + 1}
          </Link>
        );
      })}
    </div>
  );
};

export default PageNumberComponent;
