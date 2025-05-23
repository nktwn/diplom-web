'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

const LIMIT = 20;

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/product/list", {
                    params: {
                        limit: LIMIT,
                        offset: page * LIMIT,
                    },
                });
                setProducts(res.data.product_list);
                setHasNextPage(res.data.product_list.length === LIMIT);
            } catch (e) {
                console.error("Не удалось загрузить продукты:", e);
            }
        };

        fetchProducts();
    }, [page]);

    // ближайшие страницы вокруг текущей
    const getNearbyPages = () => {
        const pages = [];
        for (let i = Math.max(0, page - 2); i <= page + 2; i++) {
            if (i === page + 1 && !hasNextPage) break; // не рисуем "следующую" если её нет
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="w-[90%] mx-auto px-4 py-8 space-y-10">
            <section className="rounded-xl border shadow p-4 bg-gradient-to-br from-[var(--primary)]/10 to-white w-full">
                <h1 className="text-2xl font-bold mb-6 text-[var(--foreground)]">🛍️ Каталог товаров</h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-10">
                    <div className="inline-flex gap-2 flex-wrap justify-center items-center">
                        {/* ← */}
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 rounded-lg border text-sm font-medium transition disabled:opacity-50
                bg-white text-[#14b8a6] border-[#14b8a6] hover:bg-[#14b8a6] hover:text-white"
                        >
                            ←
                        </button>

                        {/* numbered pages */}
                        {getNearbyPages().map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                                    p === page
                                        ? "bg-[#14b8a6] text-white border-[#14b8a6]"
                                        : "bg-white text-[#14b8a6] border-[#14b8a6] hover:bg-[#14b8a6] hover:text-white"
                                }`}
                            >
                                {p + 1}
                            </button>
                        ))}

                        {/* → */}
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNextPage}
                            className="px-4 py-2 rounded-lg border text-sm font-medium transition disabled:opacity-50
                bg-white text-[#14b8a6] border-[#14b8a6] hover:bg-[#14b8a6] hover:text-white"
                        >
                            →
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
