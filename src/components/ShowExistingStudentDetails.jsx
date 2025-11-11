import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExistingUserDetails } from "../redux/slices/existingStudentSlice";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Mail, Phone, Award, FileText, User, Loader } from "lucide-react";

const ShowExistingStudentDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.existingStudentDetails);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchExistingUserDetails());
  }, [dispatch]);

  const createNewStudent = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/students/createNewStudent");
      console.log("response", response);
      // document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
      navigate("/registration/basicDetailsForm");
    } catch (error) {
      console.error("Error creating student:", error);
      setLoading(false);
    }
  };

  const continueWithExistingProfile = async (_id) => {
    try {
      setLoading(true);
      const response = await axios.post("/students/continueRegistration", {
        _id,
      });
      // document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
      console.log("response continueWithExisting Profile", response);
      navigate("/registration/basicDetailsForm");
    } catch (error) {
      console.error("Error continuing registration:", error);
      setLoading(false);
    }
  };

  const students = userData?.data || [];

  // Sort students: pending first, then completed
  const sortedStudents = [...students].sort((a, b) => {
    const aIsPending = !a.admitCard;
    const bIsPending = !b.admitCard;
    if (aIsPending === bIsPending) return 0;
    return aIsPending ? -1 : 1;
  });

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
    <div className="bg-[#fdf5f6] p-1 sm:p-10 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-gray-100 -mx-1 sm:-mx-10 px-1 sm:px-10 py-6 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#c61d23]">
              Student Profiles
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your student registrations</p>
          </div>
          <button
            onClick={createNewStudent}
            className="group relative px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/30 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Student</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c61d23] to-[#a01818] opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {sortedStudents && sortedStudents.length > 0 ? (
            sortedStudents.map((student, index) => (
              <div
                key={student._id || index}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#ffdd00]/40 shadow-md hover:shadow-xl hover:shadow-[#c61d23]/10 transition-all duration-300 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#c61d23]/0 via-[#ffdd00]/0 to-[#c61d23]/0 group-hover:from-[#c61d23]/3 group-hover:via-[#ffdd00]/5 group-hover:to-[#c61d23]/3 transition-all duration-300"></div>

                <div className="relative p-6 sm:p-8">
                  {/* Status Badge */}
                  {!student.admitCard ? (
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-gradient-to-r from-[#ffdd00] to-amber-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></div>
                      Pending
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Completed
                    </div>
                  )}

                  <div className="flex gap-6 mb-6">
                    {/* Profile Picture */}
                    <div className="relative">
                      <img
                        src={student.profilePicture || "https://via.placeholder.com/120"}
                        alt={student.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#ffdd00]/30 object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#c61d23] to-[#a01818] p-2 rounded-full text-white shadow-lg">
                        <User size={16} />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
                          {student.name}
                        </h3>
                        <p className="text-[#c61d23] text-sm font-mono font-semibold">ID: {student.StudentsId}</p>
                      </div>
                      <p className="text-gray-600 text-sm">{student.role || "Student"}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="flex justify-between space-y-3 mb-6 bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-[#c61d23] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="text-sm text-gray-900 truncate">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-[#c61d23] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase">Contact</p>
                        <p className="text-sm text-gray-900">{student.contactNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award size={16} className="text-[#c61d23] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase">Payment ID</p>
                        <p className="text-sm text-gray-900 font-mono">{student.paymentId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-col sm:flex-row">
                    {!student.admitCard && (
                      <button
                        onClick={() => continueWithExistingProfile(student._id)}
                        className="flex-1 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-red-500/30"
                      >
                        <span>Continue Registration</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    {student.admitCard && (
                      <a
                        href={student.admitCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-emerald-500/30"
                      >
                        <FileText size={18} />
                        <span>View Admit Card</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <User size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No students yet</h3>
              <p className="text-gray-600 mb-6">Create a new student profile to get started</p>
              <button
                onClick={createNewStudent}
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create First Student
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSelectedStudent(null)}
              aria-label="Close"
            >
              <div className="text-2xl">✕</div>
            </button>

            <div className="text-center mb-6">
              <img
                src={selectedStudent.profilePicture || "https://via.placeholder.com/150"}
                alt={selectedStudent.name}
                className="w-32 h-32 mx-auto rounded-2xl border-4 border-[#ffdd00]/30 object-cover mb-4 shadow-lg"
              />
              <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
              <p className="text-[#c61d23] text-sm font-mono font-semibold mt-1">{selectedStudent.StudentsId}</p>
            </div>

            <div className=" space-y-4 bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-xl p-4 border border-gray-100 mb-6">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Email</p>
                <p className="text-sm text-gray-900 break-all">{selectedStudent.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Contact</p>
                <p className="text-sm text-gray-900">{selectedStudent.contactNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Payment ID</p>
                <p className="text-sm text-gray-900 font-mono">{selectedStudent.paymentId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Role</p>
                <p className="text-sm text-gray-900">{selectedStudent.role || "Student"}</p>
              </div>
              {selectedStudent.admitCard && (
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Admit Card</p>
                  <a
                    href={selectedStudent.admitCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    <FileText size={16} />
                    View PDF
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowExistingStudentDetails;