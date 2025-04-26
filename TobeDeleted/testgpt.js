require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
//console.log(apiKey);

const apiUrl = 'https://api.openai.com/v1/chat/completions';

async function getChatGPTResponse(prompt) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching data:', error);
    return 'An error occurred while processing your request.';
  }
}

// Example usage:
const userPrompt = 'List all the cardinals of the catholic church in Africa, their countries and their ages';

getChatGPTResponse(userPrompt)
  .then(response => {
    console.log(response);
  });
