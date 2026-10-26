
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../services/api";

function ProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const verifyUser = async () => {
      const token = sessionStorage.getItem("infolens_token");

      if (!token) {
        if (active) setStatus("unauthorized");
        return;
      }

      try {
        await api.get("/auth/me");
        if (active) setStatus("authorized");
      } catch {
        sessionStorage.removeItem("infolens_token");
        if (active) setStatus("unauthorized");
      }
    };

    verifyUser();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="container py-5 text-center">
        Verifying your session...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
