import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import Sidebar from "./AdminLoginSignup/Sidebar";
import AdminHeader from "./AdminHeader";
import axios from "../../api/axios";

const normalizeKey = (key = "") => key.trim().toLowerCase().replace(/\s+/g, "_");

const parseCsv = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => normalizeKey(h));
  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] ?? "";
    });
    row._rowId = `${index + 1}`;
    return row;
  });
};

const parseSpreadsheet = async (file) => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return [];

    return XLSX.utils
      .sheet_to_json(worksheet, { defval: "" })
      .map((row, index) => {
        const normalizedRow = {};
        Object.entries(row).forEach(([key, value]) => {
          normalizedRow[normalizeKey(key)] = String(value ?? "").trim();
        });
        normalizedRow._rowId = `${index + 1}`;
        return normalizedRow;
      });
  }

  const csvText = await file.text();
  return parseCsv(csvText);
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  "Import failed. Please verify the file structure and try again.";

const exampleHeaders = [
  "studentName",
  "contactNumber",
  "email",
  "classForAdmission",
  "program",
  "dob",
  "gender",
  "examName",
  "examDate",
  "FatherName",
  "FatherContactNumber",
  "FatherOccupation",
  "MotherName",
  "MotherContactNumber",
  "MotherOccupation",
  "FamilyIncome",
  "SchoolName",
  "Percentage",
  "Class",
  "YearOfPassing",
  "Board",
  "payment_amount",
  "payment_id",
];

const exampleRow = [
  "Aarav Sharma",
  "9876543210",
  "aarav.sharma@example.com",
  "XI Engineering",
  "JEE",
  "2009-04-15",
  "Male",
  "SDAT",
  "2026-06-15",
  "Rajesh Sharma",
  "9876543211",
  "Business",
  "Sunita Sharma",
  "9876543212",
  "Teacher",
  "600000",
  "Scholars Den School",
  "88",
  "X",
  "2025",
  "CBSE",
  "500",
  "OFFLINE-REC-1001",
];

