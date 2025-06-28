import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showTripDeletedToast, showTripAlreadyActiveToast } from '../utils/toast';
import BottomNav from "../components/BottomNav";
import ChatRoomPopup from "../components/ChatRoomPopup";
import PageLoader from "../components/PageLoader";
import { API_BASE_URL } from '../utils/api';
import "../animate-slideUp.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]); 
  const [joinedTrips, setJoinedTrips] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatTripId, setActiveChatTripId] = useState(null);
  const [activeChatTrip, setActiveChatTrip] = useState(null); 
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const fileInputRef = useRef();

  // Section loader for trips only
  const [tripsLoading, setTripsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setEditName(`${res.data.user.fullname.firstname} ${res.data.user.fullname.lastname}`);
        setEditMobile(res.data.user.mobileNo);
      })
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/profile/image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, profileImage: res.data.imageUrl }));
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const [firstname, ...lastnameArr] = editName.trim().split(" ");
    const lastname = lastnameArr.join(" ");
    try {
      await axios.patch(
        `${API_BASE_URL}/users/profile`,
        { fullname: { firstname, lastname }, mobileNo: editMobile },
        { withCredentials: true }
      );
      setUser((prev) => ({
        ...prev,
        fullname: { firstname, lastname },
        mobileNo: editMobile,
      }));
      setEditProfileOpen(false);
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/users/profile`,
        { removeProfileImage: true },
        { withCredentials: true }
      );
      setUser((prev) => ({ ...prev, profileImage: null }));
      setEditProfileOpen(false);
    } catch (err) {
      alert("Failed to remove profile image. Please try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen text-white px-0 pt-0 pb-20 relative font-inter" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Profile Card */}
      <div className="relative bg-[#7C7CD1] rounded-b-3xl pb-8 pt-8 px-0 flex flex-col items-center" style={{ boxShadow: '0 2px 8px #5C5C99', minHeight: 320 }}>
        {/* Edit Profile Icon - bottom right of card */}
        <img
          src="/images/edit-profile.png"
          alt="Edit Profile"
          className="absolute bottom-4 right-4 w-12 h-12 z-20 cursor-pointer bg-white rounded-full shadow-lg p-2 border border-[#7C7CD1] hover:bg-[#f0f0ff] transition"
          onClick={() => setEditProfileOpen(true)}
          title="Edit Profile"
        />
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
        <div className="relative w-24 h-24 mt-2 mb-2">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full bg-[#292966] object-cover"
            />
          ) : (
            <img
              src="/images/avatar.png"
              alt="Profile"
              className="w-24 h-24 rounded-full bg-[#292966] object-cover"
            />
          )}
          <button
            className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => fileInputRef.current.click()}
            title="Change profile picture"
            type="button"
          >
            <img src="/images/camera.png" alt="Upload" className="w-6 h-6" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
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
          <h2 className="text-xl font-semibold mt-6 mb-2">Active Trips</h2>
          <button
            className="text-white px-4 py-1 rounded-full font-semibold text-base ml-4 mt-6 mb-2"
            disabled
            title="Refresh active trips"
          >
            <img src="/images/refresh.png" className="w-5 h-5" alt="Refresh" />
          </button>
        </div>
        <div className="flex justify-center items-center py-8">
          <PageLoader />
        </div>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="min-h-screen text-white px-0 pt-0 pb-20 relative font-inter" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Profile Card */}
      <div className="relative bg-[#7C7CD1] rounded-b-3xl pb-8 pt-8 px-0 flex flex-col items-center" style={{ boxShadow: '0 2px 8px #5C5C99', minHeight: 320 }}>
        {/* Edit Profile Icon - bottom right of card */}
        <img
          src="/images/edit-profile.png"
          alt="Edit Profile"
          className="absolute bottom-4 right-4 w-12 h-12 z-20 cursor-pointer bg-white rounded-full shadow-lg p-2 border border-[#7C7CD1] hover:bg-[#f0f0ff] transition"
          onClick={() => setEditProfileOpen(true)}
          title="Edit Profile"
        />
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
        <div className="relative w-24 h-24 mt-2 mb-2">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full bg-[#292966] object-cover"
            />
          ) : (
            <img
              src="/images/avatar.png"
              alt="Profile"
              className="w-24 h-24 rounded-full bg-[#292966] object-cover"
            />
          )}
          <button
            className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => fileInputRef.current.click()}
            title="Change profile picture"
            type="button"
          >
            <img src="/images/camera.png" alt="Upload" className="w-6 h-6" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
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
          <h2 className="text-xl font-semibold mt-6 mb-2">Active Trips</h2>
          <button
            className="text-white px-4 py-1 rounded-full font-semibold text-base ml-4 mt-6 mb-2"
            onClick={() => {
              setTripsLoading(true);
              Promise.all([
                axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true })
                  .then((res) => setUser(res.data.user))
                  .catch(() => setUser(null)),
                axios.get(`${API_BASE_URL}/trips/my`, { withCredentials: true })
                  .then((res) => setTrips(res.data.trips || []))
                  .catch(() => setTrips([])),
                axios.get(`${API_BASE_URL}/trips/joined`, { withCredentials: true })
                  .then((res) => setJoinedTrips(res.data.trips || []))
                  .catch(() => setJoinedTrips([])),
              ]).finally(() => setTripsLoading(false));
            }}
            title="Refresh active trips"
          >
            <img src="/images/refresh.png" className="w-5 h-5" alt="Refresh" />
          </button>
        </div>
        {tripsLoading ? (
          <div className="flex justify-center items-center py-8">
            <PageLoader />
          </div>
        ) : trips.length === 0 && joinedTrips.length === 0 ? (
          <div>No active trips.</div>
        ) : (
          <>
            {/* Hosted trips */}
            {trips.map((trip) => (
              <div key={trip._id} className="bg-[#1B1B1B] rounded-2xl p-4 mb-6 flex flex-col gap-0 relative border" >
                <div className="flex flex-row justify-between items-start">
                  <div>
                    <div className="text-white text-base mb-1">Departure time: <span className="font-regular">{to12Hour(trip.time)}</span></div>
                    <div className="text-white text-base mb-1">Vacant seat: <span className="font-normal">{trip.seats - (trip.joinedUsers?.length || 0)}</span></div>
                    <div className="text-white text-base mb-3">Fare: <span className="font-normal">{trip.fare ? `${trip.fare} Rs` : "to be updated!"}</span></div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div onClick={() => { setChatOpen(true); setActiveChatTripId(trip._id); setActiveChatTrip(trip); }}>
                      <img src="/images/comment.png" alt="chatroom" className="w-12 h-12 opacity-100" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-0 mt-2">
                  <button
                    className="bg-[#505081] text-white px-3 py-1 rounded-full font-semibold text-base"
                    onClick={() => navigate("/host", { state: { trip } })}
                  >
                    Update
                  </button>
                  <button
                    className="bg-[#CC3260] text-white px-3 py-1 rounded-full font-semibold text-base ml-3"
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
                    Delete
                  </button>
                  <button
                    
                    onClick={async () => {
                      try {
                        await axios.patch(`${API_BASE_URL}/trips/done/${trip._id}`, {}, { withCredentials: true });
                        setTrips(trips.filter((t) => t._id !== trip._id));
                        // Optionally show a toast for marking as done
                      } catch (err) {
                        alert("Failed to mark trip as done.");
                      }
                    }}
                  >
                    <img src="/images/correct.png" className="w-8 h-8 absolute right-7 top-29" alt="done" />
                  </button>
                </div>
                {/* Joined users with REMOVE button for host */}
                {trip.joinedUsers && trip.joinedUsers.length > 0 && trip.joinedUsers.map((joinedUser) => (
                  <div key={joinedUser._id} className="bg-[#1b1b1b] rounded-2xl p-4 mt-3 flex flex-row items-center justify-between border">
                    <div>
                      <div className="font-bold text-[#2A9E30] text-base mb-1 uppercase">{joinedUser.fullname.firstname} {joinedUser.fullname.lastname} JOINED</div>
                      <div className="text-white text-base font-semibold">CONTACT: {joinedUser.mobileNo}</div>
                      <div className="text-white text-base font-semibold">BATCH: {joinedUser.batch.toUpperCase()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        className="bg-[#ffff] px-5 py-1 rounded-full font-semibold text-black mb-2"
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
                          <img src="/images/phone.png" alt="Call User" className="w-11 h-11" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {/* Joined trips */}
            {joinedTrips.map((trip) => (
              <div key={trip._id} className="bg-[#1b1b1b] rounded-2xl p-4 mb-6 relative flex flex-row justify-between items-stretch border">
                {/* Left: Trip Info */}
                <div className="flex-1 pr-2">
                  <div className="font-bold text-[#2A9E30] mb-1 uppercase">JOINED THIS TRIP</div>
                  <div className="text-white text-base mb-1 font-semibold">Departure: <span className="font-semibold">{to12Hour(trip.time)}</span></div>
                  <div className="text-white text-base mb-1">Host: <span className="font-normal">{trip.host?.fullname?.firstname} {trip.host?.fullname?.lastname}</span></div>
                  <div className="text-white text-base mb-1">Vacant seat: <span className="font-normal">{trip.seats - (trip.joinedUsers?.length || 0)}</span></div>
                  <div className="text-white text-base mb-3">Fare: <span className="font-normal">{trip.fare ? `${trip.fare} Rs` : "to be updated!"}</span></div>
                </div>
                {/* Right: Actions */}
                <div className="flex flex-col items-end justify-between min-w-[120px] relative">
                  {/* Cancel Join Button */}
                  <button
                    className="bg-[#ffff] text-black px-0 py-2 rounded-full font-semibold absolute top-0 right-[-5px] mt-0 mr-0 w-32"
                    onClick={() => handleCancelJoin(trip._id)}
                  >
                    CANCEL JOIN
                  </button>
                  {/* WhatsApp & Call icons */}
                  <div className="flex flex-row gap-4 mt-16 mb-1">
                    <div className="" onClick={() => { setChatOpen(true); setActiveChatTripId(trip._id); setActiveChatTrip(trip); }}>
                      <img src="/images/comment.png" alt="chatroom" className="w-12 h-12" />
                    </div>
                    <a
                      href={`https://wa.me/91${trip.host?.mobileNo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat with host on WhatsApp"
                    >
                      <img src="/images/wapplogo.png" alt="WhatsApp" className="w-12 h-12" />
                    </a>
                    <a href={`tel:${trip.host?.mobileNo}`} title="Call Host">
                      <img src="/images/phone.png" alt="Call Host" className="w-12 h-12" />
                    </a>
                    
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
      
      {editProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => {
            // Only close if the user clicks the backdrop, not the modal itself
            if (e.target === e.currentTarget) setEditProfileOpen(false);
          }}
        >
          <div
            className="bg-[#212427] rounded-t-2xl p-6 w-full max-w-md shadow-xl relative animate-slideUp"
            style={{ minHeight: 340, backdropFilter: 'blur(10px)' }}
            onClick={e => e.stopPropagation()} 
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => setEditProfileOpen(false)}
              title="Close"
            >
              <img src="/images/cross.png" className="h-4 w-4 mt-5 mr-3" alt="Close" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
            <form onSubmit={handleEditProfileSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 font-semibold text-white">
                Name
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border rounded-[10px] px-3 py-2 text-white"
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 font-semibold text-white">
                Mobile Number
                <input
                  type="tel"
                  value={editMobile}
                  onChange={e => setEditMobile(e.target.value)}
                  className="border rounded-[10px] px-3 py-2 text-white"
                  placeholder="Enter mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </label>
              <button
                type="button"
                className="bg-[#CC3260] text-white rounded-[10px] px-4 py-2 font-semibold mt-2"
                onClick={handleRemoveProfileImage}
              >
                Remove Profile Image
              </button>
              <button
                type="submit"
                className="bg-[#7C7CD1] text-white rounded-[10px] px-4 py-2 font-semibold mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
