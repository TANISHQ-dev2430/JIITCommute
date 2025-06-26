import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A] bg-opacity-90">
      <ClipLoader color="#fff" size={60} />
    </div>
  );
}
