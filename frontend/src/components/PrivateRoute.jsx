import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role = null }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/auth" />;
  }

  // Role protected
  if (role && userRole !== role) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        ⛔ Access Denied: Only {role}s allowed.
      </div>
    );
  }

  return children;
}

export default PrivateRoute;
