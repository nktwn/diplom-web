'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
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

interface Contract {
    id: number;
    content: string;
    status: number;
    supplier_signature?: string;
    customer_signature?: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, roleRes, contractsRes] = await Promise.all([
                    api.get('/order'),
                    api.get('/user/role'),
                    api.get('/contract'),
                ]);
                setOrders(ordersRes.data.orders || []);
                setRole(roleRes.data.role);
                setContracts(contractsRes.data || []);
            } catch (err) {
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const refreshOrders = async () => {
        try {
            const res = await api.get('/order');
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error('Ошибка обновления заказов:', err);
        }
    };

    const cancelOrder = async (orderId: number) => {
        setUpdatingId(orderId);
        try {
            await api.post('/order/cancel', { order_id: orderId });
            await refreshOrders();
        } catch (err) {
            console.error('Ошибка отмены заказа:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const updateStatus = async (orderId: number, newStatus: 'In Progress' | 'Completed' | 'Cancelled') => {
        const statusMap: Record<string, number> = {
            'In Progress': 2,
            'Completed': 3,
            'Cancelled': 4,
        };

        setUpdatingId(orderId);
        try {
            await api.post('/order/status', {
                order_id: orderId,
                new_status_id: statusMap[newStatus],
            });
            await refreshOrders();
        } catch (err) {
            console.error('Ошибка при смене статуса:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <p className="text-center mt-20">Загрузка заказов...</p>;

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-20 text-center">
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">📭 Заказов пока нет</h1>
                <p className="text-gray-500 mt-2">Вы ещё ничего не заказывали.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold">📦 Мои заказы</h1>

            {orders.map((order) => {
                const contract = contracts.find(c => c.content.includes(`#${order.id}`));
                const customerSigned = contract?.customer_signature;
                const supplierSigned = contract?.supplier_signature;

                return (
                    <div key={order.id} className="border rounded-xl p-6 bg-white shadow space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span className="font-medium">Заказ #{order.id}</span>
                            <span>{new Date(order.order_date).toLocaleDateString()}</span>
                        </div>

                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--foreground)]">🏪 {order.supplier.name}</h2>
                                <div className="mt-1">{getStatusBadge(order.status)}</div>
                            </div>

                            {role === 0 && order.status === 'Pending' && (
                                <button
                                    onClick={() => cancelOrder(order.id)}
                                    disabled={updatingId === order.id}
                                    className="btn-danger text-sm"
                                >
                                    {updatingId === order.id ? 'Отмена...' : '❌ Отменить заказ'}
                                </button>
                            )}

                            {role === 1 && order.status === 'Pending' && (
                                <button
                                    onClick={() => updateStatus(order.id, 'In Progress')}
                                    disabled={updatingId === order.id}
                                    className="btn-outline-primary text-sm"
                                >
                                    🔄 Принять в работу
                                </button>
                            )}

                            {role === 1 && order.status === 'In Progress' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(order.id, 'Completed')}
                                        disabled={updatingId === order.id}
                                        className="btn-primary text-sm"
                                    >
                                        ✅ Завершить
                                    </button>
                                    <button
                                        onClick={() => updateStatus(order.id, 'Cancelled')}
                                        disabled={updatingId === order.id}
                                        className="btn-danger text-sm"
                                    >
                                        ❌ Отменить
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href={`/orders/${order.id}`}>
                            <ul className="divide-y mt-2 rounded-lg hover:shadow transition">
                                {order.product_list.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex gap-4 py-3 px-2 hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover border rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.price.toLocaleString()} ₸ × {item.quantity} шт
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Link>

                        {/* Подписи */}
                        {(order.status === 'In Progress' || order.status === 'Completed') && (
                            <div className="text-sm text-gray-600 pt-2 border-t mt-4">
                                <p>
                                    Подпись клиента:{" "}
                                    <span className={customerSigned ? 'text-green-600 font-medium' : 'text-red-500'}>
                {customerSigned ? '✅ Подписано' : '❌ Не подписано'}
            </span>
                                </p>
                                <p>
                                    Подпись поставщика:{" "}
                                    <span className={supplierSigned ? 'text-green-600 font-medium' : 'text-red-500'}>
                {supplierSigned ? '✅ Подписано' : '❌ Не подписано'}
            </span>
                                </p>
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
}
