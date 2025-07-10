import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

export default function Login() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
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
            placeholder="eg. 23103177"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
            className="w-full px-4 py-2 bg-[#373535] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#373535] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
