import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const categories = ['Programming', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const courseKeywords = ['Introduction', 'Mastering', 'Deep Dive', 'Fundamentals', 'Advanced', 'Practical', 'Complete Guide'];
const subjectKeywords = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'UI/UX', 'Marketing Analytics', 'Project Management', 'Machine Learning'];

const generateRandomLesson = (lessonNum) => ({
  title: `Lesson ${lessonNum}: ${subjectKeywords[Math.floor(Math.random() * subjectKeywords.length)]} Concept`,
  description: `This lesson covers a key concept in ${subjectKeywords[Math.floor(Math.random() * subjectKeywords.length)]}.`,
  content: `Detailed content for Lesson ${lessonNum}. This is a placeholder for a comprehensive explanation of the topic.`, // rich text
});

const generateRandomSection = (sectionNum) => ({
  title: `Section ${sectionNum}: ${courseKeywords[Math.floor(Math.random() * courseKeywords.length)]} Topics`,
  description: `This section explores various ${courseKeywords[Math.floor(Math.random() * courseKeywords.length)]} aspects.`,
  lessons: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => generateRandomLesson(i + 1)), // 2-4 lessons per section
});

const generateRandomCourse = (index) => {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const randomCourseKeyword = courseKeywords[Math.floor(Math.random() * courseKeywords.length)];
  const randomSubjectKeyword = subjectKeywords[Math.floor(Math.random() * subjectKeywords.length)];

  return {
    title: `${randomCourseKeyword} ${randomSubjectKeyword} Course ${index + 1}`,
    description: `A comprehensive course on ${randomSubjectKeyword} focusing on ${randomCourseKeyword.toLowerCase()} concepts.`,
    thumbnail: `https://picsum.photos/seed/${index}/200/300`,
    category: randomCategory,
    difficulty: randomDifficulty,
    sections: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => generateRandomSection(i + 1)), // 2-4 sections per course
  };
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Course.deleteMany({});
    console.log('Existing courses deleted');

    const numberOfCoursesToGenerate = Math.floor(Math.random() * 21) + 20; // Generates between 20 and 40 courses
    const generatedCourses = Array.from({ length: numberOfCoursesToGenerate }, (_, i) => generateRandomCourse(i));

    await Course.insertMany(generatedCourses);
    console.log(`Successfully seeded ${numberOfCoursesToGenerate} courses!`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedDB();