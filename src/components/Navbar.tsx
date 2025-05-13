'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="bg-[var(--card-bg)] text-[var(--foreground)] p-4 flex justify-between items-center border-b border-[var(--card-border)]">
            <div className="space-x-4">
                <button className="hover:text-[var(--primary)]">Filters</button>
                <button className="hover:text-[var(--primary)]">Sort</button>
            </div>
            <div className="space-x-4 text-lg font-medium">
                <Link href="/" className="hover:text-[var(--primary)]">Catalogue</Link>
                <Link href="/cart" className="hover:text-[var(--primary)]">Cart</Link>
            </div>
            <div>
                {user ? (
                    <Link href="/profile" className="hover:text-[var(--primary)]">Profile</Link>
                ) : (
                    <Link href="/login" className="hover:text-[var(--primary)]">Login</Link>
                )}
            </div>
        </nav>

    );
}
