'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface SupplierGroup {
    id: number;
    name: string;
    total_amount: number;
    delivery_fee: number;
    free_delivery_amount: number;
    OrderAmount: number;
    product_list: CartProduct[];
}

interface CartResponse {
    customer_id: number;
    total: number;
    suppliers: SupplierGroup[];
}

export default function CartPage() {
    const [cartData, setCartData] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [supplierWarnings, setSupplierWarnings] = useState<Record<number, boolean>>({});
    const router = useRouter();

    const fetchCart = async () => {
        try {
            const res = await api.get("/cart/");
            setCartData(res.data);
        } catch (e) {
            console.error("Ошибка загрузки корзины:", e);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete("/cart/clear");
            setCartData({ customer_id: 0, total: 0, suppliers: [] });
            setSupplierWarnings({});
        } catch (e) {
            console.error("Ошибка при очистке корзины", e);
        }
    };

    const handleCheckout = () => {
        const warnings: Record<number, boolean> = {};
        cartData?.suppliers.forEach((supplier) => {
            if (supplier.total_amount < supplier.OrderAmount) {
                warnings[supplier.id] = true;
            }
        });

        setSupplierWarnings(warnings);

        if (Object.keys(warnings).length === 0) {
            router.push("/checkout");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) return <p className="text-center mt-20">Загрузка корзины...</p>;

    if (!cartData || cartData.suppliers.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="border rounded-xl p-8 bg-white shadow text-center space-y-4 mt-12">
                    <div className="text-6xl">🛒</div>
                    <h2 className="text-2xl font-semibold text-[var(--foreground)]">Корзина пуста</h2>
                    <p className="text-gray-500">Добавьте товары из каталога или со страницы продукта.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold">🛒 Ваша корзина</h1>

            {cartData.suppliers.map((supplier) => {
                const needsMoreForFreeDelivery =
                    supplier.total_amount < supplier.free_delivery_amount;
                const deliveryFee = needsMoreForFreeDelivery ? supplier.delivery_fee : 0;

                return (
                    <div
                        key={supplier.id}
                        className="border rounded-xl p-6 bg-white shadow space-y-4"
                    >
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">
                            🏪 {supplier.name}
                        </h2>

                        <ul className="divide-y">
                            {supplier.product_list.map((product) => (
                                <li key={product.id}>
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="flex gap-4 py-4 hover:bg-gray-50 transition rounded-lg px-2"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover border rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {product.price.toLocaleString()} ₸ × {product.quantity} шт
                                            </p>
                                        </div>
                                        <div className="text-right font-semibold">
                                            {(product.price * product.quantity).toLocaleString()} ₸
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t pt-4 space-y-1 text-sm text-gray-700">
                            {needsMoreForFreeDelivery ? (
                                <p>
                                    Доставка: {deliveryFee.toLocaleString()} ₸ (до бесплатной: ещё{" "}
                                    {(supplier.free_delivery_amount - supplier.total_amount).toLocaleString()} ₸)
                                </p>
                            ) : (
                                <p className="text-green-600 font-medium">✅ Бесплатная доставка</p>
                            )}
                            <p className="font-semibold text-[var(--foreground)]">
                                Сумма товаров: {supplier.total_amount.toLocaleString()} ₸
                            </p>
                        </div>

                        {supplierWarnings[supplier.id] && (
                            <p className="text-red-600 text-sm mt-2">
                                Минимальная сумма заказа у поставщика:{" "}
                                {supplier.OrderAmount.toLocaleString()} ₸
                            </p>
                        )}
                    </div>
                );
            })}

            <div className="text-right text-xl font-bold mt-6">
                Общая сумма заказа: {cartData.total.toLocaleString()} ₸
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={clearCart}
                    className="btn-danger"
                >
                    🗑 Очистить корзину
                </button>
                <button onClick={handleCheckout} className="btn-primary">
                    ✅ Перейти к оформлению
                </button>
            </div>
        </div>
    );
}
