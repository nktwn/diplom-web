// types/index.ts

export interface Supplier {
    id: number;
    name: string;
    order_amount: number;
    free_delivery_amount: number;
    delivery_fee: number;
}

export interface Product {
    id: number;
    name: string;
    ImageUrl: string;
    lowest_product_supplier: {
        price: number;
        sell_amount: number;
        supplier: Supplier;
    };
}

export interface CartItem {
    productId: number;
    supplierId: number;
    quantity: number;
}

export interface Cart {
    supplier: Supplier;
    items: CartItem[];
}

export interface Order {
    id: number;
    status: string;
    createdAt: string;
    supplier: Supplier;
    items: CartItem[];
}

export interface User {
    id: number;
    email: string;
    name: string;
}
