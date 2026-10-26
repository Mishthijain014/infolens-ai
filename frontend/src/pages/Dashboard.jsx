
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/auth/me")
      .then((response) => {
        if (active) setUser(response.data.user);
      })
      .catch(() => {
        if (active) setError("Unable to load your profile.");
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("infolens_token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>InfoLens Dashboard</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {user ? (
        <div className="card p-4 mt-4">
          <h2 className="h4">Welcome, {user.name}!</h2>
          <p className="mb-1">Email: {user.email}</p>
          <p className="text-secondary">
            Your InfoLens account is ready.
          </p>
        </div>
      ) : (
        !error && <p className="mt-4">Loading profile...</p>
      )}
    </div>
  );
}

export default Dashboard;
