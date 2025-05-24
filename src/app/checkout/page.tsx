'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";

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

export default function CheckoutPage() {
    const [cartData, setCartData] = useState<CartResponse | null>(null);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Отображение уведомления об успешном создании заказа
        if (sessionStorage.getItem("order_success") === "true") {
            setSuccessMessage(true);
            sessionStorage.removeItem("order_success");
        }

        const fetchData = async () => {
            try {
                const [cartRes, checkoutRes] = await Promise.all([
                    api.get("/cart/"),
                    api.post("/cart/checkout"),
                ]);
                setCartData(cartRes.data);
                setCheckoutUrl(checkoutRes.data.checkout_url);
            } catch (e: any) {
                console.error("Ошибка оформления:", e?.response?.data || e.message);
                setError("Не удалось создать ссылку на оплату. Проверьте корзину и попробуйте снова.");
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <div className="text-center mt-20 text-red-600 font-medium">
                {error}
            </div>
        );
    }

    if (!checkoutUrl || !cartData) {
        return <p className="text-center mt-20">Загрузка...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold">💳 Подтверждение заказа</h1>

            {successMessage && (
                <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg shadow text-center">
                    ✅ Заказ успешно создан и ожидает оплаты.
                </div>
            )}

            {cartData.suppliers.map((supplier) => {
                const needsMore = supplier.total_amount < supplier.free_delivery_amount;
                const delivery = needsMore ? supplier.delivery_fee : 0;

                return (
                    <div
                        key={supplier.id}
                        className="border rounded-xl p-6 bg-white shadow space-y-4"
                    >
                        <h2 className="text-xl font-semibold">🏪 {supplier.name}</h2>

                        <ul className="divide-y">
                            {supplier.product_list.map((product) => (
                                <li key={product.id} className="flex gap-4 py-4">
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
                                </li>
                            ))}
                        </ul>

                        <div className="border-t pt-4 text-sm text-gray-700 space-y-1">
                            {needsMore ? (
                                <p>
                                    Доставка: {delivery.toLocaleString()} ₸ (до бесплатной: ещё{" "}
                                    {(supplier.free_delivery_amount - supplier.total_amount).toLocaleString()} ₸)
                                </p>
                            ) : (
                                <p className="text-green-600 font-medium">✅ Бесплатная доставка</p>
                            )}
                            <p className="font-semibold text-[var(--foreground)]">
                                Сумма товаров: {supplier.total_amount.toLocaleString()} ₸
                            </p>
                        </div>
                    </div>
                );
            })}

            <div className="text-right text-xl font-bold">
                Общая сумма: {cartData.total.toLocaleString()} ₸
            </div>

            <div className="flex justify-center mt-6">
                <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-center text-lg px-6 py-3"
                >
                    🧾 Перейти к оплате
                </a>
            </div>
        </div>
    );
}
