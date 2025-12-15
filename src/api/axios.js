// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7216", // your .NET backend URL
  timeout: 5000, // optional timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
