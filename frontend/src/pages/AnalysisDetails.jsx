
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./AnalysisDetails.css";

function AnalysisDetails() {
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/analyses/${id}`);
        setAnalysis(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load saved analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <main className="details-page">
        <p>Loading saved analysis...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="details-page">
        <p className="details-error">{error}</p>
        <Link to="/history">Back to History</Link>
      </main>
    );
  }

  if (!analysis) return null;

  return (
    <main className="details-page">
      <div className="details-container">
        <Link to="/history" className="details-back">
          ← Back to My History
        </Link>

        <div className="details-header">
          <span className="details-label">SAVED ANALYSIS</span>
          <h1>{analysis.title}</h1>

          <p>
            Saved on{" "}
            {new Date(analysis.createdAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>

          {analysis.sourceUrl && (
            <a
              href={analysis.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Original Article
            </a>
          )}
        </div>

        <section className="details-section">
          <h2>
            {analysis.summaryType === "detailed"
              ? "Detailed Summary"
              : "Short Summary"}
          </h2>

          <p className="details-content">
            {analysis.summary || "No summary saved."}
          </p>
        </section>

        <section className="details-section">
          <h2>AI Insights</h2>

          <div className="details-content">
            {analysis.insights || "No insights saved."}
          </div>
        </section>

        <section className="details-section">
          <h2>Question & Answer History</h2>

          {analysis.qaHistory?.length > 0 ? (
            <div className="details-qa-list">
              {analysis.qaHistory.map((item, index) => (
                <div className="details-qa-item" key={index}>
                  <div className="details-question">
                    <strong>You asked</strong>
                    <p>{item.question}</p>
                  </div>

                  <div className="details-answer">
                    <strong>InfoLens AI</strong>
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions saved for this analysis.</p>
          )}
        </section>

        <section className="details-section">
          <h2>Extracted Article Content</h2>

          <div className="details-content">
            {analysis.extractedText}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AnalysisDetails;
