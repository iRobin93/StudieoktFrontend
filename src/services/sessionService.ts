import api from "../api/axios";

export const getSessions = async (date) => {
  const response = await api.get("/session/" + date);
  return response.data;
};

export const createSession = async (session) => {
  const response = await api.post("/session", session);
  return response.data;
};
