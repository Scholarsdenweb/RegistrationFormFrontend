import React, { useState } from "react";
import ShowExistingStudentDetails from "./ShowExistingStudentDetails";
import { updateExistingUserDetails } from "../redux/slices/existingStudentSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileBar from "./ProfileBar";
import { LogOut, GraduationCap } from "lucide-react";

const ExistingStudent = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    await dispatch(updateExistingUserDetails({ userdata: "" }));
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-[#fdf5f6]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  SDAT Registration
                </h1>
                {/* <p className="text-xs text-gray-500 hidden sm:block">Student Portal</p> */}
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center">
              <ProfileBar onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="max-w-6xl mx-auto">
          <ShowExistingStudentDetails />
        </div>
      </div>
    </div>
  );
};

export default ExistingStudent;