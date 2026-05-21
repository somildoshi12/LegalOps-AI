# Portfolio Project Plan: LegalOps AI Deployment Hub

## Target Company
**Glade.ai — Forward Deployed Engineer**

## Project Goal
Build a production-style legal workflow automation platform that demonstrates the exact responsibilities expected from a Forward Deployed Engineer at Glade.ai: client-facing workflow discovery, full-stack engineering, AI agent development, legal document generation, deployment readiness, evaluation frameworks, production debugging, and product feedback loops.

This project should feel like a small but realistic version of what Glade deploys inside law firms.

---

# 1. Project Name

## LegalOps AI Deployment Hub

### One-Line Portfolio Description
A full-stack AI legal operations platform that helps law firms convert messy intake forms and case documents into structured case records, generated legal drafts, automated workflows, risk flags, and deployment-quality evaluation reports.

### Resume-Friendly Version
Built a full-stack AI legal workflow automation platform using React, TypeScript, Node.js, PostgreSQL, and LLM agents to automate intake analysis, document generation, task routing, evaluation, and production debugging for law-firm operations.

---

# 2. Why This Project Fits Glade.ai Perfectly

Glade.ai is looking for a Forward Deployed Engineer who can work directly with law firms, understand workflows, build AI-powered tools, deploy them into real environments, debug production issues, and translate customer feedback into product improvements.

This project is designed to prove each of those abilities through one polished portfolio deployment.

## Job Description Box-Ticking Matrix

| Glade.ai Requirement | How This Project Demonstrates It |
|---|---|
| Full-stack engineering | React + TypeScript frontend, Node.js backend, PostgreSQL database, REST APIs, authentication-ready architecture |
| TypeScript | Entire frontend and backend written in TypeScript |
| React | Client-facing dashboard, legal intake UI, document review screens, admin panel |
| Node.js | Backend APIs, agent orchestration, document workflows, logging, evaluation endpoints |
| AI systems deployment | Hosted demo with deployed frontend, backend, database, and AI workflow pipeline |
| LLM integration | OpenAI/Claude API integration for legal intake summarization, drafting, classification, and reasoning |
| AI agents | Multi-step legal workflow agent for intake review, document extraction, task routing, draft generation, and QA checks |
| Prompt engineering | Versioned prompt templates for different legal tasks and client workflows |
| Evaluation frameworks | Automated quality scoring for generated legal drafts, hallucination checks, citation checks, and structured output validation |
| Legal document generation | Generate demand letters, case summaries, client memos, intake summaries, and attorney review drafts |
| Workflow automation | Convert intake data into tasks, deadlines, case stages, and document actions |
| Case management | Case dashboard with matter status, client details, documents, generated drafts, and task tracking |
| Production debugging | Admin/debug console showing agent traces, failed steps, latency, token usage, API errors, and retry history |
| Client-facing engineering | Include a “Law Firm Setup Wizard” that simulates onboarding a client workflow |
| Customer discovery | Add workflow discovery templates and sample interview notes for law firms |
| Product feedback loops | Feedback button on every AI output; attorney ratings are stored and used in analytics |
| Startup/0-to-1 mindset | MVP-style product with strong UX, fast iteration, demo video, and public deployment |
| Communication skills | Add plain-English explanations for non-technical attorneys and paralegals |
| Cursor/Claude/AI-assisted coding | Mention AI-assisted development workflow in README and engineering notes |
| Production-ready mindset | Logging, validation, role-based views, rate-limit awareness, error states, and deployment docs |

---

# 3. Core Product Concept

LegalOps AI Deployment Hub is a mini legal automation platform for law firms.

It allows a law firm to:

1. Submit a new client intake form.
2. Upload legal documents such as contracts, complaints, demand letters, or case notes.
3. Extract structured information from the uploaded documents.
4. Classify the matter type.
5. Generate an attorney-ready case summary.
6. Generate a first-draft legal document.
7. Create workflow tasks for attorneys/paralegals.
8. Run AI quality checks before attorney review.
9. Track every AI workflow step through an admin debugging console.
10. Capture attorney feedback to improve future outputs.

The project should not claim to provide legal advice. It should clearly position AI outputs as draft assistance for attorney review.

---

# 4. Best Legal Use Case to Build

## Recommended Use Case: Personal Injury Intake + Demand Letter Drafting

