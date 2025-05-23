// src/lib/axios.ts

import axios from "axios";

const api = axios.create({
    baseURL: "http://188.227.35.6:8080/api",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
