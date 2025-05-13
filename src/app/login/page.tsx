'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({ phone_number: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(form.phone_number, form.password);
            router.push("/");
        } catch (err) {
            setError("Неверный номер телефона или пароль");
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Вход</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="tel"
                    placeholder="Номер телефона"
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full p-2 border rounded"
                />
                {error && <p className="text-red-600">{error}</p>}
                <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Войти
                </button>
            </form>
        </div>
    );
}
