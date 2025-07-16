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
    <div className="flex justify-center items-center gap-4 w-full py-6">
      {pageUrls.map((url, index) => {
        const fullPath = `/${url}`;
        const isActive = currentPath === fullPath;

        return (
          <React.Fragment key={url}>
            <Link
                // to={fullPath}
              aria-current={isActive ? "page" : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-bold transition-all duration-300 
              ${
                isActive
                  ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black shadow-lg border-yellow-500 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border-gray-300"
              }`}
            >
              {index + 1}
            </Link>

            {index < pageUrls.length - 1 && (
              <span className="text-gray-300 text-2xl select-none">
                {/* Unicode arrow → or use an SVG */}
                →
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PageNumberComponent;
