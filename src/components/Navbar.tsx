'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[var(--navbar-bg)] border-b border-[var(--card-border)] shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] hover:underline">
                    Zhan.Store
                </Link>
                <div className="space-x-6 text-lg font-medium text-[var(--foreground)]">
                    <Link href="/cart" className="hover:text-[var(--primary)]">Корзина</Link>
                    {user ? (
                        <>
                            <Link href="/orders" className="hover:text-[var(--primary)]">Заказы</Link>
                            <Link href="/analytics" className="hover:text-[var(--primary)]">Аналитика</Link>
                            <Link href="/profile" className="hover:text-[var(--primary)]">Профиль</Link>
                        </>
                    ) : (
                        <Link href="/login" className="hover:text-[var(--primary)]">Войти</Link>
                    )}
                </div>

            </div>
        </nav>

    );
}
