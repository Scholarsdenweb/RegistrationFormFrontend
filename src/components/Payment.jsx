// import { useDispatch, useSelector } from "react-redux";
// import axios from "../api/axios";
// import Sidebar from "./Sidebar";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Add this import
// import { fetchEducationalDetails } from "../redux/slices/educationalDetailsSlice";
// import { fetchFamilyDetails } from "../redux/slices/familyDetailsSlice";
// import { fetchBasicDetails } from "../redux/slices/basicDetailsSlice";
// import { fetchBatchDetails } from "../redux/slices/batchDetailsSlice";

// import PaymentSuccessMessage from "./PaymentSuccessMessage";
// import AllFormNotAvailable from "./AllFormNotAvailable";
// import {
//   fetchUserDetails,
//   submitUserDetails,
// } from "../redux/slices/userDeailsSlice";
// import Navbar from "./Form/Navbar";
// import Spinner from "../api/Spinner";
// import FormHeader from "./LoginSugnup/FormHeader";
// import PaymentFooter from "./PaymentFooter";
// import { toast, ToastContainer } from "react-toastify";

// const Payment = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // Initialize navigate

//   const [amount, setAmount] = useState();

//   const [allFormNotAvailable, setAllFormNotAvailable] = useState(false);

//   const { userData: basicDetailsData, dataExist: basicDetailsDataExist } =
//     useSelector((state) => state.basicDetails);
//   const { userData: batchDetailsData, dataExist: batchDetailsDataExist } =
//     useSelector((state) => state.batchDetails);
//   const {
//     userData: educationalDetailsData,
//     dataExist: educationalDetailsDataExist,
//   } = useSelector((state) => state.educationalDetails);
//   const { userData: familyDetailsData, dataExist: familyDetailsDataExist } =
//     useSelector((state) => state.familyDetails);

//   const [loading, setLoading] = useState(false);

//   const { userData } = useSelector((state) => state.userDetails);
//   const [paymentStatus, setPaymentStatus] = useState(false);

//   const getAmount = async () => {
//     const amount = await axios.get("/amount");
//     console.log("amount", amount);
//     if (amount.data.amount === 0) {
//       setPaymentStatus(true);
//     }

//     setAmount(amount.data.amount);
//   };
  
//   useEffect(() => {
//     console.log("userData in useEffect", userData);
//     if (userData.paymentId !== undefined && userData.paymentId !== "") {
//       console.log("userData.paymentId form useEffect", userData.paymentId);
//       setPaymentStatus(true);
//     }
//   }, [userData]);

//   useEffect(() => {
//     dispatch(fetchBasicDetails());
//     dispatch(fetchBatchDetails());
//     dispatch(fetchEducationalDetails());
//     dispatch(fetchFamilyDetails());
//     dispatch(fetchUserDetails());
//   }, [dispatch]);

//   useEffect(() => {
//     getAmount();
//   }, []);

//   const checkoutHandler = async () => {
//     try {
//       if (
//         !basicDetailsDataExist ||
//         !batchDetailsDataExist ||
//         !educationalDetailsDataExist ||
//         !familyDetailsDataExist
//       ) {
//         setAllFormNotAvailable(true);
//         return;
//       }

//       setLoading(true);

//       // Get Razorpay Key
//       const {
//         data: { key },
//       } = await axios.get("/payment/getKey");
//       console.log("Razorpay Key:", key);

//       // Create Order
//       const {
//         data: { order },
//       } = await axios.post("/payment/checkout");
//       console.log("Order Details:", order);

//       const options = {
//         key,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Scholars Den",
//         description: "SDAT Registration Fees",
//         order_id: order.id,
//         prefill: {
//           name: userData.studentName,
//           email: userData.email,
//           contact: userData.contactNumber,
//         },
//         theme: {
//           color: "#fdf5f6",
//         },
//         handler: async function (response) {
//           try {
//             console.log("Payment Successful:", response);
//             await dispatch(
//               submitUserDetails({ payment_id: response.razorpay_payment_id })
//             );
//             await axios.post(`/payment/paymentverification`, {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               studentId: userData.StudentsId,
//               payment_amount: order.amount / 100, // Convert paise to rupees
//             });
            
//             // Redirect to success page after successful payment
//             navigate('/registration/success');
//           } catch (handlerError) {
//             console.error("Error in handler function:", handlerError);
//             toast.error("Payment verification failed. Please contact support.");
//           }
//         },
//       };

