import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#c61d23] text-white py-6 sm:py-6 rounded-t-xl ">
      <div className="flex flex-col sm:flex-row items-center justify-cenmter ">
        
        {/* Terms, Privacy, Contact Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/registration/termsAndCondition')}
            className="border border-white px-4 py-1 rounded hover:bg-white hover:text-[#c61d23] transition"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => navigate('/registration/privacyPolicy')}
            className="border border-white px-4 py-1 rounded hover:bg-white hover:text-[#c61d23] transition"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => navigate('/registration/contactUsPage')}
            className="border border-white px-4 py-1 rounded hover:bg-white hover:text-[#c61d23] transition"
          >
            Contact Us
          </button>
          <button
            onClick={() => navigate('/registration/cancellationsAndRefunds')}
            className="border border-white px-4 py-1 rounded hover:bg-white hover:text-[#c61d23] transition"
          >
            Cancellations & Refunds
          </button>
        </div>

        {/* Payment Action Buttons */}
        {/* <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-[#c61d23] font-semibold px-6 py-2 rounded hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            onClick={() => alert("Proceeding to payment...")}
            className="bg-[#ffdd00] text-black font-bold px-6 py-2 rounded hover:brightness-110 transition"
          >
            Proceed to Pay
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentFooter;
