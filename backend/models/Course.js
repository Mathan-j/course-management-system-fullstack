// backend/models/Course.js
import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String, // rich text
});

const sectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  category: String,
  difficulty: String,
  sections: [sectionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
