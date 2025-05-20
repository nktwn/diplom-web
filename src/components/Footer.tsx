// src/components/Footer.tsx
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--card-bg)] border-t border-[var(--card-border)] mt-20 px-6 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">

                <div className="flex-1 space-y-4 text-sm text-[var(--foreground)]">
                    <h3 className="text-xl font-semibold">Zhan.Store</h3>
                    <p>📍 <strong>г. Астана</strong></p>
                    <p>📦 ООО "Zhan.Store"</p>
                    <p>Осуществляет деятельность в сфере электронной коммерции и дистрибуции товаров по Республике Казахстан.</p>
                    <p>📞 Телефон: <a href="tel:+77471713773" className="text-[var(--primary)] hover:underline">+7 747 171 3773</a></p>
                </div>
                <h3 className="text-xl font-semibold">Сканируйте для связи с поддержкой</h3>
                <div className="flex-shrink-0 text-center md:text-right">
                    <Image
                        src="/qr.png"
                        alt="QR для поддержки"
                        width={150}
                        height={150}
                        className="mx-auto md:ml-auto border border-[var(--card-border)] rounded-lg shadow-md"
                    />
                </div>
            </div>
        </footer>
    );
}
