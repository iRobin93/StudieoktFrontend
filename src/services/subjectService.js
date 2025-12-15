import api from "../api/axios";

export const getSubjects = async () => {
  const response = await api.get("/subject");
  return response.data;
};

export const addSubject = async (subject) => {
  const response = await api.post("/subject", subject);
  return response.data;
};
