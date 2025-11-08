
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import FormHeader from './LoginSugnup/FormHeader';
import PaymentFooter from './PaymentFooter';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);

  useEffect(() => {
    // Redirect to home if payment is not completed
    if (!userData.paymentId) {
      navigate('/');
    }
  }, [userData, navigate]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] to-[#ffe9eb] px-4 md:px-8 pt-6 overflow-auto">
      <div className="flex flex-col justify-between gap-8 max-w-2xl mx-auto h-full">
        {/* Header */}
        {/* <FormHeader /> */}

        {/* Main Success Card */}
        <div className="bg-white shadow-lg rounded-3xl px-6 sm:px-10 py-12 flex flex-col items-center justify-center gap-6">
          {/* Success Icon */}
          <div className="bg-green-100 rounded-full p-6 mb-4">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
            Payment Successful!
          </h1>

          <p className="text-gray-600 text-center text-lg">
            Thank you for completing your registration payment.
          </p>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 my-4"></div>

          {/* WhatsApp Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 w-full">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                <FaWhatsapp className="text-white text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Admit Card Delivery
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Your admit card will be sent to your registered WhatsApp number{' '}
                  <span className="font-semibold text-green-600">
                    {userData.contactNumber || 'XXXXXXXXXX'}
                  </span>{' '}
                  shortly.
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Please ensure your WhatsApp is active on this number.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 w-full mt-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> If you don't receive
              your admit card within 24 hours, please contact support.
            </p>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 transition-all duration-300 text-white font-semibold text-lg px-10 py-3 rounded-full shadow-md hover:shadow-lg active:scale-95"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Footer */}
        {/* <PaymentFooter /> */}
      </div>
    </div>
  );
};

export default PaymentSuccess;