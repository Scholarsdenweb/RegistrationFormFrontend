import FormHeader from "./FormHeader";
import Right from "./Right";
import SignupRight from "./SignupRight";
import scholarsDenLogo from "../../assets/scholarsDenLogo.png";
import sdatLogo from "../../assets/SDATLogo.png";

const Signup = () => {
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
        <SignupRight logoSrc={sdatLogo} />
      </div>
    </div>
  );
};

export default Signup;