This is the strongest use case because it is easy to understand, highly workflow-driven, document-heavy, and realistic for law-firm automation.

### Example Workflow

A personal injury law firm receives a potential client intake submission.

The system should:

1. Parse client intake details.
2. Identify injury type, incident date, liable party, insurance details, medical treatment, damages, and missing information.
3. Summarize the case for an attorney.
4. Classify case priority.
5. Generate a missing-information checklist.
6. Create paralegal tasks.
7. Draft an attorney-reviewed demand letter.
8. Run quality checks on the draft.
9. Show agent traces and debugging logs.

This directly aligns with Glade’s focus on filings, case management, document generation, workflow automation, legal operations, and AI deployment.

---

# 5. Main Features

## Feature 1: Law Firm Onboarding / Workflow Discovery Wizard

### Purpose
Show that you understand the client-facing part of the Forward Deployed Engineer role.

### User Flow
The user selects:

- Law firm type
- Practice area
- Intake workflow
- Required documents
- Preferred draft format
- Review process
- Paralegal task structure
- Risk tolerance

### Screens

- Firm Profile Setup
- Practice Area Selection
- Workflow Mapping
- Document Template Preferences
- AI Output Review Settings

### Why This Matters
This proves you can analyze law firm workflows before implementation instead of only building generic software.

---

## Feature 2: Client Intake Portal

### Purpose
Simulate how a paralegal or intake specialist enters new client data.

### Fields

- Client name
- Contact details
- Incident date
- Incident location
- Injury description
- Medical treatment received
- Insurance company
- Opposing party
- Police report available
- Witness details
- Uploaded documents
- Urgency level

### AI Output

- Intake summary
- Case type classification
- Missing information checklist
- Risk flags
- Recommended next steps

---

## Feature 3: Legal Document Upload + Extraction

### Purpose
Show document-heavy AI workflow automation.

### Supported Files

- PDF
- DOCX
- TXT

### Extraction Pipeline

1. Upload document.
2. Extract text.
3. Chunk document.
4. Run structured extraction.
5. Save extracted fields in database.
6. Display confidence score.

### Extracted Fields

- Parties
- Dates
- Locations
- Claim details
- Medical providers
- Insurance information
- Damages
- Legal deadlines
- Missing evidence

### Technical Notes
Use:

- `pdf-parse` for PDF extraction
- `mammoth` for DOCX extraction
- LLM structured output for legal field extraction
- Zod validation for extracted JSON

---

## Feature 4: AI Legal Workflow Agent

### Purpose
Show agentic workflow experience.

### Agent Steps

1. Read intake form.
2. Read uploaded documents.
3. Extract structured facts.
4. Classify matter type.
5. Identify missing information.
6. Generate attorney case summary.
7. Generate paralegal task list.
8. Draft legal document.
9. Run evaluation checks.
10. Store final output and trace logs.

### Recommended Implementation
Use a simple custom agent orchestrator first instead of overcomplicating with too many frameworks.

Optional advanced version:

- LangGraph.js
- LangChain.js
- OpenAI function calling / tool calling
- Claude tool use

### Agent Tools

- `extractCaseFacts()`
- `classifyMatter()`
- `generateCaseSummary()`
- `generateMissingInfoChecklist()`
- `generateDemandLetter()`
- `runDraftEvaluation()`
- `logAgentTrace()`

---

## Feature 5: Legal Document Generation

### Purpose
Directly match Glade’s document generation and legal workflow automation focus.

### Generated Documents

MVP should support:

1. Attorney case summary
2. Client intake memo
3. Missing information checklist
4. Demand letter draft
5. Paralegal task list

### Demand Letter Sections

- Header
- Parties
- Incident summary
- Liability summary
- Injuries and treatment
- Damages
- Settlement demand placeholder
- Supporting evidence checklist
- Attorney review disclaimer

### Important Disclaimer
Every generated document must include:

> Draft generated for attorney review. This output is not legal advice and should be verified by a licensed attorney before use.

---

## Feature 6: Case Management Dashboard

### Purpose
Show that you can build user-facing tools for legal operations.

### Dashboard Components

- Case list
- Case status
- Matter type
- Assigned reviewer
- Generated documents
- Open tasks
- Missing information
- Risk flags
- AI confidence score
- Last updated timestamp

