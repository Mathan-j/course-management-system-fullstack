import Course from '../models/Course.js';
import mongoose from 'mongoose';

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: 'Create failed', error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

export const searchCourses = async (req, res) => {
  const { term } = req.params;
  try {
    const courses = await Course.find({
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
      ],
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json(course);
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }
  const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json(course);
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }
  const course = await Course.findByIdAndDelete(id);
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted successfully' });
};
