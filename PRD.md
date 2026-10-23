InfoLens --- Product Requirements Document (PRD)
Document type: Product Requirements Document
Product: InfoLens
Status: Proposed baseline
Primary purpose: Convert varied content sources into editable,
AI-generated summaries and exportable deliverables.
1. Product Overview
InfoLens is a content intelligence website that helps users understand
long-form content faster. A user provides an article URL, RSS feed URL,
YouTube URL, or supported file. The system extracts the available text,
processes it with the Google Gemini API, and presents a summary,
insights, and a question-and-answer experience. Users can edit or
regenerate the summary and export it as a PDF, DOCX, or PowerPoint
presentation.
2. Problem Statement
Users often need to read or review information across multiple formats.
Manually extracting key points, summarizing content, and turning it into
a report or presentation can be time-consuming. InfoLens aims to
centralize this workflow in one interface.
3. Goals and Success Criteria
Product goals
- Support multiple content input types through a consistent workflow.
- Produce useful abstractive summaries with short and detailed length
  options.
- Surface key insights and support questions about submitted content.
- Let users edit generated summaries before export.
- Generate polished PowerPoint presentations using selectable
  templates.
- Keep each user's saved content and history private to that account.
Suggested success measures
- Successful extraction rate by source type.
- Percentage of analyses completed without an error.
- Time from submission to first usable summary.
- Percentage of summaries edited or exported.
- Export success rate for PDF, DOCX, and PPTX.
- User return rate to saved content history.
Targets should be defined after a baseline is measured.
4. Target Users
- Students preparing notes, reports, and presentations.
- Researchers and analysts reviewing multiple sources.
- Professionals who need concise summaries of articles, documents, or
  videos.
- Content teams who need a starting point for briefs and
  presentations.
5. Scope
In scope
1. User signup and login.
2. Content submission from:
   - Article URL
   - RSS feed URL
   - YouTube URL
   - Supported file uploads
3. Text extraction and normalization.
4. AI-powered abstractive summary generation using Google Gemini API.
5. Short and detailed summary options.
6. Key insights generation.
7. Q&A grounded in the extracted content.
8. Summary editing and regeneration.
9. Export to PDF and DOCX.
10. PowerPoint generation with two initial templates, preview, and PPTX
    export.
11. Saved content and analysis history.
12. Error handling for invalid, inaccessible, or unsupported content.
Out of scope for the initial release
- Guaranteed extraction from private, paywalled, or access-restricted
  sources.
- Guaranteed transcription of every YouTube video.
- Collaborative real-time editing.
- Public sharing links and team workspaces.
- More than two initial presentation templates.
- PowerPoint exports exceeding 7 slides.
- Claims that AI output is always accurate or complete.
6. Functional Requirements
FR-01: User account
- Users can create an account using name, email, and password.
- Users can log in and log out.
- The system validates required fields and handles duplicate email
  addresses.
- Passwords are stored as secure hashes, never as plaintext.
- Protected routes and APIs require authentication.
Acceptance criteria: A registered user can log in and access their
own dashboard; an unauthenticated user cannot access protected history.
FR-02: Add content
- Users can submit an article URL, RSS feed URL, YouTube URL, or
  supported file.
- The interface validates required input before submission.
- The backend validates input independently of frontend checks.
- The UI displays extraction and processing states.
Acceptance criteria: Supported input is accepted for extraction;
invalid or unsupported input receives a clear, actionable error.
FR-03: Text extraction
- Article URLs are converted into readable article text where access
  permits.
- RSS feeds are parsed into feed items, allowing the user to select or
  process an appropriate item.
- YouTube content uses an accessible transcript/caption source where
  available.
- Supported documents are parsed into text.
- Extracted text is normalized before AI processing.
Acceptance criteria: The system either returns usable extracted text
or explains why extraction failed. It does not silently generate a
summary from empty or unrelated content.
FR-04: AI summary
- The system sends extracted text and selected options to the Gemini
  API through the backend.
- Users choose Short or Detailed summary.
- Summary generation uses an abstractive approach rather than only
  copying sentences.
- The result is displayed in an editable interface.
- The system handles timeouts, rate limits, and provider errors.
Acceptance criteria: The generated summary matches the selected
length preference as closely as practical and can be edited before
export.
FR-05: Insights
- The system generates key takeaways or insights from the submitted
  content.
- Insights should be traceable to the provided material where
  practical.
