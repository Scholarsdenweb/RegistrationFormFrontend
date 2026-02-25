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
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Shield,
} from "lucide-react";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ====== STATE MANAGEMENT ======
  const [amount, setAmount] = useState(0);
  const [amountLoading, setAmountLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [allFormNotAvailable, setAllFormNotAvailable] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState(null);

  // ====== REDUX SELECTORS ======
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
  const { userData } = useSelector((state) => state.userDetails);

  // ====== VALIDATION HELPERS ======

  /**
   * Validate user data before payment
   */
  const isUserDataValid = () => {
    console.log("userData from isUserDataValid", userData);
    console.log("userData from isUserDataValid", typeof userData);

    if (!userData || typeof userData !== "object") {
      return false;
    }

    const requiredFields = [
      "studentName",
      "email",
      "contactNumber",
    ];
    return requiredFields.every(
      (field) => userData[field] && userData[field].toString().trim() !== ""
    );
  };

  /**
   * Validate all forms are completed
   */
  const areAllFormsComplete = () => {
    return (
      basicDetailsDataExist &&
      batchDetailsDataExist &&
      educationalDetailsDataExist &&
      familyDetailsDataExist
    );
  };

  /**
   * Check if Razorpay is loaded
   */
  const isRazorpayLoaded = () => {
    return typeof window !== "undefined" && window.Razorpay;
  };

  // ====== FETCH AMOUNT ======
  const getAmount = async () => {
    try {
      setAmountLoading(true);
      const response = await axios.get("/amount");

      if (!response.data || typeof response.data.amount !== "number") {
        throw new Error("Invalid amount response");
      }

      const fetchedAmount = response.data.amount;

      // If amount is 0, mark as payment not required
      if (fetchedAmount <= 0) {
        setPaymentStatus(true);
        setAmount(0);
        toast.info("No payment required for this registration");
      } else {
        setAmount(fetchedAmount);
      }
    } catch (error) {
      console.error("Error fetching amount:", error);
      toast.error("Failed to load registration amount. Please refresh.");
      setAmount(0);
    } finally {
      setAmountLoading(false);
    }
  };

  // ====== CHECK EXISTING PAYMENT ======


  // ====== REDIRECT TO SUCCESS PAGE IF PAYMENT EXISTS ======
  useEffect(() => {

    if (
      userData &&
      userData.StudentsId &&
      userData.paymentId &&
      userData.paymentId.toString().trim() !== ""
    ) {
      console.log("redirecting ");
      navigate("/registration/success", { replace: true });
    }
  }, [userData, navigate]);

  // ====== FETCH ALL DATA ======
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          dispatch(fetchBasicDetails()),
          dispatch(fetchBatchDetails()),
          dispatch(fetchEducationalDetails()),
          dispatch(fetchFamilyDetails()),
          dispatch(fetchUserDetails()),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load registration data");
      }
    };

    fetchAllData();
  }, [dispatch]);

  // ====== FETCH AMOUNT ON MOUNT ======
  useEffect(() => {
    getAmount();
  }, []);

  // ====== CLEANUP PAYMENT TIMEOUT ======
  useEffect(() => {
    return () => {
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
      }
    };
  }, [paymentTimeout]);

  // ====== RAZORPAY CHECKOUT HANDLER ======
  const checkoutHandler = async () => {
    try {
      // ====== VALIDATION 1: Check Razorpay is loaded ======
      if (!isRazorpayLoaded()) {
        toast.error("Payment system not ready. Please refresh and try again.");
        return;
      }

      // ====== VALIDATION 2: Check all forms are complete ======
      if (!areAllFormsComplete()) {
        setAllFormNotAvailable(true);
        return;
      }

      // ====== VALIDATION 3: Check user data is valid ======
      if (!isUserDataValid()) {
        toast.error(
          "Incomplete user information. Please fill all required fields."
        );
        return;
      }

      // ====== VALIDATION 4: Check amount is valid ======
      if (typeof amount !== "number" || amount <= 0) {
        toast.error("Invalid amount. Please try again later.");
        return;
      }

      // ====== VALIDATION 5: Prevent duplicate payments ======
      if (paymentProcessing || loading) {
        toast.warning("Payment is already in progress...");
        return;
      }

      // ====== VALIDATION 6: Check existing payment ======
      if (userData.paymentId && userData.paymentId.toString().trim() !== "") {
        toast.info("Payment already completed for this registration");
        return;
      }

      setPaymentProcessing(true);
      setLoading(true);

      // ====== SET PAYMENT TIMEOUT (5 minutes) ======
      const timeout = setTimeout(() => {
        setPaymentProcessing(false);
        setLoading(false);
        toast.error(
          "Payment timeout. Please check your connection and try again."
        );
      }, 5 * 60 * 1000);
      setPaymentTimeout(timeout);

      // ====== STEP 1: GET RAZORPAY KEY ======
      let keyData;
      try {
        const keyResponse = await axios.get("/payment/getKey");
        keyData = keyResponse.data;

        if (!keyData || !keyData.key) {
          throw new Error("Failed to get payment credentials");
        }
      } catch (error) {
        clearTimeout(timeout);
        throw new Error("Cannot retrieve payment key. Please try again.");
      }

      // ====== STEP 2: CREATE ORDER ======
      let orderData;
      try {
        const orderResponse = await axios.post("/payment/checkout", {
          amount: amount,
          studentId: userData._id,
        });

        orderData = orderResponse.data;

        if (!orderData || !orderData.order || !orderData.order.id) {
          throw new Error("Failed to create payment order");
        }
      } catch (error) {
        clearTimeout(timeout);
        throw new Error("Cannot create payment order. Please try again.");
      }

      // ====== STEP 3: PREPARE RAZORPAY OPTIONS ======
      const options = {
        key: keyData.key,
        amount: orderData.order.amount, // Amount in paise
        currency: orderData.order.currency || "INR",
        name: "Scholars Den",
        description: "SDAT Registration Fees",
        order_id: orderData.order.id,
        prefill: {
          name: userData.studentName || "",
          email: userData.email || "",
          contact: userData.contactNumber || "",
        },
        theme: {
          color: "#c61d23",
        },

        // ====== PAYMENT SUCCESS HANDLER ======
        handler: async function (response) {
          try {
            console.log("response form payment", response);
            clearTimeout(timeout);
            setLoading(true);

            // Validate payment response
            if (
              !response ||
              !response.razorpay_payment_id ||
              !response.razorpay_order_id
            ) {
              throw new Error("Invalid payment response");
            }

            // ====== STEP 4: VERIFY PAYMENT ======
            const verificationResponse = await axios.post(
              "/payment/paymentverification",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature || "",
                studentId: userData._id,
                payment_amount: orderData.order.amount / 100, // Convert to rupees
              }
            );

            console.log("verificationResponse", verificationResponse);

            if (
              !verificationResponse.data ||
              !verificationResponse.data.success
            ) {
              throw new Error("Payment verification failed");
            }

            // ====== STEP 5: UPDATE USER DETAILS ======
            await dispatch(
              submitUserDetails({
                payment_id: response.razorpay_payment_id,
                paymentId: response.razorpay_payment_id,
                payment_status: "completed",
              })
            );

            toast.success("🎉 Payment successful! Welcome to SDAT");

            // ====== STEP 6: REDIRECT TO SUCCESS PAGE ======
            setTimeout(() => {
              navigate("/registration/success");
            }, 1500);
          } catch (handlerError) {
            setPaymentProcessing(false);
            setLoading(false);

            const errorMessage =
              handlerError.response?.data?.message ||
              handlerError.message ||
              "Payment verification failed. Please contact support.";

            console.error("Payment handler error:", handlerError);
            toast.error(errorMessage);

            // Show retry option
            toast.info("Please contact support if payment was debited.", {
              autoClose: 5000,
            });
          }
        },

        // ====== PAYMENT FAILURE HANDLER ======
        modal: {
          ondismiss: function () {
            clearTimeout(timeout);
            setPaymentProcessing(false);
            setLoading(false);
            toast.info("Payment cancelled. You can try again anytime.");
          },
        },
      };

      // ====== STEP 7: OPEN RAZORPAY CHECKOUT ======
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        clearTimeout(timeout);
        setPaymentProcessing(false);
        setLoading(false);

        const errorMessage =
          response.error?.description || "Payment failed. Please try again.";

        console.error("Razorpay payment failed:", response.error);
        toast.error(errorMessage);
      });

      razorpay.open();
    } catch (error) {
      clearTimeout(paymentTimeout);
      setPaymentProcessing(false);
      setLoading(false);

      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      console.error("Checkout error:", error);
      toast.error(errorMessage);
    }
  };

  // ====== RENDER COMPONENT ======
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* ====== NAVIGATION BAR ====== */}
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
                <p className="text-xs text-gray-500 hidden sm:block">
                  Complete your registration
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ====== TOAST NOTIFICATIONS ====== */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* ====== DECORATIVE BACKGROUND ====== */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div className="relative py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ====== PROGRESS INDICATOR ====== */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Step 5 of 5
              </h2>
              <div className="text-sm text-gray-600">
                Payment & Confirmation
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          {/* ====== PAYMENT SUCCESS STATE ====== */}
          {amountLoading || loading ? (
            /* ====== LOADING STATE ====== */
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner />
              <p className="text-gray-600 font-medium mt-4">
                {amountLoading
                  ? "Loading registration amount..."
                  : "Processing payment..."}
              </p>
            </div>
          ) : (
            /* ====== PAYMENT FORM STATE ====== */
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
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Registration Fee
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#c61d23]">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-500 text-lg">/one time</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                  <Shield
                    size={18}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Secure Payment
                    </p>
                    <p className="text-xs text-blue-800">
                      Your payment is processed securely through Razorpay. Your
                      information is encrypted and protected.
                    </p>
                  </div>
                </div>

                {/* Payment Button */}

                {console.log(
                  "loading || paymentProcessing || !isUserDataValid() || amountLoading || amount <= 0",
                  loading,
                  paymentProcessing,
                  isUserDataValid(),
                  amountLoading,
                  amount <= 0
                )}
                <button
                  onClick={checkoutHandler}
                  disabled={
                    loading ||
                    paymentProcessing ||
                    !isUserDataValid() ||
                    amountLoading ||
                    amount <= 0
                  }
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Proceed to payment"
                >
                  <Lock size={20} />
                  {paymentProcessing ? "Processing..." : "Pay Now Securely"}
                </button>

                {/* Additional Info */}
                {/* <p className="text-xs text-gray-600 text-center mt-4">
                  No hidden charges • Secure payment gateway • Tax included
                </p> */}
              </div>

              {/* Back Button */}
              <button
                onClick={() => navigate("/registration/familyDetailsForm")}
                disabled={loading || paymentProcessing}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go back to family details"
              >
                <ArrowLeft size={18} />
                <span>Back to Family Details</span>
              </button>
            </div>
          )}

          {/* ====== FORM VALIDATION MODAL ====== */}
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
