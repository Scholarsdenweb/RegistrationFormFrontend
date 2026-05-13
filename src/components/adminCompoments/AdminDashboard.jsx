import { useMemo, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCcw,
  FiUploadCloud,
  FiXCircle,
} from "react-icons/fi";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";

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

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const successCount = results.filter((item) => item.status === "success").length;
  const failedCount = results.filter((item) => item.status === "error").length;
  const skippedCount = results.filter((item) => item.status === "skipped").length;
  const remainingCount = Math.max((progress.total || 0) - (progress.current || 0), 0);
  const progressPercent = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;
  const averageSeconds = progress.current ? elapsedSeconds / progress.current : 0;
  const estimatedRemainingSeconds = loading ? averageSeconds * remainingCount : 0;
  const totalDurationSeconds =
    startedAt && finishedAt ? Math.max(0, Math.round((finishedAt - startedAt) / 1000)) : elapsedSeconds;
  const latestSuccess = useMemo(
    () => [...results].reverse().find((item) => item.status === "success" && item.url),
    [results],
  );

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetState = () => {
    clearTimer();
    setFile(null);
    setStatusMessage("");
    setProgress({ current: 0, total: 0 });
    setResults([]);
    setLoading(false);
    setStartedAt(null);
    setFinishedAt(null);
    setElapsedSeconds(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setStatusMessage("");
    setProgress({ current: 0, total: 0 });
    setResults([]);
    setStartedAt(null);
    setFinishedAt(null);
    setElapsedSeconds(0);
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
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
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleStreamEvent = (data) => {
    if (data.complete) {
      if (data.error) {
        setStatusMessage(data.error);
      } else {
        setStatusMessage("All result files generated successfully.");
      }
      return;
    }

    setProgress({ current: data.index || 0, total: data.total || 0 });
    setResults((prev) => [
      ...prev,
      {
        studentId: data.studentId || "",
        studentName: data.studentName || "",
        status: data.status || "success",
        url: data.url || "",
        error: data.error || "",
      },
    ]);
  };

  const handleUpload = async () => {
    if (!file || loading) {
      if (!file) setStatusMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    clearTimer();
    const start = Date.now();
    setStartedAt(start);
    setFinishedAt(null);
    setElapsedSeconds(0);
    setProgress({ current: 0, total: 0 });
    setResults([]);
    setStatusMessage("Uploading CSV and starting result generation...");
    setLoading(true);

    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - start) / 1000));
    }, 1000);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/employees/generateResult`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start result generation.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        events.forEach((eventText) => {
          const cleanText = eventText.replace(/^data:\s*/m, "").trim();
          if (!cleanText) return;
          try {
            handleStreamEvent(JSON.parse(cleanText));
          } catch (error) {
            console.error("Could not parse result progress event:", cleanText, error);
          }
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatusMessage(error.message || "Error uploading file.");
    } finally {
      const end = Date.now();
      clearTimer();
      setElapsedSeconds(Math.round((end - start) / 1000));
      setFinishedAt(end);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f3f3]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        <main className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader
            title="Result Processing"
            subtitle="Upload CSV files and generate student result PDFs with live progress tracking."
          />

          <section className="bg-white border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr]">
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
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff5f5] text-[#c61d23]">
                    <FiUploadCloud size={28} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {dragActive ? "Drop CSV here" : "Choose or drag result CSV"}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-gray-500">
                    Upload the SDAT result CSV. The system will generate report cards, upload PDFs, and update student result records.
                  </p>
                  <div className="mt-5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                    {file ? `${file.name} · ${formatBytes(file.size)}` : "No CSV selected"}
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                      loading || !file
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#c61d23] hover:bg-[#a8191e]"
                    }`}
                  >
                    <FiUploadCloud />
                    {loading ? "Generating Results..." : "Generate Results"}
                  </button>
                  <button
                    type="button"
                    onClick={resetState}
                    disabled={loading && progress.current === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
                  >
                    <FiRefreshCcw /> Clear
                  </button>
                </div>

                {statusMessage && (
                  <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
                    {statusMessage}
                  </div>
                )}
              </div>

              <aside className="p-4 sm:p-6 bg-[#fcfbfb]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Generated</p>
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Skipped</p>
                    <p className="mt-1 text-2xl font-bold text-amber-600">{skippedCount}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-gray-900">Generation Progress</p>
                    <p className="text-sm font-bold text-[#c61d23]">{progressPercent}%</p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#c61d23] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Results generated: <span className="font-bold text-gray-900">{progress.current}</span>
                    {" / "}
                    <span className="font-bold text-gray-900">{progress.total}</span>
                  </p>
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
                      {loading ? formatDuration(estimatedRemainingSeconds) : "0s"}
                    </p>
                  </div>
                </div>

                {latestSuccess?.url && (
                  <a
                    href={latestSuccess.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#c61d23] bg-white px-4 py-2.5 text-sm font-semibold text-[#c61d23] hover:bg-[#fff5f5]"
                  >
                    <FiFileText /> Open Latest Result
                  </a>
                )}
              </aside>
            </div>
          </section>

          <section className="mt-5 bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900">Generation Details</h2>
              <p className="text-sm text-gray-500">
                {results.length
                  ? `${successCount} generated, ${failedCount} failed, ${skippedCount} skipped, ${remainingCount} remaining`
                  : "Generated result details will appear here as each student finishes."}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.map((result, index) => (
                    <article
                      key={`${result.studentId}-${index}`}
                      className={`rounded-lg border p-4 ${
                        result.status === "success"
                          ? "border-emerald-200 bg-emerald-50"
                          : result.status === "skipped"
                          ? "border-amber-200 bg-amber-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.status === "success" ? (
                          <FiCheckCircle className="mt-1 shrink-0 text-emerald-600" size={22} />
                        ) : (
                          <FiXCircle className="mt-1 shrink-0 text-red-600" size={22} />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {result.studentName || "Unnamed student"}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            Student ID: {result.studentId || "-"}
                          </p>
                          {result.status === "success" && result.url ? (
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
                            >
                              <FiFileText /> View result
                            </a>
                          ) : (
                            <p className="mt-3 text-sm font-medium text-red-700">
                              {result.error || result.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                  <p className="text-sm font-semibold text-gray-700">No result generation activity yet.</p>
                  <p className="mt-1 text-sm text-gray-500">Upload a CSV and start generation to see progress here.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
