import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import { fetchExistingUserFormEnquiryDetails } from "../redux/slices/existingStudentSlice";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Mail,
  Phone,
  Calendar,
  Info,
  Loader,
  FileText,
} from "lucide-react";
import ProfileBar from "./ProfileBar";
import { updateExistingUserDetails } from "../redux/slices/existingStudentSlice";

const ShowEnquiryOFExistingStudentDetails = () => {
  const { userData } = useSelector((state) => state.existingStudentDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchExistingUserFormEnquiryDetails());
  }, [dispatch]);

  const handleLogout = async () => {
    setLoading(true);
    await dispatch(updateExistingUserDetails({ userdata: "" }));
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const continueWithExistingStudent = async (enquiry) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/students/continueWithExistingStudent",
        {
          userData: enquiry,
        }
      );

      navigate("/registration/basicDetailsForm");

      console.log("response data from continueWithExistingStudent", response);
    } catch (error) {
      console.error("Error in continueWithExistingStudent", error);
      setLoading(false);
    }
  };

  const createNewStudent = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/students/createNewStudent");
      console.log("response", response);
      // document.cookie = `authToken=${response.data.token}; path=/; max-age=3600`;
      navigate("/registration/basicDetailsForm");
    } catch (error) {
      console.error("Error creating new student", error);
      setLoading(false);
    }
  };

  const enquiries = userData || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf5f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={48} className="text-[#c61d23] animate-spin" />
          <p className="text-gray-600 font-medium">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf5f6] p-1 sm:p-10 overflow-auto min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-gray-100 -mx-1 sm:-mx-10 px-1 sm:px-10 py-6 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#c61d23]">
              Enquiry Details
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Review and continue your enquiries
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={createNewStudent}
              className="group relative px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/30 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Student</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c61d23] to-[#a01818] opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"></div>
            </button>
            <ProfileBar onLogout={handleLogout} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {enquiries && enquiries.length > 0 ? (
            enquiries.map((enquiry, index) => (
              <div
                key={enquiry._id || index}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#ffdd00]/40 shadow-md hover:shadow-xl hover:shadow-[#c61d23]/10 transition-all duration-300 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#c61d23]/0 via-[#ffdd00]/0 to-[#c61d23]/0 group-hover:from-[#c61d23]/3 group-hover:via-[#ffdd00]/5 group-hover:to-[#c61d23]/3 transition-all duration-300"></div>

                <div className="relative p-6 sm:p-8">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-gradient-to-r from-[#ffdd00] to-amber-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></div>
                    Pending
                  </div>

                  {/* Enquiry Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Enquiry #{enquiry.enquiryNumber}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Complete your registration process
                    </p>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-xl p-4 border border-gray-100">
                    {enquiry.name && (
                      <div className="flex items-center gap-3">
                        <Info
                          size={16}
                          className="text-[#c61d23] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase">
                            Name
                          </p>
                          <p className="text-sm text-gray-900 truncate">
                            {enquiry.name}
                          </p>
                        </div>
                      </div>
                    )}
                    {enquiry.email && (
                      <div className="flex items-center gap-3">
                        <Mail
                          size={16}
                          className="text-[#c61d23] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase">
                            Email
                          </p>
                          <p className="text-sm text-gray-900 truncate">
                            {enquiry.email}
                          </p>
                        </div>
                      </div>
                    )}
                    {enquiry.contactNumber && (
                      <div className="flex items-center gap-3">
                        <Phone
                          size={16}
                          className="text-[#c61d23] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase">
                            Contact
                          </p>
                          <p className="text-sm text-gray-900">
                            {enquiry.contactNumber}
                          </p>
                        </div>
                      </div>
                    )}
                    {enquiry.createdAt && (
                      <div className="flex items-center gap-3">
                        <Calendar
                          size={16}
                          className="text-[#c61d23] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase">
                            Created
                          </p>
                          <p className="text-sm text-gray-900">
                            {formatDate(enquiry.createdAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-col sm:flex-row">
                    <button
                      onClick={() => continueWithExistingStudent(enquiry)}
                      className="flex-1 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-red-500/30"
                    >
                      <span>Continue Registration</span>
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No enquiries found
              </h3>
              <p className="text-gray-600 mb-6">
                Create a new student profile to get started
              </p>
              <button
                onClick={createNewStudent}
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create New Student
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Full Details */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close"
              >
                <div className="text-2xl">✕</div>
              </button>
              <h3 className="text-2xl font-bold text-gray-900">
                Enquiry #{selectedEnquiry.enquiryNumber}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Complete enquiry details
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3 bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-xl p-4 border border-gray-100">
                {Object.entries(selectedEnquiry).map(([key, value]) => {
                  if (["_id", "__v"].includes(key)) return null;

                  let label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());

                  if (key === "howToKnowAboutUs") {
                    label = "How did you hear about us?";
                  }

                  let displayValue = value;
                  if (key === "createdAt" || key === "updatedAt") {
                    displayValue = formatDate(value);
                  }

                  return (
                    <div
                      key={key}
                      className="flex justify-between items-start border-b border-gray-200 last:border-0 py-3"
                    >
                      <span className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        {label}:
                      </span>
                      <span className="text-gray-900 text-sm text-right max-w-[60%]">
                        {displayValue || "N/A"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedEnquiry(null);
                    continueWithExistingStudent(selectedEnquiry);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30"
                >
                  Continue Registration
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEnquiryOFExistingStudentDetails;
