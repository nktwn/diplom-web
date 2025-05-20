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

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!product) return <p>Продукт не найден</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/" className="text-blue-600 hover:underline">← Назад</Link>

            <div className="flex flex-col sm:flex-row gap-6">
                <img
                    src={product.ImageUrl}
                    alt={product.name}
                    className="w-full sm:w-64 h-64 object-cover border rounded-lg"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-gray-600 mt-2">
                        от {product.lowest_product_supplier?.price ?? "N/A"}₽
                    </p>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mt-6 mb-2">Поставщики:</h2>
                {suppliers.length === 0 ? (
                    <p className="text-gray-500">Нет доступных поставщиков.</p>
                ) : (
                    <ul className="space-y-3">
                        {suppliers.map((offer, index) => (
                            <li
                                key={index}
                                className="border p-4 rounded bg-[var(--card-bg)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div>
                                    <p className="font-medium">{offer.supplier.name}</p>
                                    <p className="text-sm text-gray-600">В наличии: {offer.sell_amount}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-lg font-semibold text-[var(--primary)]">{offer.price}₽</p>
                                    <button
                                        onClick={() =>
                                            addToCart({
                                                productId: product.id,
                                                supplierId: offer.supplier.id,
                                                quantity: 1,
                                            })
                                        }
                                        className="bg-[var(--primary)] text-white text-sm px-4 py-1.5 rounded hover:bg-[var(--primary-hover)] transition"
                                    >
                                        В корзину
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
