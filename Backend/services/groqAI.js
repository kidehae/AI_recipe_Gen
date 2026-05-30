const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateRecipeFromAI = async (ingredients) => {
  const ingredientsString = ingredients.join(', ');

  const systemPrompt = `
    You are an expert culinary chef AI. Your job is to generate a detailed recipe based strictly on the ingredients provided by the user.
    You must respond with a raw, valid JSON object matching this exact structural format. Do not include markdown formatting, backticks (\`\`\`), or extra text outside the JSON payload:
    
    {
      "title": "Recipe Name Here",
      "ingredients": ["1 cup ingredient item with quantity", "2 units item with quantity"],
      "instructions": ["Step 1 action details.", "Step 2 action details."],
      "cookingTime": "X mins",
      "difficulty": "Easy/Medium/Hard"
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Ingredients available: ${ingredientsString}` }
      ],
      model: 'llama-3.1-8b-instant', 
      temperature: 0.5,
      response_format: { type: "json_object" } 
    });

    const rawContent = chatCompletion.choices[0].message.content;
    return JSON.parse(rawContent);
  } catch (error) {
    console.error('--- DETAILED GROQ ERROR LOG ---');
    console.error(error); 
    console.error('--------------------------------');
    
    throw new Error(`Failed to generate recipe. AI service error: ${error.message}`);
  }
};

module.exports = { generateRecipeFromAI };