import Right from "../../LoginSugnup/Right";
import LoginRight from "../../LoginSugnup/SignupRight";
import { useDispatch, useSelector } from "react-redux";

import Spinner from "../../../api/Spinner";
import { useEffect } from "react";
import { setLoading } from "../../../redux/slices/loadingSlice";
// import AdminLoginLeft from "./AdminLoginLeft";
import FormHeader from "../../LoginSugnup/FormHeader";
import AdminLoginLeft from "./AdminLoginLeft";

const AdminLogin = () => {
  const { loading } = useSelector((state) => state.loadingDetails);
  const dispatch = useDispatch();
  // console.log("loading", loading)
  useEffect(() => {
    dispatch(setLoading(false));
  }, []);
  return loading ? (
    <Spinner />
  ) : (
    <div className="w-full min-h-screen flex flex-col gap-7 bg-[#c61d23]">
      {/* Signup Details Page (Top Section) */}
      <div className="flex px-4 md:px-8 py-2">
        <FormHeader />
      </div>

      {/* Signup Form (Middle Section) */}
      <div className="flex">
        {/* <SignupRight /> */}
        <AdminLoginLeft />
      </div>

      {/* Footer (Logo at Bottom) */}
      {/* <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div> */}
    </div>

    //   <div
    //   className="grid grid-cols-12 justify-between items-center h-screen"
    //   style={{ backgroundColor: "#c61d23" }}
    // >
    //   <div className="col-span-5 gap-3">
    //   </div>
    //   <div className="col-span-7 flex justify-center p-6 w-full h-full">
    //           <Right text="Employee"/>

    //   </div>
    // </div>
  );
};

// {loading && (
//   <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
//     <Spinner />
//   </div>
// )}

export default AdminLogin;
