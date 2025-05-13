'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      router.push("/");
    } catch (err) {
      setError("Ошибка регистрации");
    }
  };

  return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
              type="text"
              placeholder="Имя"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
          />
          <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
  );
}
