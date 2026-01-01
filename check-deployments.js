#!/usr/bin/env node

/**
 * Script de Verificación de Deployments
 * Verifica el estado de todos los servicios del proyecto Arch Project
 */

const https = require('https');

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const BACKEND_URL = 'https://arch-backend-90c5.onrender.com';
const ENDPOINTS = {
    health: '/api/health',
    products: '/api/products'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const responseTime = Date.now() - startTime;
                resolve({
                    statusCode: res.statusCode,
                    data: data,
                    responseTime: responseTime
                });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function checkBackend() {
    log('\n🖥️  Verificando Backend (Render)...', 'cyan');
    log('━'.repeat(50), 'cyan');

    try {
        // Health Check
        log('\n1. Health Check Endpoint', 'blue');
        const healthUrl = `${BACKEND_URL}${ENDPOINTS.health}`;
        const healthResponse = await makeRequest(healthUrl);

        if (healthResponse.statusCode === 200) {
            log(`   ✅ Status: ${healthResponse.statusCode}`, 'green');
            log(`   ⏱️  Response Time: ${healthResponse.responseTime}ms`, 'green');

            try {
                const healthData = JSON.parse(healthResponse.data);
                log(`   📊 Uptime: ${Math.floor(healthData.uptime)}s`, 'green');
                log(`   🌍 Environment: ${healthData.environment}`, 'green');
            } catch (e) {
                log(`   ⚠️  Could not parse health data`, 'yellow');
            }
        } else {
            log(`   ❌ Status: ${healthResponse.statusCode}`, 'red');
        }

        // Products Endpoint
        log('\n2. Products Endpoint', 'blue');
        const productsUrl = `${BACKEND_URL}${ENDPOINTS.products}`;
        const productsResponse = await makeRequest(productsUrl);

        if (productsResponse.statusCode === 200) {
            log(`   ✅ Status: ${productsResponse.statusCode}`, 'green');
            log(`   ⏱️  Response Time: ${productsResponse.responseTime}ms`, 'green');

            try {
                const products = JSON.parse(productsResponse.data);
                log(`   📦 Products Count: ${products.length}`, 'green');
            } catch (e) {
                log(`   ⚠️  Could not parse products data`, 'yellow');
            }
        } else {
            log(`   ❌ Status: ${productsResponse.statusCode}`, 'red');
        }

        log('\n✅ Backend verification complete', 'green');
        return true;

    } catch (error) {
        log(`\n❌ Backend Error: ${error.message}`, 'red');
        log('   Possible causes:', 'yellow');
        log('   - Backend is down or restarting', 'yellow');
        log('   - Network connectivity issues', 'yellow');
        log('   - Render service suspended', 'yellow');
        return false;
    }
}

function checkFrontend() {
    log('\n🌐 Verificando Frontend (Vercel)...', 'cyan');
    log('━'.repeat(50), 'cyan');

    log('\n⚠️  Frontend check requires manual verification:', 'yellow');
    log('   1. Open your Vercel deployment URL in browser', 'yellow');
    log('   2. Check that the page loads correctly', 'yellow');
    log('   3. Verify products are displayed', 'yellow');
    log('   4. Test navigation and cart functionality', 'yellow');

    log('\n📋 Vercel Dashboard:', 'blue');
    log('   https://vercel.com/dashboard', 'cyan');
}

function checkDatabase() {
    log('\n🗄️  Verificando Base de Datos (Neon)...', 'cyan');
    log('━'.repeat(50), 'cyan');

    log('\n⚠️  Database check requires manual verification:', 'yellow');
    log('   1. Go to https://console.neon.tech', 'yellow');
    log('   2. Check that the project is active', 'yellow');
    log('   3. Verify database size and connections', 'yellow');
    log('   4. Run test query in SQL Editor', 'yellow');

    log('\n📋 Neon Console:', 'blue');
    log('   https://console.neon.tech', 'cyan');
}

function printSummary(backendOk) {
    log('\n📊 Resumen de Verificación', 'cyan');
    log('━'.repeat(50), 'cyan');

    log(`\nBackend (Render):     ${backendOk ? '✅ OK' : '❌ FAILED'}`, backendOk ? 'green' : 'red');
    log('Frontend (Vercel):    ⚠️  Manual Check Required', 'yellow');
    log('Database (Neon):      ⚠️  Manual Check Required', 'yellow');

    log('\n🔗 Enlaces Útiles:', 'blue');
    log(`   Backend:  ${BACKEND_URL}`, 'cyan');
    log('   Render:   https://dashboard.render.com', 'cyan');
    log('   Vercel:   https://vercel.com/dashboard', 'cyan');
    log('   Neon:     https://console.neon.tech', 'cyan');

    if (!backendOk) {
        log('\n⚠️  Acciones Recomendadas:', 'yellow');
        log('   1. Check Render logs for errors', 'yellow');
        log('   2. Verify environment variables', 'yellow');
        log('   3. Check database connectivity', 'yellow');
        log('   4. Consider manual redeploy', 'yellow');
    }
}

async function main() {
    log('\n╔════════════════════════════════════════════════╗', 'cyan');
    log('║   Arch Project - Deployment Status Check      ║', 'cyan');
    log('╚════════════════════════════════════════════════╝', 'cyan');

    const backendOk = await checkBackend();
    checkFrontend();
    checkDatabase();
    printSummary(backendOk);

    log('\n✨ Verification complete!\n', 'green');

    process.exit(backendOk ? 0 : 1);
}

main().catch(error => {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
});
