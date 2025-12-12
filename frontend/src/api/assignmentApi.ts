// src/api/assignmentApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- TEACHER APIs ----------
export const createAssignmentApi = (data: any) =>
  axios.post(`${BASE_URL}/assignments`, data, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

export const getMyAssignmentsApi = () =>
  axios.get(`${BASE_URL}/assignments/my`, {
    headers: authHeaders(),
  });

export const getAssignmentSubmissionsApi = (assignmentId: string) =>
  axios.get(`${BASE_URL}/assignments/${assignmentId}/submissions`, {
    headers: authHeaders(),
  });

// ---------- STUDENT APIs ----------
export const listAssignmentsApi = () =>
  axios.get(`${BASE_URL}/assignments`, {
    headers: authHeaders(),
  });

export const submitAssignmentApi = (
  assignmentId: string,
  file: File,
  onProgress?: (percent: number) => void
) => {
  const formData = new FormData();
  formData.append("pdf", file);

  return axios.post(`${BASE_URL}/assignments/${assignmentId}/submit`, formData, {
    headers: {
      ...authHeaders(),
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return;
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percent);
    },
    timeout: 5 * 60 * 1000, // 5 minutes in case PDFs are big
  });
};
