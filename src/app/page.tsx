'use client';

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";
import Link from "next/link";
import { Product } from "@/types";

const BANNER_IMAGES = ["/banner/img1.png", "/banner/img2.png", "/banner/img3.png", "/banner/img4.png"];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [catalogPage, setCatalogPage] = useState(0);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [prevBannerIndex, setPrevBannerIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/product/list?limit=50&offset=0");
        const productList: Product[] = res.data.product_list;
        setProducts(productList);
        setTopProducts(productList.sort(() => 0.5 - Math.random()).slice(0, 5));
      } catch (e) {
        console.error("Ошибка загрузки продуктов:", e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevBannerIndex(bannerIndex);
      setBannerIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [bannerIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevPage(catalogPage);
      setCatalogPage((prev) => (prev + 1) % 5);
    }, 8000);
    return () => clearInterval(interval);
  }, [catalogPage]);

  return (
      <div className="space-y-10 w-[90%] mx-auto px-4 py-8">
        {/* БАННЕР */}
        <section className="relative overflow-hidden rounded-xl border shadow bg-[var(--card-bg)] w-full h-[400px]">
          <div className="relative h-full overflow-hidden">
            {BANNER_IMAGES.map((img, idx) => {
              const baseStyle = "absolute inset-0 w-full h-full transition-all duration-[1000ms] ease-in-out";

              const isCurrent = idx === bannerIndex;
              const isPrev = idx === prevBannerIndex;

              return (
                  <div
                      key={idx}
                      className={`${baseStyle} ${isCurrent ? "translate-x-0 opacity-100 z-10" : isPrev ? "-translate-x-full opacity-0 z-0" : "translate-x-full opacity-0 z-0"}`}
                  >
                    {/* Фоновая размытка */}
                    <img
                        src={img}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-40"
                    />
                    {/* Основное изображение */}
                    <div className="relative z-10 w-full h-full flex justify-center items-center">
                      <img
                          src={img}
                          alt={`Banner ${idx}`}
                          className="max-w-[70%] max-h-[80%] object-contain"
                      />
                    </div>
                  </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {BANNER_IMAGES.map((_, idx) => (
                <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                        idx === bannerIndex ? "bg-[var(--primary)]" : "bg-gray-400"
                    } transition`}
                />
            ))}
          </div>
        </section>


        {/* ТОП-ПРОДАЖ */}
        <section className="rounded-xl border shadow p-4 bg-gradient-to-br from-[var(--primary)]/10 to-white w-full">
          <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)]">🔥 Топ-продаж</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* КАТАЛОГ */}
        <section className="rounded-xl border shadow p-4 bg-[var(--card-bg)] w-full">
          <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)]">🛍️ Каталог</h2>
          <div className="relative h-[750px] overflow-hidden">
            {[...Array(5)].map((_, idx) => {
              let className = "absolute inset-0 transition-all duration-[1000ms] ease-in-out";
              if (idx === catalogPage) {
                className += " translate-x-0 opacity-100 z-10";
              } else if (idx === prevPage) {
                className += " -translate-x-full opacity-0 z-0";
              } else {
                className += " translate-x-full opacity-0 z-0";
              }

              return (
                  <div key={idx} className={className}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {products.slice(idx * 10, idx * 10 + 10).map((product) => (
                          <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(5)].map((_, idx) => (
                <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                        idx === catalogPage ? "bg-blue-600" : "bg-gray-300"
                    } transition`}
                />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
                href="/catalog"
                className="inline-block text-[var(--primary)] text-base font-semibold border border-[var(--primary)] px-5 py-2 rounded hover:bg-[var(--primary)] hover:text-white transition"
            >
              Смотреть весь каталог →
            </Link>
          </div>
        </section>
      </div>
  );
}
