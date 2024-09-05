import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { emailSnippet } = req.body;

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an email classification assistant. Classify emails into categories: Important, Promotions, Social, Marketing, Spam, or General.',
          },
          {
            role: 'user',
            content: `Classify the following email snippet into one of the categories: Important, Promotions, Social, Marketing, Spam, General. If none of the categories match, use General.\n\nEmail Snippet: "${emailSnippet}"\nClassification:`,
          },
        ],
        max_tokens: 10,
        temperature: 0,
      });

      const classification = response.data.choices[0].message.content.trim();

      res.status(200).json({ classification });
    } catch (error) {
      console.error('Error classifying email:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to classify email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
