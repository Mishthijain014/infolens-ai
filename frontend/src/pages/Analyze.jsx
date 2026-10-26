
import { useState } from "react";
import api from "../services/api";
import "./Analyze.css";

function Analyze() {
  const [url, setUrl] = useState("");
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtract = async (e) => {
    e.preventDefault();

    setError("");
    setArticle(null);
    setLoading(true);

    try {
      const response = await api.post("/articles/extract", {
        url: url.trim(),
      });

      setArticle(response.data.article);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to extract article. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="analyze-page">
      <div className="analyze-container">
        <div className="analyze-header">
          <span className="analyze-label">
            CONTENT INTELLIGENCE
          </span>

          <h1>Analyze your content</h1>

          <p>
            Paste an article URL and let InfoLens extract
            the content for analysis.
          </p>
        </div>

        <form className="analyze-form" onSubmit={handleExtract}>
          <label htmlFor="article-url">
            Article URL
          </label>

          <div className="analyze-input-row">
            <input
              id="article-url"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Extracting..." : "Extract Article"}
            </button>
          </div>
        </form>

        {error && (
          <div className="analyze-error" role="alert">
            {error}
          </div>
        )}

        {article && (
          <section className="article-result">
            <div className="article-result-header">
              <span>EXTRACTED CONTENT</span>
              <span>{article.wordCount} words</span>
            </div>

            <h2>{article.title}</h2>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View original article
            </a>

            <div className="article-text">
              {article.text}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Analyze;
