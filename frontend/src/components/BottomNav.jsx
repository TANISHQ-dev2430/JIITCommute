import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    path: "/home",
    icon: "/images/home-button.png",
    alt: "Home",
  },
  {
    path: "/profile",
    icon: "/images/avatar.png",
    alt: "Profile",
  },
  {
    path: "/history",
    icon: "/images/history.png",
    alt: "History",
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-around items-center h-16 z-20 bg-transparent" style={{ pointerEvents: 'auto' }}>
      <div className="w-90 max-w-md mx-auto flex justify-around items-center bg-gradient-to-r from-[#232228]/90 via-[#2d2c33]/90 to-[#232228]/90 backdrop-blur-md border border-white/20 rounded-full py-2 px-3 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                // Add a slight delay for smoother transition
                setTimeout(() => navigate(item.path), 80);
              }}
              className={`flex flex-col items-center focus:outline-none transition-all duration-300 ease-in-out relative ${isActive ? "scale-110" : "hover:scale-105"}`}
              style={{ minWidth: 64 }}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out`}
                aria-hidden="true"
              >
                {isActive && (
                  <span className="absolute w-30 h-10 bg-[#bcb8f8]/90 rounded-full -z-10 transition-all duration-1000 ease-in-out" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}></span>
                )}
              </span>
              <img
                src={item.icon}
                alt={item.alt}
                className={`w-7 h-7 mb-1 z-10 transition-all duration-300 ease-in-out ${isActive ? "" : "opacity-80 hover:opacity-100"}`}
                style={isActive ? { filter: 'brightness(0) saturate(100%)', transform: 'scale(1.2)' } : {}}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
