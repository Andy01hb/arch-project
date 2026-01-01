-- Neon Database Migration Script
-- Run this in Neon SQL Editor after creating your database

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image VARCHAR(500),
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Insert sample products (only if table is empty)
INSERT INTO products (name, description, price, category, image, file_url)
SELECT * FROM (VALUES
    ('Bloque Dinámico: Puerta Residencial', 'Puerta abatible con parámetros de ancho, alto y tipo de marco. Incluye vista en planta y alzado.', 4.99, 'Arquitectura', '/images/door_preview.jpg', 'protected/door_v1.dwg'),
    ('Set de Vegetación 2D', 'Colección de 50 árboles y arbustos en vista planta y alzado. Bloques escalables.', 12.50, 'Paisajismo', '/images/trees_preview.jpg', 'protected/trees_set.dwg'),
    ('Detalle Estructural: Zapata Aislada', 'Detalle constructivo de zapata aislada con armado parametrico.', 8.00, 'Estructura', '/images/footing_preview.jpg', 'protected/footing.dwg')
) AS v(name, description, price, category, image, file_url)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT 'Products table created' AS status, COUNT(*) AS product_count FROM products
UNION ALL
SELECT 'Orders table created' AS status, COUNT(*) AS order_count FROM orders
UNION ALL
SELECT 'Order items table created' AS status, COUNT(*) AS order_item_count FROM order_items;
