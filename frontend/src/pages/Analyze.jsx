
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
  const [insights, setInsights] = useState("");
const [insightsLoading, setInsightsLoading] = useState(false);
const [insightsError, setInsightsError] = useState("");

const [question, setQuestion] = useState("");
const [qaHistory, setQaHistory] = useState([]);
const [qaLoading, setQaLoading] = useState(false);
const [qaError, setQaError] = useState("");

  const handleExtract = async (e) => {
    e.preventDefault();

    setError("");
    setArticle(null);
    setSummary(null);
    setExtracting(true);
    setInsights("");
setInsightsError("");
setQuestion("");
setQaHistory([]);
setQaError("");

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

  const handleGenerateInsights = async () => {
  if (!article?.text) return;

  setInsightsLoading(true);
  setInsightsError("");
  setInsights("");

  try {
    const response = await api.post("/insights/generate", {
      text: article.text,
    });

    setInsights(response.data.data.insights);
  } catch (error) {
    setInsightsError(
      error.response?.data?.message ||
        "Unable to generate insights. Please try again."
    );
  } finally {
    setInsightsLoading(false);
  }
};


const handleAskQuestion = async (e) => {
  e.preventDefault();

  const currentQuestion = question.trim();

  if (!article?.text || !currentQuestion || qaLoading) return;

  setQaLoading(true);
  setQaError("");
  setQuestion("");

  try {
    const response = await api.post("/insights/ask", {
      text: article.text,
      question: currentQuestion,
    });

    const newQA = {
      id: crypto.randomUUID(),
      question: currentQuestion,
      answer: response.data.data.answer,
    };

    setQaHistory((prev) => [...prev, newQA]);
  } catch (error) {
    setQuestion(currentQuestion);
    setQaError(
      error.response?.data?.message ||
        "Unable to answer your question. Please try again."
    );
  } finally {
    setQaLoading(false);
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

        
{article && (
  <section className="insights-section">
    <div className="insights-heading">
      <h2>AI Insights</h2>
      <p>
        Discover key takeaways, important facts, and conclusions.
      </p>
    </div>

    <button
      type="button"
      className="insights-button"
      onClick={handleGenerateInsights}
      disabled={insightsLoading}
    >
      {insightsLoading ? "Generating Insights..." : "Generate Insights"}
    </button>

    {insightsError && (
      <p className="insights-error" role="alert">
        {insightsError}
      </p>
    )}

    {insights && (
      <div className="insights-result">
        <h3>Generated Insights</h3>
        <div className="insights-content">{insights}</div>
      </div>
    )}
  </section>
)}


{article && (
  <section className="qa-section">
    <h2>Ask AI About This Article</h2>
    <p>
      Ask multiple questions and explore the article in detail.
    </p>

    {/* Previous questions and answers */}
    {qaHistory.length > 0 && (
      <div className="qa-history" aria-live="polite">
        {qaHistory.map((item) => (
          <div className="qa-conversation" key={item.id}>
            <div className="qa-question">
              <span className="qa-label">You asked</span>
              <p>{item.question}</p>
            </div>

            <div className="qa-answer">
              <span className="qa-label">InfoLens AI</span>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Input for next question */}
    <form onSubmit={handleAskQuestion}>
      <label htmlFor="article-question">
        Ask another question
      </label>

      <textarea
        id="article-question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your next question here..."
        maxLength={500}
        rows={3}
        required
      />

      <button
        type="submit"
        disabled={qaLoading || !question.trim()}
      >
        {qaLoading ? "Finding Answer..." : "Ask Question"}
      </button>
    </form>

    {qaError && (
      <p className="qa-error" role="alert">
        {qaError}
      </p>
    )}
  </section>
)}


      </div>
    </main>
  );
}

export default Analyze;
