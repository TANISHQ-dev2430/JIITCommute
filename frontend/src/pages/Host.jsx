import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from "react-toastify";
import { API_BASE_URL } from '../utils/api';

export default function Host() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTrip = location.state?.trip;

  // Store time as string in "HH:mm" format
  const [formData, setFormData] = useState({
    destination: editingTrip?.destination || "128",
    time: editingTrip?.time ? dayjs(editingTrip.time, "HH:mm") : null, // dayjs object or null
    vacant: editingTrip?.seats || "",
    fare: editingTrip?.fare || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (value) => {
    setFormData({ ...formData, time: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
    
      let tripTime = null;
      if (formData.time) {
  
        if (typeof formData.time === 'string') {
          tripTime = new Date(formData.time);
        } else {
    
          const now = new Date();
          const hours = formData.time.hour();
          const minutes = formData.time.minute();
          tripTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
        }
      }
      if (editingTrip) {
        
        await axios.put(`${API_BASE_URL}/trips/${editingTrip._id}`,
          {
            destination: formData.destination,
            time: tripTime,
            seats: formData.vacant,
            fare: formData.fare || 0,
          },
          { withCredentials: true }
        );
        setMessage("Trip updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/trips/create`,
          {
            destination: formData.destination,
            time: tripTime,
            seats: formData.vacant,
            fare: formData.fare || 0,
          },
          { withCredentials: true }
        );
        setMessage("Trip created successfully!");
      }
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || (editingTrip ? "Error updating trip" : "Error creating trip");
      if (msg.toLowerCase().includes("active trip")) {
        toast.error("You already have an active trip.", { position: "top-center", autoClose: 2000 });
      } else {
        setMessage(msg);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <img
        src="/images/back.png"
        alt="Back"
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 w-7 h-7"
        title="Back to Home"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-white text-2xl font-semibold text-center">
          {editingTrip ? "Update Trip" : "Host a Trip"}
        </h2>

        <div>
          <label className="block text-gray-300 mb-1">Destination</label>
          <div className="relative">
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition border border-zinc-600 pr-10"
              required
            >
              <option value="128" className="bg-zinc-800 text-white">Sector 128 (JIIT 128)</option>
              <option value="62" className="bg-zinc-800 text-white">Sector 62 (JIIT 62)</option>
            </select>
            {/* Custom dropdown arrow */}
            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Time</label>
          <div className="w-full flex items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                // label="Select Time"
                value={formData.time}
                onChange={handleTimeChange}
                ampm={true}
                format="hh:mm A"
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    InputProps: {
                      style: { color: 'white', background: '#3f3f46', borderRadius: '0.5rem' },
                    },
                    InputLabelProps: {
                      style: { color: '#aaa' },
                    },
                  },
                  popper: {
                    sx: { zIndex: 13000 },
                  },
                  openPickerIcon: {
                    sx: { color: 'white' },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Vacant Seats</label>
          <input
            type="number"
            name="vacant"
            min="1"
            max="4"
            value={formData.vacant}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg"
            placeholder="1-3 seats"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Fare (optional)</label>
          <input
            type="text"
            name="fare"
            placeholder="₹ or leave blank"
            value={formData.fare}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6141AC] text-white font-semibold py-2 rounded-full transition"
        >
          {editingTrip ? "Update Trip" : "Create Trip"}
        </button>
        <div className="text-center text-gray-400 text-xs mt-4 mb-3">
          <p>Hosts can manage only 1 active trip at a time. Please complete your current trip to post a new one. Trips auto-complete 2 hour after departure time.</p>
        </div>
        {message && (
          <div className="text-center text-sm mt-2 text-white">{message}</div>
        )}
      </form>
    </div>
  );
}
