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
      setPaymentStatus("true");
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
    console.log("basicDetailsDataExist", basicDetailsData);
    console.log("batchDetailsData", batchDetailsData);
    console.log("educationalDetailsData", educationalDetailsData);
    console.log("familyDetailsData", familyDetailsData);
  }, []);

  const checkoutHandler = async () => {
    if (
      !basicDetailsDataExist ||
      !batchDetailsDataExist ||
      !educationalDetailsDataExist ||
      !familyDetailsDataExist
    ) {
      setAllFormNotAvailable(true);
      // alert("Please fill all the details first");
      return;
    }

    // dispatch(setLoading(true));

    setLoading(true);
    const {
      data: { key },
    } = await axios.get("/payment/getKey");
    console.log("key", key);

    const response = await axios.post("/payment/checkout");
    console.log("response", response);
    console.log("response.data.order.amount", response.data.order.amount);
    console.log("response.data.order.currency", response.data.order.currency);
    console.log("response.data.currency", response.data.currency);

    const options = {
      key,
      amount: response.data.order.amount,
      currency: response.data.order.currency,
      name: "Scholars Den",
      description: "S.DAT Registration Fees",
      order_id: response.data.order.id,
      callback_url: `${
        import.meta.env.VITE_APP_API_URL
      }/api/payment/paymentverification`,
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.phone,
      },
      theme: {
        color: "#c61d23",
      },
      handler: async function (response) {
        console.log("Payment successful", response);
        // setPaymentInitiated(true);

        await dispatch(
          submitUserDetails({ payment_id: response.razorpay_payment_id })
        );

        console.log("userData in handler", userData);
        // dispatch(submitUserDetails());

        // Optionally, verify the payment on your backend

        // Redirect to the success page
        // window.location.href = `${
        //   import.meta.env.VITE_APP_API_URL
        // }/payment/success/${response.razorpay_order_id}`;
      },
    };

    console.log("options", options);

    const razorpay = new window.Razorpay(options);

    await razorpay.open();

    const dataFormBasiDetails = await dispatch(fetchBasicDetails());

    console.log("DataFormBasicDetails", dataFormBasiDetails);

    setLoading(false);

    console.log("razorpay object", razorpay);
    // await axios("/payment/paymentverification", {});
  };

  return (
    <div className=" relative min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      {/* {loading && <Spinner />} */}

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
        <div className="absolute flex justify-center bottom-0 ">
                <PaymentFooter />
              </div> 
    </div>
  );
};
export default Payment;
