import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBasicDetails,
  updateBasicDetails,
} from "../../redux/slices/basicDetailsSlice";

const UploadDocumentField = ({ documentUrl, setDocumentUrl, showPopup }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);



  const { userData } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const maxSizeMB = 2;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFileUpload = (file) => {
    if (!allowedTypes.includes(file.type)) {
      showPopup("Only JPG, JPEG, or PNG files are allowed.", "error");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      showPopup("File size must be less than 2MB.", "error");
      return;
    }

    uploadToCloudinary(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ProfilePictures");
      formData.append("cloud_name", "dtytgoj3f");
      formData.append("folder", "SDAT270425Image");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtytgoj3f/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        dispatch(updateBasicDetails({ profilePicture: data.secure_url }));

        setDocumentUrl(data.secure_url);
        showPopup("Upload successful!", "success");
        closeModal();
      } else {
        showPopup("Upload failed.", "error");
      }
    } catch (err) {
      showPopup("Upload error.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch {
      showPopup("Cannot access camera.", "error");
    }
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks()?.forEach((track) => track.stop());
    setShowCamera(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      stopCamera();
      setIsModalOpen(false);
      uploadToCloudinary(blob);
    }, "image/png");
  };

  useEffect(() => {
    dispatch(fetchBasicDetails());
  }, []);

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor="document-upload"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Upload Document (JPEG, PNG, Max 2MB)
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={openModal}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:border-blue-500 transition"
      >
        Upload Document
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80 relative">
            {!showCamera ? (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Choose Upload Method
                </h2>
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-3 hover:bg-blue-700"
                  onClick={() => {
                    closeModal();
                    fileInputRef.current.click();
                  }}
                >
                  Upload from Device
                </button>
                <button
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  onClick={startCamera}
                >
                  Use Camera
                </button>
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-black"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded"
                />
                <button
                  onClick={captureImage}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Capture
                </button>
                <button
                  onClick={() => {
                    stopCamera();
                    closeModal();
                  }}
                  className="text-sm text-gray-500 hover:text-black mt-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uploading Status */}
      {isUploading && (
        <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Uploading document...
        </div>
      )}

      {/* Preview */}
      {(userData?.profilePicture || documentUrl )&& !isUploading && (
        <div className="mt-3">
          <p className="text-sm text-green-600">
            Document uploaded successfully.
          </p>
          <img
            src={userData.profilePicture || documentUrl}
            alt="Uploaded Document"
            className="mt-2 h-32 rounded-md border"
          />
        </div>
      )}

      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default UploadDocumentField;
