'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Product, Supplier } from "@/types";
import { useCart } from "@/context/CartContext";

interface SupplierOffer {
    price: number;
    sell_amount: number;
    supplier: Supplier;
}

interface ApiResponse {
    product: {
        product: Product;
        suppliers: SupplierOffer[];
    };
}

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { addToCart } = useCart();

    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<ApiResponse>(`/product/${id}`);
                setProduct(res.data.product.product);
                setSuppliers(res.data.product.suppliers);
            } catch (err) {
                console.error("Ошибка загрузки продукта:", err);
                setError("Не удалось загрузить продукт");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleSelectQuantity = (supplierId: number) => {
        setSelectedSupplier((prev) => (prev === supplierId ? null : supplierId));
        setQuantities((prev) => ({
            ...prev,
            [supplierId]: prev[supplierId] ?? 1,
        }));
    };

    const handleChangeQuantity = (supplierId: number, delta: number) => {
        setQuantities((prev) => {
            const newQty = Math.max(1, (prev[supplierId] ?? 1) + delta);
            return { ...prev, [supplierId]: newQty };
        });
    };

    const handleAddToCart = async (supplierId: number) => {
        const quantity = quantities[supplierId] ?? 1;

        await addToCart({
            productId: product!.id,
            supplierId,
            quantity,
        });

        // сброс мини-интерфейса
        setSelectedSupplier(null);
        setQuantities((prev) => ({ ...prev, [supplierId]: 1 }));
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!product) return <p>Продукт не найден</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-6">
            <Link href="/" className="text-blue-600 hover:underline">← Назад</Link>

            {/* Основной блок */}
            <div className="bg-white border rounded-xl shadow p-6 flex flex-col sm:flex-row gap-6">
                <img
                    src={product.ImageUrl}
                    alt={product.name}
                    className="w-full sm:w-64 h-64 object-cover rounded-lg border"
                />
                <div className="flex-1 space-y-4">
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">{product.name}</h1>

                    {product.lowest_product_supplier?.price > 0 && (
                        <p className="text-lg text-[var(--primary)] font-semibold">
                            от {product.lowest_product_supplier.price.toLocaleString()} ₸
                        </p>
                    )}

                    <p className="text-gray-600 text-sm">
                        Доступные предложения от поставщиков ниже
                    </p>
                </div>
            </div>

            {/* Поставщики */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Поставщики</h2>

                {suppliers.length === 0 ? (
                    <p className="text-gray-500">Нет доступных поставщиков для этого товара.</p>
                ) : (
                    <ul className="space-y-4">
                        {suppliers.map((offer) => {
                            const isSelected = selectedSupplier === offer.supplier.id;
                            const quantity = quantities[offer.supplier.id] ?? 1;

                            return (
                                <li
                                    key={offer.supplier.id}
                                    className="border p-6 rounded-xl bg-white shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                                >
                                    <div className="flex-1 space-y-2">
                                        <p className="text-lg font-semibold text-[var(--foreground)]">
                                            🏪 {offer.supplier.name}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Минимальный заказ: {offer.supplier.order_amount.toLocaleString()} ₸
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Бесплатная доставка от: {offer.supplier.free_delivery_amount.toLocaleString()} ₸
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Стоимость доставки: {offer.supplier.delivery_fee.toLocaleString()} ₸
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 min-w-[160px] w-full sm:w-auto">
                                        <p className="text-xl font-bold text-[var(--primary)]">
                                            {offer.price.toLocaleString()} ₸
                                        </p>

                                        {!isSelected ? (
                                            <button
                                                onClick={() => handleSelectQuantity(offer.supplier.id)}
                                                className="bg-[var(--primary)] text-white text-sm px-4 py-2 rounded hover:bg-[var(--primary-hover)] transition"
                                            >
                                                Выбрать количество
                                            </button>
                                        ) : (
                                            <div className="w-full flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleChangeQuantity(offer.supplier.id, -1)}
                                                        className="px-3 py-1 rounded border text-sm"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="font-medium">{quantity}</span>
                                                    <button
                                                        onClick={() => handleChangeQuantity(offer.supplier.id, 1)}
                                                        className="px-3 py-1 rounded border text-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(offer.supplier.id)}
                                                    className="w-full bg-[var(--primary)] text-white text-sm px-4 py-2 rounded hover:bg-[var(--primary-hover)] transition"
                                                >
                                                    Добавить
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
