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

// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import axios from "../api/axios";
// import {
//   CheckCircle,
//   MessageCircle,
//   Clock,
//   FileText,
//   Home,
//   AlertCircle,
// } from "lucide-react";
// import { fetchUserDetails } from "../redux/slices/userDeailsSlice";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   // const { userData } = useSelector((state) => state.userDetails);

//   const { userData } = useSelector((state) => state.userDetails);

//   const [paymentCompleted, setPaymentCompleted] = useState(false);

//   const [admitCardGenerated, setAdmitCardGenerated] = useState(false);

//   const [sendAdmitCardStatus, setSendAdmitCardStatus] = useState(false);

//   const location = useLocation();

//   const pathLocation = location.pathname;

//   useEffect(() => {
//     // Redirect to home if payment is not completed

//     console.log("test data ", !userData?.paymentId);
//     if (!userData?.paymentId) {
//       navigate("/");
//     }
//     setPaymentCompleted(userData?.paymentId ? true : false);
//     setAdmitCardGenerated(userData?.admitCard ? true : false);
//     setSendAdmitCardStatus(userData?.messageStatus?.admitCardSend);
//   }, [userData, navigate]);

//   const generateAdmitCard = async () => {
//     try {
//       // setLoading(true);
//       const response = await axios.post("/payment/generateAdmitCard");

//       console.log("response from generateAdmitCard", response);
//       setAdmitCardGenerated(true);

//       // await Promise.all([dispatch(fetchUserDetails())]);

//       // setAdmitCardStatus("Generated");
//       // setLoading(false);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const sendAdmitCard = async () => {
//     try {
//       const response = await axios.post("/payment/sendAdmitCard", {
//         studentId: userData?.StudentsId,
//       });

//       console.log("response from sendAdmitCard", response);
//       setSendAdmitCardStatus(true);
//     } catch (error) {
//       console.log("error from sendAdmitCard", error);
//     }
//   };

