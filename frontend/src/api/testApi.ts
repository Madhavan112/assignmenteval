import axios from "axios";
const BASE_URL = "http://localhost:5000/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- TEACHER APIs ----------
export const postTopic = (data: any) =>
  axios.post(`${BASE_URL}/topics`, data, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    withCredentials: true,
  });

// ---------- STUDENT APIs ----------
export const getTopics = () =>
  axios.get(`${BASE_URL}/topics`, {
    headers: authHeaders(),
    withCredentials: true,
  });

export const startTest = (topicId: string) =>
  axios.post(`${BASE_URL}/tests/start`, { topicId }, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    withCredentials: true,
  });


export const submitTest = (testId: string, answers: any) =>
  axios.post(`${BASE_URL}/tests/submit`, { testId, answers }, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    withCredentials: true,
  });

export const getMyReportsApi = () =>
  axios.get(`${BASE_URL}/tests/my-reports`, {
    headers: authHeaders(),
    withCredentials: true,
  });

export const getAllReportsApi = () =>
  axios.get(`${BASE_URL}/tests/teacher/reports`, {
    headers: authHeaders(),
    withCredentials: true,
  });

export const getTestByIdApi = (id: string) =>
  axios.get(`${BASE_URL}/tests/${id}`, {
    headers: authHeaders(),
    withCredentials: true,
  });
