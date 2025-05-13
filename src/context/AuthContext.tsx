'use client';

import { createContext, useContext, useState } from "react";
import api from "@/lib/axios";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    login: (phone: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: { name: string; phone_number: string; password: string; confirm_password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (phone_number: string, password: string) => {
        const res = await api.post("/auth/login", { phone_number, password });
        setUser(res.data); // предполагается, что backend возвращает юзера
    };

    const register = async (data: { name: string; phone_number: string; password: string; confirm_password: string }) => {
        const res = await api.post("/auth/register", data);
        setUser(res.data);
    };

    const logout = async () => {
        // Просто сбрасываем состояние юзера — без API-запроса
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
