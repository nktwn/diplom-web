import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "E-commerce Diplom",
    description: "Frontend for diplom project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <CartProvider>
                <Navbar />
                <main className="px-4 sm:px-6 lg:px-12 py-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
                    {children}</main>
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
