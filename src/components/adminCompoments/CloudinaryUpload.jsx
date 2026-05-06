// import React, { useState, useRef } from "react";

// const CloudinaryUpload = () => {
//   const [files, setFiles] = useState([]);
//   const [uploadResults, setUploadResults] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const inputRef = useRef();

//   // Handle file selection
//   const handleFileChange = (event) => {
//     setFiles(event.target.files);
//     setUploadResults([]);
//   };

//   // Drag and drop handlers
//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       setFiles(e.dataTransfer.files);
//       setUploadResults([]);
//     }
//   };

//   // Upload all files to Cloudinary
//   const uploadFiles = async () => {
//     if (!files.length) {
//       alert("Please select files first!");
//       return;
//     }
//     setUploading(true);
//     const uploadPreset = "ProfilePictures";
//     const cloudName = "dtytgoj3f";
//     const fileArray = Array.from(files);
//     const results = [];
//     for (let file of fileArray) {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", uploadPreset);
//       formData.append("folder", "SDAT130425Image");
//       try {
//         const response = await fetch(
//           `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );
//         const data = await response.json();
//         if (response.ok && data.secure_url) {
//           results.push({
//             name: file.name,
//             url: data.secure_url,
//             status: "success",
//             error: null,
//           });
//         } else {
//           results.push({
//             name: file.name,
//             url: null,
//             status: "error",
//             error: data.error?.message || "Unknown error",
//           });
//         }
//       } catch (error) {
//         results.push({
//           name: file.name,
//           url: null,
//           status: "error",
//           error: error.message || "Upload failed",
//         });
//       }
//     }
//     setUploadResults(results);
//     setUploading(false);
//   };

//   const clearResults = () => {
//     setFiles([]);
//     setUploadResults([]);
//     if (inputRef.current) inputRef.current.value = null;
//   };

//   // Count summary
//   const successCount = uploadResults.filter((r) => r.status === "success")
//     .length;
//   const errorCount = uploadResults.filter((r) => r.status === "error").length;

//   return (
//     <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-white rounded-3xl flex flex-col items-center justify-center gap-6 shadow-lg">
//       <h2 className="text-2xl font-bold mb-2">Upload Files to Cloudinary</h2>
//       <div
//         className={`w-full max-w-lg border-2 ${
//           dragActive
//             ? "border-blue-500 bg-blue-50"
//             : "border-dashed border-gray-300"
//         } rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer transition-all duration-200`}
//         onDragEnter={handleDrag}
//         onDragOver={handleDrag}
//         onDragLeave={handleDrag}
//         onDrop={handleDrop}
//         onClick={() => inputRef.current && inputRef.current.click()}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           multiple
//           onChange={handleFileChange}
//           className="hidden"
//         />
//         <span className="text-gray-500 text-lg">
//           {files.length > 0
//             ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
//             : dragActive
//             ? "Drop files here..."
//             : "Click or drag files here to upload"}
//         </span>
//       </div>
//       <button
//         onClick={uploadFiles}
//         disabled={uploading || !files.length}
//         className={`mt-3 px-6 py-2 rounded text-white font-semibold transition-all duration-200 ${
//           uploading || !files.length
//             ? "bg-blue-300 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {uploading ? (
//           <span className="flex items-center gap-2">
//             <svg
//               className="animate-spin h-5 w-5 text-white"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//                 fill="none"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8z"
//               />
//             </svg>
//             Uploading...
//           </span>
//         ) : (
//           "Upload All"
//         )}
//       </button>
//       {uploadResults.length > 0 && (
//         <div className="mt-4 w-full max-w-lg">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">Upload Summary</h3>
//             <button
//               onClick={clearResults}
//               className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
//             >
//               Clear Results
//             </button>
//           </div>
//           <div className="flex gap-4 mb-4">
//             <span className="text-green-600 font-medium">
//               Success: {successCount}
//             </span>
//             <span className="text-red-600 font-medium">
//               Failed: {errorCount}
//             </span>
//           </div>
//           <div className="space-y-3">
//             {uploadResults.map((result, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center gap-4 p-3 rounded-lg ${
//                   result.status === "success"
//                     ? "bg-green-50 border border-green-200"
//                     : "bg-red-50 border border-red-200"
//                 }`}
//               >
//                 {result.status === "success" ? (
//                   <>
//                     <img
//                       src={result.url}
//                       alt="Uploaded"
//                       className="w-16 h-16 object-cover rounded shadow"
//                     />
//                     <div>
//                       <div className="text-green-700 font-semibold">
//                         {result.name} uploaded successfully!
//                       </div>
//                       <a
//                         href={result.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline text-sm"
//                       >
//                         View Image
//                       </a>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded">
//                       <svg
//                         className="w-8 h-8 text-red-400"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <div className="text-red-700 font-semibold">
//                         {result.name} failed
//                       </div>
//                       <div className="text-red-500 text-sm">{result.error}</div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CloudinaryUpload;




