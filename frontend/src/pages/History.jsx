import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { showTripCreatedToast, showTripAlreadyActiveToast } from '../utils/toast';
import BottomNav from "../components/BottomNav";
import { API_BASE_URL } from '../utils/api';

export default function History() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch user profile to get userId
    axios
      .get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
      .then((res) => setUserId(res.data.user._id))
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    let toastId;
    setLoading(true);
    toastId = toast.loading("Loading trip history...", { toastId: "history-loader", autoClose: false });
    axios
      .get(`${API_BASE_URL}/trips/history`, { withCredentials: true })
      .then((res) => {
        const allTrips = res.data.trips || [];
        // Sort all trips by createdAt descending (most recent first)
        allTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTrips(allTrips);
      })
      .catch(() => setTrips([]))
      .finally(() => {
        setLoading(false);
        toast.dismiss("history-loader");
      });
  }, []);

  // Handler for deleting trip from history
  const handleDeleteHistory = async (tripId) => {
    try {
      await axios.delete(`${API_BASE_URL}/trips/history/${tripId}`, { withCredentials: true });
      setTrips(trips => trips.filter(t => t._id !== tripId));
    } catch (err) {
    
    }
  };

  // Removed the Done button from history page

  function to12Hour(timeStr, fallback) {
    if (!timeStr) {
      if (fallback) return to12Hour(fallback);
      return '';
    }
    
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [hour, minute] = timeStr.split(":");
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
   
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      if (fallback) return to12Hour(fallback);
      return 'Invalid Date';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  return (
    <div className="min-h-screen text-white px-4 pt-6 pb-20 relative" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Back button as image, like other pages */}
      <img
        src="/images/back.png"
        alt="Back"
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 w-7 h-7 cursor-pointer"
        title="Back to Home"
      />
      <div className="mt-6"></div>
      <h2 className="text-2xl font-bold mb-4 text-center">Trip History (Last 15 Days)</h2>
      {trips.length === 0 ? (
        <div className="text-center">No trip history found.</div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => {
            const isHost = trip.host?._id === userId;
            const hasJoined = trip.joinedUsers?.some(u => u._id === userId);

            return (
              <div
                key={trip._id}
                className="bg-[#252525] rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between relative"
              >
                {/* Cross icon to delete trip history */}
                <button
                  className="absolute top-2 right-4 text-gray-400 hover:text-red-500 focus:outline-none h-8 w-3"
                  title="Delete this trip from history"
                  onClick={() => handleDeleteHistory(trip._id)}
                >
                  <img src="/images/cross.png" alt="Delete" />
                </button>
                <div className="flex-1">
                  {/* Show joined/created info at the top */}
                  <div className="mb-2">
                    {isHost ? (
                      <span className="text-green-400 text-sm font-semibold">YOU CREATED THIS TRIP</span>
                    ) : hasJoined ? (
                      <span className="text-blue-400 text-sm font-semibold">YOU JOINED THIS TRIP</span>
                    ) : null}
                  </div>
                  <p className="font-regular text-base mb-1">
                    Departure time: {to12Hour(trip.time, trip.createdAt)}
                  </p>
                  <p className="text-sm mb-1">
                    Host Name: {trip.host?.fullname?.firstname} {trip.host?.fullname?.lastname}
                  </p>
                  <p className="text-sm mb-1">Fare: {trip.fare} RS</p>
                  <p className="text-sm mb-1">
                    Vacant seats: {trip.seats - (trip.joinedUsers?.length || 0)}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    Date: {new Date(trip.createdAt).toLocaleDateString()}
                  </p>
                  {trip.isDeleted && (
                    <span className="inline-block bg-[#CC3260] text-white text-xs px-3 py-1 rounded-full mt-1">
                      Deleted/Cancelled
                    </span>
                  )}
                  {/* Only show the Done label if trip.status === 'done' */}
                  {trip.status === 'done' && (
                    <span className="inline-block bg-green-600 text-white text-xs px-3 py-1 ml-2 rounded-full mt-1">
                      Done
                    </span>
                  )}
                </div>
              {!hasJoined && isHost && (
                <div className="w-full flex justify-center">
                  <button
                    className="bg-[#D9D9D9] text-black font-semibold px-4 py-1 rounded-full mt-2 w-70 transition-shadow shadow"
                    onClick={async () => {
                      try {
                        const { time, fare, seats, destination } = trip;
                        await axios.post(
                          `${API_BASE_URL}/trips`,
                          { time, fare, seats, destination },
                          { withCredentials: true }
                        );
                        showTripCreatedToast();
                        setTimeout(() => navigate("/home"), 2000);
                      } catch (err) {
                        if (err?.response?.data?.message?.toLowerCase().includes('active trip')) {
                          showTripAlreadyActiveToast();
                        }
                      }
                    }}
                    title="Recreate Trip"
                  >
                    RECREATE TRIP
                  </button>
                </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