### Case Status Options

- New Intake
- AI Reviewed
- Missing Info Needed
- Attorney Review
- Draft Generated
- Ready for Filing/Follow-Up
- Closed

---

## Feature 7: Task Automation Engine

### Purpose
Show workflow automation and operational thinking.

### Example Auto-Generated Tasks

- Request medical records from client
- Verify insurance policy number
- Ask client for photos of incident
- Confirm date of treatment
- Review demand letter draft
- Attorney approval required
- Follow up in 7 days

### Task Fields

- Task title
- Owner role
- Priority
- Due date
- Linked case
- AI-generated reason
- Completion status

---

## Feature 8: AI Evaluation Framework

### Purpose
This is one of the most important features because the job description explicitly mentions evaluation frameworks and quality benchmarking.

### Evaluation Types

#### 1. Structured Output Validation
Check whether LLM output follows the required schema.

#### 2. Completeness Score
Check whether generated drafts include required sections.

#### 3. Grounding Score
Check whether important claims are grounded in uploaded intake/document facts.

#### 4. Missing Information Detection
Check whether the system identifies gaps instead of inventing details.

#### 5. Legal Safety Check
Flag risky phrases such as definitive legal conclusions without attorney review.

#### 6. Hallucination Check
Compare generated statements against extracted facts.

#### 7. Attorney Review Score
Allow user rating:

- Accurate
- Needs minor edits
- Needs major edits
- Unusable

### Evaluation Dashboard

Show:

- Draft quality score
- Grounding score
- Completeness score
- Schema validation status
- Hallucination warnings
- Latency
- Token usage
- Cost estimate
- Attorney feedback

---

## Feature 9: Production Debugging Console

### Purpose
This directly targets Glade’s production support and debugging requirement.

### Debug Console Should Show

- Agent run ID
- Case ID
- Each agent step
- Step status
- Prompt version used
- Model used
- Latency per step
- Token usage
- API cost estimate
- Error messages
- Retry count
- Raw structured output
- Validation failures
- Final output status

### Debug Views

1. Agent Trace Timeline
2. Failed Runs
3. Slowest Runs
4. Highest Cost Runs
5. Prompt Version Comparison
6. User Feedback Analytics

### Why This Is Powerful
Most portfolio projects only show AI output. This project shows that you can deploy, monitor, debug, and improve AI systems in production-like environments.

---

## Feature 10: Product Feedback Loop

### Purpose
Show that you can translate field insights into product improvements.

### Feedback Features

For every AI-generated output, attorneys can select:

- Accept draft
- Minor edits needed
- Major edits needed
- Incorrect facts
- Missing important details
- Tone too formal
- Tone too weak
- Needs stronger legal structure

### Feedback Analytics

Display:

- Most common failure types
- Average attorney approval score
- Prompt versions with best scores
- Matter types with highest failure rate
- Documents needing most edits

### Product Thinking Add-On
Add a “Recommended Product Improvements” page where the app automatically summarizes feedback trends into product roadmap suggestions.

Example:

> Attorneys frequently flagged missing medical treatment details in demand letters. Recommended improvement: add a dedicated medical timeline extraction step before draft generation.

---

# 6. Recommended Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- TanStack Query
- Recharts

## Backend

- Node.js
- TypeScript
- Express.js or NestJS
- Prisma ORM
- PostgreSQL
- Zod validation
- JWT/session-ready auth structure

## AI Layer

- OpenAI API or Anthropic Claude API
- Prompt templates
- Structured JSON output
- Tool/function calling
- Optional LangChain.js or LangGraph.js

## Document Processing

- pdf-parse
- mammoth
- multer
- text chunking utility

## Evaluation Layer

- Custom scoring functions
- Zod schema validation
- LLM-as-judge evaluator
- Grounding checker
- Prompt version tracking

## Deployment

Recommended simple deployment:

- Frontend: Vercel
- Backend: Render or Railway
- Database: Supabase PostgreSQL or Neon PostgreSQL
- File storage: Supabase Storage or local demo storage

Advanced deployment:

- Docker
- GitHub Actions
- Fly.io / Render / Railway
- Sentry-style logging placeholder

---

# 7. System Architecture

