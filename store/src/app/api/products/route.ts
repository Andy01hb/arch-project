import { getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// For future: POST, PUT, DELETE methods to manage products
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // In a real app, save to database
        // For now, just return success
        return NextResponse.json({ success: true, product: body });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
