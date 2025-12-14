import pool from '../config/database';
import { Order, CreateOrderRequest } from '../types/order';

export class OrderService {
    async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const total = orderData.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Insert order
            const orderResult = await client.query(
                `INSERT INTO orders (id, customer_email, customer_name, total, status, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
                [orderId, orderData.customerEmail, orderData.customerName, total, 'pending']
            );

            // Insert order items
            for (const item of orderData.items) {
                await client.query(
                    `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
                    [orderId, item.productId, item.productName, item.price, item.quantity]
                );
            }

            await client.query('COMMIT');

            return {
                id: orderResult.rows[0].id,
                customerEmail: orderResult.rows[0].customer_email,
                customerName: orderResult.rows[0].customer_name,
                items: orderData.items,
                total: parseFloat(orderResult.rows[0].total),
                status: orderResult.rows[0].status,
                createdAt: orderResult.rows[0].created_at.toISOString(),
                paymentIntentId: orderResult.rows[0].payment_intent_id,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getOrderById(orderId: string): Promise<Order | null> {
        try {
            const orderResult = await pool.query(
                `SELECT * FROM orders WHERE id = $1`,
                [orderId]
            );

            if (orderResult.rows.length === 0) {
                return null;
            }

            const itemsResult = await pool.query(
                `SELECT product_id as "productId", product_name as "productName", price, quantity
         FROM order_items WHERE order_id = $1`,
                [orderId]
            );

            const order = orderResult.rows[0];
            return {
                id: order.id,
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                items: itemsResult.rows,
                total: parseFloat(order.total),
                status: order.status,
                createdAt: order.created_at.toISOString(),
                paymentIntentId: order.payment_intent_id,
            };
        } catch (error) {
            throw error;
        }
    }

    async updateOrderStatus(
        orderId: string,
        status: Order['status'],
        paymentIntentId?: string
    ): Promise<Order | null> {
        try {
            const query = paymentIntentId
                ? `UPDATE orders SET status = $1, payment_intent_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *`
                : `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;

            const params = paymentIntentId
                ? [status, paymentIntentId, orderId]
                : [status, orderId];

            const result = await pool.query(query, params);

            if (result.rows.length === 0) {
                return null;
            }

            return this.getOrderById(orderId);
        } catch (error) {
            throw error;
        }
    }

    async getAllOrders(): Promise<Order[]> {
        try {
            const ordersResult = await pool.query(
                `SELECT * FROM orders ORDER BY created_at DESC`
            );

            const orders: Order[] = [];

            for (const orderRow of ordersResult.rows) {
                const itemsResult = await pool.query(
                    `SELECT product_id as "productId", product_name as "productName", price, quantity
           FROM order_items WHERE order_id = $1`,
                    [orderRow.id]
                );

                orders.push({
                    id: orderRow.id,
                    customerEmail: orderRow.customer_email,
                    customerName: orderRow.customer_name,
                    items: itemsResult.rows,
                    total: parseFloat(orderRow.total),
                    status: orderRow.status,
                    createdAt: orderRow.created_at.toISOString(),
                    paymentIntentId: orderRow.payment_intent_id,
                });
            }

            return orders;
        } catch (error) {
            throw error;
        }
    }
}