```text
User / Law Firm Staff
        |
        v
React + TypeScript Frontend
        |
        v
Node.js + TypeScript API
        |
        |---- PostgreSQL Database
        |---- Document Parser
        |---- AI Agent Orchestrator
        |---- Prompt Registry
        |---- Evaluation Engine
        |---- Debug Logging Service
        |
        v
LLM Provider API
        |
        v
Generated Legal Drafts + Tasks + Evaluations + Debug Traces
```

---

# 8. Database Schema

## tables

### firms

- id
- name
- practice_area
- workflow_type
- preferred_tone
- review_policy
- created_at

### cases

- id
- firm_id
- client_name
- matter_type
- incident_date
- status
- priority
- summary
- risk_score
- created_at
- updated_at

### documents

- id
- case_id
- file_name
- file_type
- extracted_text
- extracted_json
- confidence_score
- created_at

### generated_outputs

- id
- case_id
- output_type
- content
- prompt_version
- model_name
- evaluation_score
- created_at

### tasks

- id
- case_id
- title
- owner_role
- priority
- due_date
- reason
- status
- created_at

### agent_runs

- id
- case_id
- status
- model_name
- total_latency_ms
- total_tokens
- estimated_cost
- error_message
- created_at

### agent_steps

- id
- agent_run_id
- step_name
- status
- input_summary
- output_summary
- latency_ms
- tokens_used
- error_message
- created_at

### evaluations

- id
- generated_output_id
- schema_valid
- completeness_score
- grounding_score
- hallucination_risk
- safety_score
- final_score
- notes
- created_at

### feedback

- id
- generated_output_id
- reviewer_role
- rating
- feedback_type
- comments
- created_at

---

# 9. Main Pages for Portfolio Demo

## 1. Landing Page

Show product value clearly:

- AI-powered law firm workflow automation
- Intake to draft in minutes
- Human-in-the-loop attorney review
- Built for legal operations reliability

## 2. Law Firm Setup Wizard

Demonstrates client workflow discovery.

## 3. New Intake Page

Form for entering case details and uploading documents.

## 4. Case Dashboard

Shows all active matters and status.

## 5. Case Detail Page

Includes:

- Client details
- Extracted facts
- Documents
- AI summary
- Missing information
- Tasks
- Drafts
- Evaluation results

## 6. Document Generation Page

Generate:

- Intake memo
- Case summary
- Demand letter
- Checklist

## 7. Evaluation Dashboard

Shows AI quality metrics.

## 8. Debug Console

Shows production-style agent traces and failures.

## 9. Feedback Analytics Page

Shows attorney feedback trends and product improvement suggestions.

## 10. Demo Dataset Page

Add sample legal intake cases so recruiters can test the project without uploading files.

---

# 10. MVP Scope

Build this first.

## MVP Features

1. React + TypeScript frontend
2. Node.js + TypeScript backend
3. PostgreSQL database
4. Intake form
5. PDF/TXT upload
6. AI extraction
7. Case summary generation
8. Demand letter draft generation
9. Missing information checklist
10. Task generation
11. Evaluation score
12. Debug trace logging
13. Deployed demo
14. Clean README
15. Demo video

## MVP Pages

1. Landing Page
2. Intake Page
3. Case Dashboard
4. Case Detail Page
5. Debug Console
6. Evaluation Dashboard

---

# 11. Advanced Features

Add these after MVP.

1. DOCX support
2. Prompt version comparison
3. Attorney feedback analytics
4. Multi-firm configuration
5. Role-based views for attorney/paralegal/admin
6. LLM provider switcher: OpenAI vs Claude
7. Export generated draft as DOCX/PDF
8. RAG over uploaded case documents
9. Calendar deadline extraction
10. Product roadmap recommendation engine

---

# 12. AI Prompt Design

## Prompt Categories

1. Intake summarization prompt
2. Legal fact extraction prompt
3. Matter classification prompt
4. Missing information prompt
5. Demand letter generation prompt
6. Evaluation prompt
7. Product feedback summarization prompt

## Prompt Versioning

Store each prompt with:

- prompt_id
- version
- task_type
- system_prompt
- user_prompt_template
- created_at
- performance_score

## Example Prompt Tasks

### Fact Extraction
Return structured JSON with:

- client
- opposing_party
- incident_date
- incident_location
- injuries
- treatment
- insurance
- damages
- missing_information
- risk_flags

