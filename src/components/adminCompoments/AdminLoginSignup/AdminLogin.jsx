// import Right from "../../LoginSugnup/Right";
// import LoginRight from "../../LoginSugnup/SignupRight";
// import { useDispatch, useSelector } from "react-redux";

// import Spinner from "../../../api/Spinner";
// import { useEffect } from "react";
// import { setLoading } from "../../../redux/slices/loadingSlice";
// // import AdminLoginLeft from "./AdminLoginLeft";
// import FormHeader from "../../LoginSugnup/FormHeader";
// import AdminLoginLeft from "./AdminLoginLeft";

// const AdminLogin = () => {
//   const { loading } = useSelector((state) => state.loadingDetails);
//   const dispatch = useDispatch();
//   // console.log("loading", loading)
//   useEffect(() => {
//     dispatch(setLoading(false));
//   }, []);
//   return loading ? (
//     <Spinner />
//   ) : (
//     <div
//       className="grid grid-cols-12 justify-between items-center h-screen"
//       style={{ backgroundColor: "#fdf5f6" }}
//     >
//       <div className="col-span-5 gap-3">
//         <AdminLoginLeft />
//       </div>
//       <div className="col-span-7 flex justify-center p-6 w-full h-full">
//         <Right text={"Employee"} />
//       </div>
//     </div>
//   );
// };

// // {loading && (
// //   <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
// //     <Spinner />
// //   </div>
// // )}

// export default AdminLogin;

import FormHeader from "../../LoginSugnup/FormHeader";
// import Right from "./Right";
// import SignupRight from "./SignupRight";
import scholarsDenLogo from "../../../assets/scholarsDenLogo.png";
import AdminLoginLeft from "./AdminLoginLeft";

// import sdatLogo from "../../assets/SDATLogo.png";

const AdminLogin = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0] overflow-hidden">
      {/* Header */}
      <div className=" bg-white/50 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <FormHeader logoSrc={scholarsDenLogo} />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AdminLoginLeft />

        {/* <SignupRight logoSrc={sdatLogo} /> */}
      </div>
    </div>
  );
};

export default AdminLogin;
