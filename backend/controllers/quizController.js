import OpenAI from 'openai';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1/", // Use OpenRouter by default
});

const quizController = {
  generateQuiz: async (req, res) => {
    const { courseId, sectionIndex, lessonIndex } = req.body;

    if (!courseId || sectionIndex === undefined || lessonIndex === undefined) {
      return res.status(400).json({ message: 'Course ID, section index, and lesson index are required.' });
    }

    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }

      const lesson = course.sections[sectionIndex]?.lessons[lessonIndex];
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found.' });
      }

      const lessonContent = lesson.content || lesson.description || lesson.title;
      if (!lessonContent) {
        return res.status(400).json({ message: 'Lesson content is empty, cannot generate quiz.' });
      }

      const prompt = `Generate a multiple-choice quiz with 3-5 questions based on the following content. For each question, provide 4 options (A, B, C, D) and clearly indicate the correct answer. Format the output as a JSON array of objects, where each object has 'question', 'options' (an array of strings), and 'correctAnswer' (the letter A, B, C, or D). Ensure the questions are directly answerable from the provided text. Content: """${lessonContent}""".`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Or a suitable OpenRouter model like "mistralai/mistral-7b-instruct"
        messages: [
          { role: "system", content: "You are a helpful assistant that generates quizzes based on provided text." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const quizResponse = JSON.parse(completion.choices[0].message.content);
      res.json(quizResponse);

    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: 'Error generating quiz from AI.', error: error.message });
    }
  },
};

export default quizController;
