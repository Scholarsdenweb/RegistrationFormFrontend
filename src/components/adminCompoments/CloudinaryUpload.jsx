import React, { useState } from "react";

const CloudinaryUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setFiles(event.target.files); // Store selected files
  };

  // Upload all files to Cloudinary
  const uploadFiles = async () => {
    if (!files.length) {
      alert("Please select files first!");
      return;
    }
  
    setUploading(true);
    const uploadPreset = "ProfilePictures";
    const cloudName = "dtytgoj3f";
    const urls = [];
  
    const fileArray = Array.from(files); // Convert FileList to an array
  
    for (let file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "SDAT130425Image"); // Optional: specify a folder in Cloudinary
  
      // Log to verify
      console.log("Uploading:", file.name);
      console.log("formData", formData);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
            overwrite: true, // Ensures the latest file replaces the old one
            invalidate: true, // Forces cache refresh for updated file
          }
        );
        const data = await response.json();
        console.log("Upload Success:", data.secure_url);
        urls.push(data.secure_url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  
    setUploadedUrls(urls);
    setUploading(false);
  };
  

  return (
    <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-white rounded-3xl flex flex-col items-center justify-center gap-6 shadow-lg">
      <h2 className="text-xl font-bold">Upload Files to Cloudinary</h2>
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mt-3"
      />

      <button
        onClick={uploadFiles}
        disabled={uploading}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload All"}
      </button>

      {/* {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Uploaded Files:</h3>
          {uploadedUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt="Uploaded" className="w-32 h-32 mt-2" />
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CloudinaryUpload;
