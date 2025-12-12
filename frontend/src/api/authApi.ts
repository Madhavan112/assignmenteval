import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginApi = (data: unknown) =>
  axios.post(`${API}/login`, data);

export const registerApi = (data: unknown) =>
  axios.post(`${API}/signup`, data);
