import api from "../api/axios";

export const getSessions = async () => {
  const response = await api.get("/session");
  return response.data;
};

export const addSession = async (session) => {
  const response = await api.post("/session", session);
  return response.data;
};
