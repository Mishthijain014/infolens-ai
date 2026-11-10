
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./History.css";

function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/analyses");
        setAnalyses(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load analysis history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      await api.delete(`/analyses/${id}`);

      setAnalyses((prev) =>
        prev.filter((analysis) => analysis._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete analysis."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="history-page">Loading history...</div>;
  }

  return (
    <main className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <span className="history-label">YOUR WORKSPACE</span>
            <h1>My History</h1>
            <p>View and manage your saved content analyses.</p>
          </div>

          <Link to="/analyze" className="history-new-btn">
            + New Analysis
          </Link>
        </div>

        {error && (
          <p className="history-error" role="alert">
            {error}
          </p>
        )}

        {!error && analyses.length === 0 && (
          <div className="history-empty">
            <h2>No saved analyses yet</h2>
            <p>
              Analyze an article and save it to see it here.
            </p>
            <Link to="/analyze">Analyze Content</Link>
          </div>
        )}

        <div className="history-grid">
          {analyses.map((analysis) => (
            <article className="history-card" key={analysis._id}>
              <div className="history-card-top">
                <span className="history-type">
                  {analysis.summaryType === "detailed"
                    ? "Detailed Summary"
                    : "Short Summary"}
                </span>

                <span className="history-date">
                  {new Date(analysis.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <h2>{analysis.title}</h2>

              <p className="history-summary">
                {analysis.summary || "No summary available."}
              </p>

              <div className="history-actions">
                <Link
                  to={`/history/${analysis._id}`}
                  className="history-view-btn"
                >
                  View Analysis
                </Link>

                <button
                  type="button"
                  className="history-delete-btn"
                  onClick={() => handleDelete(analysis._id)}
                  disabled={deletingId === analysis._id}
                >
                  {deletingId === analysis._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default History;
