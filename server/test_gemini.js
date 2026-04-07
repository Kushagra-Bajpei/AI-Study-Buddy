const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function findWorkingModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelsToTest = [
    "gemini-2.5-flash", 
    "gemini-2.0-flash", 
    "gemini-flash-latest",
    "gemma-2-9b-it",
    "gemini-1.5-pro",
    "gemini-pro-latest"
  ];

  console.log("Searching for a reliable working Gemini model...");
  let successCount = 0;

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'hello' in exactly one word");
      const response = await result.response;
      console.log(`✅ SUCCESS: ${modelName} -> ${response.text().trim()}`);
      successCount++;
    } catch (error) {
      console.log(`❌ FAILED: ${modelName} -> ${error.message.substring(0, 80)}...`);
    }
  }

  if (successCount === 0) {
    console.log("⚠️ All tested models failed. This is likely an account-level quota issue or Google servers are down.");
  }
}

findWorkingModel();
