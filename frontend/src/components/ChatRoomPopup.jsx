import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_BASE_URL } from '../utils/api';

export default function ChatRoomPopup({ open, onClose, tripId, userId, hostName , activeChatTrip }) {
  const inputRef = useRef();
  const containerRef = useRef();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!open || !tripId || !userId) return;
    // Use deployed backend URL for production
    const s = io(API_BASE_URL, { transports: ['websocket'] }); 
    setSocket(s);
    s.emit('joinRoom', { tripId, userId });
    // Fetch chat history
    axios.get(`${API_BASE_URL}/trips/${tripId}/chat`).then(res => {
      setMessages(res.data.messages.map(m => ({
        ...m,
        isSelf: m.sender?._id === userId || m.sender === userId
      })));
    });
    s.on('chatMessage', msg => {
      setMessages(prev => [
        ...prev,
        {
          ...msg,
          isSelf:
            msg.sender === userId ||
            msg.sender?._id === userId ||
            msg.sender?.userId === userId
        }
      ]);
    });
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [open, tripId, userId]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  // Send message
  const handleSend = (msg) => {
    if (!msg.trim() || !socket) return;
    socket.emit('chatMessage', { tripId, userId, text: msg });
  };

  const getSenderName = (msg) => {
    if (msg.isSelf) return "You";
    const sender = msg.sender || {};
    const nameObj = sender.fullname;
    if (nameObj) {
      if (typeof nameObj === "string") return nameObj;
      if (typeof nameObj === "object")
        return `${nameObj.firstname ?? ""} ${nameObj.lastname ?? ""}`.trim();
    }
    if (sender.userId) return sender.userId;
    if (sender._id) return sender._id;
    return "Unknown";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-t-3xl bg-[#212427] shadow-2xl p-0 pb-2 animate-slideup relative"
        style={{
          minHeight: 320,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div className="text-white text-lg font-semibold pl-3 pt-4 flex flex-row">
          Chat Room
          {/* Only show hostName if the user is NOT the host and hostName is not null/empty */}
          {(hostName && hostName !== "Unknown Host" && hostName.trim() !== "") ? (
            <>
              <span className="mx-1">
                <img src="/images/dot.png" alt="dot" className="h-5 w-5 mt-1" /></span>
              <span className="text-grey-400 text-lg font-normal">{hostName}</span>
            </>
          ) : null}
        </div>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-4 text-white text-2xl z-10" title="Close chat">&times;</button>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-2" style={{ scrollbarWidth: 'thin' }}>
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-8">No messages yet.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-400 mb-1">
                  {getSenderName(msg)}
                </span>
                <div className={`rounded-2xl px-4 py-2 text-black text-base max-w-[80%] ${msg.isSelf ? 'bg-[#CCCCFF]' : 'bg-[#F6F6F6]'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Input */}
        <form
          className="flex items-center px-4 pb-2 pt-1 gap-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
          onSubmit={e => {
            e.preventDefault();
            if (inputRef.current.value.trim()) {
              handleSend(inputRef.current.value);
              inputRef.current.value = '';
            }
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Write a message ..."
            className="flex-1 rounded-full px-4 py-2 bg-[#2d2c33] text-white outline-none border"
            autoComplete="off"
          />
          <button type="submit" className="text-white text-2xl px-2 py-1 rounded-full h-11 w-11">
            <img src="/images/send.png" alt="send" />
          </button>
        </form>
      </div>
      <style>{`
        @keyframes slideup { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideup { animation: slideup 0.35s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}
