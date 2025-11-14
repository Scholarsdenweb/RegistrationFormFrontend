import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExistingUserDetails } from "../redux/slices/existingStudentSlice";
import { LogOut, ChevronDown, Phone, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileBar = ({ onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { userData: existingStudentDetail } = useSelector(
    (state) => state.existingStudentDetails
  );

  const { logout } = useAuth();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogoutClick = async () => {
    await dispatch(updateExistingUserDetails({ data: "" }));
    // document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    // document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/registration";
    logout();

    setDropdownOpen(false);
    if (onLogout) onLogout();
  };

  const studentData =
    existingStudentDetail?.data?.[0] || existingStudentDetail?.userData?.[0];
  const contactNumber =
    studentData?.contactNumber || studentData?.fatherContactNumber || "N/A";
  const studentName = studentData?.name || "Student";
  const profilePicture = studentData?.profilePicture;

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        aria-label="Profile menu"
      >
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#c61d23]/20 to-[#ffdd00]/10 border border-[#c61d23]/20 group-hover:border-[#c61d23]/40 transition-all">
          {profilePicture &&
          // ? (
          //   <img
          //     src={profilePicture}
          //     alt={studentName}
          //     className="w-full h-full rounded-full object-cover"
          //   />
          // ) : (
            <User size={20} className="text-[#c61d23]" />
          // )
          }
        </div> 
        <div className="hidden sm:flex flex-col items-start">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Student
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
            {studentName}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-600 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
          {/* Profile Section */}
          <div className="p-4 bg-gradient-to-r from-[#fdf5f6] to-[#f5eff0] border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c61d23] to-[#a01818] flex items-center justify-center overflow-hidden flex-shrink-0">
                {profilePicture &&
                // ? (
                //   <img
                //     src={profilePicture}
                //     alt={studentName}
                //     className="w-full h-full object-cover"
                //   />
                // ) : (
                  <User size={24} className="text-white" />
                // )
              }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {studentName}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Phone size={12} />
                  <span className="truncate">{contactNumber}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <LogOut size={16} className="text-[#c61d23]" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            {/* <p>© 2024 RISE Registration</p> */}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ProfileBar;
