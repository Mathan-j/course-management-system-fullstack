import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, searchCourses, fetchCourses } from "../redux/coursesSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const searchTerm = useSelector((state) => state.courses.searchTerm);

  const handleSearch = (e) => {
    const term = e.target.value;
    dispatch(setSearchTerm(term));
    if (term) {
      dispatch(searchCourses(term));
    } else {
      dispatch(fetchCourses());
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <nav className="bg-blue-700 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold tracking-tight">
          🎓 CourseManager
        </Link>

        <div className="flex gap-6 items-center">
          {token && (
            <>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-3 py-1 rounded-md text-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <Link
                to="/"
                className={`text-white hover:text-blue-200 transition ${
                  location.pathname === "/" ? "underline" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`text-white hover:text-blue-200 transition ${
                  location.pathname === "/dashboard" ? "underline" : ""
                }`}
              >
                Dashboard
              </Link>
              {role === "admin" && (
                <Link
                  to="/create"
                  className="bg-white text-blue-700 px-4 py-1 rounded font-semibold shadow hover:bg-blue-100 transition"
                >
                  + New Course
                </Link>
              )}
              <button onClick={handleLogout} className="text-white hover:underline">
                Logout
              </button>
            </>
          )}

          {!token && (
            <Link to="/auth" className="text-white hover:text-blue-200 transition">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
