import { useEffect, useState } from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
import axios from "../../api/axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import editIcon from "../../assets/editIcon.png";

const Amount = () => {
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
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader title="Fee Configuration" subtitle="Set and update the current registration fee amount used in the system." />
          <div className="relative bg-white/90 rounded-3xl border border-white shadow-[0_20px_50px_rgba(157,23,33,0.08)] p-6 sm:p-10 flex flex-col items-center gap-8 min-h-[70vh]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center tracking-tight">
              Registration Fee Settings
            </h1>
            <p className="text-sm text-gray-500 text-center -mt-4">Manage the current registration amount used in the application.</p>

            <div className="w-full max-w-2xl flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-[#fff6f7] to-[#f8eeee] border border-[#f4d6d9] rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">
                  Amount
                </span>
                <span className="text-2xl font-semibold text-gray-800">
                  ₹ {amount}
                </span>
              </div>

              <button
                className="p-2 rounded-full hover:bg-white transition border border-gray-200 bg-white/80"
                aria-label="Edit Amount"
                onClick={() => setShowPopup(true)}
              >
                <img src={editIcon} alt="Edit" className="w-5 h-5" />
              </button>
            </div>

            {/* Popup Modal */}
            {showPopup && (
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8 w-[92%] max-w-md flex flex-col gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Edit Amount
                  </h2>

                  <label
                    htmlFor="amountInput"
                    className="text-sm font-medium text-gray-600"
                  >
                    Enter New Amount
                  </label>
                  <input
                    id="amountInput"
                    type="number"
                    value={changedAmount}
                    onChange={(e) => setChangedAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30"
                    placeholder="e.g. 250"
                  />

                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateAmountHandler}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-[#c61d23] to-[#8f1515] hover:opacity-95 text-white rounded-md flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <ClipLoader size={18} color="#fff" />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amount;
