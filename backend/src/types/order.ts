export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    customerEmail: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    paymentIntentId?: string;
}

export interface CreateOrderRequest {
    customerEmail: string;
    customerName: string;
    items: OrderItem[];
}
