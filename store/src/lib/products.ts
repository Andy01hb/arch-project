import { getProducts as getProductsFromApi, getProductById as getProductByIdFromApi, Product } from './api';

export type { Product };

export async function getProducts(): Promise<Product[]> {
    try {
        return await getProductsFromApi();
    } catch (error) {
        console.error("Error fetching products from API:", error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | undefined> {
    try {
        return await getProductByIdFromApi(id);
    } catch (error) {
        console.error("Error fetching product from API:", error);
        return undefined;
    }
}
