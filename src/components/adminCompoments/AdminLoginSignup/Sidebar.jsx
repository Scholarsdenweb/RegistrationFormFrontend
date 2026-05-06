import ScholarsDenLogo from "../../../assets/scholarsDenLogo.png";

import logoutIcon from "../../../assets/logoutIcon.png";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
    setIsOpen(false);
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Upload Result" },
    { to: "/admin/allStudents", label: "All Results" },
    { to: "/admin/addExamDate", label: "Add Exam Date" },
    { to: "/admin/downloadResult", label: "Download Result" },
    { to: "/admin/CloudinaryUpload", label: "Upload Student Pictures" },
    { to: "/admin/allForms", label: "All Rise Forms" },
    { to: "/admin/amount", label: "Amount" },
    { to: "/admin/add-student-registration", label: "Add Student Registration" },
  ];

  const navContent = (
    <div className="px-4 py-4 lg:px-5 lg:py-6 h-full flex flex-col justify-between">
        <div className="space-y-4 lg:space-y-6">
          <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:gap-2">
            <img className="w-12 h-12 lg:w-16 lg:h-16" src={ScholarsDenLogo} alt="Scholars Den Logo" />
            <span className="text-sm lg:text-base font-medium">Admin Panel</span>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "text-red-600 bg-white"
                      : "text-black bg-white/60 hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className="mt-4 lg:mt-6 flex gap-3 items-center text-black cursor-pointer px-3 py-2 rounded-xl hover:bg-white w-fit"
          onClick={handleLogout}
        >
          <img src={logoutIcon} alt="Logout" />
          <h4>Logout</h4>
        </div>
      </div>
  );

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-30 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-sm font-semibold text-gray-800 shadow-md backdrop-blur"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-base leading-none">☰</span> Menu
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#fff7f8] to-[#f8ecee] text-black border-r border-gray-200 transform transition-transform duration-300 lg:static lg:transform-none lg:w-full lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {navContent}
      </div>
    </>
  );
};

export default Sidebar;
