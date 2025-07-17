// backend/routes/courseRoutes.js
import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourses,
} from '../controllers/courseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses);                 // open to all
router.get('/search/:term', searchCourses);     // open to all
router.get('/:id', getCourseById);              // open to all

router.post('/', verifyToken, isAdmin, createCourse);
router.put('/:id', verifyToken, isAdmin, updateCourse);
router.delete('/:id', verifyToken, isAdmin, deleteCourse);

export default router;
