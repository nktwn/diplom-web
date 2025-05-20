'use client';

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";

export default function CartPage() {
    const { cart, checkout, clearCart } = useCart();
    const [products, setProducts] = useState<Record<number, Product>>({});

    useEffect(() => {
        const loadProducts = async () => {
            const ids = [...new Set(cart.map((c) => c.productId))];
            const responses = await Promise.all(
                ids.map((id) => api.get(`/product/${id}`))
            );
            const map: Record<number, Product> = {};
            responses.forEach((r) => {
                map[r.data.product.product.id] = r.data.product.product;
            });
            setProducts(map);
        };
        if (cart.length > 0) loadProducts();
    }, [cart]);

    const handleCheckout = async () => {
        try {
            await checkout();
            alert("Заказ оформлен!");
        } catch {
            alert("Ошибка при оформлении заказа");
        }
    };

    if (cart.length === 0) return <p className="text-center mt-20">Корзина пуста</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Корзина</h1>
            {cart.map((item, index) => {
                const product = products[item.productId];
                return (
                    <div key={index} className="flex justify-between items-center border-b py-2">
                        <div>
                            <p>{product?.name ?? "Загрузка..."}</p>
                            <p className="text-sm text-gray-500">Поставщик ID: {item.supplierId}</p>
                        </div>
                        <p>{item.quantity} шт</p>
                    </div>
                );
            })}
            <div className="flex justify-between mt-6">
                <button onClick={clearCart} className="text-red-600">Очистить</button>
                <button onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Оформить заказ
                </button>
            </div>
        </div>
    );
}
