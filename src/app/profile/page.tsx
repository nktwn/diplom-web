'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Address {
    description: string;
    street: string;
}

interface UserProfile {
    id: number;
    name: string;
    phone_number: string;
}

export default function ProfilePage() {
    const { logout } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", phone_number: "" });
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileRes, addressRes, roleRes] = await Promise.all([
                    api.get("/user/profile"),
                    api.get("/user/address"),
                    api.get("/user/role")
                ]);

                setProfile(profileRes.data.user);
                setEditForm({
                    name: profileRes.data.user.name,
                    phone_number: profileRes.data.user.phone_number,
                });

                setAddresses(addressRes.data.address_list || []);
                setRole(roleRes.data.role);
            } catch (e) {
                console.error("Ошибка загрузки профиля", e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getRoleLabel = (role: number | null): string => {
        switch (role) {
            case 0: return "Клиент";
            case 1: return "Поставщик";
            case 2: return "Администратор";
            default: return "Неизвестно";
        }
    };

    const handleSaveProfile = async () => {
        try {
            await api.put("/user/profile", editForm);
            setProfile((prev) => prev ? { ...prev, ...editForm } : null);
            setEditing(false);
        } catch (e) {
            alert("Ошибка при обновлении профиля");
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (loading) return <p className="text-center mt-20">Загрузка профиля...</p>;
    if (!profile) return <p className="text-center mt-20 text-red-600">Не удалось загрузить профиль</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-12">
            {/* Фото + имя + телефон */}
            <div className="flex flex-col items-center gap-4 text-center">
                <Image
                    src="/profile.png"
                    alt="Фото профиля"
                    width={100}
                    height={100}
                    className="rounded-full border shadow-md"
                />
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">{profile.name}</h1>
                    <p className="text-gray-600">{profile.phone_number}</p>
                    <p className="text-sm text-gray-500">Роль: <span className="font-medium">{getRoleLabel(role)}</span></p>
                </div>
            </div>

            {/* Редактирование профиля */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow p-6 space-y-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            value={editForm.name}
                            disabled={!editing}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full border rounded px-4 py-2 mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Телефон</label>
                        <input
                            type="tel"
                            value={editForm.phone_number}
                            disabled={!editing}
                            onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                            className="w-full border rounded px-4 py-2 mt-1"
                        />
                    </div>

                    <div className="flex justify-end">
                        {editing ? (
                            <button
                                onClick={handleSaveProfile}
                                className="btn-primary"
                            >
                                💾 Сохранить
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-outline-primary"
                            >
                                ✏️ Редактировать
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Список адресов */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-2">Мои адреса</h2>

                {addresses.length === 0 ? (
                    <p className="text-gray-500">Адреса не найдены.</p>
                ) : (
                    <ul className="space-y-3">
                        {addresses.map((addr, idx) => (
                            <li
                                key={idx}
                                className="border border-[var(--card-border)] rounded p-4 bg-white shadow-sm"
                            >
                                <p className="font-medium">{addr.description}</p>
                                <p className="text-gray-600 text-sm">{addr.street}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Logout */}
            <div className="text-center">
                <button
                    onClick={handleLogout}
                    className="btn-danger"
                >
                    🚪 Выйти из аккаунта
                </button>
            </div>
        </div>
    );
}
