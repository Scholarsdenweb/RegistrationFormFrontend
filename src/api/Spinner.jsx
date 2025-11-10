// import React from "react";
// import { useState } from "react";
// import BeatLoader from "react-spinners/BeatLoader";

// const Spinner = () => {
//   let [loading, setLoading] = useState(true);
//   let [color, setColor] = useState("#ffffff");
//   return (
//     <div
//       className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center h-full w-full bg-black bg-opacity-50 backdrop-blur-sm"
//     >
//       <BeatLoader
//         color="#c61d23"
//         loading
//         margin={8}
//         size={18}
//         speedMultiplier={1}
//       />
//     </div>
//   );
// };

// export default Spinner;








import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { Loader } from "lucide-react";

const Spinner = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-full w-full bg-black/40 backdrop-blur-md">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4 animate-fade-in">
        {/* Spinner */}
        <div className="flex justify-center">
          <BeatLoader
            color="#c61d23"
            loading={loading}
            margin={8}
            size={18}
            speedMultiplier={1}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">Processing</p>
          <p className="text-xs text-gray-600 mt-1">Please wait...</p>
        </div>

        {/* Progress Dots */}
        {/* <div className="flex gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-[#c61d23]/40 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-[#c61d23]/60 animate-pulse" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 rounded-full bg-[#c61d23] animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        </div> */}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Spinner;