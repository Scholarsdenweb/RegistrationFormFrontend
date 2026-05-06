// components/PaymentProcessing.jsx

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Loader2, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";

const MAX_POLLS = 15;        // 15 attempts
const POLL_INTERVAL = 3000;  // every 3 seconds = 45s max wait

const PaymentProcessing = ({ razorpay_payment_id, onGiveUp }) => {
  const navigate = useNavigate();

  const [pollCount, setPollCount]     = useState(0);
  const [status, setStatus]           = useState("polling"); // polling | success | failed | timeout
  const [dotCount, setDotCount]       = useState(1);

  const pollTimerRef  = useRef(null);
  const dotTimerRef   = useRef(null);
  const isMountedRef  = useRef(true);

  // ── Animated dots ────────────────────────────────────────────────────────
  useEffect(() => {
    dotTimerRef.current = setInterval(() => {
      setDotCount((d) => (d % 3) + 1);
    }, 500);
    return () => clearInterval(dotTimerRef.current);
  }, []);

  // ── Core poll function ───────────────────────────────────────────────────
  const poll = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      const { data } = await axios.post("/payment/paymentverification", {
        razorpay_payment_id,
      });

      if (!isMountedRef.current) return;

      if (data?.success) {
        setStatus("success");
        clearInterval(pollTimerRef.current);

        // Small celebration delay before redirect
        setTimeout(() => {
          if (isMountedRef.current) navigate("/registration/success", { replace: true });
        }, 1500);
        return;
      }

      // 202 = still processing — keep polling
      setPollCount((c) => {
        const next = c + 1;
        if (next >= MAX_POLLS) {
          setStatus("timeout");
          clearInterval(pollTimerRef.current);
        }
        return next;
      });

    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Poll error:", error);

      setPollCount((c) => {
        const next = c + 1;
        if (next >= MAX_POLLS) {
          setStatus("timeout");
          clearInterval(pollTimerRef.current);
        }
        return next;
      });
    }
  }, [razorpay_payment_id, navigate]);

  // ── Start polling on mount ───────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    poll(); // immediate first check
    pollTimerRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      isMountedRef.current = false;
      clearInterval(pollTimerRef.current);
      clearInterval(dotTimerRef.current);
    };
  }, [poll]);

  const dots = ".".repeat(dotCount);
  const progress = Math.min((pollCount / MAX_POLLS) * 100, 95); // cap at 95% until success

  // ════════════════════════════════════════════════════════════════════════
  // RENDER — SUCCESS
  // ════════════════════════════════════════════════════════════════════════
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-emerald-100 rounded-full p-6 mb-4 border-4 border-emerald-200">
          <CheckCircle size={48} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h2>
        <p className="text-gray-600">Redirecting you to your registration details…</p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER — TIMEOUT (give up after MAX_POLLS)
  // ════════════════════════════════════════════════════════════════════════
  if (status === "timeout") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="bg-amber-100 rounded-full p-6 mb-4 border-4 border-amber-200">
          <AlertCircle size={48} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Still Processing…</h2>
        <p className="text-gray-600 mb-2 max-w-sm">
          Your payment was received but confirmation is taking longer than usual.
          This sometimes happens due to bank delays.
        </p>

        {/* Payment ID proof */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-6">
          <p className="text-xs text-gray-500">Your Payment ID (save this)</p>
          <p className="text-sm font-mono font-semibold text-gray-800 break-all">
            {razorpay_payment_id}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Retry polling */}
          <button
            onClick={() => {
              setPollCount(0);
              setStatus("polling");
              poll();
              pollTimerRef.current = setInterval(poll, POLL_INTERVAL);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold rounded-lg"
          >
            <RefreshCw size={18} />
            Check Again
          </button>

        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER — POLLING (default)
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">

      {/* Spinner */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl" />
        <div className="relative bg-blue-50 rounded-full p-6 border-4 border-blue-100">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Confirming your payment{dots}
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        Please don't close this tab. This usually takes just a few seconds.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-8">
        Check {pollCount + 1} of {MAX_POLLS}
      </p>

      {/* Payment ID for reassurance */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-start gap-3 text-left max-w-sm w-full">
        <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-emerald-800 mb-0.5">
            Payment Received
          </p>
          <p className="text-xs text-emerald-700 font-mono break-all">
            {razorpay_payment_id}
          </p>
        </div>
      </div>

      {/* Reassurance note */}
      <div className="mt-6 flex items-start gap-2 text-left max-w-sm w-full bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Clock size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Even if you close this tab, your payment is safe. You can log back in
          to check your registration status.
        </p>
      </div>
    </div>
  );
};

export default PaymentProcessing;