### Demand Letter Drafting
Generate a formal draft using only provided facts. If facts are missing, insert placeholders instead of inventing details.

### Evaluation
Score the generated document for completeness, factual grounding, safety, and attorney-readiness.

---

# 13. Evaluation Framework Details

## Required Evaluation Output

```json
{
  "schema_valid": true,
  "completeness_score": 0.87,
  "grounding_score": 0.91,
  "hallucination_risk": "low",
  "safety_score": 0.94,
  "missing_sections": ["Settlement amount needs attorney input"],
  "warnings": ["Medical timeline incomplete"],
  "final_score": 0.90
}
```

## Scoring Logic

### Completeness Score
Based on whether required sections exist.

### Grounding Score
Based on whether generated facts match extracted facts.

### Hallucination Risk
Flag when generated draft contains details not present in the source data.

### Safety Score
Check whether output avoids unsupported legal conclusions.

---

# 14. Deployment Plan

## Recommended Deployment Setup

### Frontend
Deploy on Vercel.

### Backend
Deploy on Render or Railway.

### Database
Use Supabase PostgreSQL or Neon.

### Environment Variables

```env
DATABASE_URL=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
JWT_SECRET=
NODE_ENV=production
```

### Deployment Checklist

- Production frontend URL
- Production backend URL
- Database migrated
- API key secured
- Demo data seeded
- Error states tested
- Mobile responsiveness checked
- README updated
- Demo video recorded

---

# 15. GitHub Repository Structure

```text
legalops-ai-deployment-hub/
  README.md
  docs/
    product-requirements.md
    workflow-discovery-notes.md
    prompt-design.md
    evaluation-framework.md
    deployment-guide.md
  frontend/
    src/
      components/
      pages/
      hooks/
      lib/
      types/
  backend/
    src/
      routes/
      controllers/
      services/
      agents/
      prompts/
      evaluators/
      middleware/
      utils/
    prisma/
      schema.prisma
      seed.ts
  sample-data/
    intake-case-1.json
    intake-case-2.json
    sample-demand-letter.txt
  docker-compose.yml
```

---

# 16. README Must Include

Your README should be recruiter-friendly and Glade-specific.

## README Sections

1. Project overview
2. Why I built this
3. Glade.ai alignment
4. Key features
5. Architecture diagram
6. Tech stack
7. AI workflow explanation
8. Evaluation framework
9. Debugging console
10. Screenshots
11. Demo link
12. Demo video link
13. Local setup
14. Deployment instructions
15. Future improvements

---

# 17. Demo Video Script

## 2-Minute Demo Flow

### 0:00–0:20 — Problem
Law firms handle repetitive intake, document drafting, and case workflow tasks manually. This creates delays, inconsistent outputs, and heavy paralegal workload.

### 0:20–0:45 — Workflow Discovery
Show the law firm setup wizard and explain how the system adapts to the firm’s practice area and review workflow.

### 0:45–1:15 — Intake to AI Workflow
Submit a personal injury intake form, upload a document, and run the AI workflow.

### 1:15–1:40 — Generated Outputs
Show case summary, missing information checklist, paralegal tasks, and demand letter draft.

### 1:40–2:00 — Production Readiness
Show evaluation dashboard, attorney feedback, and debug console with agent traces, latency, token usage, and failed-step visibility.

---

# 18. Portfolio Website Presentation

## Project Card Title
LegalOps AI Deployment Hub

## Project Card Subtitle
AI-powered legal workflow automation platform for intake analysis, document generation, evaluation, and deployment debugging.

## Tags

- React
- TypeScript
- Node.js
- PostgreSQL
- LLM Agents
- Legal Tech
- Workflow Automation
- Evaluation Frameworks
- Production Debugging

## Project Highlights

- Built full-stack legal operations platform using React, TypeScript, Node.js, and PostgreSQL.
- Designed AI agent workflow for intake review, document extraction, task routing, and demand letter drafting.
- Implemented evaluation framework for grounding, completeness, hallucination risk, and attorney-readiness scoring.
- Created production debugging dashboard with agent traces, latency, token usage, failures, and prompt versions.
- Added client-facing workflow discovery wizard to simulate real law firm onboarding.

---

# 19. Resume Bullets for This Project

## Version 1 — Forward Deployed Engineer Focus

