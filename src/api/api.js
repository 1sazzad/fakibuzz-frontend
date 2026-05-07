import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});

function encodePath(value) {
  return encodeURIComponent(String(value).trim());
}

export const apiEndpoints = {
  health: () => API.get("/health"),
  searchSubject: (query) => API.get("/subjects/search", { params: { query } }),
  getSubjectOverview: (subjectCode) => API.get(`/subjects/${encodePath(subjectCode)}/overview`),
  getSubjects: () => API.get("/subjects"),
  getSubjectQuestions: (subjectCode) => API.get(`/subjects/${encodePath(subjectCode)}/questions`),
  searchQuestions: (payload) => API.post("/search", payload),
  getSubjectAnalysis: (subjectCode) => API.get(`/subjects/${encodePath(subjectCode)}/analysis`),
  getSubjectPrediction: (subjectCode) => API.get(`/subjects/${encodePath(subjectCode)}/prediction`),
  generateAnswer: (payload) => API.post("/answers/generate", payload),
  createAdminExam: (payload) => API.post("/admin/exams", payload),
  publishSubject: (subjectCode) => API.post(`/admin/subjects/${encodePath(subjectCode)}/publish`),
};

export default API;