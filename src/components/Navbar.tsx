'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            {/* Left — Filters & Sort (stubs) */}
            <div className="space-x-4">
                <button className="hover:underline">Filters</button>
                <button className="hover:underline">Sort</button>
            </div>

            {/* Center — Main navigation */}
            <div className="space-x-4 text-lg font-medium">
                <Link href="/">Catalogue</Link>
                <Link href="/cart">Cart</Link>
            </div>

            {/* Right — Auth */}
            <div>
                {user ? (
                    <Link href="/profile" className="hover:underline">Profile</Link>
                ) : (
                    <Link href="/login" className="hover:underline">Login</Link>
                )}
            </div>
        </nav>
    );
}
