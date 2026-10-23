InfoLens
InfoLens is an AI-powered content intelligence platform that turns
articles, RSS feeds, YouTube videos, and uploaded documents into
editable summaries and useful insights. Users can review or regenerate
the summary, ask questions about the content, and export the result to
PDF, DOCX, or PowerPoint.
Core Features
- Multiple input sources: Article URL, RSS Feed URL, YouTube URL,
  and uploaded files.
- Text extraction: Extract readable text or transcripts from
  supported sources before AI processing.
- AI processing: Use the Google Gemini API for abstractive
  summarization and content analysis.
- Summary length: Let users choose a short or detailed summary.
- Insights and Q&A: Generate key insights and answer questions
  grounded in the submitted content.
- Edit and regenerate: Allow users to revise a generated summary
  and request another version.
- Export: Download summaries as PDF or DOCX.
- PowerPoint generation: Choose a presentation template, preview
  the slides, and export a PPTX containing a maximum of 7 slides.
- User account and history: Save content and revisit previous
  analyses.
User Flow
1. Sign up or log in.
2. Add content using an article URL, RSS feed, YouTube URL, or file
   upload.
3. Extract text from the source.
4. Process the extracted content with the Google Gemini API.
5. View the summary, insights, and Q&A options.
6. Edit or regenerate the summary.
7. Export as PDF/DOCX, or start PowerPoint generation.
8. For PowerPoint, choose Template 1 or Template 2, preview the
   presentation, and export a PPTX of up to 7 slides.
9. Save the content and analysis to the user's history.
Proposed Technology Stack
The stack below reflects the current project direction and can be
adjusted as implementation evolves.
- Frontend: HTML, CSS, vanilla JavaScript, Bootstrap where useful,
  and Vite for local development.
- Backend: Node.js and Express.js.
- AI: Google Gemini API.
- Database: MongoDB with Mongoose for users and saved content
  history.
- Authentication: Secure password hashing and session/token-based
  authentication.
- Document processing: Format-specific parsers for supported
  document types and a transcript/caption extraction strategy for
  YouTube.
- Exports: Server-side or client-side libraries for PDF, DOCX, and
  PPTX generation.
Keep Gemini API credentials on the server. Do not expose secret API
keys in frontend JavaScript or commit them to Git.

Getting Started
Prerequisites
- Node.js and npm
- A MongoDB database (local or hosted)
- A Google Gemini API key
Setup
The exact commands depend on the repository's current folder structure.
For a typical split frontend/backend setup:
git clone https://github.com/Mishthijain014/InfoLens.git
cd InfoLens
Install dependencies in each application folder after confirming the
repository's actual package.json files:
cd Frontend
npm install
npm run dev
In another terminal, install and start the backend using the scripts
defined in its package.json.

Configure backend environment variables in a local .env file. Example
names:
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=replace_with_a_long_random_secret
These are illustrative variable names; align them with the actual code.
Never commit .env.
Suggested Repository Documentation
- README.md --- project overview and local setup.
- PRD.md --- product requirements, scope, user stories, and
  acceptance criteria.
- HLD.md --- high-level architecture, components, and data flow.
Important Constraints
- PowerPoint exports must contain no more than 7 slides.
- Users must be able to review and edit a generated summary before
  exporting.
- The user should be able to choose short or detailed summary
  generation.
- The PPT flow must include template selection and preview
  before export.
- If a source cannot be extracted (for example, a video has no
  accessible transcript), show a clear error and offer an alternative
  input method.
Security and Reliability Notes
- Validate URLs and uploaded file types and sizes on the backend.
- Apply authentication and authorization checks to saved content and
  history.
- Rate-limit AI and extraction endpoints, handle provider errors, and
  avoid logging secrets.
- Treat external article text and uploaded files as untrusted input.
- Make it clear that AI-generated summaries and insights may need
  human verification.