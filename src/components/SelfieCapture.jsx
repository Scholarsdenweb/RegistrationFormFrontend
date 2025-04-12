import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitUserDetails } from "../redux/slices/userDeailsSlice";

const SelfieCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const navigate = useNavigate();
  const [showError, setShowError] = useState("");
  const { userData: userDetails } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();



  const getCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Front camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowError("Could not access camera.");
    }
  };
  
  useEffect(() => {
    getCamera();
  }, []);

  



  const handleCapture = async() => {
    const canvas =  canvasRef.current;
    const video =  videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");

    setCapturedImage(image);

    uploadToCloudinary(image);
  };

  const [formData, setFormData] = useState({
    profilePicture: userDetails?.profilePicture || null,
  });





  const uploadToCloudinary = async (dataUrl) => {
    setUploading(true);
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("file", blob, userDetails.StudentsId + ".png");
      formData.append("upload_preset", "ProfilePictures");
      formData.append("cloud_name", "dtytgoj3f");
      formData.append("folder", "SDAT130425Image")
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dtytgoj3f/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      if (data.secure_url) {
        const updatedFormData = {
          ...formData,
          profilePicture: data.secure_url,
        };

        console.log("Data.secure_url", data.secure_url)

        console.log("updatedForm", updatedFormData);
  
        setFormData(updatedFormData);
        dispatch(submitUserDetails(updatedFormData));
        setUploadedUrl(data.secure_url);
        navigate("/registration/payment");
      } else {
        setShowError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setShowError("Something went wrong");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-4">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-xl w-full aspect-square object-cover"
            />
            <button
              onClick={handleCapture}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
            >
              Capture Student Selfie
            </button>
          </>
        ) : (
          <>
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="rounded-xl w-full aspect-square object-cover"
            />
            {uploading ? (
              <p className="text-center text-gray-500 mt-2">Uploading...</p>
            ) : uploadedUrl ? (
              <div className="text-center mt-2">
                <p className="text-green-600">Upload successful!</p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  View Image
                </a>
              </div>
            ) : (
              <p className="text-center text-red-500 mt-2">Upload failed.</p>
            )}
            <button
              onClick={() => {
                setCapturedImage(null);
                setUploadedUrl("");
                getCamera();
              }}
              className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition"
            >
              Retake
            </button>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {showError && <p className="text-xl mt-5 text-[#c61d23]">{showError}</p>}
    </div>
  );
};

export default SelfieCapture;
