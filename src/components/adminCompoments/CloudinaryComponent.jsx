import React from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
import { ToastContainer } from "react-toastify";
import CloudinaryUpload from "./CloudinaryUpload";

const CloudinaryComponents = () => {
  return (
    <div className="w-full min-h-screen bg-[#fdf5f6]">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Toast Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 xl:col-span-10 p-4 sm:p-6">
          {/* <Navbar /> */}

          <CloudinaryUpload />
        </div>
      </div>
    </div>
  );
};

export default CloudinaryComponents;
