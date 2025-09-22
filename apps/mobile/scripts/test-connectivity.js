#!/usr/bin/env node

/**
 * Script de test de connectivité pour Dar Darkom Mobile
 * Teste la connectivité entre l'app mobile et le serveur backend
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const TEST_URLS = [
  'http://192.168.1.74:5000',
  'http://192.168.1.100:5000',
  'http://192.168.1.101:5000',
  'http://192.168.1.102:5000',
  'http://10.0.0.1:5000',
  'http://172.16.0.1:5000',
  'http://localhost:5000'
];

const TEST_ENDPOINTS = [
  '/api/me',
  '/api/products',
  '/health'
];

// Fonction pour tester une URL
async function testUrl(baseUrl, endpoint = '') {
  return new Promise((resolve) => {
    const url = new URL(endpoint, baseUrl);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          success: true,
          status: res.statusCode,
          url: url.href,
          responseTime: Date.now() - startTime,
          data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        url: url.href
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout après 10 secondes',
        url: url.href
      });
    });

    const startTime = Date.now();
    req.end();
  });
}

// Fonction principale
async function runTests() {
  console.log('🔧 Test de connectivité Dar Darkom Mobile\n');
  console.log('=' .repeat(50));
  
  for (const baseUrl of TEST_URLS) {
    console.log(`\n🌐 Test de ${baseUrl}`);
    console.log('-'.repeat(30));
    
    // Test de base
    const baseResult = await testUrl(baseUrl);
    if (baseResult.success) {
      console.log(`✅ Connexion réussie (${baseResult.status}) - ${baseResult.responseTime}ms`);
    } else {
      console.log(`❌ Échec: ${baseResult.error}`);
      continue;
    }
    
    // Test des endpoints
    for (const endpoint of TEST_ENDPOINTS) {
      const endpointResult = await testUrl(baseUrl, endpoint);
      if (endpointResult.success) {
        console.log(`  ✅ ${endpoint} (${endpointResult.status}) - ${endpointResult.responseTime}ms`);
        if (endpointResult.data) {
          console.log(`     📄 Données: ${endpointResult.data}`);
        }
      } else {
        console.log(`  ❌ ${endpoint}: ${endpointResult.error}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 Résumé des recommandations:');
  console.log('1. Vérifiez que le serveur backend est démarré');
  console.log('2. Vérifiez que le port 5000 n\'est pas bloqué par le pare-feu');
  console.log('3. Assurez-vous que l\'appareil mobile et l\'ordinateur sont sur le même réseau');
  console.log('4. Utilisez l\'IP qui fonctionne dans api-config.ts');
}

// Exécuter les tests
runTests().catch(console.error);


