import React from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
import { ToastContainer } from "react-toastify";
import CloudinaryUpload from "./CloudinaryUpload";
import AllFormsMain from "./AllFormsMain";

const AllFormsComponents = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Toast Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          {/* <Navbar /> */}

          <AdminHeader title="All Student Forms" subtitle="Search, filter, inspect, and export student registration records." />
          <AllFormsMain />
        </div>
      </div>
    </div>
  );
};

export default AllFormsComponents;
