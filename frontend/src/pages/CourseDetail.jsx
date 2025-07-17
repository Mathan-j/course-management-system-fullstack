import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import { deleteCourse } from "../redux/coursesSlice";
import axios from "../utils/axiosInstance";
import Quiz from "../components/Quiz";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const courses = useSelector((state) => state.courses.list);
  const role = localStorage.getItem("role");

  // Progress state (per lesson)
  const [completed, setCompleted] = useState({});
  // Section expand/collapse
  const [openSections, setOpenSections] = useState([]);
  const [openQuiz, setOpenQuiz] = useState(null);

  useEffect(() => {
    const found = courses.find((c) => String(c._id) === String(id));
    if (found) {
      setCourse({ ...found });
      setLoading(false);
    } else {
      axios.get(`/courses/${id}`)
        .then(res => {
          setCourse(res.data);
        })
        .catch(() => {
          setCourse(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, courses]);

  const totalLessons = course && course.sections ? course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0) : 0;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Save progress to localStorage
  useEffect(() => {
    if (!course?._id) return;
    const saved = JSON.parse(localStorage.getItem("progress") || "{}");
    saved[course._id] = completed;
    localStorage.setItem("progress", JSON.stringify(saved));

    // Check if course is completed and save to completedCourses
    if (progress === 100 && totalLessons > 0) {
      const completedCourses = JSON.parse(localStorage.getItem("completedCourses") || "[]");
      if (!completedCourses.includes(course._id)) {
        localStorage.setItem("completedCourses", JSON.stringify([...completedCourses, course._id]));
      }
    }
  }, [completed, course?._id, progress, totalLessons]);

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

  // Find the next uncompleted lesson
  const findNextLesson = () => {
    if (!course || !course.sections) return null;
    for (let secIdx = 0; secIdx < course.sections.length; secIdx++) {
      const section = course.sections[secIdx];
      for (let lesIdx = 0; lesIdx < section.lessons.length; lesIdx++) {
        const key = `${secIdx}-${lesIdx}`;
        if (!completed[key]) {
          return { sectionIndex: secIdx, lessonIndex: lesIdx, lesson: section.lessons[lesIdx] };
        }
      }
    }
    return null; // All lessons completed
  };

  

  

  const toggleSection = (index) => {
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(index)
        ? prevOpenSections.filter((i) => i !== index)
        : [...prevOpenSections, index]
    );
  };

  const toggleLesson = (sectionIndex, lessonIndex) => {
    const key = `${sectionIndex}-${lessonIndex}`;
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [key]: !prevCompleted[key],
    }));
  };

  const nextLesson = findNextLesson();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={course?.thumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={course?.title}
          className="w-full md:w-64 h-40 object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{course?.title}</h1>
          <div className="mb-2 text-gray-700" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(course?.description || "")
          }} />
          <div className="flex gap-2 mb-2">
            <span className="bg-gray-200 text-xs px-2 py-1 rounded">{course?.category}</span>
            <span className="bg-gray-100 text-xs px-2 py-1 rounded">{course?.difficulty}</span>
            <span className="bg-blue-100 text-xs px-2 py-1 rounded">
              {course?.sections?.length} sections
            </span>
          </div>
          <div className="flex gap-3 mt-2">
            {role === "admin" && (
              <>
                <Link
                  to={`/edit/${course?._id}`}
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
        <h2 className="text-lg font-semibold mb-2">Progress: {progress}%</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {nextLesson && (
          <div className="mt-2 text-sm text-gray-600">
            Next up:{" "}
            <a href={`#lesson-${nextLesson.sectionIndex}-${nextLesson.lessonIndex}`} className="text-blue-600 underline">
              {nextLesson.lesson.title}
            </a>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {course?.sections?.map((section, secIdx) => (
          <div key={secIdx} className="border rounded">
            <button
              className="w-full text-left p-4 font-semibold flex justify-between items-center"
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
                    <div key={lesIdx} id={`lesson-${secIdx}-${lesIdx}`} className="mb-4 border-b pb-3">
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
                      <button
                        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                        onClick={() => setOpenQuiz({ secIdx, lesIdx })}
                      >
                        Take Quiz
                      </button>
                      {openQuiz && openQuiz.secIdx === secIdx && openQuiz.lesIdx === lesIdx && (
                        <div className="mt-4">
                          <Quiz
                            courseId={course._id}
                            sectionIndex={secIdx}
                            lessonIndex={lesIdx}
                          />
                        </div>
                      )}
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