import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showTripDeletedToast, showTripAlreadyActiveToast } from '../utils/toast';
import BottomNav from "../components/BottomNav";
import ChatRoomPopup from "../components/ChatRoomPopup";
import { API_BASE_URL } from '../utils/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]); 
  const [joinedTrips, setJoinedTrips] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatTripId, setActiveChatTripId] = useState(null);
  const [activeChatTrip, setActiveChatTrip] = useState(null); 
  
  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
    axios.get(`${API_BASE_URL}/trips/my`, { withCredentials: true })
      .then((res) => setTrips(res.data.trips || []))
      .catch(() => setTrips([]));
    axios.get(`${API_BASE_URL}/trips/joined`, { withCredentials: true })
      .then((res) => setJoinedTrips(res.data.trips || []))
      .catch(() => setJoinedTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      alert("Logout failed. Please try again.");
    }
  };
  const handleRemoveUser = async (tripId, userId) => {
    try {
      await axios.patch(`${API_BASE_URL}/trips/${tripId}/remove-user`, { userId }, { withCredentials: true });
      setTrips(trips => trips.map(trip => trip._id === tripId ? { ...trip, joinedUsers: trip.joinedUsers.filter(u => u._id !== userId) } : trip));
    } catch (err) {
      alert('Failed to remove user.');
    }
  };

  // Cancel join (for joined trips)
  const handleCancelJoin = async (tripId) => {
    try {
      await axios.patch(`${API_BASE_URL}/trips/${tripId}/cancel-join`, {}, { withCredentials: true });
      setJoinedTrips(joinedTrips => joinedTrips.filter(trip => trip._id !== tripId));
    } catch (err) {
      alert('Failed to cancel join.');
    }
  };
  
  function to12Hour(timeStr) {
    if (!timeStr) return '';
   
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [hour, minute] = timeStr.split(":");
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
   
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen text-white px-0 pt-0 pb-20 relative font-inter" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Profile Card */}
      <div className="relative bg-[#5C5C99] rounded-b-3xl pb-8 pt-8 px-0 flex flex-col items-center" style={{ boxShadow: '0 2px 8px #5C5C99', minHeight: 320 }}>
        <img
          src="/images/back.png"
          alt="Back"
          onClick={() => navigate("/home")}
          className="absolute top-5 left-5 w-8 h-8 cursor-pointer"
        />
        <img
          src="/images/logout.png"
          alt="Logout"
          onClick={handleLogout}
          className="absolute top-5 right-5 w-9 h-9 cursor-pointer"
        />
        <img src="/images/avatar.png" alt="Profile" className="w-24 h-24 rounded-full bg-[#292966] mt-2 mb-2" />
        <div className="text-gray-200 text-base mt-2">Name</div>
        <div className="text-2xl font-bold text-white mb-1">{user?.fullname?.firstname} {user?.fullname?.lastname}</div>
        <div className="text-gray-200 text-base">Enroll</div>
        <div className="text-2xl font-bold text-white mb-1">{user?.enrollmentNumber}</div>
        <div className="text-gray-200 text-base">Mob no.</div>
        <div className="text-2xl font-bold text-white">{user?.mobileNo}</div>
      </div>
      {/* Active Trips Section */}
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mt-6 mb-2">Active trips</h2>
          <button
            className="bg-[#505081] text-white px-4 py-1 rounded-full font-semibold text-base ml-4 mt-6 mb-2"
            onClick={() => {
              setLoading(true);
              axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
                .then((res) => setUser(res.data.user))
                .catch(() => setUser(null));
              axios.get(`${API_BASE_URL}/trips/my`, { withCredentials: true })
                .then((res) => setTrips(res.data.trips || []))
                .catch(() => setTrips([]));
              axios.get(`${API_BASE_URL}/trips/joined`, { withCredentials: true })
                .then((res) => setJoinedTrips(res.data.trips || []))
                .catch(() => setJoinedTrips([]))
                .finally(() => setLoading(false));
            }}
            title="Refresh active trips"
          >
            Refresh
          </button>
        </div>
        {trips.length === 0 && joinedTrips.length === 0 ? (
          <div>No active trips.</div>
        ) : (
          <>
            {/* Hosted trips */}
            {trips.map((trip) => (
              <div key={trip._id} className="bg-[#CFCFCF] rounded-2xl p-4 mb-6 flex flex-col gap-0 relative" >
                <div className="flex flex-row justify-between items-start">
                  <div>
                    <div className="text-black text-base mb-1">Departure time: <span className="font-regular">{to12Hour(trip.time)}</span></div>
                    <div className="text-black text-base mb-1">Vacant seat: <span className="font-normal">{trip.seats - (trip.joinedUsers?.length || 0)}</span></div>
                    <div className="text-black text-base mb-3">Fare: <span className="font-normal">{trip.fare ? `${trip.fare} Rs` : "to be updated!"}</span></div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div onClick={() => { setChatOpen(true); setActiveChatTripId(trip._id); setActiveChatTrip(trip); }}>
                      <img src="/images/chatroom.png" alt="chatroom" className="w-12 h-12 opacity-100" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-2">
                  <button
                    className="bg-[#505081] text-white px-8 py-2 rounded-full font-semibold text-base"
                    onClick={() => navigate("/host", { state: { trip } })}
                  >
                    Modify
                  </button>
                  <button
                    className="bg-[#CC3260] text-white px-8 py-2 rounded-full font-semibold text-base"
                    onClick={async () => {
                      try {
                        await axios.delete(`${API_BASE_URL}/trips/${trip._id}`, { withCredentials: true });
                        setTrips(trips.filter((t) => t._id !== trip._id));
                        showTripDeletedToast();
                        setTimeout(() => navigate("/home"), 1000);
                      } catch (err) {
                        alert("Failed to delete trip.");
                      }
                    }}
                  >
                    Delete trip
                  </button>
                </div>
                {/* Joined users with REMOVE button for host */}
                {trip.joinedUsers && trip.joinedUsers.length > 0 && trip.joinedUsers.map((joinedUser) => (
                  <div key={joinedUser._id} className="bg-[#F5F5F5] rounded-2xl p-4 mt-3 flex flex-row items-center justify-between">
                    <div>
                      <div className="font-bold text-green-700 text-base mb-1 uppercase">{joinedUser.fullname.firstname} {joinedUser.fullname.lastname} JOINED</div>
                      <div className="text-black text-base font-semibold">CONTACT: {joinedUser.mobileNo}</div>
                      <div className="text-black text-base font-semibold">BATCH: {joinedUser.batch.toUpperCase()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        className="bg-[#D9D9D9]  text-black px-5 py-1 rounded-full font-regular text-base mb-2"
                        onClick={() => handleRemoveUser(trip._id, joinedUser._id)}
                      >
                        REMOVE
                      </button>
                      <div className="flex gap-4">
                        <a
                          href={`https://wa.me/91${joinedUser.mobileNo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat with user on WhatsApp"
                        >
                          <img src="/images/wapplogo.png" alt="WhatsApp" className="w-12 h-12" />
                        </a>
                        <a href={`tel:${joinedUser.mobileNo}`} title="Call User">
                          <img src="/images/phone.png" alt="Call User" className="w-12 h-12" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {/* Joined trips */}
            {joinedTrips.map((trip) => (
              <div key={trip._id} className="bg-[#F5F5F5] rounded-2xl p-4 mb-6 relative flex flex-row justify-between items-stretch">
                {/* Left: Trip Info */}
                <div className="flex-1 pr-2">
                  <div className="font-bold text-green-700 mb-1 uppercase">YOU JOINED THIS TRIP</div>
                  <div className="text-black text-base mb-1">Departure: <span className="font-normal">{to12Hour(trip.time)}</span></div>
                  <div className="text-black text-base mb-1">Host: <span className="font-normal">{trip.host?.fullname?.firstname} {trip.host?.fullname?.lastname}</span></div>
                  <div className="text-black text-base mb-1">Vacant seat: <span className="font-normal">{trip.seats - (trip.joinedUsers?.length || 0)}</span></div>
                  <div className="text-black text-base mb-3">Fare: <span className="font-normal">{trip.fare ? `${trip.fare} Rs` : "to be updated!"}</span></div>
                </div>
                {/* Right: Actions */}
                <div className="flex flex-col items-end justify-between min-w-[120px] relative">
                  {/* Cancel Join Button */}
                  <button
                    className="bg-[#D9D9D9] text-black px-1 py-2 rounded-full font-regular text-base absolute top-0 right-0 mt-0 mr-0 w-32"
                    onClick={() => handleCancelJoin(trip._id)}
                  >
                    CANCEL JOIN
                  </button>
                  {/* WhatsApp & Call icons */}
                  <div className="flex flex-row gap-3 mt-13 mb-1">
                    <a
                      href={`https://wa.me/91${trip.host?.mobileNo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat with host on WhatsApp"
                    >
                      <img src="/images/wapplogo.png" alt="WhatsApp" className="w-13 h-13" />
                    </a>
                    <a href={`tel:${trip.host?.mobileNo}`} title="Call Host">
                      <img src="/images/phone.png" alt="Call Host" className="w-13 h-13" />
                    </a>
                  </div>
                  {/* Chatroom icon at bottom right */}
                  <div className=" bottom-1 right-0 mr-8 bg-[#CFCFCF] rounded-full p-2 " onClick={() => { setChatOpen(true); setActiveChatTripId(trip._id); setActiveChatTrip(trip); }}>
                    <img src="/images/chatroom.png" alt="chatroom" className="w-13 h-13 opacity-100" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <ChatRoomPopup 
        open={chatOpen} 
        onClose={() => { setChatOpen(false); setActiveChatTripId(null); setActiveChatTrip(null); }} 
        tripId={activeChatTripId} 
        userId={user?._id} 
        hostName={
          activeChatTrip && activeChatTrip.host && activeChatTrip.host._id === user?._id
            ? null 
            : (activeChatTrip?.host?.fullname
                ? `${activeChatTrip.host.fullname.firstname ?? ""} ${activeChatTrip.host.fullname.lastname ?? ""}`.trim()
                : "Unknown Host")
        }
        activeChatTrip={activeChatTrip}
      />
      <BottomNav />
    </div>
  );
}