const escapeCsvValue = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const OfflineRegistrationUpload = () => {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [importSummary, setImportSummary] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setFileName(file.name);
    setSelectedFile(file);
    setImportSummary(null);

    try {
      const parsedRows = await parseSpreadsheet(file);

      if (parsedRows.length === 0) {
        setRows([]);
        setSelectedFile(null);
        setError("No valid records found. Please upload a CSV/XLSX with header + data rows.");
        return;
      }

      setRows(parsedRows);
      setSubmitMessage("");
    } catch (err) {
      console.error(err);
      setSelectedFile(null);
      setError("Unable to read the file. Please upload a valid CSV or XLSX file.");
    }
  };

  const enrichedRows = useMemo(() => {
    return rows.map((row) => {
      const receiptId =
        row.receipt_id ||
        row.receiptid ||
        row.receipt ||
        row.recipt_id ||
        row.reciptid ||
        row.recipt ||
        row.payment_receipt_id ||
        row.payment_receipt ||
        row.payment_id ||
        row.paymentid ||
        "";

      const paymentId = row.payment_id || row.paymentid || "";
      const paymentStatus = receiptId ? "Paid" : "Pending";

      return {
        ...row,
        _receiptId: receiptId,
        _paymentId: paymentId,
        _paymentStatus: paymentStatus,
      };
    });
  }, [rows]);

  const summary = useMemo(() => {
    const paid = enrichedRows.filter((row) => row._paymentStatus === "Paid").length;
    const pending = enrichedRows.length - paid;
    return { total: enrichedRows.length, paid, pending };
  }, [enrichedRows]);

  const handleBulkCreate = async () => {
    if (!selectedFile || enrichedRows.length === 0) {
      setSubmitMessage("Please upload student data first.");
      return;
    }

    setSubmitLoading(true);
    setSubmitMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("/admin/offline-registration/import-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const summary = response?.data?.summary || {};
      setImportSummary(summary);
      setSubmitMessage(
        `Import complete. Created ${summary.createdCount || 0} records, skipped ${summary.skippedCount || 0}.`
      );
    } catch (err) {
      console.error(err);
      setSubmitMessage(getErrorMessage(err));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDownloadExample = () => {
    const csv = [exampleHeaders, exampleRow]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "offline-registration-example.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const previewColumns = useMemo(() => {
    if (enrichedRows.length === 0) return [];
    const systemCols = new Set([
      "_rowId",
      "_receiptId",
      "_paymentId",
      "_paymentStatus",
    ]);
    return Object.keys(enrichedRows[0]).filter((key) => !systemCols.has(key));
  }, [enrichedRows]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fdf5f6] to-[#f6ecee]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        <div className="lg:col-span-9 xl:col-span-10 p-4 pt-16 lg:pt-6 sm:p-6">
          <AdminHeader
            title="Offline Registration Upload"
            subtitle="Upload offline registration CSV/XLSX data and auto-classify payment status by receipt_id."
          />

          <div className="w-full bg-white/90 rounded-3xl border border-white shadow-[0_20px_50px_rgba(157,23,33,0.08)] p-5 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-[#fff4de] border border-[#f6d9a8] p-4">
                <p className="text-xs text-gray-600">Total Records</p>
                <p className="text-2xl font-extrabold text-gray-800">{summary.total}</p>
              </div>
              <div className="rounded-xl bg-[#eafaf1] border border-[#bde8d0] p-4">
                <p className="text-xs text-gray-600">Paid (receipt_id found)</p>
                <p className="text-2xl font-extrabold text-[#0b8f4d]">{summary.paid}</p>
              </div>
              <div className="rounded-xl bg-[#fde9ea] border border-[#f5c9cc] p-4">
                <p className="text-xs text-gray-600">Pending Payment</p>
                <p className="text-2xl font-extrabold text-[#9f1239]">{summary.pending}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#fcfbfb] p-4 sm:p-5 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Offline Registration File
              </label>
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadExample}
                  className="inline-flex w-fit items-center justify-center rounded-xl border border-[#c61d23] bg-white px-4 py-2 text-sm font-semibold text-[#c61d23] transition hover:bg-[#fff4f4]"
                >
                  Download Example File
                </button>
                <p className="text-xs text-gray-500">
                  Includes required columns: studentName, contactNumber, classForAdmission, and payment_id for offline receipt.
                </p>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
              />
              {fileName && <p className="text-sm text-gray-600 mt-2">File: {fileName}</p>}
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBulkCreate}
                  disabled={submitLoading || enrichedRows.length === 0}
                  className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                    submitLoading || enrichedRows.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#c61d23] to-[#8f1515] hover:opacity-95"
                  }`}
                >
                  {submitLoading ? "Importing Records..." : "Import Offline Registrations"}
                </button>
                {submitMessage && (
                  <p
                    className={`text-sm self-center ${
                      submitMessage.includes("failed") || submitMessage.includes("Failed")
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {submitMessage}
                  </p>
                )}
              </div>
              {importSummary && (
                <p className="text-xs text-gray-500 mt-3">
                  Server processed {importSummary.totalRows || 0} rows. Payment is stored in
                  paymentId when receipt_id/reciptId/payment_id is present.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Processed Full Student Data Preview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gradient-to-r from-[#c61d23] to-[#8f1515] text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Row</th>
                      {previewColumns.map((col) => (
                        <th key={col} className="px-3 py-2 text-left whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-left whitespace-nowrap">Payment/Receipt ID</th>
                      <th className="px-3 py-2 text-left">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedRows.length > 0 ? (
                      enrichedRows.map((row) => (
                        <tr key={row._rowId} className="border-b border-gray-100">
                          <td className="px-3 py-2">{row._rowId}</td>
                          {previewColumns.map((col) => (
                            <td key={`${row._rowId}-${col}`} className="px-3 py-2 whitespace-nowrap">
                              {row[col] || "-"}
                            </td>
                          ))}
                          <td className="px-3 py-2">{row._receiptId || "-"}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                row._paymentStatus === "Paid"
                                  ? "bg-[#eafaf1] text-[#0b8f4d]"
                                  : "bg-[#fde9ea] text-[#9f1239]"
                              }`}
                            >
                              {row._paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={previewColumns.length + 3}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Upload a CSV file to preview offline registration payment status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Rule: If `receipt_id`, `reciptId`, or `payment_id` is available, payment is considered complete; otherwise pending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineRegistrationUpload;
