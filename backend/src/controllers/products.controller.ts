import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: error.message || 'Error creating product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const success = await ProductService.deleteProduct(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};
