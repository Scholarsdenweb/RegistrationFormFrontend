import React from "react";
import ScholarsDenLogo from "../assets/scholarsDenLogo.png";
import DashboardDarkMode from "../assets/DashboardDarkMode.png";
import DashboardLightMode from "../assets/DashboardLightMode.png";
import PaymentDarkMode from "../assets/PaymentDarkMode.png";
import PaymentLightMode from "../assets/PaymentLightMode.png";
import RegistrationDarkMode from "../assets/RegistrationDarkMode.png";
import RegistrationLightMode from "../assets/RegistrationLightMode.png";
import LogoutLightMode from "../assets/LogoutLightMode.png";
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
      <div className=" flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={ScholarsDenLogo} alt="" />
          <span className="text-white mt-3">Student Panel</span>
        </div>

        <div className="flex flex-col gap-7 w-full justify-end items-end">

        <Link
          to={"/dashboard"}
          className={`flex gap-3 w-5/6 items-end rounded-l-full p-3  ${
            location.pathname === "/dashboard"
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          {/* <div className="flex justify-center items-center gap-3"> */}

          <img
            src={
              location.pathname === "/dashboard"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          />
          <h4>Dashboard</h4>
          {/* </div> */}
        </Link>
        <Link
          to={"/payment"}
          className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 ${
            location.pathname === "/payment"
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >

{/* <div className="flex justify-center items-center gap-3"> */}

          <img 
            src={
              location.pathname === "/payment"
                ? PaymentDarkMode
                : PaymentLightMode
            }
            alt=""
          />
          <h4>Payment Info</h4>
          {/* </div> */}
        </Link>
        <Link
          to={"/registration/basicDetailsForm"}
          className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 ${
            location.pathname.includes("/registration")
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          <img
            src={
              location.pathname === "/registration/basicDetailsForm" || location.pathname === "/registration/educationalDetailsForm"
                ? RegistrationDarkMode
                : RegistrationLightMode
            }
            alt=""
          />
          <h4>Registration</h4>
        </Link>
        {/* <Link
          to={"/result"}
          className={`flex gap-3 justify-end w-5/6 items-end rounded-l-full p-3 ${
            location.pathname.includes("/result")
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          <img
            src={
              location.pathname === "/result"
                ? RegistrationDarkMode
                : RegistrationLightMode
            }
            alt=""
          />
          <h4>Result</h4>
          
        </Link> */}

        </div>
      </div>

      <div className={`flex gap-3 justify-center mb-9 text-white cursor-pointer `}
      onClick={handleLogout}
      >
        <img src={LogoutLightMode} alt="" />
        <h4>Logout</h4>
      </div>
    </div>
  );
};

export default Sidebar;
