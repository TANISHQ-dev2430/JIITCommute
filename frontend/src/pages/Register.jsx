import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from '../utils/api';
import EmailOtpPopup from '../components/EmailOtpPopup';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    enrollment: "",
    mobile: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [emailOtpPopupOpen, setEmailOtpPopupOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") setEmailVerified(false);
  };

  const validateEmail = (email) => {
    // Only allow @mail.jiit.ac.in domain
    return /^([a-zA-Z0-9._%+-]+)@mail\.jiit\.ac\.in$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateEmail(formData.email)) {
      setMessage("Please enter a valid JIIT college email (@mail.jiit.ac.in)");
      return;
    }
    if (!emailVerified) {
      setMessage("Please verify your college email before registering.");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/users/register`,
        {
          fullname: {
            firstname: formData.firstName,
            lastname: formData.lastName,
          },
          email: formData.email,
          enrollmentNumber: formData.enrollment,
          mobileNo: formData.mobile,
          password: formData.password,
        },
        { withCredentials: true }
      );
      toast.success("Registration successful!" , {autoClose: 1000, toastClassName:"customtoast"});
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          (err.response?.data?.errors?.[0]?.msg ?? "Registration failed.")
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1A1A1A] font-inter justify-center items-center relative" style={{ fontFamily: "'Inter', Helvetica, Arial, sans-serif", backgroundImage: "url('/images/rg-bg.png')", backgroundSize: "cover", backgroundPosition: "center top" }}>
     
      <img
        src="/images/jc-logo.png"
        alt="Logo"
        className="absolute left-2 top-6 w-16 h-16 object-contain z-10 md:left-10 md:top-8 md:w-20 md:h-20"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 px-4 pt-8 pb-14 w-full max-w-md mx-auto"
        style={{ maxWidth: 500 }}
      >
        <div className="mt-20"></div>
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label className="block text-white text-lg mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#232222] text-white rounded-2xl text-base focus:outline-none"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-white text-lg mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#232222] text-white rounded-2xl text-base focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-white text-lg mb-1">College Email</label>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              name="email"
              placeholder="e.g. Enrollment@mail.jiit.ac.in"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#232222] text-white rounded-2xl text-base focus:outline-none"
              required
              pattern="^[a-zA-Z0-9._%+-]+@mail\.jiit\.ac\.in$"
              title="Please enter a valid JIIT college email (@mail.jiit.ac.in)"
            />
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-white font-semibold ${emailVerified ? 'bg-green-600' : 'bg-[#7B4AE2] hover:bg-[#B983FF]'}`}
              onClick={() => setEmailOtpPopupOpen(true)}
              disabled={!formData.email || !validateEmail(formData.email) || emailVerified}
            >
              {emailVerified ? 'Verified' : 'Verify'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-white text-lg mb-1">Enrollment Number</label>
          <input
            type="text"
            name="enrollment"
            placeholder="eg. 23103177"
            value={formData.enrollment}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#232222] text-white rounded-2xl text-base focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-white text-lg mb-1">Mobile no.</label>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile no. (whatsapp preferred)"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#232222] text-white rounded-2xl text-base focus:outline-none"
            required
            maxLength={10}
          />
        </div>
        <div>
          <label className="block text-white text-lg mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#232222] text-white rounded-2xl text-base focus:outline-none"
            required
          />
        </div>
        {message && (
          <div className="text-center text-red-400 text-sm">{message}</div>
        )}
        <p className="text-white text-base text-center mt-2">
          Already registered?{' '}
          <span
            className="text-[#A58EFF] font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#7B4AE2] to-[#B983FF] hover:from-[#B983FF] hover:to-[#7B4AE2] text-white font-semibold py-3 rounded-full text-lg mt-2 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A58EFF] focus:ring-offset-2"
          style={{ borderRadius: 40 }}
        >
          REGISTER
        </button>
      </form>
      {emailOtpPopupOpen && (
        <EmailOtpPopup
          email={formData.email}
          onClose={() => setEmailOtpPopupOpen(false)}
          onVerified={() => {
            setEmailVerified(true);
            setEmailOtpPopupOpen(false);
            setMessage("");
          }}
        />
      )}
    </div>
  );
}
