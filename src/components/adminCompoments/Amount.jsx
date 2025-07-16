import { useEffect, useState } from "react";
import Sidebar from "./AdminLoginSignup/Sidebar";
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

    console.log("changedAmount", changedAmount);
    console.log("changedAmount", Number(changedAmount));

    const response = await axios.patch("/amount", {changedAmount: Number(changedAmount)});

    console.log("response from updateAmountHandler", response);

    try {
      setLoading(true);
      const response = await axios.patch("/amount", changedAmount );
      setAmount(response.data.amount);
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
        <div className="flex flex-col col-span-5 py-6 px-8">
          <div className="relative bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Registration Fee
            </h1>

            <div className="w-full flex items-center justify-between p-5 bg-gray-100 rounded-2xl shadow-inner hover:shadow-md transition">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">
                  Amount
                </span>
                <span className="text-2xl font-semibold text-gray-800">
                  ₹ {amount}
                </span>
              </div>

              <button
                className="p-2 rounded-full hover:bg-gray-200 transition"
                aria-label="Edit Amount"
                onClick={() => setShowPopup(true)}
              >
                <img src={editIcon} alt="Edit" className="w-5 h-5" />
              </button>
            </div>

            {/* Popup Modal */}
            {showPopup && (
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col gap-4">
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
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
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
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center gap-2"
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
