const axios = require('axios');

async function testE2E() {
  const baseURL = 'http://localhost:5000/api';
  const email = `testuser_${Date.now()}@example.com`;

  try {
    const registerResponse = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test E2E User',
      email: email,
      password: 'password123'
    });

    const token = registerResponse.data.token;
    
    console.log('Requesting AI notes from localhost server...');
    const aiResponse = await axios.post(
      `${baseURL}/ai/notes`,
      { topic: 'Quantum Computing', level: 'beginner' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✅ Notes Success!');
    console.log('Fallback active:', aiResponse.data.isFallback);
    console.log(aiResponse.data.content.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ API Test Failed!');
    if (error.response) console.error(error.response.data);
    else console.error(error.message);
  }
}

testE2E();
