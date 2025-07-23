import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../AdminLoginSignup/Sidebar";
import AddStudentRegistrationMain from "./AddStudentRegistrationMain";

const AddStudentRegistartionComponent = () => {
  const [amount, setAmount] = useState(null);
  const [changedAmount, setChangedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const fetchAmount = async () => {
    try {
      const response = await axios.get("/amount");
      setAmount(response.data.amount);
    } catch (error) {
      toast.error("Error fetching amount.");
      console.error("Fetch amount error:", error);
    }
  };

  useEffect(() => {
    fetchAmount();
  }, []);

  const updateAmountHandler = async () => {
    if (!changedAmount || isNaN(changedAmount)) {
      toast.error("Please enter a valid number.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch("/amount", {
        changedAmount: Number(changedAmount),
      });

      console.log("response, response", response);
      setAmount(response.data.updatedAmount.amount);
      setShowPopup(false);
      toast.success("Amount updated successfully!");
    } catch (error) {
      toast.error("Failed to update amount.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#c61d23] overflow-auto min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-7 h-full">
        {/* Sidebar */}
        <div className="col-span-2">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col col-span-5 py-6">
        <AddStudentRegistrationMain/>
        </div>
      </div>
    </div>
  );
};

export default AddStudentRegistartionComponent;
