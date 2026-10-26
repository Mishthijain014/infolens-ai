
import { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      sessionStorage.setItem(
        "infolens_token",
        response.data.token
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  
return (
  <div className="auth-page">
    <aside className="auth-brand-panel">
      <Link to="/" className="auth-logo">
        InfoLens.
      </Link>

      <div className="auth-brand-content">
        <div className="auth-feature">
          AI-POWERED CONTENT INTELLIGENCE
        </div>

        <h2>
          Turn information into understanding.
        </h2>

        <p>
          Analyze articles, documents, and videos.
          Generate meaningful summaries, uncover insights,
          and learn faster with InfoLens.
        </p>
      </div>

      <small className="text-secondary">
        © 2026 InfoLens. All rights reserved.
      </small>
    </aside>

    <main className="auth-form-panel">
      <div className="auth-form-wrapper">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Enter your details to access your workspace.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-email" className="form-label">
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  </div>
);



}

export default Login;
