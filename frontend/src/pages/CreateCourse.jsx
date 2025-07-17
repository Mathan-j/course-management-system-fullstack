import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { addCourse } from "../redux/coursesSlice";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Programming");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [sections, setSections] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddSection = () => {
    setSections([...sections, { title: "", description: "", lessons: [] }]);
  };

  const handleSectionChange = (idx, field, value) => {
    const updated = [...sections];
    updated[idx][field] = value;
    setSections(updated);
  };

  const handleRemoveSection = (idx) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleAddLesson = (secIdx) => {
    const updated = [...sections];
    updated[secIdx].lessons.push({ title: "", content: "" });
    setSections(updated);
  };

  const handleLessonChange = (secIdx, lesIdx, field, value) => {
    const updated = [...sections];
    updated[secIdx].lessons[lesIdx][field] = value;
    setSections(updated);
  };

  const handleRemoveLesson = (secIdx, lesIdx) => {
    const updated = [...sections];
    updated[secIdx].lessons = updated[secIdx].lessons.filter((_, i) => i !== lesIdx);
    setSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 10 || title.length > 60) {
      alert("Title must be between 10 and 60 characters");
      return;
    }
    if (sections.length === 0) {
      alert("Add at least one section");
      return;
    }
    for (const section of sections) {
      if (!section.title.trim()) {
        alert("Section titles cannot be empty");
        return;
      }
      for (const lesson of section.lessons) {
        if (!lesson.title.trim()) {
          alert("Lesson titles cannot be empty");
          return;
        }
      }
    }

    try {
      const course = {
        title,
        description,
        thumbnail,
        category,
        difficulty,
        sections,
      };
      await dispatch(addCourse(course)).unwrap();
      alert("✅ Course created successfully");
      navigate("/");
    } catch (err) {
      alert("❌ Failed to create course");
      console.error("Course creation error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter course title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Sections */}
        <div className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Sections</h2>
            <button
              type="button"
              className="bg-blue-600 text-white px-2 py-1 rounded"
              onClick={handleAddSection}
            >
              + Add Section
            </button>
          </div>
          {sections.map((section, secIdx) => (
            <div key={secIdx} className="border p-4 rounded bg-gray-50 mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">Section Title</label>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveSection(secIdx)}
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(secIdx, "title", e.target.value)
                }
                placeholder="Section title"
              />
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={section.description}
                onChange={(e) =>
                  handleSectionChange(secIdx, "description", e.target.value)
                }
                placeholder="Section description"
              />

              {/* Lessons */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Lessons</h3>
                <button
                  type="button"
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => handleAddLesson(secIdx)}
                >
                  + Add Lesson
                </button>
              </div>
              {section.lessons.map((lesson, lesIdx) => (
                <div
                  key={lesIdx}
                  className="bg-white p-3 mt-2 rounded shadow-sm mb-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      className="w-full p-2 border mb-2 rounded"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(secIdx, lesIdx, "title", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="text-red-500 ml-2"
                      onClick={() => handleRemoveLesson(secIdx, lesIdx)}
                    >
                      Remove
                    </button>
                  </div>
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
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