//       console.log("Razorpay Options:", options);

//       const razorpay = new window.Razorpay(options);
//       razorpay.on("payment.failed", function (response) {
//         console.error("Payment Failed:", response.error);
//         toast.error("Payment failed. Please try again.");
//       });
//       razorpay.open();

//       console.log("Razorpay instance created:", razorpay);
//     } catch (error) {
//       console.error("Error in checkoutHandler:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] to-[#ffe9eb] px-4 md:px-8 pt-6 overflow-auto">
//       {/* Toast Notifications */}
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="flex flex-col justify-between gap-8 max-w-2xl mx-auto h-full">
//         {/* Header */}
//         <FormHeader />

//         {/* Main Card Section */}
//         <div
//           className={`transition-all duration-300 ease-in-out bg-white shadow-lg rounded-3xl px-6 sm:px-10 py-10 flex flex-col items-center justify-center gap-6`}
//         >
//           {paymentStatus ? (
//             <PaymentSuccessMessage />
//           ) : loading ? (
//             <Spinner />
//           ) : (
//             <div className="flex flex-col items-center justify-center text-center gap-6 w-full">
//               <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
//                 SDAT Registration Amount
//               </h2>

//               <p className="text-3xl font-bold text-pink-600">₹{amount}</p>

//               <button
//                 onClick={checkoutHandler}
//                 className="mt-4 bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 transition-all duration-300 text-white font-semibold text-lg px-10 py-3 rounded-full shadow-md hover:shadow-lg active:scale-95"
//               >
//                 Pay Now
//               </button>
//             </div>
//           )}

//           {/* Conditional Modal */}
//           {allFormNotAvailable && (
//             <AllFormNotAvailable
//               setAllFormNotAvailable={setAllFormNotAvailable}
//               familyDetailsDataExist={familyDetailsDataExist}
//               educationalDetailsDataExist={educationalDetailsDataExist}
//               batchDetailsDataExist={batchDetailsDataExist}
//               basicDetailsDataExist={basicDetailsDataExist}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         {/* <PaymentFooter /> */}
//       </div>
//     </div>
//   );
// };
// export default Payment;









// import { useDispatch, useSelector } from "react-redux";
// import axios from "../api/axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchEducationalDetails } from "../redux/slices/educationalDetailsSlice";
// import { fetchFamilyDetails } from "../redux/slices/familyDetailsSlice";
// import { fetchBasicDetails } from "../redux/slices/basicDetailsSlice";
// import { fetchBatchDetails } from "../redux/slices/batchDetailsSlice";
// import PaymentSuccessMessage from "./PaymentSuccessMessage";
// import AllFormNotAvailable from "./AllFormNotAvailable";
// import {
//   fetchUserDetails,
//   submitUserDetails,
// } from "../redux/slices/userDeailsSlice";
// import Spinner from "../api/Spinner";
// import { toast, ToastContainer } from "react-toastify";
// import {
//   CreditCard,
//   CheckCircle,
//   AlertCircle,
//   ArrowRight,
//   Lock,
//   Shield,
// } from "lucide-react";

// const Payment = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [amount, setAmount] = useState(0);
//   const [allFormNotAvailable, setAllFormNotAvailable] = useState(false);

//   const { userData: basicDetailsData, dataExist: basicDetailsDataExist } =
//     useSelector((state) => state.basicDetails);
//   const { userData: batchDetailsData, dataExist: batchDetailsDataExist } =
//     useSelector((state) => state.batchDetails);
//   const {
//     userData: educationalDetailsData,
//     dataExist: educationalDetailsDataExist,
//   } = useSelector((state) => state.educationalDetails);
//   const { userData: familyDetailsData, dataExist: familyDetailsDataExist } =
//     useSelector((state) => state.familyDetails);

//   const [loading, setLoading] = useState(false);

//   const { userData } = useSelector((state) => state.userDetails);
//   const [paymentStatus, setPaymentStatus] = useState(false);

//   const getAmount = async () => {
//     try {
//       const amount = await axios.get("/amount");
//       console.log("amount", amount);
//       if (amount.data.amount === 0) {
//         setPaymentStatus(true);
//       }
//       setAmount(amount.data.amount);
//     } catch (error) {
//       console.error("Error fetching amount:", error);
//       toast.error("Error fetching amount. Please try again.");
//     }
//   };

