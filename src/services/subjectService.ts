import api from "../api/axios";

export const getSubjects = async (date) => {
  const response = await api.get("/subject/bydate/" + date.value);
  return response.data;
};

export const addSubject = async (subject) => {
  const response = await api.post("/subject", subject);
  return response.data;
};

export const deleteSubject = async (subjectId) => {
  const response = await api.delete("/subject/" + subjectId);
  return response.data;
};
