'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { getStatusBadge } from '@/components/StatusBadge';

interface OrderProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    status: string;
    order_date: string;
    supplier: {
        id: number;
        name: string;
    };
    product_list: OrderProduct[];
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<number | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrderAndRole = async () => {
            try {
                const [orderRes, roleRes] = await Promise.all([
                    api.get(`/order/${id}`),
                    api.get(`/user/role`)
                ]);
                setOrder(orderRes.data);
                setRole(roleRes.data.role);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndRole();
    }, [id]);

    const refreshOrder = async () => {
        if (!order) return;
        const res = await api.get(`/order/${order.id}`);
        setOrder(res.data);
    };

    const cancelOrder = async () => {
        if (!order) return;
        setUpdating(true);
        try {
            await api.post("/order/cancel", { order_id: order.id });
            await refreshOrder();
        } catch (err) {
            console.error("Ошибка при отмене заказа:", err);
        } finally {
            setUpdating(false);
        }
    };

    const updateStatus = async (newStatus: 'In Progress' | 'Completed' | 'Cancelled') => {
        if (!order) return;

        const statusMap: Record<string, number> = {
            'In Progress': 2,
            'Completed': 3,
            'Cancelled': 4
        };

        setUpdating(true);
        try {
            await api.post("/order/status", {
                order_id: order.id,
                new_status_id: statusMap[newStatus],
            });
            await refreshOrder();
        } catch (err) {
            console.error("Ошибка при смене статуса:", err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p className="text-center mt-20">Загрузка заказа...</p>;
    if (!order) return <p className="text-center mt-20 text-red-500">Заказ не найден.</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">📦 Заказ #{order.id}</h1>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-2">Статус: {getStatusBadge(order.status)}</p>
                        <p>Поставщик: <span className="font-medium">{order.supplier.name}</span></p>
                        <p>Дата заказа: {new Date(order.order_date).toLocaleString()}</p>
                    </div>
                </div>

                {/* Клиент: отмена */}
                {role === 0 && order.status === "Pending" && (
                    <button
                        onClick={cancelOrder}
                        disabled={updating}
                        className="btn-danger text-sm"
                    >
                        {updating ? "Отмена..." : "❌ Отменить заказ"}
                    </button>
                )}

                {/* Поставщик: смена статуса */}
                {role === 1 && order.status === 'Pending' && (
                    <button
                        onClick={() => updateStatus('In Progress')}
                        disabled={updating}
                        className="btn-outline-primary text-sm"
                    >
                        🔄 Принять в работу
                    </button>
                )}

                {role === 1 && order.status === 'In Progress' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateStatus('Completed')}
                            disabled={updating}
                            className="btn-primary text-sm"
                        >
                            ✅ Завершить
                        </button>
                        <button
                            onClick={() => updateStatus('Cancelled')}
                            disabled={updating}
                            className="btn-danger text-sm"
                        >
                            ❌ Отменить
                        </button>
                    </div>
                )}
            </div>

            <ul className="divide-y border rounded-xl bg-white shadow">
                {order.product_list.map((item) => (
                    <li key={item.id} className="flex gap-4 p-4">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover border rounded"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.price.toLocaleString()} ₸ × {item.quantity} шт
                            </p>
                        </div>
                        <div className="text-right font-semibold">
                            {(item.price * item.quantity).toLocaleString()} ₸
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
