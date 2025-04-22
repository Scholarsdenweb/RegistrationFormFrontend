import React, { useState } from "react";
import ShowExistingStudentDetails from "./ShowExistingStudentDetails";
import { updateExistingUserDetails } from "../redux/slices/existingStudentSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ExistingStudent = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(updateExistingUserDetails({ userdata: "" }));

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {loading && <Spinner />}

      <div className="flex flex-col gap-6 mx-auto">
        <div className="text-3xl text-white text-center">
          {/* <FormHeader /> */}
          S.DAT Registration
        </div>

        {/* <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
        Registration Form For SDAT
      </h1> */}

        {/* <PageNumberComponent /> */}
        <ShowExistingStudentDetails />

        <div className="flex justify-end ">
          <button
            onClick={handleLogout}
            className="bg-[#ffdd00] p-3 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExistingStudent;
