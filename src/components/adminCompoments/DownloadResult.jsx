import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiCheckCircle, FiChevronRight, FiDownload, FiExternalLink, FiRefreshCcw, FiSearch, FiSend } from "react-icons/fi";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
import axios from "../../api/axios";

const formatDateLabel = (value = "") => {
  const parts = String(value).split(/[./-]/);
  if (parts.length !== 3) return value || "-";

  const [day, month, year] = parts[0].length === 4
    ? [parts[2], parts[1], parts[0]]
    : parts;

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DownloadResult = () => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [examDates, setExamDates] = useState([]);
  const [selectedExamDate, setSelectedExamDate] = useState("");
  const [results, setResults] = useState([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [zipDownloadLoading, setZipDownloadLoading] = useState(false);
  const [sendingResultId, setSendingResultId] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [resultFilters, setResultFilters] = useState({
    search: "",
    whatsappStatus: "all",
  });
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedSummary = useMemo(
    () => examDates.find((item) => item.examDate === selectedExamDate),
    [examDates, selectedExamDate],
  );

  const totalResults = useMemo(
    () => examDates.reduce((sum, item) => sum + (item.count || 0), 0),
    [examDates],
  );

  const sentResultsCount = useMemo(
    () => results.filter((result) => result.whatsappSent).length,
    [results],
  );

  const filteredResults = useMemo(() => {
    const search = resultFilters.search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch = !search || String(result.StudentId || "").toLowerCase().includes(search);
      const matchesWhatsApp =
        resultFilters.whatsappStatus === "all"
          || (resultFilters.whatsappStatus === "sent" && result.whatsappSent)
          || (resultFilters.whatsappStatus === "pending" && !result.whatsappSent);

      return matchesSearch && matchesWhatsApp;
    });
  }, [results, resultFilters]);

  const fetchExamDates = async (range = dateRange) => {
    setDatesLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const params = new URLSearchParams();
      if (range.startDate) params.set("startDate", range.startDate);
      if (range.endDate) params.set("endDate", range.endDate);

      const response = await axios.get(`/result/dates?${params.toString()}`);
      const dates = response.data || [];
      setExamDates(dates);
      setSelectedExamDate("");
      setResults([]);
    } catch (err) {
      console.error(err);
      setError("Unable to load SDAT result dates.");
      setExamDates([]);
      setSelectedExamDate("");
    } finally {
      setDatesLoading(false);
    }
  };

  const fetchResultsByDate = async (examDate) => {
    if (!examDate) {
      setResults([]);
      return;
    }

    setResultsLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await axios.get(
        `/result?date=${encodeURIComponent(examDate)}&page=1&limit=5000`,
      );
      setResults(response.data || []);
      setResultFilters({ search: "", whatsappStatus: "all" });
    } catch (err) {
      console.error(err);
      setError("Unable to load results for the selected date.");
      setResults([]);
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamDates();
  }, []);

  const handleRangeChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    fetchExamDates();
  };

  const handleResetFilter = () => {
    const emptyRange = { startDate: "", endDate: "" };
    setDateRange(emptyRange);
    fetchExamDates(emptyRange);
  };

  const handleSelectExamDate = (examDate) => {
    setSelectedExamDate(examDate);
    fetchResultsByDate(examDate);
  };

  const handleBackToDates = () => {
    setSelectedExamDate("");
    setResults([]);
    setResultFilters({ search: "", whatsappStatus: "all" });
    setStatusMessage("");
  };

  const handleResultFilterChange = (event) => {
    const { name, value } = event.target;
    setResultFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetResultFilters = () => {
    setResultFilters({ search: "", whatsappStatus: "all" });
  };

  const handleDownloadAll = async () => {
    if (!selectedExamDate) return;

    setDownloadLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/result/combined-pdf`,
        {
          method: "POST",
          headers: {
            Accept: "application/pdf",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedExamDate }),
        },
      );

      if (!response.ok) {
        throw new Error("Combined PDF download failed");
      }

      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "";
      const extension = contentType.includes("zip") ? "zip" : "pdf";
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SDAT_Results_${selectedExamDate}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Unable to create or download the combined result PDF for this date.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!selectedExamDate) return;

    setZipDownloadLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/employees/generate-zip`,
        {
          method: "POST",
          headers: {
            Accept: "application/zip",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedExamDate }),
        },
      );

      if (!response.ok) {
        throw new Error("ZIP download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SDAT_Results_${selectedExamDate}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Unable to download all results as a ZIP folder for this date.");
    } finally {
      setZipDownloadLoading(false);
    }
  };

  const updateResultAfterSend = (updatedResult) => {
    if (!updatedResult?._id) return;

    setResults((prev) =>
      prev.map((result) =>
        result._id === updatedResult._id
          ? { ...result, ...updatedResult }
          : result,
      ),
    );
  };

  const handleSendWhatsApp = async (result) => {
    if (!result?._id || result.whatsappSent) return;

    setSendingResultId(result._id);
    setError("");
    setStatusMessage("");

    try {
      const response = await axios.post("/result/send-whatsapp", {
        resultId: result._id,
      });
      updateResultAfterSend(response.data?.result);
      setStatusMessage(response.data?.message || "Result sent on WhatsApp successfully.");
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Unable to send this result on WhatsApp.";
      if (err?.response?.data?.result) {
        updateResultAfterSend(err.response.data.result);
      }
      setError(message);
    } finally {
      setSendingResultId("");
    }
  };

  const handleBulkSendWhatsApp = async () => {
    if (!selectedExamDate || results.length === 0) return;

    setBulkSending(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await axios.post("/result/send-whatsapp/bulk", {
        date: selectedExamDate,
      });
      const updatedResults = response.data?.results || [];
      setResults((prev) =>
        prev.map((result) => {
          const updatedResult = updatedResults.find((item) => item._id === result._id);
          return updatedResult ? { ...result, ...updatedResult } : result;
        }),
      );

      const summary = response.data?.summary;
      setStatusMessage(
        summary
          ? `WhatsApp bulk completed: ${summary.sent} sent, ${summary.alreadySent} already sent, ${summary.failed} failed.`
          : response.data?.message || "Bulk WhatsApp sending completed.",
      );
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to send bulk WhatsApp messages.");
    } finally {
      setBulkSending(false);
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
            title="Download Results"
            subtitle="Select an SDAT date, review all generated results, and export them together."
          />

          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
            <span className="font-medium text-gray-600">Download Results</span>
            <FiChevronRight className="text-gray-400" />
            <button
              type="button"
              onClick={handleBackToDates}
              disabled={!selectedExamDate}
              className={`font-medium ${
                selectedExamDate
                  ? "text-gray-600 hover:text-[#c61d23]"
                  : "text-[#c61d23] cursor-default"
              }`}
            >
              SDAT Dates
            </button>
            {selectedExamDate && (
              <>
                <FiChevronRight className="text-gray-400" />
                <span className="font-bold text-[#c61d23]">
                  {formatDateLabel(selectedExamDate)}
                </span>
              </>
            )}
          </nav>

          {!selectedExamDate && (
          <section className="w-full bg-white border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SDAT Result Dates</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {examDates.length} dates found · {totalResults} result files in this range
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  From
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleRangeChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
                  />
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  To
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleRangeChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c61d23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a8191e] self-end"
                >
                  <FiSearch /> Filter
                </button>
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23] self-end"
                >
                  <FiRefreshCcw /> Reset
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            {statusMessage && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {statusMessage}
              </div>
            )}

            <div className="mt-5">
              {datesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : examDates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {examDates.map((item) => {
                    const isSelected = selectedExamDate === item.examDate;
                    return (
                      <button
                        key={item.examDate}
                        type="button"
                        onClick={() => handleSelectExamDate(item.examDate)}
                        className={`text-left rounded-lg border p-4 transition ${
                          isSelected
                            ? "border-[#c61d23] bg-[#fff5f5] shadow-sm"
                            : "border-gray-200 bg-white hover:border-[#c61d23]/50"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <FiCalendar /> SDAT Date
                        </span>
                        <span className="mt-2 block text-lg font-bold text-gray-900">
                          {formatDateLabel(item.examDate)}
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          {item.count} result{item.count === 1 ? "" : "s"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                  <p className="text-sm font-semibold text-gray-700">No SDAT results found for this date range.</p>
                  <p className="text-sm text-gray-500 mt-1">Adjust the range or reset the filter.</p>
                </div>
              )}
            </div>
          </section>
          )}

          {selectedExamDate && (
          <section className="w-full bg-white border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 p-4 sm:p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedExamDate ? `Results for ${formatDateLabel(selectedExamDate)}` : "Select an SDAT date"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredResults.length} shown · {selectedSummary?.count || results.length || 0} generated result files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sentResultsCount} sent on WhatsApp · {Math.max(results.length - sentResultsCount, 0)} pending
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBulkSendWhatsApp}
                  disabled={!selectedExamDate || bulkSending || results.length === 0 || sentResultsCount === results.length}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                    !selectedExamDate || bulkSending || results.length === 0 || sentResultsCount === results.length
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  <FiSend />
                  {bulkSending ? "Sending..." : "Send Bulk Messages"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  disabled={!selectedExamDate || downloadLoading || results.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                    !selectedExamDate || downloadLoading || results.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#c61d23] hover:bg-[#a8191e]"
                  }`}
                >
                  <FiDownload />
                  {downloadLoading ? "Preparing PDF..." : "Download Combined PDF"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={!selectedExamDate || zipDownloadLoading || results.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${
                    !selectedExamDate || zipDownloadLoading || results.length === 0
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-[#c61d23] bg-white text-[#c61d23] hover:bg-[#fff5f5]"
                  }`}
                >
                  <FiDownload />
                  {zipDownloadLoading ? "Preparing ZIP..." : "Download ZIP Folder"}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <label className="text-sm font-semibold text-gray-700">
                  Search Student ID
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-[#c61d23] focus-within:ring-2 focus-within:ring-[#c61d23]/15">
                    <FiSearch className="text-gray-400" />
                    <input
                      type="search"
                      name="search"
                      value={resultFilters.search}
                      onChange={handleResultFilterChange}
                      placeholder="Enter student ID"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </label>

                <label className="text-sm font-semibold text-gray-700">
                  WhatsApp Status
                  <select
                    name="whatsappStatus"
                    value={resultFilters.whatsappStatus}
                    onChange={handleResultFilterChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
                  >
                    <option value="all">All Results</option>
                    <option value="sent">Sent</option>
                    <option value="pending">Pending</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleResetResultFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23] self-end"
                >
                  <FiRefreshCcw /> Reset
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
              {statusMessage && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {statusMessage}
                </div>
              )}
              {resultsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-80 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {filteredResults.map((result) => (
                    <article
                      key={result._id}
                      className="rounded-lg border border-gray-200 bg-white shadow-sm transition hover:border-[#c61d23]/50 hover:shadow-md"
                    >
                      <div className="h-64 overflow-hidden rounded-t-lg border-b border-gray-200 bg-gray-50">
                        <iframe
                          src={result.resultUrl}
                          title={`Result preview for ${result.StudentId || "student"}`}
                          className="h-full w-full bg-white"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Student ID
                            </p>
                            <h3 className="mt-1 text-base font-bold text-gray-900">
                              {result.StudentId || "-"}
                            </h3>
                          </div>
                          <span className="rounded-full bg-[#fff5f5] px-3 py-1 text-xs font-bold text-[#c61d23]">
                            {formatDateLabel(result.examDate)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
                          <span className="text-xs font-semibold text-gray-600">WhatsApp</span>
                          {result.whatsappSent ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              <FiCheckCircle /> Sent
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                              Pending
                            </span>
                          )}
                        </div>
                        <a
                          href={result.resultUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
                        >
                          <FiExternalLink /> Open Result
                        </a>
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(result)}
                          disabled={result.whatsappSent || sendingResultId === result._id || bulkSending}
                          className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                            result.whatsappSent
                              ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                              : sendingResultId === result._id || bulkSending
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                        >
                          {result.whatsappSent ? <FiCheckCircle /> : <FiSend />}
                          {result.whatsappSent
                            ? "Sent on WhatsApp"
                            : sendingResultId === result._id
                              ? "Sending..."
                              : "Send on WhatsApp"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center text-gray-500">
                  No results match the selected filters.
                </div>
              )}
            </div>
          </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DownloadResult;
