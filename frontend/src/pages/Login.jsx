import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

export default function Login() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(
        `${API_BASE_URL}/users/login`,
        { enrollmentNumber: enrollment, password },
        { withCredentials: true }
      );
      navigate("/home");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-zinc-900 px-6 " style={{ fontFamily:"'Inter', Helvetica, Arial, sans-serif" }}>
      <img
          src="/images/back.png"
          alt="Back"
          onClick={() => navigate("/landing")}
          className="absolute top-5 left-5 w-8 h-8 cursor-pointer"
        />
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm space-y-6 mt-10"
      >
        <div className="flex justify-center">
          <img
            src="/images/jc-logo.png"
            alt="Logo"
            className="w-29 h-29 rounded-xl"
          />
        </div>
        {/* <h2 className="text-white text-2xl font-semibold text-center">Login</h2> */}

        <div>
          <label className="block text-gray-300 mb-1">Enrollment</label>
          <input
            type="text"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
            className="w-full px-4 py-2 bg-[#373535] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#373535] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.563 0 3.06-.322 4.396-.902M6.53 6.53A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.284 1.977M6.53 6.53l10.94 10.94M6.53 6.53 3.98 8.223m0 0L2.25 12m1.73-3.777 10.94 10.94" />
                </svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C4.333 8.39 8.267 6 12 6c3.733 0 7.667 2.39 9.75 6-2.083 3.61-6.017 6-9.75 6-3.733 0-7.667-2.39-9.75-6z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>
        </div>

        {message && (
          <div className="text-center text-red-400 text-sm">{message}</div>
        )}

        <p className="text-sm text-gray-400 text-center">
          Not yet registered?{" "}
          <a href="/register" className="text-[#A58EFF] hover:underline">
            Sign up
          </a>
        </p>

        <button
          type="submit"
          className="w-full bg-[#6141AC] text-white font-semibold py-3 mt-4 rounded-full transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
