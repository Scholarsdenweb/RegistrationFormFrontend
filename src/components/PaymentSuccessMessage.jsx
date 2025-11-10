// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
// import FormHeader from './LoginSugnup/FormHeader';
// import PaymentFooter from './PaymentFooter';

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const { userData } = useSelector((state) => state.userDetails);

//   useEffect(() => {
//     // Redirect to home if payment is not completed
//     if (!userData.paymentId) {
//       navigate('/');
//     }
//   }, [userData, navigate]);

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] to-[#ffe9eb] px-4 md:px-8 pt-6 overflow-auto">
//       <div className="flex flex-col justify-between gap-8 max-w-2xl mx-auto h-full">
//         {/* Header */}
//         {/* <FormHeader /> */}

//         {/* Main Success Card */}
//         <div className="bg-white shadow-lg rounded-3xl px-6 sm:px-10 py-12 flex flex-col items-center justify-center gap-6">
//           {/* Success Icon */}
//           <div className="bg-green-100 rounded-full p-6 mb-4">
//             <FaCheckCircle className="text-green-500 text-6xl" />
//           </div>

//           {/* Success Message */}
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
//             Payment Successful!
//           </h1>

//           <p className="text-gray-600 text-center text-lg">
//             Thank you for completing your registration payment.
//           </p>

//           {/* Divider */}
//           <div className="w-full border-t border-gray-200 my-4"></div>

//           {/* WhatsApp Message */}
//           <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 w-full">
//             <div className="flex items-start gap-4">
//               <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
//                 <FaWhatsapp className="text-white text-3xl" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   Admit Card Delivery
//                 </h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   Your admit card will be sent to your registered WhatsApp number{' '}
//                   <span className="font-semibold text-green-600">
//                     {userData.contactNumber || 'XXXXXXXXXX'}
//                   </span>{' '}
//                   shortly.
//                 </p>
//                 <p className="text-sm text-gray-500 mt-3">
//                   Please ensure your WhatsApp is active on this number.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Additional Info */}
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 w-full mt-4">
//             <p className="text-sm text-gray-700">
//               <span className="font-semibold">Note:</span> If you don't receive
//               your admit card within 24 hours, please contact support.
//             </p>
//           </div>

//           {/* Back to Dashboard Button */}
//           <button
//             onClick={() => navigate('/')}
//             className="mt-6 bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 transition-all duration-300 text-white font-semibold text-lg px-10 py-3 rounded-full shadow-md hover:shadow-lg active:scale-95"
//           >
//             Go to Dashboard
//           </button>
//         </div>

//         {/* Footer */}
//         {/* <PaymentFooter /> */}
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../api/axios"
import {
  CheckCircle,
  MessageCircle,
  Clock,
  FileText,
  Home,
  AlertCircle,
} from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [resultGenerated, setResultGenerated] = useState(false);

  useEffect(() => {
    // Redirect to home if payment is not completed
    if (!userData.paymentId) {
      navigate("/");
    }
  }, [userData, navigate]);

  const generateAdmitCard = async () => {
    try {
      // setLoading(true);
      const response = await axios.post("/payment/generateAdmitCard");

      console.log("response from generateAdmitCard", response);
      setResultGenerated(true);

      // setAdmitCardStatus("Generated");
      // setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (userData.paymentId) {
      generateAdmitCard();
    }
  }, [userData]);

  useEffect(() => {
    if (userData.paymentId) {
      setPaymentCompleted(true);
    }

    console.log("userData ", userData);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                  Registration Complete
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Payment verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 mb-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-emerald-100 to-green-100 rounded-full p-6 border-4 border-emerald-200">
                  <CheckCircle size={64} className="text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Payment Successful!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for completing your SDAT registration payment.
              </p>
              <div className="inline-block mt-4 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm font-semibold text-emerald-700">
                  Payment ID: {userData.paymentId || "XXXXXXXXXX"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-200 my-8"></div>

            {/* WhatsApp Message Section */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle size={20} className="text-green-600" />
                What's Next?
              </h3>

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 flex-shrink-0 shadow-lg">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Admit Card Delivery
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Your admit card will be sent to your registered WhatsApp
                      number{" "}
                      <span className="font-semibold text-green-700">
                        {userData.contactNumber || "XXXXXXXXXX"}
                      </span>{" "}
                      shortly.
                    </p>
                    <p className="text-sm text-gray-600 mt-3 flex items-start gap-2">
                      <Clock
                        size={16}
                        className="text-green-600 flex-shrink-0 mt-0.5"
                      />
                      Please ensure your WhatsApp is active on this number.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-3 mt-6">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Timeline
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      title: "Payment Verified",
                      desc: "Your payment has been confirmed",
                      time: "Just now",
                      completed: paymentCompleted,
                    },
                    {
                      step: 2,
                      title: "Processing",
                      desc: "Admission being processed",
                      time: "1-2 hours",
                      completed: resultGenerated,
                    },
                    {
                      step: 3,
                      title: "Admit Card",
                      desc: "Admit card will be sent on WhatsApp",
                      time: "Within 24 hours",
                      completed: false,
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                            item.completed
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle size={20} />
                          ) : (
                            item.step
                          )}
                        </div>
                        {item.step < 3 && (
                          <div
                            className={`w-1 h-8 ${
                              item.completed ? "bg-emerald-600" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-200 my-8"></div>

            {/* Important Notice */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-8">
              <div className="flex gap-3">
                <AlertCircle
                  size={18}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">
                    Important Note
                  </p>
                  <p className="text-sm text-amber-800">
                    If you don't receive your admit card within 24 hours, please
                    contact our support team immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex gap-4">
                <FileText size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What to do next?
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-blue-600" />
                      Check your WhatsApp for the admit card
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-blue-600" />
                      Verify all details on the admit card
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-blue-600" />
                      Save and print a copy for your records
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/registration/existingStudent")}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 text-lg"
              >
                <FileText size={20} />
                View Your Profile
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300"
              >
                <Home size={18} />
                Go to Home
              </button>
            </div>
          </div>

          {/* Floating Success Message */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Thank you for joining SDAT! We're excited to have you on board. 🎓
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
