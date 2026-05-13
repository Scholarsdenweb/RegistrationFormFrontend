import { useMemo, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiImage,
  FiRefreshCcw,
  FiUploadCloud,
  FiXCircle,
} from "react-icons/fi";
import AdminHeader from "./AdminHeader";

const CLOUDINARY_UPLOAD_PRESET = "ProfilePictures";
const CLOUDINARY_CLOUD_NAME = "dtytgoj3f";
const CLOUDINARY_FOLDER = "Student_Pictures";

const formatDuration = (seconds = 0) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  const rounded = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  if (!minutes) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const toCleanPublicId = (fileName = "") => {
  const dotIndex = fileName.lastIndexOf(".");
  const nameWithoutExtension = dotIndex > -1 ? fileName.slice(0, dotIndex) : fileName;
  return nameWithoutExtension.trim().replace(/\s+/g, "_");
};

const CloudinaryUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFileName, setCurrentFileName] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const selectedFiles = useMemo(() => Array.from(files || []), [files]);
  const selectedSize = useMemo(
    () => selectedFiles.reduce((sum, file) => sum + file.size, 0),
    [selectedFiles],
  );
  const successCount = uploadResults.filter((result) => result.status === "success").length;
  const failedCount = uploadResults.filter((result) => result.status === "error").length;
  const processedCount = uploadResults.length;
  const remainingCount = Math.max(selectedFiles.length - processedCount, 0);
  const progressPercent = selectedFiles.length
    ? Math.round((processedCount / selectedFiles.length) * 100)
    : 0;
  const averageSeconds = processedCount > 0 ? elapsedSeconds / processedCount : 0;
  const estimatedRemainingSeconds = uploading ? averageSeconds * remainingCount : 0;
  const totalDurationSeconds =
    startedAt && finishedAt ? Math.max(0, Math.round((finishedAt - startedAt) / 1000)) : elapsedSeconds;

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const setSelectedFiles = (fileList) => {
    setFiles(Array.from(fileList || []).filter((file) => file.type.startsWith("image/")));
    setUploadResults([]);
    setCurrentFileName("");
    setStartedAt(null);
    setFinishedAt(null);
    setElapsedSeconds(0);
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files?.length) {
      setSelectedFiles(event.dataTransfer.files);
    }
  };

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);
    formData.append("public_id", toCleanPublicId(file.name));

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length || uploading) return;

    resetTimer();
    const start = Date.now();
    setStartedAt(start);
    setFinishedAt(null);
    setElapsedSeconds(0);
    setUploadResults([]);
    setUploading(true);

    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - start) / 1000));
    }, 1000);

    for (const file of selectedFiles) {
      setCurrentFileName(file.name);
      try {
        const url = await uploadSingleFile(file);
        setUploadResults((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            url,
            status: "success",
            error: null,
          },
        ]);
      } catch (error) {
        setUploadResults((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            url: null,
            status: "error",
            error: error.message || "Upload failed",
          },
        ]);
      }
    }

    const end = Date.now();
    resetTimer();
    setElapsedSeconds(Math.round((end - start) / 1000));
    setFinishedAt(end);
    setCurrentFileName("");
    setUploading(false);
  };

  const clearResults = () => {
    resetTimer();
    setFiles([]);
    setUploadResults([]);
    setUploading(false);
    setCurrentFileName("");
    setStartedAt(null);
    setFinishedAt(null);
    setElapsedSeconds(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <AdminHeader
        title="Upload Student Pictures"
        subtitle="Upload student profile photos to Cloudinary with clear progress tracking."
      />

      <section className="bg-white border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-0">
          <div className="p-4 sm:p-6 border-b xl:border-b-0 xl:border-r border-gray-200">
            <div
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 text-center transition ${
                dragActive
                  ? "border-[#c61d23] bg-[#fff5f5]"
                  : "border-gray-300 bg-gray-50 hover:border-[#c61d23]/60"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff5f5] text-[#c61d23]">
                <FiUploadCloud size={28} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {dragActive ? "Drop photos here" : "Choose or drag student photos"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                Upload JPG, PNG, or other image files. File names are used as Cloudinary public IDs after replacing spaces with underscores.
              </p>
              <div className="mt-5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                {selectedFiles.length
                  ? `${selectedFiles.length} photo${selectedFiles.length === 1 ? "" : "s"} selected · ${formatBytes(selectedSize)}`
                  : "No photos selected"}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={uploadFiles}
                disabled={uploading || !selectedFiles.length}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                  uploading || !selectedFiles.length
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#c61d23] hover:bg-[#a8191e]"
                }`}
              >
                <FiUploadCloud />
                {uploading ? "Uploading Photos..." : "Upload Photos"}
              </button>
              <button
                type="button"
                onClick={clearResults}
                disabled={uploading && processedCount === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
              >
                <FiRefreshCcw /> Clear
              </button>
            </div>
          </div>

          <aside className="p-4 sm:p-6 bg-[#fcfbfb]">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uploaded</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{successCount}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Remaining</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{remainingCount}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Failed</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{failedCount}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{selectedFiles.length}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-gray-900">Upload Progress</p>
                <p className="text-sm font-bold text-[#c61d23]">{progressPercent}%</p>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#c61d23] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {currentFileName && (
                <p className="mt-3 truncate text-sm text-gray-600">
                  Uploading: <span className="font-semibold text-gray-900">{currentFileName}</span>
                </p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <FiClock /> Time taken
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">{formatDuration(totalDurationSeconds)}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <FiClock /> Estimated remaining
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {uploading ? formatDuration(estimatedRemainingSeconds) : "0s"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Upload Details</h2>
            <p className="text-sm text-gray-500">
              {uploadResults.length
                ? `${successCount} uploaded, ${failedCount} failed, ${remainingCount} remaining`
                : "Results will appear here as each photo completes."}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {uploadResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {uploadResults.map((result, index) => (
                <article
                  key={`${result.name}-${index}`}
                  className={`rounded-lg border p-4 ${
                    result.status === "success"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex gap-3">
                    {result.status === "success" ? (
                      <img
                        src={result.url}
                        alt={result.name}
                        className="h-16 w-16 rounded-lg object-cover border border-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-red-500">
                        <FiXCircle size={28} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {result.status === "success" ? (
                          <FiCheckCircle className="shrink-0 text-emerald-600" />
                        ) : (
                          <FiXCircle className="shrink-0 text-red-600" />
                        )}
                        <p className="truncate text-sm font-bold text-gray-900">{result.name}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{formatBytes(result.size)}</p>
                      {result.status === "success" ? (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
                        >
                          <FiImage /> View uploaded photo
                        </a>
                      ) : (
                        <p className="mt-2 text-sm font-medium text-red-700">{result.error}</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <p className="text-sm font-semibold text-gray-700">No upload activity yet.</p>
              <p className="mt-1 text-sm text-gray-500">Select photos and start upload to see progress here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CloudinaryUpload;
