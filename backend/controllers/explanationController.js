import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1/",
});

const explanationController = {
  getExplanation: async (req, res) => {
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({ message: 'Concept is required' });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // You can choose other models like "gpt-4o"
        messages: [
          { role: "system", content: "You are a helpful assistant that explains concepts clearly and concisely." },
          { role: "user", content: `Explain the concept of: ${concept}` }
        ],
      });

      const explanation = completion.choices[0].message.content;
      res.json({ explanation });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      res.status(500).json({ message: 'Error fetching explanation from AI.' });
    }
  },
};

export default explanationController;