- The UI distinguishes generated insights from the source text.
Acceptance criteria: Insights are displayed separately from the
summary, with a useful error state if generation fails.
FR-06: Q&A
- Users can submit questions about the analyzed content.
- Answers should be grounded in extracted content and should
  acknowledge when the source does not contain enough information.
- The UI shows loading and error states.
Acceptance criteria: A question receives an answer based on the
analyzed source, or a clear message that the available content is
insufficient.
FR-07: Edit and regenerate
- Users can edit the generated summary.
- Users can request a regenerated summary.
- The current edited text should not be overwritten without a clear
  user action.
- Export should use the version the user has chosen to keep.
Acceptance criteria: Users can edit text and export the edited
version; regeneration has a clear loading state and preserves the prior
version until replacement is accepted.
FR-08: PDF and DOCX export
- Users can export the current summary to PDF or DOCX.
- The export includes the summary and may include title/source
  metadata where available.
- Export errors are communicated clearly.
Acceptance criteria: The downloaded file opens in its intended
format and contains the current summary text.
FR-09: PowerPoint generation
- Users can initiate PPT generation from the summary/content analysis.
- The system creates a presentation with a maximum of 7 slides.
- Users can choose Template 1 or Template 2.
- Users can preview the generated slides before export.
- Users can export the final deck as PPTX.
Acceptance criteria: The user can select a template, preview the
deck, and download a PPTX with no more than 7 slides. The preview
reflects the selected template and content.
FR-10: Saved content history
- Authenticated users can save source details, extracted content where
  appropriate, summary, insights, and timestamps.
- Users can view their own saved history and reopen an item.
- Users must not be able to view another user's saved content.
Acceptance criteria: History is scoped to the authenticated user on
the server, not merely filtered in the browser.
7. Main User Journey
1. User signs up or logs in.
2. User opens the dashboard and adds a source.
3. The backend validates the source and extracts text.
4. The backend calls Gemini for summary and, as requested, insights.
5. The user chooses short or detailed summary and reviews the result.
6. The user edits or regenerates the summary and can use Q&A.
7. The user exports PDF/DOCX, or starts PPT generation.
8. For PPT, the user chooses Template 1 or Template 2.
9. The user previews the presentation and exports a PPTX of up to 7
   slides.
10. The system saves the content and analysis to the user's history,
    subject to the save behavior chosen in the UI.
8. Non-Functional Requirements
- Security: Hash passwords, protect secrets, authorize every
  user-owned record, validate uploads and URLs.
- Privacy: Explain what is stored and avoid retaining source
  material longer than needed without a product reason.
- Performance: Show progress states for extraction and generation;
  set reasonable request timeouts.
- Reliability: Handle provider outages, malformed input, and
  partial failures gracefully.
- Usability: Use clear labels, loading indicators, empty states,
  and accessible controls.
- Maintainability: Keep source extraction, AI processing, exports,
  and account logic in separate modules.
- Compatibility: Support current mainstream desktop and mobile
  browsers, subject to testing.
9. Data Requirements
Suggested entities:
- User: name, email, password hash, created timestamp.
- ContentItem: user ID, source type, source URL or file metadata,
  title, processing status, timestamps.
- Analysis: content item ID, summary, summary length mode,
  insights, model/provider metadata, timestamps.
- QuestionAnswer: analysis ID, question, answer, timestamp
  (optional for MVP).
- ExportRecord: analysis ID, export type, status, timestamp
  (optional for MVP).
Use ownership references and server-side authorization for all
user-specific records. Avoid storing raw files indefinitely unless
required.
10. Risks and Mitigations
  Risk                                Mitigation
  Article blocks scraping or requires Explain access limitation and offer
  login                               file/paste input where supported

  YouTube transcript unavailable      Return a specific message; do not
                                      pretend the video was processed

  Gemini rate limit or outage         Retry only when appropriate, show a
                                      useful error, and preserve user
                                      input

  AI output contains inaccuracies     Allow editing and advise users to
                                      verify important claims

  Malicious URL or file               Validate inputs, restrict file
                                      types and sizes, defend against
                                      SSRF, and scan/parse safely

  Large content exceeds model limits  Apply size limits and use chunking
                                      or a clear rejection message
  Presentation content overflows      Summarize slide content, validate
  slides                              layout, and preview before export
11. Open Decisions
- Exact supported upload formats and file-size/page limits.
- Whether RSS input processes one selected item or a batch.
- Whether summaries are saved automatically or only on user action.
- Whether Q&A history is persisted.
- Exact behavior for PPT editing after preview.
- Production hosting, retention policy, and account recovery approach.