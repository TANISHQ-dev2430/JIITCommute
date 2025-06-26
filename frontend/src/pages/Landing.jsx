import { useNavigate } from "react-router-dom";


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-end items-center bg-cover bg-center font-inter px-4"
      style={{ backgroundImage: "url('/images/lp-bg.png')", fontFamily: "'Inter', Helvetica, Arial, sans-serif" }}
    >
      {/* JC Logo and Name */}
      <div className="w-full flex flex-col items-center justify-start pt-12 md:pt-24 max-w-md mx-auto">
        <img
          src="/images/jc-logo.png"
          alt="JC Logo"
          className="w-60 md:w-40 select-none"
          draggable="false"
        />
        <div className="text-white text-1xl md:text-2xl font-semibold mt-[-70px] mb-50 tracking-wide text-center">
          JIITCommute
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center w-full ">
        <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
          <button
            className="bg-white text-black font-semibold rounded-full px-8 py-3 mb-4 shadow w-full text-base md:text-lg hover:bg-gray-100 transition"
            onClick={() => navigate("/register")}
          >
            CREATE ACCOUNT
          </button>
          <p className="text-white text-sm md:text-base text-center">
            Already have an account?{' '}
            <span
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
      {/* About Button at the very bottom */}
      <div className="w-full flex justify-center mb-6">
        <button
          className="bg-white/20 text-white border border-white/40 rounded-full px-8 py-2 font-semibold shadow hover:bg-white/30 transition text-base"
          onClick={() => navigate("/about")}
        >
          About
        </button>
      </div>
    </div>
  );
}
