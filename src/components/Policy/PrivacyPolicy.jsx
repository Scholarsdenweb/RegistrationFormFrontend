import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 bg-[#c61d23] text-white shadow-md relative">
      {/* Title */}
      <h1 className="text-lg sm:text-2xl font-bold mb-4 text-center">
        Privacy Policy
      </h1>

      {/* Close Button */}
      <button
        className="absolute top-2 right-6 text-lg sm:text-2xl border-2 px-3 py-1 sm:py-2 rounded-full text-white hover:bg-[#ffdd00] hover:text-black"
        onClick={() => navigate("-1")}
      >
        X
      </button>

      {/* Privacy Content */}
      <div className="text-sm sm:text-base text-justify space-y-4">
        <p>
          Scholars Den values your trust and is committed to ensuring the privacy and security of your personal information. This Privacy Policy outlines how we collect, use, store, and protect your data when you interact with our website, services, or visit our campus.
        </p>

        <h2 className="font-bold text-base sm:text-lg">🔐 Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Personal details like name, email, phone number, address, date of birth, etc.</li>
          <li>Academic records and documents provided during registration or inquiry.</li>
          <li>Device and browsing information when you use our website (via cookies or analytics tools).</li>
        </ul>

        <h2 className="font-bold text-base sm:text-lg">📘 How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To provide academic services, support, and updates regarding courses and admissions.</li>
          <li>To personalize your learning experience and improve our offerings.</li>
          <li>To communicate important announcements, results, or fee reminders.</li>
          <li>For administrative and legal purposes (if required).</li>
        </ul>

        <h2 className="font-bold text-base sm:text-lg">🤝 Sharing of Information</h2>
        <p>
          Scholars Den does <strong>not sell or rent</strong> your personal data to any third party. We may share your information only with:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Trusted service providers (e.g., for SMS/email delivery, payment gateways).</li>
          <li>Government authorities if required by law or regulation.</li>
        </ul>

        <h2 className="font-bold text-base sm:text-lg">🧾 Data Security</h2>
        <p>
          We take appropriate security measures to protect your data from unauthorized access, misuse, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
        </p>

        <h2 className="font-bold text-base sm:text-lg">🔄 Your Rights</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>You may request to update or correct your personal information.</li>
          <li>You can withdraw consent for marketing communications at any time.</li>
          <li>For data access or deletion, contact us using the details below.</li>
        </ul>

        <h2 className="font-bold text-base sm:text-lg">📅 Policy Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. All changes will be reflected on this page with the updated effective date.
        </p>

        <h2 className="font-bold text-base sm:text-lg">📞 Contact Us</h2>
        <p>
          For any questions about this policy or your personal data, feel free to reach out:
        </p>
        <ul className="list-none pl-2">
          <li>📱 <strong>Phone:</strong> +91-9412224443</li>
          <li>📧 <strong>Email:</strong> info@scholarsden.in</li>
        </ul>

        <p className="text-center font-bold mt-4">
          Thank you for trusting Scholars Den with your information.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
