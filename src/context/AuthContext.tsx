// src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: { email: string; password: string; name: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        api.get("/auth/profile")
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const login = async (email: string, password: string) => {
        await api.post("/auth/login", { email, password });
        const res = await api.get("/auth/profile");
        setUser(res.data);
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    const register = async (data: { email: string; password: string; name: string }) => {
        await api.post("/auth/register", data);
        await login(data.email, data.password);
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
