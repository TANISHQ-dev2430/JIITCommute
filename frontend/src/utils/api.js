// Utility to get the backend API base URL depending on environment
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://jiitcommute.onrender.com';