//   useEffect(() => {
//     console.log("userData in useEffect", userData);
//     if (userData.paymentId !== undefined && userData.paymentId !== "") {
//       console.log("userData.paymentId form useEffect", userData.paymentId);
//       setPaymentStatus(true);
//     }
//   }, [userData]);

//   useEffect(() => {
//     dispatch(fetchBasicDetails());
//     dispatch(fetchBatchDetails());
//     dispatch(fetchEducationalDetails());
//     dispatch(fetchFamilyDetails());
//     dispatch(fetchUserDetails());
//   }, [dispatch]);

//   useEffect(() => {
//     getAmount();
//   }, []);

//   const checkoutHandler = async () => {
//     try {
//       if (
//         !basicDetailsDataExist ||
//         !batchDetailsDataExist ||
//         !educationalDetailsDataExist ||
//         !familyDetailsDataExist
//       ) {
//         setAllFormNotAvailable(true);
//         return;
//       }

//       setLoading(true);

//       const {
//         data: { key },
//       } = await axios.get("/payment/getKey");
//       console.log("Razorpay Key:", key);

//       const {
//         data: { order },
//       } = await axios.post("/payment/checkout");
//       console.log("Order Details:", order);

//       const options = {
//         key,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Scholars Den",
//         description: "SDAT Registration Fees",
//         order_id: order.id,
//         prefill: {
//           name: userData.studentName,
//           email: userData.email,
//           contact: userData.contactNumber,
//         },
//         theme: {
//           color: "#c61d23",
//         },
//         handler: async function (response) {
//           try {
//             console.log("Payment Successful:", response);
//             await dispatch(
//               submitUserDetails({ payment_id: response.razorpay_payment_id })
//             );
//             await axios.post(`/payment/paymentverification`, {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               studentId: userData.StudentsId,
//               payment_amount: order.amount / 100,
//             });

//             navigate("/registration/success");
//           } catch (handlerError) {
//             console.error("Error in handler function:", handlerError);
//             toast.error("Payment verification failed. Please contact support.");
//           }
//         },
//       };

//       console.log("Razorpay Options:", options);

//       const razorpay = new window.Razorpay(options);
//       razorpay.on("payment.failed", function (response) {
//         console.error("Payment Failed:", response.error);
//         toast.error("Payment failed. Please try again.");
//       });
//       razorpay.open();

//       console.log("Razorpay instance created:", razorpay);
//     } catch (error) {
//       console.error("Error in checkoutHandler:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
//       {/* Navigation Bar */}
//       <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 sm:h-20">
//             <div className="flex items-center gap-3">
//               <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
//                 <CreditCard size={24} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
//                   Payment
//                 </h1>
//                 <p className="text-xs text-gray-500 hidden sm:block">Complete your registration</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Toast Notifications */}
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Decorative Background */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative py-8 sm:py-12">
//         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           {paymentStatus ? (
//             // Success State
//             <div className="space-y-6">
//               <PaymentSuccessMessage />

//               <button
//                 onClick={() => navigate("/registration/existingStudent")}
//                 className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
//               >
//                 <ArrowRight size={20} />
//                 View Your Profile
//               </button>
//             </div>
//           ) : loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <Spinner />
//               <p className="text-gray-600 font-medium mt-4">Processing...</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {/* Payment Card */}
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-8">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                   <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                     Complete Your Registration
//                   </h2>
//                   <p className="text-gray-600">
//                     One final step to unlock your SDAT program access
//                   </p>
//                 </div>

//                 {/* Amount Display */}
//                 <div className="bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-2xl p-8 mb-8 text-center border border-gray-100">
//                   <p className="text-gray-600 text-sm font-medium mb-2">Registration Fee</p>
//                   <div className="flex items-baseline justify-center gap-1">
//                     <span className="text-5xl font-bold text-[#c61d23]">₹{amount}</span>
//                     <span className="text-gray-500 text-lg">/one time</span>
//                   </div>
//                 </div>

//                 {/* Benefits List */}
//                 {/* <div className="space-y-3 mb-8">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">What You'll Get:</h3>
//                   <div className="space-y-2">
//                     {[
//                       "Access to all SDAT programs and courses",
//                       "Digital admit card upon verification",
//                       "24/7 student support and resources",
//                       "Regular updates and announcements",
//                     ].map((benefit, idx) => (
//                       <div key={idx} className="flex items-center gap-3">
//                         <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
//                         <span className="text-sm text-gray-700">{benefit}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div> */}

