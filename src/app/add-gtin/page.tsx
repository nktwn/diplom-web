'use client';

import { useState } from 'react';
import api from '@/lib/axios';

interface ExternalProduct {
    name: string;
    image: string;
    brand: string;
    gtin: string;
    description: string;
}

export default function AddByGTINPage() {
    const [gtin, setGtin] = useState('');
    const [product, setProduct] = useState<ExternalProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setProduct(null);
        setError('');
        setSuccess(false);

        try {
            // 🔄 Пример запроса — замени на реальный источник данных по GTIN
            const res = await api.get(`/external/gtin/${gtin}`);
            setProduct(res.data);
        } catch (e: any) {
            setError('Товар не найден или ошибка запроса');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!product) return;
        try {
            await api.post('/product/create', {
                name: product.name,
                image: product.image,
                brand: product.brand,
                gtin: product.gtin,
                description: product.description,
            });
            setSuccess(true);
        } catch (e) {
            alert('Ошибка при добавлении товара');
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 pt-20">
            <h1 className="text-3xl font-bold">🔍 Добавление по GTIN</h1>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Введите GTIN (штрихкод)"
                    value={gtin}
                    onChange={(e) => setGtin(e.target.value)}
                    className="flex-1 border px-4 py-2 rounded"
                />
                <button onClick={handleSearch} className="btn-primary">Поиск</button>
            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">✅ Товар успешно добавлен</p>}

            {product && (
                <div className="border rounded-xl p-6 bg-white shadow space-y-4">
                    <img src={product.image} alt={product.name} className="w-40 h-40 object-contain mx-auto" />
                    <h2 className="text-xl font-semibold text-center">{product.name}</h2>
                    <p className="text-center text-gray-600">{product.brand}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>

                    <div className="text-center">
                        <button onClick={handleAdd} className="btn-primary">➕ Добавить в каталог</button>
                    </div>
                </div>
            )}
        </div>
    );
}
