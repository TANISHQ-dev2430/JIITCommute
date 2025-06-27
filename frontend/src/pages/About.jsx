import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-cover bg-center font-inter px-4 py-10" style={{ backgroundImage: "url('/images/about-bg.png')", fontFamily: "'Inter', Helvetica, Arial, sans-serif" }}>
      {/* Back Button */}
      <img
        src="/images/back.png"
        alt="Back"
        onClick={() => navigate("/landing")}
        className="absolute top-5 left-5 w-8 h-8 cursor-pointer"
      />
      {/* Overview Section */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">Overview</h2>
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-4">
          <div className="text-white/90 text-sm text-center">
            JIIT Commute is a student-focused ride-sharing platform made exclusively for JIITians, helping students travel conveniently between JIIT Sector 62 and JIIT Sector 128 campuses. Whether you're commuting for classes or events, JIIT Commute makes it easier to share rides, save money, and connect with fellow students.
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">Features</h2>
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-4 flex flex-col gap-3">
          <div className="text-white/90 text-sm">
            <span className="font-bold">View All Available Rides:</span> Instantly see a list of all rides created by other students.
          </div>
          <div className="text-white/90 text-sm">
            <span className="font-bold">Create a Ride:</span> If you're traveling and have empty seats, create a ride by entering your travel time. Others can view and join your ride easily.
          </div>
          <div className="text-white/90 text-sm">
            <span className="font-bold">Recreate Past Rides:</span> If you travel at the same time regularly, you can recreate your previous rides in just one tap.
          </div>
          <div className="text-white/90 text-sm">
            <span className="font-bold">Join a Ride Instantly:</span> Found a ride that matches your time? Just tap to join.
          </div>
          <div className="text-white/90 text-sm">
            <span className="font-bold">Direct Call or WhatsApp:</span> Contact ride creators directly through call or WhatsApp with just one tap.
          </div>
          <div className="text-white/90 text-sm">
            <span className="font-bold">In-App Group Chat:</span> Each ride has a shared inbox chat where all members can communicate and coordinate conveniently.
          </div>
          <div className="text-white/90 text-sm">
            <span className="font-bold">View Ride History:</span> Want to keep track of your past rides? Access your ride history anytime from your profile.
          </div>
        </div>
      </div>
      {/* Team Section */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">Meet the Team Behind JIITCommute</h2>
        <div className="flex flex-col gap-4">
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-4 relative">
            <div className="flex items-center mb-1">
              <span className="w-8 h-8 bg-white rounded-full mr-2">
                <img src="/images/krishna.jpg" className="rounded-full h-8 w-8" alt="krishna" />
              </span>
              <span className="text-white font-semibold text-sm">Krishna Chauhan</span>
              <span className="text-white/80 text-xs ml-2">• creation & coordination</span>
            </div>
            <div className="text-white/90 text-xs">Ideated the app and managed the overall development process with a strong focus on user needs.</div>
            <a href="https://www.linkedin.com/in/krishna-chauhan-bb9620292/" target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2">
              <img src="/images/linkedin-icon.png" alt="LinkedIn" className="h-5 w-5" />
            </a>
          </div>
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-4 relative">
            <div className="flex items-center mb-1">
              <span className="w-8 h-8 bg-white rounded-full mr-2">
                <img src="/images/abhay.jpg" className="rounded-full h-8 w-8" alt="abhaybansal" />
              </span>
              <span className="text-white font-semibold text-sm">Abhay Bansal</span>
              <span className="text-white/80 text-xs ml-2">• Frontend dev</span>
            </div>
            <div className="text-white/90 text-xs">Designed the user interface to ensure a smooth and intuitive experience for students using the app.</div>
            <a href="https://www.linkedin.com/in/abhay-bansal-76b921284/" target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2">
              <img src="/images/linkedin-icon.png" alt="LinkedIn" className="h-5 w-5" />
            </a>
          </div>
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-4 relative">
            <div className="flex items-center mb-1">
              <span className="w-8 h-8 bg-white rounded-full mr-2">
                <img src="/images/parri.jpg" className="rounded-full h-8 w-8" alt="parritanishq" />
              </span>
              <span className="text-white font-semibold text-sm">Parri Tanishq</span>
              <span className="text-white/80 text-xs ml-2">• Backend dev</span>
            </div>
            <div className="text-white/90 text-xs">Developed the backend infrastructure, including ride-matching logic and database management.</div>
            <a href="https://www.linkedin.com/in/tanishq-kumar-894814211/" target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2">
              <img src="/images/linkedin-icon.png" alt="LinkedIn" className="h-5 w-5" />
            </a>
          </div>
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-4 relative">
            <div className="flex items-center mb-1">
              <span className="w-8 h-8 bg-white rounded-full mr-2">
                <img src="/images/mohnish.jpg" className="rounded-full h-8 w-8" alt="mohnish" />
              </span>
              <span className="text-white font-semibold text-sm">Mohnish</span>
              <span className="text-white/80 text-xs ml-2">• UI / UX</span>
            </div>
            <div className="text-white/90 text-xs">Crafted a clean, student-friendly design and worked on optimizing user experience across screens.</div>
            <a href="https://www.linkedin.com/in/mohnish-kumar-a250a7223/" target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2">
              <img src="/images/linkedin-icon.png" alt="LinkedIn" className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full text-center text-white/60 text-xs mt-8 mb-2 select-none">
        © {new Date().getFullYear()} JIITCommute. All rights reserved.
      </div>
      <div className="text-white/60 text-xs flex items-center justify-center gap-1">
        jiitcommute@gmail.com 
        <a href="mailto:jiitcommute@gmail.com">
          <img src="/images/letter.png" className="h-6 w-6" alt="mail-icon"/>
        </a>
      </div>
    </div>
  );
}
