'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="px-4 pt-28 pb-20 flex justify-center">
            <div className="w-full max-w-2xl border rounded-2xl shadow-xl bg-gradient-to-br from-[var(--primary)]/10 to-white p-10 space-y-8">
                <h1 className="text-3xl font-bold text-center text-[var(--foreground)]">🔐 Вход в аккаунт</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="tel"
                        placeholder="Номер телефона"
                        value={form.phone_number}
                        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                        className="w-full p-4 border rounded-lg text-lg"
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-4 border rounded-lg text-lg"
                    />
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    <button className="w-full bg-blue-600 text-white py-3 text-lg rounded-lg hover:bg-blue-700 transition">
                        Войти
                    </button>
                </form>

                <p className="text-center text-gray-700 text-base">
                    Ещё не зарегистрированы?{" "}
                    <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
                        Создать аккаунт →
                    </Link>
                </p>
            </div>
        </div>
    );
}
