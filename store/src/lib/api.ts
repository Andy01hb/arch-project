const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    fileUrl: string;
}

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

// Products API
export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error('Failed to create product');
    }

    return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete product');
    }
}

// Orders API
export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return response.json();
}

export async function getOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }
    return response.json();
}

// Payment API
export async function createPaymentIntent(orderId: string): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create payment intent');
    }

    return response.json();
}
