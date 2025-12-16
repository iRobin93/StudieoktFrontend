import api from "../api/axios";

export const getSessions = async (date) => {
  try {
    const response = await api.get("/session/" + date);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    alert("Failed to fetch sessions. Please try again later. " + error.message);
    return [];
  }
};

export const createSession = async (session) => {
  try {
    const response = await api.post("/session", session);
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    alert("Failed to create session. Please try again later. " + error.message);
    return null;
  }
};
