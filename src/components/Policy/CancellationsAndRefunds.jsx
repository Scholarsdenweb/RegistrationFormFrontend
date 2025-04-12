import React from "react";
import { useNavigate } from "react-router-dom";

const CancellationsAndRefunds = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-4 sm:px-8 py-6 bg-[#c61d23] text-white shadow-md relative">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-center">
        Cancellations & Refunds
      </h1>

      {/* Close Button */}
      <button
        className="absolute top-4 right-6 text-lg sm:text-2xl border-2 px-3 py-1 sm:py-2 rounded-full text-white hover:bg-[#ffdd00] hover:text-black transition"
        onClick={() => navigate(-1)}
        aria-label="Close"
      >
        X
      </button>

      {/* Content */}
      <div className="space-y-5 text-base sm:text-lg leading-relaxed">
        <p>
          At <strong>Scholars Den</strong>, we are committed to providing
          high-quality educational services that empower students for academic
          excellence. We understand that circumstances can change, and we strive
          to handle cancellations and refunds in a transparent and fair manner.
        </p>

        <p className="font-semibold">🔁 Course Cancellation</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Once a student has been enrolled for the SDAT, cancellation requests will not be accepted.
          </li>
         
        
        </ul>

        <p className="font-semibold">💸 Refund Policy</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Fees once paid are non-refundable under any condition.</li>
        
        </ul>

        <p className="font-semibold">🔄 Batch Transfer & Adjustments</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Requests for batch transfers or schedule adjustments will be
            considered only if seats are available.
          </li>
          <li>
            Such changes must be approved by the Academic Coordinator.
          </li>
          <li>
            No refunds will be issued if a student is unable to attend the new
            assigned batch.
          </li>
        </ul>

        <p className="font-semibold">⚠️ Important Notes</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            All policies are subject to change without prior notice at the
            discretion of the management.
          </li>
          <li>
            Refunds are not applicable for scholarships or
            concession-based admissions.
          </li>
          <li>
            Any disputes shall be subject to Moradabad jurisdiction only.
          </li>
        </ul>

        <p>
          If you have any questions regarding this policy, please feel free to
          contact us:
        </p>
        <p>
          📱 Phone:{" "}
          <a href="tel:+919412224443" className="underline hover:text-yellow-300">
            +91-9412224443
          </a>
          <br />
          📧 Email:{" "}
          <a
            href="mailto:info@scholarsden.in"
            className="underline hover:text-yellow-300"
          >
            info@scholarsden.in
          </a>
        </p>

        <p>We appreciate your understanding and cooperation.</p>
        <p>– Team Scholars Den</p>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds;
