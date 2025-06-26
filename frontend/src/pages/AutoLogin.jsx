import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../utils/api';

export default function AutoLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const start = Date.now();
    axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
      .then(() => {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);
        setTimeout(() => navigate("/home"), delay);
      })
      .catch(() => {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 1000 - elapsed);
        setTimeout(() => navigate("/landing"), delay); 
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B1B1B]">
      <div className="flex flex-col items-center">
        <div className="loader mb-4" style={{ width: 48, height: 48 }} />
        <div className="text-white text-xl font-semibold animate-pulse" style={{ fontFamily: "Inter, sans-serif" }}>
          Signing you in...
        </div>
      </div>
      <style>{`
        .loader {
          border: 6px solid #444;
          border-top: 6px solid #fff;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
