import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showTripJoinedSuccessToast, showTripAlreadyJoinedToast } from "../utils/toast";
import BottomNav from "../components/BottomNav";
import { API_BASE_URL } from '../utils/api';

export default function Home() {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState("62");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [user, setUser] = useState(null);
  const path = window.location.pathname;
  useEffect(() => {
  axios
    .get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
    .then((res) => {
      setMyId(res.data.user._id);
      setUser(res.data.user);
    })
    .catch(() => {
      setMyId(null);
      setUser(null);
    });
}, []);

useEffect(() => {
  setLoading(true);
  axios
    .get(`${API_BASE_URL}/trips/all`, { withCredentials: true })
    .then((res) => {
      setTrips(res.data.trips || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.destination === selectedSector &&
      trip.isActive !== false
  );

  const isUserHosting = trips.some((trip) => trip.host?._id === myId);
  const isUserJoined = trips.some((trip) => trip.joinedUsers?.includes(myId));

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  
  function to12Hour(timeStr) {
    if (!timeStr) return '';
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [hour, minute] = timeStr.split(":");
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    // If timeStr is a valid date string
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }


  const handleJoinTrip = async (tripId) => {
    try {
      await axios.post(`${API_BASE_URL}/trips/${tripId}/join`, {}, { withCredentials: true });
      showTripJoinedSuccessToast();
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      if (err?.response?.data?.message?.toLowerCase().includes("already joined")) {
        showTripAlreadyJoinedToast();
      } else {
        alert(
          err.response?.data?.message ||
            "Could not join trip. You may have already joined another trip or the trip is full."
        );
      }
    }
  };

  return (
    <div className="min-h-screen font-inter relative flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#1B1B1B] bg-opacity-90 backdrop-blur px-6 pt-6 pb-2 flex items-center justify-between">
        <div>
          <div className="text-white text-sm font-semibold">{dateString}</div>
          <div>
            <span className="block text-white text-3xl font-normal leading-tight">
              Hello,<span className="font-bold" style={{ textTransform: "uppercase" }}>{user?.fullname?.firstname && <span className="ml-1">{user.fullname.firstname}</span>}</span>
            </span>
            <span className="block text-white text-xl font-normal">
              where would you like to go?
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate("/host")}
          className="bg-transparent text-white text-3xl font-bold"
        >
          <span className="inline-block w-8 h-17 rounded-full flex items-center justify-center">
            <img src="/images/plus-icon.png" alt="Addtrip" className="w-5 h-5" />
          </span>
        </button>
      </div>

      {/* Sticky Destination sector switcher */}
      <div className="sticky top-[92px] z-20 bg-[#1B1B1B] bg-opacity-90 backdrop-blur flex items-center px-6 pt-1 pb-2">
        <div className="flex bg-[#555454] rounded-full">
          <button
            onClick={() => setSelectedSector("62")}
            className={`px-9 py-1 rounded-full text-lg font-semibold transition-all duration-200 focus:outline-none
              ${selectedSector === "62" ? "bg-[#CCCCFF] text-black shadow" : "text-white"}
            `}
            style={{ minWidth: 56 }}
          >
            62
          </button>
          <button
            onClick={() => setSelectedSector("128")}
            className={`px-9 py-1 rounded-full text-lg font-semibold transition-all duration-200 focus:outline-none
              ${selectedSector === "128" ? "bg-[#CCCCFF] text-black shadow" : "text-white"}
            `}
            style={{ minWidth: 56 }}
          >
            128
          </button>
        </div>
      </div>

      {/* Sticky Available Trips Heading */}
      <div className="sticky top-[152px] z-20 bg-[#1A1A1A] bg-opacity-90 backdrop-blur px-6 pt-2 pb-2 flex items-center justify-between">
        <h1 className="text-white text-2xl font-normal">Available Trips Today</h1>
        <button
          className="bg-[#505081] text-white px-4 py-1 rounded-full font-semibold text-base ml-4"
          onClick={() => {
            setLoading(true);
            axios
              .get(`${API_BASE_URL}/trips/all`, { withCredentials: true })
              .then((res) => {
                setTrips(res.data.trips || []);
                setLoading(false);
              })
              .catch(() => setLoading(false));
          }}
          title="Refresh trips"
        >
          Refresh
        </button>
      </div>

      {/* Only Trip Cards Scroll */}
      <div
        className="overflow-y-auto px-3 pb-32"
        style={{
          flex: 1,
          maxHeight: "calc(100vh - 230px)"
        }}
      >
        {loading ? (
          <div className="text-white text-center mt-8">Loading...</div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-white text-center mt-8">No trips available.</div>
        ) : (
          filteredTrips.map((trip) => {
            const isHost = myId === trip.host?._id;
            const hasJoined = trip.joinedUsers?.some(u => u._id === myId);
            const seatsLeft = trip.seats - (trip.joinedUsers?.length || 0);
            const isFilled = seatsLeft <= 0;
            const canViewProfile = isHost || hasJoined;
            return (
              <div
                key={trip._id}
                className={`bg-[#F6F6F6] rounded-2xl shadow flex items-center mb-5 px-4 py-4 ${canViewProfile ? 'cursor-pointer' : ''}`}
                onClick={() => canViewProfile && navigate("/profile")}
              >
                {/* Timeline icon */}
                <div className="flex flex-col items-center mr-3">
                  <span className="w-2 h-2 bg-black rounded-full mb-1"></span>
                  <span className="w-1 h-16 bg-black rounded-full"></span>
                  <span className="w-2 h-2 bg-black rounded-full mt-1"></span>
                </div>
                {/* Trip info */}
                <div className="flex-1">
                  <p className="font-bold text-black mb-1">
                    Departure time: {to12Hour(trip.time)}
                  </p>
                  <p className="text-sm text-black mb-1">
                    Host name: {trip.host?.fullname?.firstname}{" "}
                    {trip.host?.fullname?.lastname}
                  </p>
                  <p className="text-sm text-black mb-1">
                    Vacant seat: {isFilled ? "0" : seatsLeft}
                  </p>
                  <p className="text-sm text-black mb-1">
                    Fare: {trip.fare} Rs
                  </p>
                </div>
                <div className="ml-auto flex items-center">
                  {isFilled ? (
                    <span className="bg-gray-300 text-white px-6 py-2 rounded-full font-semibold">
                      FILLED
                    </span>
                  ) : (
                    <button
                      className="bg-[#A3A3CC] hover:bg-purple-600 text-black font-regular px-7 py-2 rounded-full transition disabled:opacity-50"
                      disabled={isHost || isUserHosting}
                      title={
                        isHost
                          ? "You cannot join your own trip"
                          : isUserHosting
                          ? "You cannot join a trip while hosting"
                          : "Join this trip"
                      }
                      onClick={() => handleJoinTrip(trip._id)}
                    >
                      JOIN
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <BottomNav />
    </div>
  );
}
