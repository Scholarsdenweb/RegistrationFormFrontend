import ScholarsDenLogo from "../../../assets/scholarsDenLogo.png";
import DashboardDarkMode from "../../../assets/DashboardDarkMode.png";
import DashboardLightMode from "../../../assets/DashboardLightMode.png";

import logoutIcon from "../../../assets/logoutIcon.png";
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
      className="flex text-black flex-col justify-between h-screen pt-4 md:w-full"
      style={{ backgroundColor: "#fdf5f6" }}
    >
      <div className=" flex flex-col gap-5">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={ScholarsDenLogo} alt="" />
          <span className="text-black mt-3">Admin Panel</span>
        </div>

        <Link
          to={"/admin/dashboard"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/dashboard"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img className="w-4"
            src={
              location.pathname === "/admin/dashboard"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>Upload Result</h4>
        </Link>
        <Link
          to={"/admin/allStudents"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/allStudents"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/allStudents"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>All Results</h4>
        </Link>
        <Link
          to={"/admin/addExamDate"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/addExamDate"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/addExamDate"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>Add Exam Date</h4>
        </Link>
        <Link
          to={"/admin/downloadResult"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/downloadResult"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/downloadResult"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>Download Result</h4>
        </Link>
        <Link
          to={"/admin/CloudinaryUpload"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/CloudinaryUpload"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/CloudinaryUpload"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>Upload Student Pictures</h4>
        </Link>
        <Link
          to={"/admin/allForms"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/allForms"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/allForms"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>All Rise Forms</h4>
        </Link>
        <Link
          to={"/admin/amount"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/amount"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/allForms"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>Amount</h4>
        </Link>
       


       <Link
          to={"/admin/add-student-registration"}
          className={`flex gap-3 rounded-l-full ml-16 p-3 ${
            location.pathname === "/admin/add-student-registration"
              ? "text-red-600 bg-white"
              : "text-black"
          } `}
        >
          {/* <img
            src={
              location.pathname === "/admin/allForms"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          /> */}
          <h4>Add Student Registration</h4>
        </Link>
      
      </div>

      <div className={`flex gap-3  items-center ml-16 mb-9 text-black cursor-pointer `}
      onClick={handleLogout}
      >
        <img src={logoutIcon} alt="" />
        <h4>Logout</h4>
      </div>
    </div>
  );
};

export default Sidebar;