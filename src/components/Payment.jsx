import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
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
import Navbar from "./Form/Navbar";
import Spinner from "../api/Spinner";
import FormHeader from "./LoginSugnup/FormHeader";
import PaymentFooter from "./PaymentFooter";
import { toast, ToastContainer } from "react-toastify";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const [amount, setAmount] = useState();

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
    const amount = await axios.get("/amount");
    console.log("amount", amount);
    if (amount.data.amount === 0) {
      setPaymentStatus(true);
    }

    setAmount(amount.data.amount);
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

      // Get Razorpay Key
      const {
        data: { key },
      } = await axios.get("/payment/getKey");
      console.log("Razorpay Key:", key);

      // Create Order
      const {
        data: { order },
      } = await axios.post("/payment/checkout");
      console.log("Order Details:", order);

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Scholars Den",
        description: "Rise Registration Fees",
        order_id: order.id,
        prefill: {
          name: userData.studentName,
          email: userData.email,
          contact: userData.contactNumber,
        },
        theme: {
          color: "#fdf5f6",
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
              payment_amount: order.amount / 100, // Convert paise to rupees
            });
            
            // Redirect to success page after successful payment
            navigate('/registration/success');
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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] to-[#ffe9eb] px-4 md:px-8 pt-6 overflow-auto">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col justify-between gap-8 max-w-2xl mx-auto h-full">
        {/* Header */}
        <FormHeader />

        {/* Main Card Section */}
        <div
          className={`transition-all duration-300 ease-in-out bg-white shadow-lg rounded-3xl px-6 sm:px-10 py-10 flex flex-col items-center justify-center gap-6`}
        >
          {paymentStatus ? (
            <PaymentSuccessMessage />
          ) : loading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-6 w-full">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                SDAT Registration Amount
              </h2>

              <p className="text-3xl font-bold text-pink-600">₹{amount}</p>

              <button
                onClick={checkoutHandler}
                className="mt-4 bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 transition-all duration-300 text-white font-semibold text-lg px-10 py-3 rounded-full shadow-md hover:shadow-lg active:scale-95"
              >
                Pay Now
              </button>
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

        {/* Footer */}
        {/* <PaymentFooter /> */}
      </div>
    </div>
  );
};
export default Payment;