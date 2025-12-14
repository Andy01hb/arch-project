import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('--- Diagnóstico de Conexión DB ---');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Password Length: ${process.env.DB_PASSWORD?.length}`);
console.log(`Password (first/last char): ${process.env.DB_PASSWORD?.[0]}...${process.env.DB_PASSWORD?.slice(-1)}`);

const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function testConnection() {
    try {
        console.log('\nIntentando conectar...');
        await client.connect();
        console.log('✅ ¡CONEXIÓN EXITOSA!');

        const res = await client.query('SELECT NOW()');
        console.log('Hora del servidor DB:', res.rows[0].now);

        await client.end();
    } catch (err: any) {
        console.error('\n❌ ERROR DE CONEXIÓN:');
        console.error(`Código: ${err.code}`);
        console.error(`Mensaje: ${err.message}`);
        if (err.code === '28P01') {
            console.error('-> La contraseña es incorrecta.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('-> No se puede conectar al servidor (Host/Puerto incorrecto).');
        } else if (err.code === '3D000') {
            console.error('-> La base de datos no existe.');
        }
        process.exit(1);
    }
}

testConnection();
