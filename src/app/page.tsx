'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

const LIMIT = 28;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/product/list", {
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        setProducts(res.data.product_list);
        setTotal(res.data.total); // Предполагается, что сервер возвращает общее количество продуктов
      } catch (e) {
        console.error("❌ Failed to load products:", e);
        setError("Не удалось загрузить продукты");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const getVisiblePages = () => {
    const delta = 2;
    const pages: (number | string)[] = [];

    const left = Math.max(0, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    if (left > 0) {
      pages.push(0);
      if (left > 1) pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      if (right < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
        {products.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Назад
          </button>

          {getVisiblePages().map((p, index) =>
              p === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-1">
              ...
            </span>
              ) : (
                  <button
                      key={p}
                      onClick={() => setPage(Number(p))}
                      className={`px-3 py-1 rounded ${
                          p === page ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                  >
                    {Number(p) + 1}
                  </button>
              )
          )}

          <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      </div>
  );
}