import React, { useState, useRef } from "react";

const CloudinaryUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  // Handle file selection
  const handleFileChange = (event) => {
    setFiles(event.target.files);
    setUploadResults([]);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
      setUploadResults([]);
    }
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
    const fileArray = Array.from(files);
    const results = [];
    for (let file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "Student_Pictures");
      
      // Extract filename without extension and replace spaces with underscores
      const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const cleanFileName = fileNameWithoutExt.replace(/\s+/g, '_');
      formData.append("public_id", cleanFileName);
      
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (response.ok && data.secure_url) {
          results.push({
            name: file.name,
            url: data.secure_url,
            status: "success",
            error: null,
          });
        } else {
          results.push({
            name: file.name,
            url: null,
            status: "error",
            error: data.error?.message || "Unknown error",
          });
        }
      } catch (error) {
        results.push({
          name: file.name,
          url: null,
          status: "error",
          error: error.message || "Upload failed",
        });
      }
    }
    setUploadResults(results);
    setUploading(false);
  };

  const clearResults = () => {
    setFiles([]);
    setUploadResults([]);
    if (inputRef.current) inputRef.current.value = null;
  };

  // Count summary
  const successCount = uploadResults.filter((r) => r.status === "success")
    .length;
  const errorCount = uploadResults.filter((r) => r.status === "error").length;

  return (
    <div className="w-full min-h-[70vh] bg-white rounded-2xl flex flex-col items-center justify-center gap-6 shadow-lg p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Upload Files to Cloudinary</h2>
      <div
        className={`w-full max-w-lg border-2 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-dashed border-gray-300"
        } rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer transition-all duration-200`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-gray-500 text-sm sm:text-lg text-center px-3">
          {files.length > 0
            ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
            : dragActive
            ? "Drop files here..."
            : "Click or drag files here to upload"}
        </span>
      </div>
      <button
        onClick={uploadFiles}
        disabled={uploading || !files.length}
        className={`mt-3 px-6 py-2 rounded text-white font-semibold transition-all duration-200 ${
          uploading || !files.length
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload All"
        )}
      </button>
      {uploadResults.length > 0 && (
        <div className="mt-4 w-full max-w-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">Upload Summary</h3>
            <button
              onClick={clearResults}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
            >
              Clear Results
            </button>
          </div>
          <div className="flex gap-4 mb-4">
            <span className="text-green-600 font-medium">
              Success: {successCount}
            </span>
            <span className="text-red-600 font-medium">
              Failed: {errorCount}
            </span>
          </div>
          <div className="space-y-3">
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg ${
                  result.status === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {result.status === "success" ? (
                  <>
                    <img
                      src={result.url}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover rounded shadow"
                    />
                    <div>
                      <div className="text-green-700 font-semibold">
                        {result.name} uploaded successfully!
                      </div>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Image
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded">
                      <svg
                        className="w-8 h-8 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-red-700 font-semibold">
                        {result.name} failed
                      </div>
                      <div className="text-red-500 text-sm">{result.error}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;






// https://res.cloudinary.com/dtytgoj3f/image/upload/v1769152427/SDAT130425Image/Arav_Singh_202610273.jpg

// https://res.cloudinary.com/dtytgoj3f/image/upload/v1769152658/Student_Pictures/Arav_Singh_202610273.jpg
