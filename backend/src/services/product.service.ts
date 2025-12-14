import pool from '../config/database';
import { Product } from '../types/product';

export async function getProducts(): Promise<Product[]> {
    try {
        const result = await pool.query(
            'SELECT id, name, description, price, category, image, file_url as "fileUrl" FROM products ORDER BY created_at DESC'
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const result = await pool.query(
            'SELECT id, name, description, price, category, image, file_url as "fileUrl" FROM products WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
        const result = await pool.query(
            `INSERT INTO products (name, description, price, category, image, file_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, description, price, category, image, file_url as "fileUrl"`,
            [product.name, product.description, product.price, product.category, product.image, product.fileUrl]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}