//   useEffect(() => {
//     console.log("userData", userData);
//     if (userData.paymentId) {
//       generateAdmitCard();
//     }
//     if (userData?.admitCard) {
//       sendAdmitCard();
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (userData.paymentId) {
//       setPaymentCompleted(true);
//     }

//     console.log("userData ", userData);
//   }, []);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         await Promise.all([dispatch(fetchUserDetails())]);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load registration data");
//       }
//     };

//     fetchAllData();
//   }, [dispatch, pathLocation]);

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
//       {/* Navigation Bar */}
//       <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 sm:h-20">
//             <div className="flex items-center gap-3">
//               <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600">
//                 <CheckCircle size={24} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
//                   Registration Complete
//                 </h1>
//                 <p className="text-xs text-gray-500 hidden sm:block">
//                   Payment verified
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Decorative Background */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/20 to-transparent rounded-full blur-3xl"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative py-8 sm:py-12">
//         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Success Card */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 mb-6">
//             {/* Success Icon */}
//             <div className="flex justify-center mb-8">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"></div>
//                 <div className="relative bg-gradient-to-br from-emerald-100 to-green-100 rounded-full p-6 border-4 border-emerald-200">
//                   <CheckCircle size={64} className="text-emerald-600" />
//                 </div>
//               </div>
//             </div>

//             {/* Success Message */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
//                 Payment Successful!
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 Thank you for completing your SDAT registration payment.
//               </p>
//               <div className="inline-block mt-4 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
//                 <p className="text-sm font-semibold text-emerald-700">
//                   Payment ID: {userData.paymentId || "XXXXXXXXXX"}
//                 </p>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="w-full border-t border-gray-200 my-8"></div>

//             {/* WhatsApp Message Section */}
//             <div className="space-y-4 mb-8">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <MessageCircle size={20} className="text-green-600" />
//                 What's Next?
//               </h3>

//               {/* WhatsApp Card */}
//               <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6">
//                 <div className="flex items-start gap-4">
//                   <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 flex-shrink-0 shadow-lg">
//                     <MessageCircle size={24} className="text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-2">
//                       Admit Card Delivery
//                     </h4>
//                     <p className="text-gray-700 leading-relaxed">
//                       Your admit card will be sent to your registered WhatsApp
//                       number{" "}
//                       <span className="font-semibold text-green-700">
//                         {userData.contactNumber || "XXXXXXXXXX"}
//                       </span>{" "}
//                       shortly.
//                     </p>
//                     <p className="text-sm text-gray-600 mt-3 flex items-start gap-2">
//                       <Clock
//                         size={16}
//                         className="text-green-600 flex-shrink-0 mt-0.5"
//                       />
//                       Please ensure your WhatsApp is active on this number.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Timeline Steps */}
//               <div className="space-y-3 mt-6">
//                 <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
//                   Timeline
//                 </h4>
//                 <div className="space-y-3">
//                   {[
//                     {
//                       step: 1,
//                       title: "Payment Verified",
//                       desc: "Your payment has been confirmed",
//                       time: "Just now",
//                       completed: paymentCompleted,
//                     },
//                     {
//                       step: 2,
//                       title: "Processing",
//                       desc: "Admission being processed",
//                       time: "1-2 hours",
//                       completed: admitCardGenerated,
//                     },
//                     {
//                       step: 3,
//                       title: "Admit Card",
//                       desc: "Admit card will be sent on WhatsApp",
//                       time: "Within 24 hours",
//                       completed: sendAdmitCardStatus,
//                     },
//                   ].map((item) => (
//                     <div key={item.step} className="flex gap-4">
//                       <div className="relative flex flex-col items-center">
//                         <div
//                           className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
//                             item.completed
//                               ? "bg-emerald-600 text-white"
//                               : "bg-gray-200 text-gray-600"
//                           }`}
//                         >
//                           {item.completed ? (
//                             <CheckCircle size={20} />
//                           ) : (
//                             item.step
//                           )}
//                         </div>
//                         {item.step < 3 && (
//                           <div
//                             className={`w-1 h-8 ${
//                               item.completed ? "bg-emerald-600" : "bg-gray-200"
//                             }`}
//                           ></div>
//                         )}
//                       </div>
//                       <div className="pb-6">
//                         <p className="font-semibold text-gray-900">
//                           {item.title}
//                         </p>
//                         <p className="text-sm text-gray-600">{item.desc}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {item.time}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="w-full border-t border-gray-200 my-8"></div>

//             {/* Important Notice */}
//             <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-8">
//               <div className="flex gap-3">
//                 <AlertCircle
//                   size={18}
//                   className="text-amber-600 flex-shrink-0 mt-0.5"
//                 />
//                 <div>
//                   <p className="font-semibold text-amber-900 mb-1">
//                     Important Note
//                   </p>
//                   <p className="text-sm text-amber-800">
//                     If you don't receive your admit card within 24 hours, please
//                     contact our support team immediately.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Next Steps Info */}
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6 mb-8">
//               <div className="flex gap-4">
//                 <FileText size={24} className="text-blue-600 flex-shrink-0" />
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">
//                     What to do next?
//                   </h4>
//                   <ul className="space-y-2 text-sm text-gray-700">
//                     <li className="flex items-center gap-2">
//                       <CheckCircle size={16} className="text-blue-600" />
//                       Check your WhatsApp for the admit card
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <CheckCircle size={16} className="text-blue-600" />
//                       Verify all details on the admit card
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <CheckCircle size={16} className="text-blue-600" />
//                       Save and print a copy for your records
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => navigate("/registration/existingStudent")}
//                 className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 text-lg"
//               >
//                 <FileText size={20} />
//                 View Your Profile
//               </button>

//               <button
//                 onClick={() => navigate("/")}
//                 className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300"
//               >
//                 <Home size={18} />
//                 Go to Home
//               </button>
//             </div>
//           </div>

//           {/* Floating Success Message */}
//           <div className="text-center mt-8">
//             <p className="text-sm text-gray-600">
//               Thank you for joining SDAT! We're excited to have you on board. 🎓
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;


