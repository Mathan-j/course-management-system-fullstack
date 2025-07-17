import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Pie chart colors
const COLORS = ["#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa"];

// Memoized PieChart for performance
const CategoryPieChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
));

function Dashboard() {
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courses.list);

  // Stats
  const totalCourses = courses.length;
  const byCategory = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      map[c.category] = (map[c.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [courses]);

  // Completion
  const progressData = useMemo(() => {
    const progress = JSON.parse(localStorage.getItem("progress") || "{}");
    let completedCourses = 0;
    courses.forEach((course) => {
      const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);
      const completedCount = progress[course._id]
        ? Object.values(progress[course._id]).filter(Boolean).length
        : 0;
      if (totalLessons && completedCount === totalLessons) completedCourses++;
    });
    return {
      completed: completedCourses,
      inProgress: totalCourses - completedCourses,
    };
  }, [courses, totalCourses]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-800 transition"
          onClick={() => navigate("/create")}
        >
          + Create New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-900">{totalCourses}</div>
          <div className="text-blue-700">Total Courses</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-300 rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-900">{progressData.completed}</div>
          <div className="text-green-700">Completed Courses</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-bold text-yellow-900">{progressData.inProgress}</div>
          <div className="text-yellow-700">In Progress</div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">Course Distribution by Category</h2>
        {byCategory.length === 0 ? (
          <div className="text-gray-500 text-center">No data</div>
        ) : (
          <CategoryPieChart data={byCategory} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;