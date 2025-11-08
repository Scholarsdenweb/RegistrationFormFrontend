import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserDetails } from "../../redux/slices/userDeailsSlice";

const TermsAndConditionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userDetails);

  const handleChange = (name, value) => {
    dispatch(updateUserDetails({ [name]: value }));
    navigate("/");
  };

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  const handleClose = () => {
    // If opened in a new tab/window, close it
    if (window.opener) {
      window.close();
    } else {
      // If not opened as a new tab, navigate back
      navigate("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 bg-[#fdf5f6] text-black shadow-md relative">
      {/* Title */}
      <h1 className="text-lg sm:text-2xl font-bold mb-4 text-center">
        Terms & Conditions
      </h1>

      {/* Close Button */}
      <button
        className="absolute top-2 right-6 text-lg sm:text-2xl border-2 px-3 py-1 sm:py-2 rounded-full text-black hover:bg-[#e2e1dc] hover:text-black"
        onClick={handleClose}
      >
        X
      </button>

      {/* Terms List */}
      <ol className="list-decimal pl-4 sm:pl-6 space-y-2 sm:space-y-3 text-sm sm:text-base text-justify">
        <li>
          In case of non-payment of fees by the due date, the student will not
          be allowed to attend classes. Scholars Den reserves the right to file
          a lawsuit to recover the remaining amount.
        </li>
        <li>If the payment of fees is made after the due date, late payment fees apply:</li>
        <ul className="list-disc pl-6 sm:pl-10">
          <li>For the first 7 days: ₹100 per day</li>
          <li>From 8th to 15th day: ₹500 per day</li>
          <li>After 15 days: ₹10,000 penalty + ₹1,000 per day late fee</li>
        </ul>
        <li>Scholarships are valid only till the announced date of validity.</li>
        <li>Refund of caution money requires an application with NOC.</li>
        <li>Refunds will be processed within 45 days (if eligible).</li>
        <li>No interest is paid on caution money refunds.</li>
        <li>
          Caution money will be refunded at the end of the session, subject to
          deductions for damages.
        </li>
        <li>No refund for fee defaulters or mid-session dropouts.</li>
        <li><strong>Fees paid for RISE & SDAT are non-refundable under any circumstances.</strong></li>
        <li>Refunds will be made as per the schedule below:</li>
        <ul className="list-disc pl-6 sm:pl-10">
          <li>Classes 6th–10th: From 1st September of the financial year.</li>
          <li>Classes 11th and above: From 1st September of the financial year.</li>
        </ul>
        <li>
          If a cheque is dishonored, a penalty of ₹2000 applies, with cash
          payment required within 3 days.
        </li>
        <li>
          Refund requests must be in the prescribed format. No phone or email
          requests are accepted.
        </li>
        <li>All legal matters are subject to Moradabad (UP) jurisdiction.</li>
        <li>No refund will be provided in case of expulsion due to disciplinary reasons.</li>
        <li>Tuition Fee Refund Policy:</li>
        <ul className="list-disc pl-6 sm:pl-10">
          <li>No refund after 30 days of batch commencement.</li>
          <li>Processing charges for refund:</li>
          <ul className="list-decimal pl-6 sm:pl-10">
            <li>No class attended: ₹5,000</li>
            <li>1 to 15 days: ₹10,000 (Foundation) / ₹15,000 (XI & above)</li>
            <li>16 to 30 days: ₹20,000 (Foundation) / ₹30,000 (XI & above)</li>
          </ul>
        </ul>
      </ol>

      {/* Agreement Section */}
      <p className="mt-6 font-bold text-center text-base sm:text-lg">
        I/We certify that we have read and agree to abide by the above terms and
        conditions.
      </p>
      <p className="font-bold text-center text-base sm:text-lg">
        मै/हम माणत करता/करती/करते है कि हमने उक्त नयम व शत को भली भांत पढ़ लया है व
        उनका पालन करेंगे।
      </p>

      {/* Agree Button */}
      {/* <div className="flex justify-center mt-4">
        <button
          className="w-full sm:w-auto hover:bg-[#ffdd00] hover:text-black border-2 py-2 px-4 rounded-lg transition duration-300"
          onClick={() => handleChange("termsAndCondition", true)}
        >
          Agree
        </button>
      </div> */}
    </div>
  );
};

export default TermsAndConditionPage;