import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "../api/axios";
import {
  CheckCircle,
  MessageCircle,
  Clock,
  FileText,
  Home,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { fetchUserDetails } from "../redux/slices/userDeailsSlice";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, loading } = useSelector((state) => state.userDetails);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [sendingStatus, setSendingStatus] = useState("");

  const admitCardGeneratedRef = useRef(false);
  const admitCardSentRef = useRef(false);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await dispatch(fetchUserDetails());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchAllData();
  }, [dispatch]);

  // Redirect logic - only after initial load is complete
  useEffect(() => {
    if (isInitialLoad || loading) {
      return;
    }

    if (!userData?.paymentId) {
      console.log("No payment ID found, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [userData, navigate, isInitialLoad, loading]);

  // Generate admit card
  const generateAdmitCard = useCallback(async () => {
    if (isGenerating || admitCardGeneratedRef.current) return;

    try {
      admitCardGeneratedRef.current = true;
      setIsGenerating(true);
      setGenerationStatus("generating");
      console.log("Generating admit card...");

      const response = await axios.post("/payment/generateAdmitCard");
      console.log("response from generateAdmitCard", response);

      setGenerationStatus("generated");
      await dispatch(fetchUserDetails());
    } catch (error) {
      console.error("Error generating admit card:", error);
      admitCardGeneratedRef.current = false;
      setGenerationStatus("");
    } finally {
      setIsGenerating(false);
    }
  }, [dispatch, isGenerating]);

  // Send admit card
  const sendAdmitCard = useCallback(async () => {
    if (isSending || admitCardSentRef.current) return;

    try {
      admitCardSentRef.current = true;
      setIsSending(true);
      setSendingStatus("sending");
      console.log("Sending admit card...");

      const response = await axios.post("/payment/sendAdmitCard", {
        studentId: userData?.StudentsId,
      });
      console.log("response from sendAdmitCard", response);

      setSendingStatus("sent");
      await dispatch(fetchUserDetails());
    } catch (error) {
      console.error("error from sendAdmitCard", error);
      admitCardSentRef.current = false;
      setSendingStatus("");
    } finally {
      setIsSending(false);
    }
  }, [dispatch, isSending, userData?.StudentsId]);

  // Auto-generate and send admit card
  useEffect(() => {
    if (isInitialLoad || !userData?.paymentId) {
      return;
    }

    if (!userData.admitCard && !admitCardGeneratedRef.current) {
      generateAdmitCard();
      return;
    }

    if (
      userData.admitCard &&
      !userData.messageStatus?.admitCardSend &&
      !admitCardSentRef.current
    ) {
      sendAdmitCard();
    }
  }, [
    userData?.paymentId,
    userData?.admitCard,
    userData?.messageStatus?.admitCardSend,
    isInitialLoad,
    generateAdmitCard,
    sendAdmitCard,
  ]);

  // Show loading state
  // if (isInitialLoad || loading) {
  //   return (
  //     <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0] flex items-center justify-center px-4">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600 text-sm sm:text-base">Loading payment details...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const paymentCompleted = !!userData?.paymentId;
  const admitCardGenerated = !!userData?.admitCard;
  const admitCardSent = !!userData?.messageStatus?.admitCardSend;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar - Mobile Optimized */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600">
                <CheckCircle size={18} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
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
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-green-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="relative py-4 sm:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Success Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
            {/* Success Icon - Mobile Optimized */}
            <div className="flex justify-center mb-4 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl sm:blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-emerald-100 to-green-100 rounded-full p-4 sm:p-6 border-2 sm:border-4 border-emerald-200">
                  <CheckCircle size={48} className="text-emerald-600 sm:w-16 sm:h-16" />
                </div>
              </div>
            </div>

            {/* Success Message - Mobile Optimized */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Payment Successful!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-2">
                Thank you for completing your SDAT registration payment.
              </p>
              <div className="inline-block mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-emerald-700 break-all">
                  Payment ID: {userData?.paymentId || "XXXXXXXXXX"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-200 my-6 sm:my-8"></div>

            {/* WhatsApp Message Section - Mobile Optimized */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle size={18} className="text-green-600 sm:w-5 sm:h-5" />
                What's Next?
              </h3>

              {/* WhatsApp Card - Mobile Optimized */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 sm:p-3 flex-shrink-0 shadow-lg">
                    <MessageCircle size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      Admit Card Delivery
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Your admit card{" "}
                      {admitCardSent ? "has been sent" : "will be sent"} to your
                      registered WhatsApp number{" "}
                      <span className="font-semibold text-green-700 break-all">
                        {userData?.contactNumber || "XXXXXXXXXX"}
                      </span>
                      {admitCardSent ? "." : " shortly."}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 flex items-start gap-2">
                      <Clock
                        size={14}
                        className="text-green-600 flex-shrink-0 mt-0.5 sm:w-4 sm:h-4"
                      />
                      <span>
                        {admitCardSent
                          ? "Check your WhatsApp for the admit card message."
                          : "Please ensure your WhatsApp is active on this number."}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Steps - Mobile Optimized */}
              <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Progress Timeline
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      step: 1,
                      title: "Payment Verified",
                      desc: "Your payment has been confirmed",
                      time: "Completed",
                      completed: paymentCompleted,
                      isProcessing: false,
                    },
                    {
                      step: 2,
                      title: "Admit Card Generation",
                      desc: admitCardGenerated
                        ? "Admit card generated successfully"
                        : "Generating your admit card",
                      time: admitCardGenerated ? "Completed" : "In progress",
                      completed: admitCardGenerated,
                      isProcessing:
                        isGenerating || generationStatus === "generating",
                      processingText: "Generating...",
                    },
                    {
                      step: 3,
                      title: "Admit Card Delivery",
                      desc: admitCardSent
                        ? "Admit card sent to your WhatsApp"
                        : "Sending admit card via WhatsApp",
                      time: admitCardSent ? "Completed" : "Pending",
                      completed: admitCardSent,
                      isProcessing: isSending || sendingStatus === "sending",
                      processingText: "Sending...",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3 sm:gap-4">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
                            item.completed
                              ? "bg-emerald-600 text-white"
                              : item.isProcessing
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle size={16} className="sm:w-5 sm:h-5" />
                          ) : item.isProcessing ? (
                            <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                          ) : (
                            item.step
                          )}
                        </div>
                        {item.step < 3 && (
                          <div
                            className={`w-0.5 sm:w-1 h-6 sm:h-8 transition-all ${
                              item.completed ? "bg-emerald-600" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="pb-4 sm:pb-6 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm sm:text-base text-gray-900">
                            {item.title}
                          </p>
                          {item.isProcessing && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap flex-shrink-0">
                              {item.processingText}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                          {item.desc}
                        </p>
                        <p
                          className={`text-xs mt-1 font-medium ${
                            item.completed
                              ? "text-emerald-600"
                              : item.isProcessing
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-200 my-6 sm:my-8"></div>

            {/* Important Notice - Mobile Optimized */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-3 sm:p-4 mb-6 sm:mb-8">
              <div className="flex gap-2 sm:gap-3">
                <AlertCircle
                  size={16}
                  className="text-amber-600 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-amber-900 mb-1 text-sm sm:text-base">
                    Important Note
                  </p>
                  <p className="text-xs sm:text-sm text-amber-800">
                    If you don't receive your admit card within 24 hours, please
                    contact our support team immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps Info - Mobile Optimized */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex gap-3 sm:gap-4">
                <FileText size={20} className="text-blue-600 flex-shrink-0 sm:w-6 sm:h-6" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    What to do next?
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                      <span>Check your WhatsApp for the admit card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                      <span>Verify all details on the admit card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                      <span>Save and print a copy for your records</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/registration/existingStudent")}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 text-sm sm:text-base lg:text-lg"
              >
                <FileText size={18} className="sm:w-5 sm:h-5" />
                View Your Profile
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base"
              >
                <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
                Go to Home
              </button>
            </div>
          </div>

          {/* Floating Success Message - Mobile Optimized */}
          <div className="text-center mt-4 sm:mt-8 px-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Thank you for joining SDAT! We're excited to have you on board. 🎓
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess