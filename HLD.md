InfoLens --- High-Level Design (HLD)
Document type: High-Level Design
Product: InfoLens
Status: Proposed architecture
Architecture style: Modular web application with a backend API and
external AI provider.
1. Purpose
This document describes the proposed system structure for InfoLens, the
responsibility of each major component, and the flow of content from
submission through extraction, AI processing, editing, storage, and
export.
2. Architecture Overview
                         INFO LENS WEB CLIENT
              (HTML, CSS, JavaScript, Bootstrap, Vite)
                               |
                         HTTPS / REST API
                               |
                       NODE.JS + EXPRESS
                               |
       +-----------------------+-------------------------+
       |                       |                         |
  Auth & User Service    Content/Extraction Service   Analysis Service
       |                       |                         |
       |                 URL / RSS / YouTube /      Google Gemini API
       |                 Document adapters               |
       |                       |                    Summary / Insights /
       |                 Normalized text                  Q&A
       |                       |                         |
       +-----------------------+-------------------------+
                               |
                         Persistence Layer
                         MongoDB + Mongoose
                               |
                    Export & Presentation Service
                               |
                     PDF / DOCX / PPTX generator
                               |
                  Template selection and preview
                               |
                       Download final artifact
3. Major Components
3.1 Frontend
Suggested technologies: HTML, CSS, vanilla JavaScript, Bootstrap
where useful, and Vite.

Responsibilities: - Signup, login, logout, and dashboard screens. -
Source selection and submission forms. - Extraction and AI processing
progress states. - Summary, insights, and Q&A presentation. - Editable
summary interface and regeneration controls. - PDF/DOCX export
controls. - PPT template selection, slide preview, and PPTX export. -
Saved content history.

The frontend must not contain the Gemini API key or database
credentials. Client-side validation improves usability but does not
replace backend validation.
3.2 Backend API
Suggested technologies: Node.js and Express.js.

Responsibilities: - Expose authenticated REST endpoints. - Validate
request payloads, URLs, and uploads. - Coordinate extraction, Gemini
requests, persistence, and export. - Enforce ownership and access
control for saved records. - Normalize errors and return consistent API
responses. - Apply request limits, timeouts, and rate limiting.

Keep routes/controllers thin and place business logic in service
modules.
3.3 Authentication and Authorization
Responsibilities: - Register users and hash passwords using a suitable
password-hashing library. - Authenticate login requests. - Issue and
validate a secure session or token. - Protect private endpoints. -
Enforce record ownership for content, analyses, and exports.

For browser-based applications, use secure, HttpOnly cookies where
feasible, with appropriate SameSite and CSRF protections. If bearer
tokens are chosen instead, define secure storage and expiry/refresh
behavior deliberately.
3.4 Content Extraction Service
Use a source adapter per input type:
- Article adapter: Fetch and parse accessible web pages into
  readable text.
- RSS adapter: Parse the feed and identify its entries.
- YouTube adapter: Obtain an accessible transcript/caption when
  available.
- Document adapter: Validate and parse supported uploaded document
  formats.
Responsibilities: - Validate and normalize the input. - Enforce upload
and content-size limits. - Extract title, source metadata, and readable
text when available. - Return a normalized extraction result. - Fail
explicitly when content is unavailable.

A normalized result may contain:
{
  "sourceType": "article",
  "sourceUrl": "https://example.com/article",
  "title": "Example article",
  "text": "Extracted readable content...",
  "extractionStatus": "completed"
}
This is an illustrative contract, not a fixed implementation.
3.5 AI Analysis Service
Provider: Google Gemini API.

Responsibilities: - Send extracted content and the requested output mode
to Gemini. - Generate abstractive summaries in short or detailed
mode. - Generate key insights. - Answer questions using the analyzed
source as context. - Handle token/context limits, provider errors, and
rate limits. - Validate and normalize the returned output before sending
it to the frontend.

Recommended separation: - summaryService - insightsService -
questionAnswerService

Do not assume model output is trustworthy or valid JSON unless the
response is validated. Prompts should treat source text as untrusted
data and should not follow instructions embedded in the source.
3.6 Persistence Layer
Suggested technology: MongoDB with Mongoose.

Proposed collections:
- users
- contentItems
- analyses
- questionAnswers (optional)
- exportRecords (optional)
Store user ownership on each user-specific record. Add indexes for
common queries, such as user ID and creation time. Define a retention
policy for uploaded files and extracted text.
3.7 Export and Presentation Service
Responsibilities: - Export the current user-approved summary to PDF or
DOCX. - Convert summary and insights into a slide outline. - Keep PPTX
output at 7 slides maximum. - Apply Template 1 or Template 2. -
Produce a preview before final download. - Generate the final PPTX only
after the user confirms the preview.

The template renderer should separate slide content from visual styling
so either template can be applied to the same structured slide data.
4. End-to-End Data Flow
Flow A: Content analysis
1. User submits an article URL, RSS URL, YouTube URL, or file.
2. Frontend sends the source to the backend over HTTPS.
3. Backend authenticates the user and validates the request.
4. Extraction service selects the correct adapter.
5. Adapter returns normalized text and metadata, or a clear extraction
   error.
6. Analysis service sends the text and requested summary mode to
   Gemini.
7. Gemini returns summary content; insight generation may run as a
   separate request.
8. Backend validates the output and returns it to the frontend.
9. Frontend displays summary, insights, and Q&A entry point.
10. Content and analysis are saved according to the product's save
    behavior.
Flow B: Edit and regenerate
1. User edits the displayed summary in the browser.
2. The frontend keeps the current edit in state.
3. On save/export, the edited version is sent to the backend where
   persistence is required.
4. If regeneration is requested, the backend generates a new candidate.
5. The user can review the candidate before replacing the current
   version.
Flow C: PDF/DOCX export
1. User chooses PDF or DOCX.
2. Backend verifies access to the analysis and receives the current
   summary version.
3. Export service formats the summary and relevant metadata.
4. Backend returns a downloadable file or a short-lived download URL.
5. UI reports success or displays an actionable error.
Flow D: PPT generation
1. User chooses PowerPoint generation.
2. Backend creates a structured slide outline from the approved
   content.
3. Slide count is validated to be no more than 7.
4. User selects Template 1 or Template 2.
5. Renderer applies the template to the slide outline.
6. Frontend displays a preview.
7. User confirms export.
8. PPTX generator creates the file and returns it for download.
5. Suggested API Surface
These endpoints are illustrative and should be aligned with the
implemented code.
  Method                  Endpoint                         Purpose
  POST                    /api/auth/signup               Create account

  POST                    /api/auth/login                Authenticate user

  POST                    /api/auth/logout               End session

  GET                     /api/auth/me                   Get current user

  POST                    /api/content/extract           Validate source and
                                                           extract text

  POST                    /api/analyses                  Generate summary and
                                                           requested analysis

  POST                    /api/analyses/:id/regenerate   Generate a new summary
                                                           candidate

  PATCH                   /api/analyses/:id              Save edited summary

  POST                    /api/analyses/:id/questions    Ask a question about
                                                           the content

  GET                     /api/history                   List current user's
                                                           saved items

  GET                     /api/history/:id               Retrieve one owned item

  POST                    /api/exports/pdf               Create PDF export

  POST                    /api/exports/docx              Create DOCX export

  POST                    /api/presentations/preview     Build a preview for a
                                                           chosen template

  POST                    /api/presentations/export      Generate PPTX, maximum
                                                       7 slides
Use consistent status codes and error response shapes. Validate
authentication and resource ownership on every private endpoint.
6. Suggested Data Model
User
- _id
- name
- email (unique index)
- passwordHash
- createdAt
- updatedAt
ContentItem
- _id
- userId
- sourceType (article, rss, youtube, file)
- sourceUrl (optional)
- title
- fileMetadata (optional)
- extractionStatus
- createdAt
- updatedAt
Analysis
- _id
- userId
- contentItemId
- summary
- summaryMode (short, detailed)
- insights (array or structured object)
- modelMetadata (non-secret provider/model information)
- createdAt
- updatedAt
QuestionAnswer (optional)
- _id
- userId
- analysisId
- question
- answer
- createdAt
ExportRecord (optional)
- _id
- userId
- analysisId
- format (pdf, docx, pptx)
- status
- createdAt
7. Security and Operational Considerations
- Keep API keys and database credentials in server-side environment
  variables or a secrets manager.
- Never commit .env files or credentials.
- Protect against server-side request forgery (SSRF) when fetching
  user-provided URLs; block loopback, private, link-local, and cloud
  metadata destinations, and revalidate redirects.
- Validate upload MIME type, extension, size, and parser behavior; do
  not trust client-provided MIME alone.
- Add rate limits and per-user quotas to expensive extraction and AI
  endpoints.
- Set request and provider timeouts; avoid unbounded retries.
- Use HTTPS in deployment and secure cookie settings where applicable.
- Avoid logging passwords, API keys, full private documents, or
  unnecessary personal data.
- Check user ownership in the backend before reading, updating, or
  exporting saved records.
- Treat extracted content as untrusted input to the AI model.
- Record operational errors without exposing stack traces or secrets
  to end users.
8. Error Handling
Use a consistent error response, for example:
{
  "error": {
    "code": "EXTRACTION_UNAVAILABLE",
    "message": "We couldn't extract text from this source. Try another URL or upload a supported file."
  }
}
Handle at least: - Invalid input or URL. - Unsupported file type or
oversized file. - No accessible article text or transcript. - Gemini
rate limit, timeout, or provider outage. - Empty or malformed AI
response. - Unauthorized access or missing record. - Export or
presentation-rendering failure.

Preserve the user's submitted input and current edited summary when an
operation fails.
9. Deployment View
A typical deployment can use: - Static frontend hosting for the
Vite-built website. - A Node.js hosting environment for the Express
API. - Managed MongoDB for persistence. - Server-side environment
configuration for Gemini and database credentials. - HTTPS, application
logs, monitoring, and backups appropriate to the chosen host.

The frontend should call the deployed backend through a configured API
base URL. Configure CORS to allow only the intended frontend origins.
10. Key Architecture Decisions and Trade-offs
- Modular monolith vs. microservices: Start with a modular Express
  backend to reduce deployment complexity. Separate services only when
  scale or team ownership justifies the overhead.
- Server-side vs. browser-side AI calls: Use server-side Gemini
  calls to protect credentials and centralize rate limits, at the cost
  of maintaining backend infrastructure.
- Store extracted text vs. re-extract on every visit: Storing
  normalized text can improve repeat access and Q&A, but increases
  storage and privacy responsibilities.
- Generate PPT before or after template selection: Use structured
  slide content plus a separate renderer so templates can change
  without re-running all analysis.
- Preview before export: Adds a step, but gives users control over
  layout and content before downloading.
11. Architecture Diagram Summary
User
  |
  v
Frontend (Vite + HTML/CSS/JavaScript)
  |
  v
Express API ---- Authentication ---- MongoDB
  |
  +---- Extraction adapters
  |       +---- Article
  |       +---- RSS
  |       +---- YouTube transcript
  |       +---- Document parser
  |
  +---- Gemini analysis
  |       +---- Short/Detailed summary
  |       +---- Insights
  |       +---- Q&A
  |
  +---- Editable analysis persistence
  |
  +---- Export service
          +---- PDF
          +---- DOCX
          +---- PPTX (max 7 slides)
                    +---- Template 1 / Template 2
                    +---- Preview
                    +---- Final export