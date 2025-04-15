import { Link, useNavigate, useParams } from "react-router-dom";
import tickCircle from "../assets/tickCircle.png";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/slices/userDeailsSlice";

const PaymentSuccessMessage = () => {
  const { paymentId } = useParams();
  // const navigate = useNavigate();
  // const [admitCardStatus, setAdmitCardStatus] = useState("Pending");
  const { userData } = useSelector((state) => state.userDetails);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const generateAdmitCard = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/payment/generateAdmitCard");
      console.log("response from generateAdmitCard", response);
      // setAdmitCardStatus("Generated");
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };


  const callPaymentFunction =async()=>{

    await generateAdmitCard();
    dispatch(fetchUserDetails());
    navigate("/registration/payment");
  }

  useEffect(() => {
  

    const addPaymentId = async () => {
      console.log("ADD payment Id function is running now");
      try {
        const response = await axios.patch("/students/editStudent", {
          paymentId,
        });
        console.log("response from paymentId", response);
      } catch (error) {
        console.log("error", error);
      }
    };

    addPaymentId();
    callPaymentFunction();
  
  }, []);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);
  return loading ? (
    <div className="flex flex-col p-3 justify-center items-center ">
      <h2> Your admit card is being generated</h2>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  ) : (
    <div className="flex flex-col justify-center gap-3 w-full h-full items-center p-6 rounded-lg">
      <img src={tickCircle} alt="" />
      <div className="text-sm px-10 py-2">
        {` Your payment was successful. Order ID : ${
          paymentId ? paymentId : userData.paymentId
        }`}
      </div>

      <span>Admit Card has been generated successfully.</span>
      <span>Thank you for your payment.</span>

      {userData.admitCard ? (
        <a
          href={userData.admitCard} // Link to the PDF
          // download={`${userData.admitCard}AdmitCard.pdf`} // Suggest a default filename
          target="_blank" // Open in a new tab
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{ backgroundColor: "#c61d23" }}
        >
          Download Your Admit Card
        </a>
      ) : (
        <span>N/A</span>
      )}
    </div>
  );
};
export default PaymentSuccessMessage;
