import api from "../api/axios";

export const getSubjects = async (date) => {
  try {
    const response = await api.get("/subject/bydate/" + date.value);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    alert("Failed to fetch subjects. Please try again later. " + error.message);
    return [];
  }
};

export const addSubject = async (subject) => {
  try {
    const response = await api.post("/subject", subject);
    return response.data;
  } catch (error) {
    console.error("Error adding subjects:", error);
    alert("Failed to add subjects. Please try again later. " + error.message);
    return [];
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    const response = await api.delete("/subject/" + subjectId);
    return response.data;
  } catch (error) {
    console.error("Error deleting subject:", error);
    alert("Failed to delete subject. Please try again later. " + error.message);
    return [];
  }
};
