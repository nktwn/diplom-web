// src/app/catalog/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

const LIMIT = 20;

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);

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
            } catch (e) {
                console.error("Не удалось загрузить продукты:", e);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Каталог</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Назад
                </button>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    Вперед
                </button>
            </div>
        </div>
    );
}