//                 {/* Security Info */}
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
//                   <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-xs font-semibold text-blue-900 mb-1">Secure Payment</p>
//                     <p className="text-xs text-blue-800">
//                       Your payment is processed securely through Razorpay. Your information is encrypted and protected.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Payment Button */}
//                 <button
//                   onClick={checkoutHandler}
//                   className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 text-lg"
//                 >
//                   <Lock size={20} />
//                   Pay Now Securely
//                 </button>

//                 {/* Additional Info */}
//                 {/* <p className="text-xs text-gray-600 text-center mt-4">
//                   No hidden charges • Cancel anytime • GST included
//                 </p> */}
//               </div>

//               {/* Info Cards */}
//               {/* <div className="grid md:grid-cols-2 gap-4">

//                 <div className="bg-gradient-to-br from-[#fff5e6] to-[#ffedd5] border border-[#ffc107]/30 rounded-xl p-4">
//                   <div className="flex items-start gap-3">
//                     <span className="text-2xl">🎓</span>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 text-sm mb-1">Full Access</h4>
//                       <p className="text-xs text-gray-700">Get instant access to all learning materials after payment</p>
//                     </div>
//                   </div>
//                 </div>


//                 <div className="bg-gradient-to-br from-[#e6f7ff] to-[#bae7ff] border border-[#1890ff]/30 rounded-xl p-4">
//                   <div className="flex items-start gap-3">
//                     <span className="text-2xl">✅</span>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 text-sm mb-1">Instant Verification</h4>
//                       <p className="text-xs text-gray-700">Get your admit card immediately after successful payment</p>
//                     </div>
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//           )}

//           {/* Conditional Modal */}
//           {allFormNotAvailable && (
//             <AllFormNotAvailable
//               setAllFormNotAvailable={setAllFormNotAvailable}
//               familyDetailsDataExist={familyDetailsDataExist}
//               educationalDetailsDataExist={educationalDetailsDataExist}
//               batchDetailsDataExist={batchDetailsDataExist}
//               basicDetailsDataExist={basicDetailsDataExist}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;















