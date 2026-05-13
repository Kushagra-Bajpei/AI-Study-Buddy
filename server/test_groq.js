const OpenAI = require("openai");
require("dotenv").config();

async function testGroq() {
  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  console.log("Testing Groq API connectivity...");

  try {
    const response = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: 'Say "Groq is active!" in exactly three words' }
      ],
    });

    console.log(`✅ SUCCESS: Groq responded -> "${response.choices[0].message.content.trim()}"`);
  } catch (error) {
    console.error(`❌ FAILED: Groq API error -> ${error.message}`);
  }
}

testGroq();
