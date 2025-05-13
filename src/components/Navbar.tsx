// src/components/Navbar.tsx

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <div className="space-x-4">
                <Link href="/">Главная</Link>
                <Link href="/cart">Корзина</Link>
                <Link href="/orders">Заказы</Link>
            </div>
            <div>
                {user ? (
                    <>
                        <span className="mr-4">{user.name}</span>
                        <button onClick={logout}>Выйти</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Войти</Link>
                        <span className="mx-2">/</span>
                        <Link href="/register">Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
