import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import { deleteCourse } from "../redux/coursesSlice";
import axios from "../utils/axiosInstance";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [course, setCourse] = useState(null);
  const courses = useSelector((state) => state.courses.list);
  const role = localStorage.getItem("role");

  // Progress state (per lesson)
  const [completed, setCompleted] = useState({});
  // Section expand/collapse
  const [openSections, setOpenSections] = useState([]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("progress") || "{}");
    if (course?._id) setCompleted(saved[course._id] || {});
  }, [course?._id]);

  // Save progress to localStorage
  useEffect(() => {
    if (!course?._id) return;
    const saved = JSON.parse(localStorage.getItem("progress") || "{}");
    saved[course._id] = completed;
    localStorage.setItem("progress", JSON.stringify(saved));
  }, [completed, course?._id]);

  useEffect(() => {
    const found = courses.find((c) => String(c._id) === String(id));
    if (found) {
      setCourse(found);
    } else {
      // Fetch from backend if not found
      axios.get(`/courses/${id}`).then(res => setCourse(res.data)).catch(() => setCourse(null));
    }
  }, [id, courses]);

  if (!course) return <div className="p-4">Course not found.</div>;

  // Toggle lesson completion
  const toggleLesson = (secIdx, lesIdx) => {
    const key = `${secIdx}-${lesIdx}`;
    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Progress calculation
  const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Section expand/collapse
  const toggleSection = (idx) => {
    setOpenSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Delete course
  const handleDelete = async () => {
    if (!course?._id) return;
    try {
      await axios.delete(`/courses/${course._id}`);
      alert("Course deleted!");
      navigate("/");
    } catch (err) {
      alert("Failed to delete course");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={course.thumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={course.title}
          className="w-full md:w-64 h-40 object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <div className="mb-2 text-gray-700" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(course.description)
          }} />
          <div className="flex gap-2 mb-2">
            <span className="bg-gray-200 text-xs px-2 py-1 rounded">{course.category}</span>
            <span className="bg-gray-100 text-xs px-2 py-1 rounded">{course.difficulty}</span>
            <span className="bg-blue-100 text-xs px-2 py-1 rounded">
              {course.sections.length} sections
            </span>
          </div>
          <div className="flex gap-3 mt-2">
            {role === "admin" && (
              <>
                <Link
                  to={`/edit/${course._id}`}
                  className="text-yellow-600 hover:underline"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:underline"
                >
                  🗑 Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Progress:</span>
          <div className="w-40 h-3 bg-gray-200 rounded">
            <div
              className="h-3 bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm">{progress}%</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {completedCount} of {totalLessons} lessons completed
        </div>
      </div>

      {/* Sections & Lessons */}
      <div>
        {course.sections.map((section, secIdx) => (
          <div key={secIdx} className="mb-4 border rounded">
            <button
              className="w-full text-left px-4 py-2 bg-gray-100 font-semibold flex justify-between items-center"
              onClick={() => toggleSection(secIdx)}
            >
              <span>{section.title || `Section ${secIdx + 1}`}</span>
              <span>{openSections.includes(secIdx) ? "▲" : "▼"}</span>
            </button>
            {openSections.includes(secIdx) && (
              <div className="p-4 bg-gray-50">
                <div className="mb-2 text-gray-700">{section.description}</div>
                {section.lessons.map((lesson, lesIdx) => {
                  const key = `${secIdx}-${lesIdx}`;
                  return (
                    <div key={lesIdx} className="mb-4 border-b pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={!!completed[key]}
                          onChange={() => toggleLesson(secIdx, lesIdx)}
                        />
                        <span className="font-semibold">{lesson.title || `Lesson ${lesIdx + 1}`}</span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(lesson.content || "")
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;
