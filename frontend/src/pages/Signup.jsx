
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const response = await api.post("/auth/signup", form);

      sessionStorage.setItem(
        "infolens_token",
        response.data.token
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
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
          YOUR AI-POWERED RESEARCH WORKSPACE
        </div>

        <h2>
          Less reading. More understanding.
        </h2>

        <p>
          Transform articles, documents, and videos into
          clear summaries, actionable insights, and answers.
          Everything you need to learn smarter, in one place.
        </p>
      </div>

      <small className="text-secondary">
        © 2026 InfoLens. All rights reserved.
      </small>
    </aside>

    <main className="auth-form-panel">
      <div className="auth-form-wrapper">
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Start turning information into insights.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={60}
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
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

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              autoComplete="new-password"
              required
            />
            <small className="text-secondary">
              Must contain at least 8 characters.
            </small>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  </div>
);

}

export default Signup;
