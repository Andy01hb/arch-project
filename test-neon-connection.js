// Test Neon Connection
const { Pool } = require('pg');

// REEMPLAZA ESTO con tu connection string de Neon
const DATABASE_URL = 'postgresql://neondb_owner:npg_qPbo86BeWlnr@ep-weathered-smoke-a40ru0l6-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('🔄 Intentando conectar a Neon...');
        console.log('Connection string:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Oculta password

        const client = await pool.connect();
        console.log('✅ ¡Conexión exitosa!');

        const result = await client.query('SELECT COUNT(*) FROM products');
        console.log(`📦 Productos en DB: ${result.rows[0].count}`);

        const products = await client.query('SELECT id, name, price FROM products LIMIT 3');
        console.log('\n🛍️ Primeros 3 productos:');
        products.rows.forEach(p => {
            console.log(`  - ${p.id}: ${p.name} ($${p.price})`);
        });

        client.release();
        await pool.end();

        console.log('\n✅ Test completado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error de conexión:');
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        console.error('\nStack completo:');
        console.error(error);
        process.exit(1);
    }
}

testConnection();
