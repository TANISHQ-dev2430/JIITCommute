import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../utils/api';

export default function EmailOtpPopup({ email, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const sentOnMount = useRef(false);

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/users/send-email-otp`, { email });
      setMessage("OTP sent to your college email.");
      setResent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP.");
    }
    setLoading(false);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/users/verify-email-otp`, { email, otp });
      setMessage("Email verified!");
      onVerified();
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!sentOnMount.current) {
      sendOtp();
      sentOnMount.current = true;
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.35)'}}>
      <div className="bg-[#232222] rounded-t-2xl p-8 w-full max-w-xs flex flex-col items-center relative animate-slideup" style={{boxShadow: '0 -4px 32px rgba(0,0,0,0.25)'}}>
        <h2 className="text-white text-xl font-semibold mb-4">Verify College Email</h2>
        <form onSubmit={verifyOtp} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-base focus:outline-none"
            required
            maxLength={6}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7B4AE2] to-[#B983FF] text-white font-semibold py-2 rounded-full text-lg mt-2"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <button
          className="mt-3 text-[#A58EFF] text-sm underline"
          onClick={sendOtp}
          disabled={loading || resent}
        >
          {resent ? "OTP Sent" : "Resend OTP"}
        </button>
        {message && <div className="text-center text-red-400 text-sm mt-2">{message}</div>}
        <button className="absolute top-2 right-4 text-white text-2xl" onClick={onClose}>&times;</button>
      </div>
      <style>{`
        .animate-slideup {
          animation: slideup 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slideup {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
