import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // ✅ правильный порт
    withCredentials: true,
});

export default api;

