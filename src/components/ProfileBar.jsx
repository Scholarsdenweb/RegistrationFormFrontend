import React, { useEffect, useState } from "react";
import profileImg from "../assets/profileImg.png";

import { useDispatch, useSelector } from "react-redux";
import { fetchFamilyDetails } from "../redux/slices/familyDetailsSlice";
import {
  fetchExistingUserDetails,
  updateExistingUserDetails,
} from "../redux/slices/existingStudentSlice";
import { Link, useNavigate } from "react-router-dom";

const ProfileBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { userData: existingStudentDetail } = useSelector(
    (state) => state.existingStudentDetails
  );

  const handleLogout = async () => {
    await dispatch(updateExistingUserDetails({ data: "" }));

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/registration";
    navigate("/");
  };

  useEffect(() => {
    console.log("TEST DATA ", existingStudentDetail);
  }, [existingStudentDetail]);

  //   useEffect(() => {
  //     dispatch(fetchExistingUserDetails());
  //   }, []);

  //   useEffect(() => {
  //     console.log("existingStudentDetail", existingStudentDetail);
  //   }, [existingStudentDetail]);

  return (
    <div className="w-9" onClick={toggleDropdown}>
      <img src={profileImg} alt="" />
      {/* Top Navbar */}
      <nav className="  ">
        <div className="">
          <div className="">
            <div className="flex items-center">
              <div className="flex items-center  relative">
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-1 right-0 z-50  bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 dark:text-white w-full whitespace-nowrap overflow-hidden">
                        {`Contact Number : ${
                          existingStudentDetail?.data[0]?.contactNumber
                            ? existingStudentDetail?.data[0]?.contactNumber
                            : existingStudentDetail?.userData[0]
                                ?.fatherContactNumber
                        }`}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      {/* <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Earnings
                        </a>
                      </li> */}
                      <li>
                        <Link
                          to="/"
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Sign out
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ProfileBar;
