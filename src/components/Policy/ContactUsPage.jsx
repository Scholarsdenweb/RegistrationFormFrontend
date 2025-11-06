import React from "react";
import { useNavigate } from "react-router-dom";

const ContactUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-4 sm:px-8 py-6 bg-[#fdf5f6] text-black shadow-md relative">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-center">Contact Us</h1>

      {/* Close Button */}
      <button
        className="absolute top-4 right-6 text-lg sm:text-2xl border-2 px-3 py-1 sm:py-2 rounded-full text-black hover:bg-[#e2e1dc] hover:text-black transition"
        onClick={() => navigate("/registration/payment")}
        aria-label="Close"
      >
        X
      </button>

      {/* Content */}
      <div className="space-y-4 text-base sm:text-lg leading-relaxed">
        <p>
          At <strong>Scholars Den</strong>, we believe that the first step to academic success begins with the right guidance — and open communication.
          Whether you’re a parent exploring the best future for your child, or a student aiming for top ranks in <strong>JEE</strong>, <strong>NEET</strong>, or seeking a strong <strong>foundation </strong> — we’re just a message away.
        </p>

        <p>We’re here to help with:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>📚 Information about our Foundation, JEE, and NEET programs</li>
          <li>📝 Admission inquiries & scholarship tests (like <strong>RISE</strong>)</li>
          <li>🔄 Help with an existing registration or class schedule</li>
          <li>❓ Any other questions you may have!</li>
        </ul>

        <p className="pt-2 font-semibold">📬 Get in Touch:</p>
        <p>
        {/* 9412224443 */}
          📱 Phone: <a href="tel:+919412224443" className="underline hover:text-yellow-300">+91-8126555222 / 333</a><br />
          📧 Email: <a href="mailto:info@scholarsden.in" className="underline hover:text-yellow-300">info@scholarsden.in</a>
        </p>

        <p>We aim to respond to all queries within <strong>1–2 business days</strong>.</p>
        <p><em>Your journey to excellence starts here — let’s connect!</em></p>
      </div>
    </div>
  );
};

export default ContactUsPage;
