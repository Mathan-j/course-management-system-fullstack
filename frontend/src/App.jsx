import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCourses } from "./redux/coursesSlice";

import Home from "./pages/Home";
import CreateCourse from "./pages/CreateCourse";
import CourseDetail from "./pages/CourseDetail";
import EditCourse from "./pages/EditCourse";
import Dashboard from "./pages/Dashboard";
import LoginSignup from "./pages/LoginSignup";
import ExplainConcept from "./pages/ExplainConcept";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./components/PrivateRoute";
import './index.css';

function App() {
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pb-10">
        <ErrorBoundary>
          <Routes>
            {/* Public Route */}
            <Route path="/auth" element={<LoginSignup />} />

            {/* Protected Routes (any logged-in user) */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:id"
              element={
                <PrivateRoute>
                  <CourseDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/explain-concept"
              element={
                <PrivateRoute>
                  <ExplainConcept />
                </PrivateRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/create"
              element={
                <PrivateRoute role="admin">
                  <CreateCourse />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute role="admin">
                  <EditCourse />
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  );
}

export default App;
