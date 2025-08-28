const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gemini API key not configured." })
    };
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const requestBody = JSON.parse(event.body);
    const prompt = requestBody.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required." })
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ text: text })
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from Gemini API." })
    };
  }
};