import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEducationalDetails } from "../redux/slices/educationalDetailsSlice";
import { fetchFamilyDetails } from "../redux/slices/familyDetailsSlice";
import { fetchBasicDetails } from "../redux/slices/basicDetailsSlice";
import { fetchBatchDetails } from "../redux/slices/batchDetailsSlice";
import PaymentSuccessMessage from "./PaymentSuccessMessage";
import AllFormNotAvailable from "./AllFormNotAvailable";
import {
  fetchUserDetails,
  submitUserDetails,
} from "../redux/slices/userDeailsSlice";
import Spinner from "../api/Spinner";
import { toast, ToastContainer } from "react-toastify";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Shield,
} from "lucide-react";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(0);
  const [allFormNotAvailable, setAllFormNotAvailable] = useState(false);

  const { userData: basicDetailsData, dataExist: basicDetailsDataExist } =
    useSelector((state) => state.basicDetails);
  const { userData: batchDetailsData, dataExist: batchDetailsDataExist } =
    useSelector((state) => state.batchDetails);
  const {
    userData: educationalDetailsData,
    dataExist: educationalDetailsDataExist,
  } = useSelector((state) => state.educationalDetails);
  const { userData: familyDetailsData, dataExist: familyDetailsDataExist } =
    useSelector((state) => state.familyDetails);

  const [loading, setLoading] = useState(false);

  const { userData } = useSelector((state) => state.userDetails);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const getAmount = async () => {
    try {
      const amount = await axios.get("/amount");
      console.log("amount", amount);
      if (amount.data.amount === 0) {
        setPaymentStatus(true);
      }
      setAmount(amount.data.amount);
    } catch (error) {
      console.error("Error fetching amount:", error);
      toast.error("Error fetching amount. Please try again.");
    }
  };

  useEffect(() => {
    console.log("userData in useEffect", userData);
    if (userData.paymentId !== undefined && userData.paymentId !== "") {
      console.log("userData.paymentId form useEffect", userData.paymentId);
      setPaymentStatus(true);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(fetchBasicDetails());
    dispatch(fetchBatchDetails());
    dispatch(fetchEducationalDetails());
    dispatch(fetchFamilyDetails());
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    getAmount();
  }, []);

  const checkoutHandler = async () => {
    try {
      if (
        !basicDetailsDataExist ||
        !batchDetailsDataExist ||
        !educationalDetailsDataExist ||
        !familyDetailsDataExist
      ) {
        setAllFormNotAvailable(true);
        return;
      }

      setLoading(true);

      const {
        data: { key },
      } = await axios.get("/payment/getKey");
      console.log("Razorpay Key:", key);

      const {
        data: { order },
      } = await axios.post("/payment/checkout");
      console.log("Order Details:", order);

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Scholars Den",
        description: "SDAT Registration Fees",
        order_id: order.id,
        prefill: {
          name: userData.studentName,
          email: userData.email,
          contact: userData.contactNumber,
        },
        theme: {
          color: "#c61d23",
        },
        handler: async function (response) {
          try {
            console.log("Payment Successful:", response);
            await dispatch(
              submitUserDetails({ payment_id: response.razorpay_payment_id })
            );
            await axios.post(`/payment/paymentverification`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              studentId: userData.StudentsId,
              payment_amount: order.amount / 100,
            });

            navigate("/registration/success");
          } catch (handlerError) {
            console.error("Error in handler function:", handlerError);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
      };

      console.log("Razorpay Options:", options);

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });
      razorpay.open();

      console.log("Razorpay instance created:", razorpay);
    } catch (error) {
      console.error("Error in checkoutHandler:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <CreditCard size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Payment
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Complete your registration</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Step 5 of 5</h2>
              <div className="text-sm text-gray-600">Payment & Confirmation</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          {paymentStatus ? (
            // Success State
            <div className="space-y-6">
              <PaymentSuccessMessage />

              <button
                onClick={() => navigate("/registration/existingStudent")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
              >
                <ArrowRight size={20} />
                View Your Profile
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner />
              {/* <p className="text-gray-600 font-medium mt-4">Processing...</p> */}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Registration
                  </h2>
                  <p className="text-gray-600">
                    One final step to unlock your SDAT program access
                  </p>
                </div>

                {/* Amount Display */}
                <div className="bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-2xl p-8 mb-8 text-center border border-gray-100">
                  <p className="text-gray-600 text-sm font-medium mb-2">Registration Fee</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#c61d23]">₹{amount}</span>
                    <span className="text-gray-500 text-lg">/one time</span>
                  </div>
                </div>

                {/* Benefits List */}
                {/* <div className="space-y-3 mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">What You'll Get:</h3>
                  <div className="space-y-2">
                    {[
                      "Access to all SDAT programs and courses",
                      "Digital admit card upon verification",
                      "24/7 student support and resources",
                      "Regular updates and announcements",
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                  <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 mb-1">Secure Payment</p>
                    <p className="text-xs text-blue-800">
                      Your payment is processed securely through Razorpay. Your information is encrypted and protected.
                    </p>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={checkoutHandler}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 text-lg"
                >
                  <Lock size={20} />
                  Pay Now Securely
                </button>

                {/* Additional Info */}
                {/* <p className="text-xs text-gray-600 text-center mt-4">
                  No hidden charges • Cancel anytime • GST included
                </p> */}
              </div>

              {/* Back Button */}
              <button
                onClick={() => navigate("/registration/familyDetailsForm")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300 mt-6"
              >
                <ArrowLeft size={18} />
                <span>Back to Family Details</span>
              </button>

              {/* Info Cards */}
              {/* <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#fff5e6] to-[#ffedd5] border border-[#ffc107]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Full Access</h4>
                      <p className="text-xs text-gray-700">Get instant access to all learning materials after payment</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#e6f7ff] to-[#bae7ff] border border-[#1890ff]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Instant Verification</h4>
                      <p className="text-xs text-gray-700">Get your admit card immediately after successful payment</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          )}

          {/* Conditional Modal */}
          {allFormNotAvailable && (
            <AllFormNotAvailable
              setAllFormNotAvailable={setAllFormNotAvailable}
              familyDetailsDataExist={familyDetailsDataExist}
              educationalDetailsDataExist={educationalDetailsDataExist}
              batchDetailsDataExist={batchDetailsDataExist}
              basicDetailsDataExist={basicDetailsDataExist}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;


