import FormHeader from "./FormHeader";
import Right from "./Right";
import SignupRight from "./SignupRight";
// import scholarsDenLogo from "../../assets/scholarsDenLogo"


const Signup = () => {
  return (
    <div className="w-full min-h-screen flex flex-col gap-7 bg-[#c61d23]">
      {/* Signup Details Page (Top Section) */}
      <div className="flex px-4 md:px-8 py-2"><FormHeader /></div>

      {/* Signup Form (Middle Section) */}
      <div className="flex">
        <SignupRight />
      </div>

      {/* Footer (Logo at Bottom) */}
      {/* <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div> */}
    </div>
  );
};

export default Signup;
