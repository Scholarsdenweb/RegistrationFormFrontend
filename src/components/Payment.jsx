import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
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
  const [paymentStatus, setPaymentStatus] = useState(
    userData.paymentId !== undefined && userData.paymentId !== "" ? true : false
  );

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
        description: "S.DAT Registration Fees",
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
            });
          } catch (handlerError) {
            console.error("Error in handler function:", handlerError);
          }
        },
      };

      console.log("Razorpay Options:", options);

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        // Optionally notify user here
        toast.error("Something went wrong during payment process.");
      });
      razorpay.open();

      console.log("Razorpay instance created:", razorpay);
    } catch (error) {
      console.error("Error in checkoutHandler:", error);
      // Optionally show error to user
      // toast.error("Something went wrong during payment process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" relative min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {/* {loading && <Spinner />} */}
            <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Notifications */}


      <div className="flex flex-col gap-6 max-w-screen-md h-full mx-auto ">
        <div>
          <FormHeader />
        </div>

        <div
          className={`col-span-6 sm:px-9 sm:py-8 sm:mb-3 sm:mr-5 h-full bg-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 `}
        >
          {paymentStatus ? (
            <PaymentSuccessMessage />
          ) : loading ? (
            <Spinner />
          ) : (
            <div className="ol-span-6 px-9 py-8 mb-3 sm:mr-5 h-full bg-gray-100 rounded-3xl flex flex-col items-center justify-between gap-4 ">
              <div className="flex flex-col gap-5">
                <h2 className="text-bold text-2xl ">
                  SDAT Registration Amount : <span>&#8377;500</span>{" "}
                </h2>

                <div
                  className="bg-[#c61d23] text-white p-3 rounded-lg text-center cursor-pointer"
                  onClick={checkoutHandler}
                >
                  Pay Now
                </div>
              </div>
            </div>
          )}
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
      <div className="fixed flex justify-center bottom-0 z-0">
        <PaymentFooter />
      </div>
    </div>
  );
};
export default Payment;
