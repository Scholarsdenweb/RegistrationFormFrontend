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
    <div className="w-full min-h-screen bg-[#fdf5f6]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 xl:col-span-10 p-4 sm:p-6">
        <AddStudentRegistrationMain/>
        </div>
      </div>
    </div>
  );
};

export default AddStudentRegistartionComponent;
