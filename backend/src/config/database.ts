import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Support both DATABASE_URL (Neon/Heroku style) and individual variables (local dev)
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Neon and most cloud providers
        }
    })
    : new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'arch_project',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });

console.log(`Database connection mode: ${process.env.DATABASE_URL ? 'DATABASE_URL (Production)' : 'Individual vars (Local)'}`);

// Test connection immediately
(async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        const result = await client.query('SELECT NOW()');
        console.log(`📅 Database time: ${result.rows[0].now}`);
        client.release();
    } catch (error) {
        console.error('❌ Failed to connect to PostgreSQL database');
        console.error('Error details:', error);
        // Don't exit, let the app try to reconnect later
    }
})();

// Test connection
pool.on('connect', () => {
    console.log('🔌 New client connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    // Don't exit immediately, log and continue
});

export default pool;

