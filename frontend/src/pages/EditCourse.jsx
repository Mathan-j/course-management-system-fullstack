import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editCourse } from "../redux/coursesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../utils/axiosInstance";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [course, setCourse] = useState(null);
  const courses = useSelector((state) => state.courses.list);

  useEffect(() => {
    const found = courses.find((c) => String(c._id) === String(id));
    if (found) {
      setCourse({ ...found });
    } else {
      axios.get(`/courses/${id}`).then(res => setCourse(res.data)).catch(() => setCourse(null));
    }
  }, [id, courses]);

  if (!course) return <div className="p-4">Loading course...</div>;

  const handleChange = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (secIdx, field, value) => {
    const updated = [...course.sections];
    updated[secIdx][field] = value;
    setCourse((prev) => ({ ...prev, sections: updated }));
  };

  const handleLessonChange = (secIdx, lesIdx, field, value) => {
    const updated = [...course.sections];
    updated[secIdx].lessons[lesIdx][field] = value;
    setCourse((prev) => ({ ...prev, sections: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editCourse(course)).unwrap();
      alert("✅ Course updated!");
      navigate("/");
    } catch (err) {
      alert("❌ Failed to update course");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <ReactQuill
            value={course.description}
            onChange={(val) => handleChange("description", val)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Thumbnail URL</label>
          <input
            type="text"
            value={course.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            value={course.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Programming</option>
            <option>Design</option>
            <option>Business</option>
            <option>Marketing</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <select
            value={course.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Sections */}
        <div className="space-y-6 mt-6">
          <h2 className="text-xl font-bold">Sections</h2>
          {course.sections.map((section, secIdx) => (
            <div key={secIdx} className="border p-4 rounded bg-gray-50">
              <div className="mb-2">
                <label className="block font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={section.title}
                  onChange={(e) =>
                    handleSectionChange(secIdx, "title", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Section Description</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={section.description}
                  onChange={(e) =>
                    handleSectionChange(secIdx, "description", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <h3 className="font-semibold">Lessons</h3>
                {section.lessons.map((lesson, lesIdx) => (
                  <div key={lesIdx} className="bg-white p-3 mt-2 rounded shadow-sm">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      className="w-full p-2 border mb-2 rounded"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(secIdx, lesIdx, "title", e.target.value)
                      }
                    />
                    <ReactQuill
                      theme="snow"
                      value={lesson.content}
                      onChange={(val) =>
                        handleLessonChange(secIdx, lesIdx, "content", val)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
