"use client"; // 👈 Ensure this runs as a Client Component

import axios from "axios";

// Use NEXT_PUBLIC_ prefix for env variables exposed to the client
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  withCredentials: true, // include cookies if needed
});

// Add Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user"); // Hopestore stores user object
  if (user) {
    const parsedUser = JSON.parse(user);
    if (parsedUser?.uid) {
      config.headers.Authorization = `Bearer ${parsedUser.uid}`; // using UID as token
    }
  }
  return config;
});

export default api;
