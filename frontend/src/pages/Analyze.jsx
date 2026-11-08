
import { useState } from "react";
import api from "../services/api";
import "./Analyze.css";

function Analyze() {
  const [url, setUrl] = useState("");
  const [article, setArticle] = useState(null);
  const [summaryType, setSummaryType] = useState("short");
  const [summary, setSummary] = useState(null);

  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleExtract = async (e) => {
    e.preventDefault();

    setError("");
    setArticle(null);
    setSummary(null);
    setExtracting(true);

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
      setExtracting(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!article?.text) return;

    setError("");
    setSummary(null);
    setGenerating(true);

    try {
      const response = await api.post("/summaries/generate", {
        text: article.text,
        summaryType,
      });

      setSummary(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate summary. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="analyze-page">
      <div className="analyze-container">
        <div className="analyze-header">
          <span className="analyze-label">CONTENT INTELLIGENCE</span>
          <h1>Analyze your content</h1>
          <p>
            Extract article content and generate AI-powered summaries.
          </p>
        </div>

        <form className="analyze-form" onSubmit={handleExtract}>
          <label htmlFor="article-url">Article URL</label>

          <div className="analyze-input-row">
            <input
              id="article-url"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <button type="submit" disabled={extracting || generating}>
              {extracting ? "Extracting..." : "Extract Article"}
            </button>
          </div>
        </form>

        {error && (
          <div className="analyze-error" role="alert">
            {error}
          </div>
        )}

        {article && (
          <>
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

              <div className="article-text">{article.text}</div>
            </section>

            <section className="summary-controls">
              <h2>Generate AI Summary</h2>

              <p>Choose your preferred summary length.</p>

              <div className="summary-options">
                <label>
                  <input
                    type="radio"
                    name="summaryType"
                    value="short"
                    checked={summaryType === "short"}
                    onChange={(e) => {
                      setSummaryType(e.target.value);
                      setSummary(null);
                    }}
                    disabled={generating}
                  />
                  Short Summary
                </label>

                <label>
                  <input
                    type="radio"
                    name="summaryType"
                    value="detailed"
                    checked={summaryType === "detailed"}
                    onChange={(e) => {
                      setSummaryType(e.target.value);
                      setSummary(null);
                    }}
                    disabled={generating}
                  />
                  Detailed Summary
                </label>
              </div>

              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={generating || extracting}
                className="generate-summary-btn"
              >
                {generating ? "Generating..." : "Generate Summary"}
              </button>
            </section>
          </>
        )}

        {summary && (
          <section className="summary-result">
            <div className="summary-result-header">
              <span>AI GENERATED SUMMARY</span>
              <span>{summary.summaryWordCount} words</span>
            </div>

            <h2>
              {summary.summaryType === "short"
                ? "Short Summary"
                : "Detailed Summary"}
            </h2>

            <div className="summary-text">{summary.summary}</div>

            {summary.inputTruncated && (
              <p className="summary-warning">
                This summary is based on the first part of the article
                because the source exceeded the input limit.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default Analyze;
