import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_ADMIN_BACKEND || "http://localhost:8080";

export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);
export const googleLogin = (token) => axios.post(`${API_URL}/auth/google`, { token });
