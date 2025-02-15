import React from "react";
import ScholarsDenLogo from "../../../assets/scholarsDenLogo.png";
import DashboardDarkMode from "../../../assets/DashboardDarkMode.png";
import DashboardLightMode from "../../../assets/DashboardLightMode.png";
import PaymentDarkMode from "../../../assets/PaymentDarkMode.png";
import PaymentLightMode from "../../../assets/PaymentLightMode.png";
import RegistrationDarkMode from "../../../assets/RegistrationDarkMode.png";
import RegistrationLightMode from "../../../assets/RegistrationLightMode.png";
import LogoutLightMode from "../../../assets/LogoutLightMode.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  }

  return (
    <div
      className="flex flex-col justify-between h-screen pt-4 md:w-full"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className=" flex flex-col gap-8">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={ScholarsDenLogo} alt="" />
          <span className="text-white mt-3">Emplyee Panel</span>
        </div>

        <Link
          to={"/dashboard"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/employee/dashboard"
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          <img
            src={
              location.pathname === "/employee/dashboard"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          />
          <h4>Upload Result</h4>
        </Link>
      
      </div>

      <div className={`flex gap-3  ml-16 mb-9 text-white cursor-pointer `}
      onClick={handleLogout}
      >
        <img src={LogoutLightMode} alt="" />
        <h4>Logout</h4>
      </div>
    </div>
  );
};

export default Sidebar;