- Built a full-stack legal workflow automation platform using React, TypeScript, Node.js, and PostgreSQL to simulate AI deployments for law firms.
- Designed LLM agent workflows for intake analysis, document extraction, demand letter drafting, task routing, and attorney review.
- Implemented AI evaluation and debugging dashboards tracking grounding, completeness, hallucination risk, latency, token usage, and failed agent steps.

## Version 2 — AI Engineer Focus

- Orchestrated multi-step LLM agents for legal intake summarization, structured fact extraction, document generation, and quality evaluation.
- Built prompt versioning and evaluation workflows to benchmark draft quality, schema validity, hallucination risk, and attorney feedback.

## Version 3 — Full-Stack Engineer Focus

- Shipped a deployed React and Node.js legal-tech application with case dashboards, intake forms, document uploads, AI outputs, and admin monitoring.
- Integrated PostgreSQL, Prisma, document parsing, LLM APIs, structured validation, and production-style logging across the application.

---

# 20. LinkedIn Project Description

Built LegalOps AI Deployment Hub, a full-stack legal-tech platform that automates law firm intake workflows using React, TypeScript, Node.js, PostgreSQL, and LLM agents.

The system converts client intake forms and uploaded legal documents into structured case summaries, missing-information checklists, paralegal tasks, and attorney-reviewed demand letter drafts. I also built an AI evaluation framework to score outputs for grounding, completeness, hallucination risk, and legal safety, along with a production debugging console for agent traces, latency, token usage, prompt versions, and failed workflow steps.

This project was designed to simulate how AI systems are deployed into real legal environments with human-in-the-loop review, client workflow discovery, and production-quality monitoring.

---

# 21. Implementation Roadmap

## Phase 1 — Product + Design

- Define user personas: attorney, paralegal, admin
- Create workflow discovery questionnaire
- Design database schema
- Create wireframes
- Prepare sample legal cases

## Phase 2 — Full-Stack Foundation

- Set up Vite React TypeScript frontend
- Set up Node.js TypeScript backend
- Configure PostgreSQL and Prisma
- Build case and intake APIs
- Build dashboard UI

## Phase 3 — AI Workflow MVP

- Add intake summarization prompt
- Add structured extraction prompt
- Add demand letter generation prompt
- Add missing information checklist
- Add task generation
- Store outputs in database

## Phase 4 — Evaluation + Debugging

- Add schema validation
- Add completeness scoring
- Add grounding checks
- Add hallucination warnings
- Add agent trace logging
- Build debug console
- Build evaluation dashboard

## Phase 5 — Deployment + Portfolio Polish

- Deploy frontend
- Deploy backend
- Deploy database
- Seed demo data
- Add screenshots
- Record demo video
- Update README
- Add project to portfolio website

---

# 22. What to Show Recruiters

## Must-Have Demo Links

1. Live app link
2. GitHub repo
3. Demo video
4. Project README
5. Architecture diagram
6. Evaluation framework document
7. Debug console screenshot

## Best Recruiter Demo Path

1. Open landing page.
2. Click demo case.
3. Run AI workflow.
4. Show generated legal draft.
5. Show evaluation score.
6. Show debug trace.
7. Show feedback analytics.

This flow proves both engineering and forward-deployed product thinking.

---

# 23. Important Legal and Ethical Guardrails

Add clear disclaimers throughout the app.

## Required Disclaimer

This platform generates draft legal workflow assistance for attorney review. It does not provide legal advice, does not replace a licensed attorney, and should not be used for final legal decisions without professional review.

## Safety Rules

- Do not claim legal advice.
- Use placeholders for missing facts.
- Flag uncertain information.
- Require attorney review before finalizing generated documents.
- Log all generated outputs.
- Keep sample data fictional.

---

# 24. Final Recommendation

Build this as one flagship project, not multiple smaller projects.

For Glade.ai, this project is strong because it demonstrates:

- Legal tech domain understanding
- Full-stack TypeScript engineering
- AI agent development
- Legal document generation
- Workflow automation
- Evaluation frameworks
- Production debugging
- Client-facing deployment thinking
- Product feedback loops
- Startup-style execution

This project can become the strongest portfolio artifact for the Forward Deployed Engineer role because it does not just show that you can build an AI app. It shows that you can deploy an AI workflow into a realistic law-firm operating environment, monitor it, evaluate it, debug it, and improve it based on user feedback.
