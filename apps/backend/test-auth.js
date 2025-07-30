const fetch = require('node-fetch');

async function testAuth() {
  try {
    // Test de connexion
    console.log('🔍 Test de connexion au backend...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    console.log('✅ Backend accessible:', healthResponse.status);
    
    // Test de login
    console.log('\n🔍 Test de login...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@guerlain.com',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login réussi');
      console.log('Token:', loginData.token ? 'Présent' : 'Manquant');
      
      // Test des messages avec token
      console.log('\n🔍 Test des messages avec token...');
      const messagesResponse = await fetch('http://localhost:5000/api/messages/admin/all', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Status messages:', messagesResponse.status);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        console.log('✅ Messages récupérés:', messagesData.length, 'conversations');
      } else {
        const errorData = await messagesResponse.json();
        console.log('❌ Erreur messages:', errorData);
      }
      
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Erreur login:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAuth(); 