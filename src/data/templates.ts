export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  prompt: string;
  inputs: { label: string; required: boolean }[];
}

export interface TemplateCategory {
  name: string;
  subcategories: string[];
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { name: "General", subcategories: ["Writing", "Research", "Learning"] },
  {
    name: "Engineering",
    subcategories: ["Coding & Debugging", "Documentation", "Architecture"],
  },
  { name: "Sales", subcategories: ["Outreach", "Proposals", "Analysis"] },
  {
    name: "Marketing",
    subcategories: ["Content Creation", "Social Media", "Strategy"],
  },
  {
    name: "Product Management",
    subcategories: ["Strategy", "Analysis", "Communication"],
  },
  {
    name: "Operations",
    subcategories: ["Process", "Planning", "Communication"],
  },
  {
    name: "Customer Success",
    subcategories: ["Communication", "Analysis", "Strategy"],
  },
  {
    name: "HR & People",
    subcategories: ["Recruiting", "Development", "Communication"],
  },
];

export const TEMPLATES: PromptTemplate[] = [
  // ---------------------------------------------------------------------------
  // GENERAL
  // ---------------------------------------------------------------------------
  {
    id: "gen-summarize-doc",
    title: "Summarize a Document",
    description:
      "Condense a long document into a clear, structured summary with key takeaways.",
    category: "General",
    subcategory: "Writing",
    prompt: `You are a senior research analyst with expertise in distilling complex information into concise summaries. Your task is to summarize the following document while preserving all critical insights.

**Document to Summarize:**
[DOCUMENT_TEXT]

**Target Audience:** [TARGET_AUDIENCE]

**Desired Length:** [SUMMARY_LENGTH]

Please produce your summary using this structure:

1. **Executive Summary** -- A 2-3 sentence overview of the document's main thesis or purpose.
2. **Key Points** -- A bulleted list of the 5-7 most important findings or arguments.
3. **Supporting Details** -- Brief elaboration on each key point with relevant data or quotes.
4. **Conclusion & Implications** -- What this means for the target audience and any recommended next steps.

Keep the tone professional and objective. Avoid introducing opinions not present in the original document.`,
    inputs: [
      { label: "Document Text", required: true },
      { label: "Target Audience", required: true },
      { label: "Summary Length", required: false },
    ],
  },
  {
    id: "gen-professional-email",
    title: "Draft a Professional Email",
    description:
      "Compose a polished, purpose-driven professional email for any business context.",
    category: "General",
    subcategory: "Writing",
    prompt: `You are an expert business communication specialist. Draft a professional email based on the following details.

**Purpose of Email:** [EMAIL_PURPOSE]
**Recipient:** [RECIPIENT_NAME_AND_ROLE]
**Tone:** [TONE]
**Key Points to Cover:** [KEY_POINTS]
**Call to Action:** [CALL_TO_ACTION]

Guidelines:
- Open with a clear, context-setting subject line suggestion.
- Keep the email concise -- ideally under 200 words in the body.
- Use a professional greeting and sign-off appropriate to the relationship.
- Structure the body with short paragraphs (2-3 sentences each).
- End with a specific, actionable next step.
- Avoid jargon unless the recipient's role warrants it.

Output format:
**Subject:** [suggested subject line]
**Body:** [full email text]`,
    inputs: [
      { label: "Email Purpose", required: true },
      { label: "Recipient Name and Role", required: true },
      { label: "Tone", required: false },
      { label: "Key Points", required: true },
      { label: "Call to Action", required: true },
    ],
  },
  {
    id: "gen-business-proposal",
    title: "Write a Business Proposal",
    description:
      "Generate a structured business proposal with problem statement, solution, and ROI.",
    category: "General",
    subcategory: "Writing",
    prompt: `You are a seasoned business consultant who writes compelling proposals that win contracts. Create a detailed business proposal based on the information below.

**Client/Company:** [CLIENT_NAME]
**Problem or Opportunity:** [PROBLEM_STATEMENT]
**Proposed Solution:** [SOLUTION_OVERVIEW]
**Budget Range:** [BUDGET_RANGE]
**Timeline:** [TIMELINE]

Structure the proposal as follows:

1. **Executive Summary** -- Briefly state the problem and your proposed solution.
2. **Problem Analysis** -- Demonstrate deep understanding of the client's pain points.
3. **Proposed Solution** -- Detail the approach, methodology, and deliverables.
4. **Timeline & Milestones** -- Break the project into phases with clear milestones.
5. **Investment & ROI** -- Present costs with projected return on investment.
6. **Why Us** -- Highlight differentiators and relevant experience.
7. **Next Steps** -- Provide a clear path forward.

Use persuasive but factual language. Quantify benefits wherever possible.`,
    inputs: [
      { label: "Client Name", required: true },
      { label: "Problem Statement", required: true },
      { label: "Solution Overview", required: true },
      { label: "Budget Range", required: false },
      { label: "Timeline", required: false },
    ],
  },
  {
    id: "gen-explain-concept",
    title: "Explain a Concept",
    description:
      "Break down a complex topic into a clear, multi-level explanation.",
    category: "General",
    subcategory: "Learning",
    prompt: `You are an expert educator known for making complex subjects accessible to any audience. Explain the following concept at the requested level of depth.

**Concept:** [CONCEPT]
**Audience Level:** [AUDIENCE_LEVEL]
**Context or Use Case:** [CONTEXT]

Provide your explanation in three layers:

1. **The Simple Version** -- Explain it as if speaking to a curious beginner. Use an analogy or metaphor.
2. **The Detailed Version** -- Expand with accurate terminology, key principles, and how the parts fit together.
3. **The Practical Version** -- Show how this concept applies in real-world scenarios relevant to the stated context.

Also include:
- **Common Misconceptions** -- 2-3 things people often get wrong about this topic.
- **Further Learning** -- Suggest 2-3 areas to explore next for deeper understanding.

Keep language clear and jargon-free in the simple version. Gradually introduce precise terminology in the detailed version.`,
    inputs: [
      { label: "Concept", required: true },
      { label: "Audience Level", required: true },
      { label: "Context", required: false },
    ],
  },
  {
    id: "gen-meeting-agenda",
    title: "Create Meeting Agenda",
    description:
      "Build a structured meeting agenda with time blocks, owners, and objectives.",
    category: "General",
    subcategory: "Writing",
    prompt: `You are a professional meeting facilitator who designs agendas that keep meetings focused and productive. Create a detailed meeting agenda based on the following.

**Meeting Purpose:** [MEETING_PURPOSE]
**Duration:** [MEETING_DURATION]
**Attendees:** [ATTENDEES]
**Key Topics to Cover:** [KEY_TOPICS]
**Desired Outcomes:** [DESIRED_OUTCOMES]

Output format:

1. **Meeting Header** -- Title, date placeholder, duration, attendees, and meeting objective in one sentence.
2. **Agenda Items** -- For each topic, provide:
   - Time allocation (in minutes)
   - Topic title
   - Owner / presenter
   - Goal for that segment (inform, discuss, or decide)
   - Any pre-read materials needed
3. **Parking Lot** -- Space for off-topic items to be captured.
4. **Action Items Template** -- A table with columns: Action, Owner, Due Date, Status.

Ensure the total time allocations sum to the meeting duration. Include 5 minutes for opening and 5 minutes for wrap-up and next steps.`,
    inputs: [
      { label: "Meeting Purpose", required: true },
      { label: "Meeting Duration", required: true },
      { label: "Attendees", required: true },
      { label: "Key Topics", required: true },
      { label: "Desired Outcomes", required: false },
    ],
  },
  {
    id: "gen-brainstorm-ideas",
    title: "Brainstorm Ideas",
    description:
      "Generate a diverse set of creative ideas around a topic using structured ideation.",
    category: "General",
    subcategory: "Research",
    prompt: `You are a creative strategist and innovation facilitator. Generate a wide range of ideas around the following topic using multiple ideation frameworks.

**Topic / Challenge:** [TOPIC]
**Constraints:** [CONSTRAINTS]
**Target Outcome:** [TARGET_OUTCOME]

Use these three ideation approaches:

1. **Divergent Thinking** -- Generate 10 ideas with no filtering. Include wild, unconventional ideas alongside practical ones.
2. **SCAMPER Method** -- Apply at least 4 of the SCAMPER techniques (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse) to the topic and generate one idea per technique.
3. **Analogous Inspiration** -- Identify 3 analogous problems in unrelated industries and extract transferable solutions.

Then provide:
- **Top 5 Recommendations** -- Rank the best ideas by feasibility and impact, with a one-sentence rationale for each.
- **Quick Win** -- Identify the single idea that could be implemented fastest with the least resources.
- **Moonshot** -- Identify the single idea with the highest potential impact if constraints were removed.`,
    inputs: [
      { label: "Topic", required: true },
      { label: "Constraints", required: false },
      { label: "Target Outcome", required: true },
    ],
  },

  // ---------------------------------------------------------------------------
  // ENGINEERING
  // ---------------------------------------------------------------------------
  {
    id: "eng-production-function",
    title: "Build a Production Function",
    description:
      "Generate a robust, production-ready function with error handling and types.",
    category: "Engineering",
    subcategory: "Coding & Debugging",
    prompt: `You are a senior software engineer writing production-grade code. Implement a function that meets the following requirements.

**Language / Framework:** [LANGUAGE]
**Function Purpose:** [FUNCTION_PURPOSE]
**Input Parameters:** [INPUT_PARAMS]
**Expected Output:** [EXPECTED_OUTPUT]
**Edge Cases to Handle:** [EDGE_CASES]

Requirements:
- Write clean, idiomatic code for the specified language.
- Include comprehensive error handling (validate inputs, handle failures gracefully).
- Add type annotations or type hints where the language supports them.
- Follow the single-responsibility principle.
- Include JSDoc / docstring comments explaining purpose, parameters, return value, and thrown exceptions.
- Optimize for readability first, performance second.

Output format:
1. **Function implementation** -- The complete, ready-to-use code.
2. **Usage example** -- A brief code snippet showing how to call the function.
3. **Complexity analysis** -- Time and space complexity in Big-O notation.
4. **Notes** -- Any assumptions made or trade-offs chosen.`,
    inputs: [
      { label: "Language", required: true },
      { label: "Function Purpose", required: true },
      { label: "Input Parameters", required: true },
      { label: "Expected Output", required: true },
      { label: "Edge Cases", required: false },
    ],
  },
  {
    id: "eng-debug-code",
    title: "Debug Broken Code",
    description:
      "Systematically diagnose and fix bugs in code with root cause analysis.",
    category: "Engineering",
    subcategory: "Coding & Debugging",
    prompt: `You are a senior debugging specialist. Analyze the following broken code, identify the root cause of the issue, and provide a corrected version.

**Language / Framework:** [LANGUAGE]
**Broken Code:**
\`\`\`
[BROKEN_CODE]
\`\`\`

**Error Message or Unexpected Behavior:** [ERROR_DESCRIPTION]
**Expected Behavior:** [EXPECTED_BEHAVIOR]

Provide your analysis in this structure:

1. **Bug Identification** -- Pinpoint the exact line(s) causing the issue and explain what is going wrong.
2. **Root Cause Analysis** -- Explain why this bug occurs. Is it a logic error, type mismatch, race condition, off-by-one, null reference, or something else?
3. **Fixed Code** -- Provide the complete corrected code with inline comments marking every change.
4. **Explanation of Fix** -- Describe what was changed and why.
5. **Prevention Tips** -- Suggest coding practices, linting rules, or tests that would prevent this class of bug in the future.

Be precise and reference specific line numbers or variable names.`,
    inputs: [
      { label: "Language", required: true },
      { label: "Broken Code", required: true },
      { label: "Error Description", required: true },
      { label: "Expected Behavior", required: true },
    ],
  },
  {
    id: "eng-refactor-code",
    title: "Refactor Existing Code",
    description:
      "Improve code quality, readability, and maintainability through systematic refactoring.",
    category: "Engineering",
    subcategory: "Coding & Debugging",
    prompt: `You are a staff engineer specializing in code quality and refactoring. Refactor the following code to improve its structure without changing its external behavior.

**Language / Framework:** [LANGUAGE]
**Code to Refactor:**
\`\`\`
[CODE_TO_REFACTOR]
\`\`\`

**Primary Concerns:** [CONCERNS]
**Constraints:** [CONSTRAINTS]

Analyze and refactor using these criteria:

1. **Code Smells Identified** -- List each code smell found (e.g., long method, magic numbers, deep nesting, duplicated logic, god class).
2. **Refactoring Plan** -- For each smell, name the specific refactoring technique to apply (e.g., Extract Method, Replace Conditional with Polymorphism).
3. **Refactored Code** -- Provide the complete improved code with comments explaining major structural changes.
4. **Before/After Comparison** -- Summarize what changed and the benefit of each change.
5. **Further Improvements** -- Note any additional improvements that would require broader architectural changes.

Preserve all existing functionality. The refactored code must be a drop-in replacement.`,
    inputs: [
      { label: "Language", required: true },
      { label: "Code to Refactor", required: true },
      { label: "Concerns", required: false },
      { label: "Constraints", required: false },
    ],
  },
  {
    id: "eng-unit-tests",
    title: "Create Unit Test Suite",
    description:
      "Generate a comprehensive unit test suite covering happy paths, edge cases, and failures.",
    category: "Engineering",
    subcategory: "Coding & Debugging",
    prompt: `You are a test engineering expert who writes thorough, maintainable test suites. Create a comprehensive unit test suite for the following code.

**Language / Test Framework:** [LANGUAGE_AND_FRAMEWORK]
**Code Under Test:**
\`\`\`
[CODE_UNDER_TEST]
\`\`\`

**Key Behaviors to Test:** [KEY_BEHAVIORS]

Generate tests organized into these categories:

1. **Happy Path Tests** -- Verify the function works correctly with valid, typical inputs.
2. **Edge Case Tests** -- Test boundary values, empty inputs, maximum values, and unusual but valid inputs.
3. **Error Handling Tests** -- Verify the code fails gracefully with invalid inputs, null values, and exceptional conditions.
4. **Integration Points** -- If the code depends on external services or modules, include tests with mocks or stubs.

For each test:
- Use descriptive test names that read like specifications (e.g., "should return empty array when input list is empty").
- Follow the Arrange-Act-Assert pattern.
- Include inline comments explaining the purpose of non-obvious test cases.

Output the complete test file ready to run. Aim for at least 90% code coverage.`,
    inputs: [
      { label: "Language and Test Framework", required: true },
      { label: "Code Under Test", required: true },
      { label: "Key Behaviors", required: false },
    ],
  },
  {
    id: "eng-project-readme",
    title: "Draft a Project README",
    description:
      "Create a professional README with setup instructions, usage examples, and contribution guidelines.",
    category: "Engineering",
    subcategory: "Documentation",
    prompt: `You are a developer experience specialist who writes exemplary open-source documentation. Create a comprehensive README for the following project.

**Project Name:** [PROJECT_NAME]
**Description:** [PROJECT_DESCRIPTION]
**Tech Stack:** [TECH_STACK]
**Key Features:** [KEY_FEATURES]
**Setup Requirements:** [SETUP_REQUIREMENTS]

Structure the README as follows:

1. **Title & Badges** -- Project name with placeholder badges for build status, version, and license.
2. **Overview** -- 2-3 sentence description of what the project does and who it is for.
3. **Features** -- Bulleted list of key features.
4. **Quick Start** -- Step-by-step instructions to get the project running locally in under 5 minutes.
5. **Installation** -- Detailed setup covering prerequisites, environment variables, and dependencies.
6. **Usage** -- Code examples demonstrating the primary use cases.
7. **Configuration** -- Table of available configuration options.
8. **Contributing** -- Brief contribution guidelines with a link to a CONTRIBUTING.md placeholder.
9. **License** -- License placeholder.

Use clear Markdown formatting. Keep instructions copy-paste friendly with code blocks.`,
    inputs: [
      { label: "Project Name", required: true },
      { label: "Project Description", required: true },
      { label: "Tech Stack", required: true },
      { label: "Key Features", required: true },
      { label: "Setup Requirements", required: false },
    ],
  },
  {
    id: "eng-api-docs",
    title: "Document an API Endpoint",
    description:
      "Generate clear API documentation with request/response examples and error codes.",
    category: "Engineering",
    subcategory: "Documentation",
    prompt: `You are a technical writer specializing in API documentation. Create detailed documentation for the following API endpoint.

**Endpoint:** [ENDPOINT_METHOD_AND_PATH]
**Purpose:** [ENDPOINT_PURPOSE]
**Authentication:** [AUTH_METHOD]
**Request Parameters:** [REQUEST_PARAMS]
**Response Structure:** [RESPONSE_STRUCTURE]

Document the endpoint using this format:

1. **Endpoint Overview** -- Method, path, one-line description, and authentication requirements.
2. **Request** -- Headers, path parameters, query parameters, and request body with types and descriptions in a table format.
3. **Response** -- Success response with a complete JSON example. Include the HTTP status code and content type.
4. **Error Responses** -- Table of possible error codes (400, 401, 403, 404, 500) with example error response bodies and descriptions.
5. **Code Examples** -- Working request examples in cURL, JavaScript (fetch), and Python (requests).
6. **Rate Limiting** -- Note any rate limit headers or constraints.
7. **Changelog** -- Placeholder version history table.

Use consistent formatting and ensure all JSON examples are valid.`,
    inputs: [
      { label: "Endpoint Method and Path", required: true },
      { label: "Endpoint Purpose", required: true },
      { label: "Auth Method", required: false },
      { label: "Request Parameters", required: true },
      { label: "Response Structure", required: true },
    ],
  },
  {
    id: "eng-system-architecture",
    title: "Design System Architecture",
    description:
      "Create a high-level system architecture design with components, data flow, and trade-offs.",
    category: "Engineering",
    subcategory: "Architecture",
    prompt: `You are a principal architect designing scalable, maintainable systems. Create a system architecture design for the following requirements.

**System Name:** [SYSTEM_NAME]
**Problem Statement:** [PROBLEM_STATEMENT]
**Scale Requirements:** [SCALE_REQUIREMENTS]
**Key Constraints:** [CONSTRAINTS]
**Tech Preferences:** [TECH_PREFERENCES]

Provide the architecture design in this structure:

1. **System Overview** -- High-level description of the system and its primary goals.
2. **Architecture Diagram (Text)** -- An ASCII or text-based diagram showing major components and their interactions.
3. **Component Breakdown** -- For each component: purpose, technology choice, responsibilities, and interfaces.
4. **Data Flow** -- Describe how data moves through the system for the 2-3 most critical user journeys.
5. **Data Storage** -- Database choices, schema considerations, caching strategy, and data partitioning approach.
6. **Non-Functional Requirements** -- Address scalability, reliability, security, and observability.
7. **Trade-offs & Decisions** -- Document key architectural decisions using a lightweight ADR format (context, decision, consequences).
8. **Open Questions** -- List areas that need further investigation.

Justify each technology choice with concrete reasoning, not brand preference.`,
    inputs: [
      { label: "System Name", required: true },
      { label: "Problem Statement", required: true },
      { label: "Scale Requirements", required: true },
      { label: "Constraints", required: false },
      { label: "Tech Preferences", required: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // SALES
  // ---------------------------------------------------------------------------
  {
    id: "sales-cold-outreach",
    title: "Write Cold Outreach Email",
    description:
      "Craft a personalized cold outreach email that earns opens and replies.",
    category: "Sales",
    subcategory: "Outreach",
    prompt: `You are an elite B2B sales development representative known for high reply rates on cold outreach. Write a personalized cold email based on the following information.

**Prospect Name:** [PROSPECT_NAME]
**Prospect Title & Company:** [PROSPECT_TITLE_AND_COMPANY]
**What They Care About:** [PROSPECT_PRIORITIES]
**Your Product/Service:** [YOUR_OFFERING]
**Key Value Proposition:** [VALUE_PROP]

Guidelines:
- Subject line should be under 6 words, curiosity-driven, and personalized.
- Opening sentence must reference something specific about the prospect or their company -- never start with "I" or your company name.
- Keep the body under 100 words.
- Include exactly one clear insight or data point that demonstrates value.
- End with a low-friction CTA (not "Let's schedule a 30-minute call").
- Tone should be conversational, peer-to-peer, and confident without being pushy.

Output format:
**Subject Line:** [subject]
**Email Body:** [full email]
**Follow-up Timing:** [when to follow up if no reply]
**A/B Variant Subject:** [alternative subject line to test]`,
    inputs: [
      { label: "Prospect Name", required: true },
      { label: "Prospect Title and Company", required: true },
      { label: "Prospect Priorities", required: true },
      { label: "Your Offering", required: true },
      { label: "Value Proposition", required: true },
    ],
  },
  {
    id: "sales-proposal",
    title: "Create Sales Proposal",
    description:
      "Build a persuasive sales proposal tailored to the prospect's needs and budget.",
    category: "Sales",
    subcategory: "Proposals",
    prompt: `You are a senior sales strategist who crafts winning proposals. Create a tailored sales proposal based on the following details.

**Prospect Company:** [PROSPECT_COMPANY]
**Decision Maker:** [DECISION_MAKER]
**Pain Points Identified:** [PAIN_POINTS]
**Your Solution:** [YOUR_SOLUTION]
**Pricing:** [PRICING_DETAILS]
**Competitor They Are Considering:** [COMPETITOR]

Structure the proposal as follows:

1. **Personalized Introduction** -- Reference a specific conversation or challenge the prospect mentioned.
2. **Understanding Your Challenges** -- Mirror back their pain points to demonstrate you listened.
3. **Recommended Solution** -- Map your offering directly to each pain point. Be specific, not generic.
4. **Implementation Plan** -- Provide a phased rollout with timelines.
5. **Investment Summary** -- Present pricing with clear ROI metrics and a comparison to the cost of inaction.
6. **Why Choose Us Over [COMPETITOR]** -- Honest, respectful competitive positioning.
7. **Social Proof** -- Placeholder for 2-3 relevant case studies or testimonials.
8. **Next Steps** -- Clear path to close with specific dates.

Write in a confident, consultative tone. Focus on outcomes, not features.`,
    inputs: [
      { label: "Prospect Company", required: true },
      { label: "Decision Maker", required: true },
      { label: "Pain Points", required: true },
      { label: "Your Solution", required: true },
      { label: "Pricing Details", required: true },
      { label: "Competitor", required: false },
    ],
  },
  {
    id: "sales-competitive-analysis",
    title: "Competitive Analysis",
    description:
      "Create a structured competitive analysis comparing your solution against alternatives.",
    category: "Sales",
    subcategory: "Analysis",
    prompt: `You are a competitive intelligence analyst for a sales organization. Build a comprehensive competitive analysis using the details below.

**Your Product:** [YOUR_PRODUCT]
**Key Competitors:** [COMPETITORS]
**Target Market Segment:** [TARGET_SEGMENT]
**Your Differentiators:** [DIFFERENTIATORS]

Produce the analysis in this format:

1. **Market Overview** -- Brief description of the competitive landscape and key trends.
2. **Feature Comparison Matrix** -- A table comparing your product against each competitor across 8-10 key criteria. Use checkmarks, partial, or missing indicators.
3. **Pricing Comparison** -- Side-by-side pricing models and total cost of ownership analysis.
4. **Strengths & Weaknesses** -- For each competitor: 3 strengths and 3 weaknesses from the buyer's perspective.
5. **Win/Loss Patterns** -- Common scenarios where you win and where you lose against each competitor.
6. **Battle Cards** -- For each competitor, provide 3 objection-handling talk tracks: the objection, recommended response, and proof point.
7. **Strategic Recommendations** -- How to position against each competitor in different deal scenarios.

Base analysis on the information provided. Flag any areas where you would need additional data.`,
    inputs: [
      { label: "Your Product", required: true },
      { label: "Competitors", required: true },
      { label: "Target Segment", required: true },
      { label: "Differentiators", required: true },
    ],
  },
  {
    id: "sales-followup-sequence",
    title: "Follow-up Sequence",
    description:
      "Design a multi-touch follow-up email sequence to nurture unresponsive prospects.",
    category: "Sales",
    subcategory: "Outreach",
    prompt: `You are a sales engagement strategist who designs high-converting follow-up sequences. Create a multi-touch follow-up sequence for a prospect who has not responded to the initial outreach.

**Prospect Context:** [PROSPECT_CONTEXT]
**Initial Outreach Summary:** [INITIAL_OUTREACH]
**Your Value Proposition:** [VALUE_PROP]
**Industry:** [INDUSTRY]

Create a 5-email sequence with the following structure for each email:

1. **Timing** -- Days after previous email.
2. **Subject Line** -- Unique, not a "Re:" chain.
3. **Email Body** -- Complete text, under 80 words per email.
4. **Strategy Note** -- What psychological principle or sales tactic this email employs.

Sequence arc:
- **Email 1 (Day 3):** Gentle bump with new value angle.
- **Email 2 (Day 7):** Share a relevant insight, article, or data point.
- **Email 3 (Day 14):** Social proof -- reference a similar company's success.
- **Email 4 (Day 21):** Direct question or challenge the status quo.
- **Email 5 (Day 30):** Breakup email -- respectful close of the loop.

Each email must stand alone and avoid guilt-tripping or desperation.`,
    inputs: [
      { label: "Prospect Context", required: true },
      { label: "Initial Outreach Summary", required: true },
      { label: "Value Proposition", required: true },
      { label: "Industry", required: false },
    ],
  },
  {
    id: "sales-objection-handling",
    title: "Objection Handling Script",
    description:
      "Prepare responses to common sales objections using proven frameworks.",
    category: "Sales",
    subcategory: "Outreach",
    prompt: `You are a veteran sales coach who trains reps on objection handling. Create a comprehensive objection-handling guide based on the following context.

**Product/Service:** [PRODUCT_SERVICE]
**Target Buyer Persona:** [BUYER_PERSONA]
**Common Objections:** [COMMON_OBJECTIONS]
**Pricing:** [PRICING]

For each objection provided, create a response using the LAER framework (Listen, Acknowledge, Explore, Respond):

1. **Objection** -- The exact words the prospect uses.
2. **What They Really Mean** -- The underlying concern behind the objection.
3. **Listen & Acknowledge** -- An empathetic statement that validates their concern.
4. **Explore** -- 2-3 probing questions to understand the real issue.
5. **Respond** -- A concise response that reframes the objection, includes a proof point, and bridges to value.
6. **Closing Pivot** -- A natural transition to advance the deal.

If no specific objections are provided, cover these five: "It's too expensive," "We're happy with our current solution," "Now isn't the right time," "I need to talk to my team," and "Can you just send me some information?"

Keep responses conversational, not scripted. Reps should sound human, not robotic.`,
    inputs: [
      { label: "Product/Service", required: true },
      { label: "Buyer Persona", required: true },
      { label: "Common Objections", required: false },
      { label: "Pricing", required: false },
    ],
  },
  {
    id: "sales-call-prep",
    title: "Sales Call Prep",
    description:
      "Prepare a structured briefing for an upcoming sales call with talk tracks.",
    category: "Sales",
    subcategory: "Analysis",
    prompt: `You are a sales enablement manager preparing a rep for an important sales call. Create a comprehensive call prep document.

**Prospect Company:** [PROSPECT_COMPANY]
**Prospect Contact:** [PROSPECT_CONTACT]
**Call Type:** [CALL_TYPE]
**What You Know So Far:** [KNOWN_CONTEXT]
**Your Solution:** [YOUR_SOLUTION]
**Call Objective:** [CALL_OBJECTIVE]

Generate the call prep sheet:

1. **Company Snapshot** -- Key facts about the prospect company, based on the context provided.
2. **Contact Background** -- Relevant details about the person you are meeting.
3. **Call Objective** -- One clear, measurable outcome for this call.
4. **Opening** -- A 2-sentence opening that establishes rapport and sets the agenda.
5. **Discovery Questions** -- 5-7 open-ended questions organized from broad to specific, designed to uncover pain, impact, and decision criteria.
6. **Value Messaging** -- 3 key talking points mapped to likely pain points, each with a supporting proof point.
7. **Potential Objections** -- 3 likely objections with brief responses.
8. **Next Step Options** -- 3 possible next steps to propose depending on how the call goes (strong, medium, weak buying signals).
9. **Red Flags to Watch For** -- 3 signals that the deal may not be real.`,
    inputs: [
      { label: "Prospect Company", required: true },
      { label: "Prospect Contact", required: true },
      { label: "Call Type", required: true },
      { label: "Known Context", required: true },
      { label: "Your Solution", required: true },
      { label: "Call Objective", required: true },
    ],
  },

  // ---------------------------------------------------------------------------
  // MARKETING
  // ---------------------------------------------------------------------------
  {
    id: "mktg-blog-outline",
    title: "Write Blog Post Outline",
    description:
      "Create a detailed blog post outline with SEO-optimized structure and key talking points.",
    category: "Marketing",
    subcategory: "Content Creation",
    prompt: `You are a content strategist who writes blog posts that rank and convert. Create a detailed outline for a blog post based on the following brief.

**Topic:** [BLOG_TOPIC]
**Target Keyword:** [TARGET_KEYWORD]
**Target Audience:** [TARGET_AUDIENCE]
**Content Goal:** [CONTENT_GOAL]
**Desired Word Count:** [WORD_COUNT]

Produce the outline in this format:

1. **SEO Title** -- Under 60 characters, includes the target keyword, and is click-worthy.
2. **Meta Description** -- Under 155 characters, compelling, keyword-rich.
3. **Introduction** -- Hook strategy, problem statement, and what the reader will learn.
4. **H2 Sections** -- 5-7 main sections, each with:
   - H2 heading (keyword-optimized where natural)
   - 3-5 bullet points of key content to cover
   - Suggested H3 subheadings if the section is complex
   - Internal/external link opportunities
5. **Conclusion** -- Key takeaway and call to action.
6. **Content Brief Notes** -- Tone, competing articles to differentiate from, and unique angles to take.

Ensure the outline follows a logical narrative arc that keeps readers engaged through the full article.`,
    inputs: [
      { label: "Blog Topic", required: true },
      { label: "Target Keyword", required: true },
      { label: "Target Audience", required: true },
      { label: "Content Goal", required: true },
      { label: "Word Count", required: false },
    ],
  },
  {
    id: "mktg-social-campaign",
    title: "Create Social Media Campaign",
    description:
      "Design a multi-platform social media campaign with posts, hashtags, and scheduling.",
    category: "Marketing",
    subcategory: "Social Media",
    prompt: `You are a social media strategist who creates campaigns that drive engagement and conversions. Design a social media campaign based on the following.

**Campaign Objective:** [CAMPAIGN_OBJECTIVE]
**Product/Service:** [PRODUCT_SERVICE]
**Target Audience:** [TARGET_AUDIENCE]
**Platforms:** [PLATFORMS]
**Campaign Duration:** [DURATION]
**Key Message:** [KEY_MESSAGE]

Deliver the campaign plan:

1. **Campaign Overview** -- Name, theme, and core narrative in 2-3 sentences.
2. **Content Pillars** -- 3-4 content themes that support the campaign message.
3. **Post Calendar** -- For each platform, provide 5 sample posts including:
   - Post copy (platform-appropriate length)
   - Visual direction (describe the image or video concept)
   - Hashtags (5-10 relevant tags)
   - Best posting time
   - CTA
4. **Engagement Strategy** -- How to respond to comments, spark conversations, and leverage UGC.
5. **Paid Amplification** -- Which posts to boost, target audience settings, and suggested budget allocation.
6. **KPIs & Measurement** -- Specific metrics to track for each platform with target benchmarks.`,
    inputs: [
      { label: "Campaign Objective", required: true },
      { label: "Product/Service", required: true },
      { label: "Target Audience", required: true },
      { label: "Platforms", required: true },
      { label: "Duration", required: false },
      { label: "Key Message", required: true },
    ],
  },
  {
    id: "mktg-press-release",
    title: "Draft Press Release",
    description:
      "Write a professional press release following AP style with quotes and boilerplate.",
    category: "Marketing",
    subcategory: "Content Creation",
    prompt: `You are a PR communications specialist who writes press releases that get picked up by media outlets. Draft a press release based on the following.

**Company Name:** [COMPANY_NAME]
**Announcement:** [ANNOUNCEMENT]
**Key Details:** [KEY_DETAILS]
**Quote Source (Name & Title):** [QUOTE_SOURCE]
**Target Media:** [TARGET_MEDIA]

Follow standard press release format:

1. **Header** -- "FOR IMMEDIATE RELEASE" with date and location placeholder.
2. **Headline** -- Compelling, factual, under 10 words.
3. **Subheadline** -- Adds context, under 20 words.
4. **Lead Paragraph** -- Answers who, what, when, where, and why in 2-3 sentences.
5. **Body Paragraphs** -- 2-3 paragraphs with supporting details, context, and significance.
6. **Executive Quote** -- A substantive quote from the named source that adds perspective, not just cheerleading.
7. **Additional Details** -- Technical specifications, availability, pricing, or next steps as relevant.
8. **Boilerplate** -- Company description placeholder (2-3 sentences).
9. **Media Contact** -- Placeholder for name, email, and phone.

Write in AP style. Use active voice, third person, and factual language. Avoid superlatives and marketing-speak.`,
    inputs: [
      { label: "Company Name", required: true },
      { label: "Announcement", required: true },
      { label: "Key Details", required: true },
      { label: "Quote Source", required: true },
      { label: "Target Media", required: false },
    ],
  },
  {
    id: "mktg-seo-brief",
    title: "SEO Content Brief",
    description:
      "Create a comprehensive SEO content brief with keyword strategy and competitive insights.",
    category: "Marketing",
    subcategory: "Strategy",
    prompt: `You are an SEO content strategist who creates briefs that consistently produce top-ranking content. Build an SEO content brief for the following topic.

**Primary Keyword:** [PRIMARY_KEYWORD]
**Secondary Keywords:** [SECONDARY_KEYWORDS]
**Target Audience:** [TARGET_AUDIENCE]
**Business Goal:** [BUSINESS_GOAL]
**Content Type:** [CONTENT_TYPE]

Produce the content brief:

1. **Keyword Strategy** -- Primary keyword, 5-8 secondary keywords, and 5-8 semantic/related terms to include naturally.
2. **Search Intent Analysis** -- What is the searcher trying to accomplish? (Informational, navigational, transactional, or commercial investigation.)
3. **Content Requirements** -- Recommended word count, heading structure, and content format.
4. **Competitive Gap Analysis** -- Based on common knowledge, identify what top-ranking content typically covers and what angles are underserved.
5. **Outline** -- Detailed heading structure (H2s and H3s) with notes on what to cover in each section.
6. **On-Page SEO Checklist** -- Title tag, meta description, URL slug, image alt text guidance, internal linking strategy, and schema markup recommendations.
7. **Content Differentiation** -- 3 unique angles or original value-adds that competitors are unlikely to cover.
8. **CTA Strategy** -- Where and how to insert calls to action naturally.`,
    inputs: [
      { label: "Primary Keyword", required: true },
      { label: "Secondary Keywords", required: false },
      { label: "Target Audience", required: true },
      { label: "Business Goal", required: true },
      { label: "Content Type", required: false },
    ],
  },
  {
    id: "mktg-email-newsletter",
    title: "Email Newsletter",
    description:
      "Write an engaging email newsletter with compelling subject line and structured content.",
    category: "Marketing",
    subcategory: "Content Creation",
    prompt: `You are an email marketing specialist who writes newsletters with above-average open and click-through rates. Create an email newsletter based on the following.

**Newsletter Name/Brand:** [NEWSLETTER_BRAND]
**Audience:** [AUDIENCE]
**Topic/Theme for This Issue:** [TOPIC]
**Key Content Pieces:** [KEY_CONTENT]
**CTA Goal:** [CTA_GOAL]

Produce the newsletter:

1. **Subject Line Options** -- 3 options: one curiosity-driven, one benefit-driven, one urgency-driven. All under 50 characters.
2. **Preview Text** -- Complements the subject line, under 90 characters.
3. **Header Section** -- Brief personal greeting or timely hook (2-3 sentences).
4. **Main Content Block** -- The primary story or insight, broken into scannable paragraphs with a clear takeaway.
5. **Secondary Content** -- 2-3 shorter content blocks (news, tips, links) with brief descriptions.
6. **CTA Block** -- A prominent call to action with button text and supporting copy.
7. **Footer** -- Social links placeholder, unsubscribe text, and a brief sign-off.

Write in a conversational, brand-appropriate tone. Optimize for skimmability with bold key phrases and short paragraphs.`,
    inputs: [
      { label: "Newsletter Brand", required: true },
      { label: "Audience", required: true },
      { label: "Topic", required: true },
      { label: "Key Content", required: true },
      { label: "CTA Goal", required: true },
    ],
  },
  {
    id: "mktg-brand-messaging",
    title: "Brand Messaging Framework",
    description:
      "Develop a comprehensive brand messaging framework with positioning, voice, and key messages.",
    category: "Marketing",
    subcategory: "Strategy",
    prompt: `You are a brand strategist who builds messaging frameworks that create market differentiation. Create a brand messaging framework based on the following.

**Brand/Product Name:** [BRAND_NAME]
**Target Audience:** [TARGET_AUDIENCE]
**Core Problem You Solve:** [CORE_PROBLEM]
**Key Differentiators:** [DIFFERENTIATORS]
**Competitive Landscape:** [COMPETITIVE_LANDSCAPE]

Build the framework:

1. **Brand Positioning Statement** -- A single statement following the format: "For [target audience] who [need], [brand] is the [category] that [key benefit] because [reason to believe]."
2. **Value Proposition** -- One-sentence articulation of the unique value you deliver.
3. **Brand Pillars** -- 3-4 core themes that support the positioning, each with a headline, description, and proof point.
4. **Messaging Hierarchy** -- Primary message (1 sentence), secondary messages (3 sentences), and supporting messages (detail level).
5. **Brand Voice & Tone** -- 4-5 voice attributes with "we are / we are not" descriptions and example sentences.
6. **Elevator Pitch** -- 30-second version and 60-second version.
7. **Tagline Options** -- 5 tagline candidates ranging from descriptive to aspirational.
8. **Audience-Specific Messaging** -- Adapted key messages for 2-3 different audience segments or personas.`,
    inputs: [
      { label: "Brand Name", required: true },
      { label: "Target Audience", required: true },
      { label: "Core Problem", required: true },
      { label: "Differentiators", required: true },
      { label: "Competitive Landscape", required: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // PRODUCT MANAGEMENT
  // ---------------------------------------------------------------------------
  {
    id: "pm-user-story",
    title: "Write User Story",
    description:
      "Craft a detailed user story with acceptance criteria, edge cases, and technical notes.",
    category: "Product Management",
    subcategory: "Strategy",
    prompt: `You are a senior product manager who writes user stories that engineering teams can implement without ambiguity. Create a detailed user story based on the following.

**Feature:** [FEATURE_NAME]
**User Persona:** [USER_PERSONA]
**Problem Being Solved:** [PROBLEM]
**Business Context:** [BUSINESS_CONTEXT]

Write the user story using this structure:

1. **User Story** -- "As a [persona], I want to [action] so that [benefit]."
2. **Description** -- 3-5 sentences expanding on the user need, context, and expected experience.
3. **Acceptance Criteria** -- 5-8 testable criteria using Given/When/Then format.
4. **Edge Cases** -- 3-5 edge cases the implementation must handle.
5. **Out of Scope** -- Explicitly list what this story does NOT include.
6. **Dependencies** -- Other stories, APIs, or systems this depends on.
7. **Technical Notes** -- Any implementation hints or constraints for the engineering team.
8. **Success Metrics** -- 2-3 measurable outcomes that indicate this feature is working as intended.
9. **Sizing Estimate** -- Rough t-shirt size (S/M/L/XL) with rationale.

Be specific enough that two engineers reading this story would build the same thing.`,
    inputs: [
      { label: "Feature Name", required: true },
      { label: "User Persona", required: true },
      { label: "Problem", required: true },
      { label: "Business Context", required: false },
    ],
  },
  {
    id: "pm-product-requirements",
    title: "Create Product Requirements",
    description:
      "Write a comprehensive product requirements document with goals, scope, and success metrics.",
    category: "Product Management",
    subcategory: "Strategy",
    prompt: `You are a product management leader who writes PRDs that align teams and accelerate delivery. Create a product requirements document for the following initiative.

**Product/Feature Name:** [PRODUCT_NAME]
**Problem Statement:** [PROBLEM_STATEMENT]
**Target Users:** [TARGET_USERS]
**Business Objective:** [BUSINESS_OBJECTIVE]
**Key Constraints:** [CONSTRAINTS]

Structure the PRD:

1. **Overview** -- What we are building and why, in 3-4 sentences.
2. **Problem Statement** -- Define the user pain point with data or evidence where available.
3. **Goals & Success Metrics** -- 3-5 measurable goals with specific KPIs and targets.
4. **User Personas** -- Brief profiles of the primary and secondary users.
5. **Requirements** -- Organized into Must Have, Should Have, and Nice to Have (MoSCoW). Each requirement should be a clear, testable statement.
6. **User Flows** -- Text-based descriptions of the 2-3 primary user journeys.
7. **Non-Functional Requirements** -- Performance, security, accessibility, and scalability needs.
8. **Scope & Boundaries** -- Explicitly state what is in scope and out of scope.
9. **Risks & Mitigations** -- Top 3 risks with mitigation strategies.
10. **Timeline** -- High-level phase breakdown with milestones.`,
    inputs: [
      { label: "Product Name", required: true },
      { label: "Problem Statement", required: true },
      { label: "Target Users", required: true },
      { label: "Business Objective", required: true },
      { label: "Constraints", required: false },
    ],
  },
  {
    id: "pm-competitive-landscape",
    title: "Competitive Landscape Analysis",
    description:
      "Map the competitive landscape with positioning, strengths, and strategic implications.",
    category: "Product Management",
    subcategory: "Analysis",
    prompt: `You are a product strategy analyst who helps product teams make informed competitive decisions. Create a competitive landscape analysis for the following product area.

**Your Product:** [YOUR_PRODUCT]
**Product Category:** [PRODUCT_CATEGORY]
**Key Competitors:** [KEY_COMPETITORS]
**Target Market:** [TARGET_MARKET]

Deliver the analysis:

1. **Market Overview** -- Current state of the market, key trends, and growth drivers in 3-5 sentences.
2. **Competitive Map** -- Position each competitor (and your product) on two axes: a text-based 2x2 matrix using the most relevant dimensions for this market.
3. **Competitor Profiles** -- For each competitor:
   - Target customer and positioning
   - Key strengths (3)
   - Key weaknesses (3)
   - Recent notable moves or product launches
   - Pricing model
4. **Feature Comparison** -- Table comparing 10-12 key features or capabilities across all players.
5. **Differentiation Opportunities** -- 3-5 areas where your product can win based on competitive gaps.
6. **Threats to Monitor** -- 3 competitive threats with early warning indicators.
7. **Strategic Recommendations** -- 3-5 actionable recommendations for product strategy based on this analysis.`,
    inputs: [
      { label: "Your Product", required: true },
      { label: "Product Category", required: true },
      { label: "Key Competitors", required: true },
      { label: "Target Market", required: true },
    ],
  },
  {
    id: "pm-feature-prioritization",
    title: "Feature Prioritization Framework",
    description:
      "Evaluate and prioritize a backlog of features using structured scoring frameworks.",
    category: "Product Management",
    subcategory: "Analysis",
    prompt: `You are a product management expert who helps teams make data-informed prioritization decisions. Create a feature prioritization analysis for the following backlog.

**Product:** [PRODUCT_NAME]
**Feature Candidates:** [FEATURE_LIST]
**Current Business Goals:** [BUSINESS_GOALS]
**Resource Constraints:** [RESOURCE_CONSTRAINTS]

Produce the prioritization analysis:

1. **Scoring Framework** -- Apply the RICE framework (Reach, Impact, Confidence, Effort) to each feature. Define the scoring scale for each dimension.
2. **Feature Scoring Table** -- A table with each feature scored across all RICE dimensions with a calculated priority score.
3. **Prioritized Roadmap** -- Organize features into Now (next sprint), Next (next quarter), and Later (backlog) buckets.
4. **Dependencies Map** -- Identify features that depend on or unlock other features.
5. **Trade-off Analysis** -- For the top 3 features, articulate what you gain and what you defer by choosing each.
6. **Stakeholder Alignment** -- For each prioritization decision, provide a one-sentence rationale that can be shared with stakeholders.
7. **Review Triggers** -- Define conditions that should trigger a re-prioritization (e.g., competitor launch, metric shift).

Be explicit about assumptions. Flag where you lack data and are using estimates.`,
    inputs: [
      { label: "Product Name", required: true },
      { label: "Feature List", required: true },
      { label: "Business Goals", required: true },
      { label: "Resource Constraints", required: false },
    ],
  },
  {
    id: "pm-sprint-retro",
    title: "Sprint Retrospective",
    description:
      "Facilitate a structured sprint retrospective with insights and action items.",
    category: "Product Management",
    subcategory: "Communication",
    prompt: `You are an agile coach facilitating a productive sprint retrospective. Create a structured retrospective document based on the following sprint data.

**Sprint Number/Name:** [SPRINT_NAME]
**Sprint Goal:** [SPRINT_GOAL]
**What Was Delivered:** [DELIVERED_ITEMS]
**What Was Not Delivered:** [NOT_DELIVERED]
**Team Observations:** [TEAM_OBSERVATIONS]

Structure the retrospective:

1. **Sprint Summary** -- Goal, duration, velocity, and completion rate in a quick-reference block.
2. **What Went Well** -- 5-7 positive observations organized by theme (process, collaboration, technical, delivery).
3. **What Could Be Improved** -- 5-7 improvement areas, each with a specific description of the issue and its impact.
4. **Root Cause Analysis** -- For the top 3 improvement areas, apply the "5 Whys" technique to identify root causes.
5. **Action Items** -- 3-5 concrete, assignable actions. Each must have: a clear description, an owner placeholder, a due date placeholder, and a measurable definition of done.
6. **Experiments to Try** -- 1-2 process experiments to run in the next sprint with clear success criteria.
7. **Kudos** -- Space for team member recognition.
8. **Metrics to Track** -- 2-3 metrics to watch in the next sprint based on identified improvements.`,
    inputs: [
      { label: "Sprint Name", required: true },
      { label: "Sprint Goal", required: true },
      { label: "Delivered Items", required: true },
      { label: "Not Delivered", required: false },
      { label: "Team Observations", required: false },
    ],
  },
  {
    id: "pm-stakeholder-update",
    title: "Stakeholder Update",
    description:
      "Write a concise, executive-friendly stakeholder update on product progress.",
    category: "Product Management",
    subcategory: "Communication",
    prompt: `You are a product leader who communicates progress clearly to executives and cross-functional stakeholders. Write a stakeholder update based on the following.

**Product/Initiative:** [PRODUCT_INITIATIVE]
**Reporting Period:** [REPORTING_PERIOD]
**Key Accomplishments:** [ACCOMPLISHMENTS]
**Current Challenges:** [CHALLENGES]
**Upcoming Milestones:** [UPCOMING_MILESTONES]

Format the update for executive consumption:

1. **TL;DR** -- 2-3 sentences summarizing the overall status. Use a status indicator: On Track, At Risk, or Off Track.
2. **Key Metrics** -- 3-5 metrics with current values, targets, and trend direction (up/down/flat).
3. **Accomplishments This Period** -- Bulleted list of what was delivered or achieved, with business impact noted.
4. **Challenges & Mitigations** -- For each challenge: what it is, the impact if unresolved, and the mitigation plan.
5. **Decisions Needed** -- Any decisions that require stakeholder input, with a recommendation and deadline.
6. **Next Period Priorities** -- Top 3-5 priorities for the coming period.
7. **Risks & Dependencies** -- Items that could affect the timeline, with owner and status.
8. **Timeline View** -- Text-based milestone timeline showing completed, in-progress, and upcoming milestones.

Keep the tone factual and forward-looking. Lead with outcomes, not activities.`,
    inputs: [
      { label: "Product/Initiative", required: true },
      { label: "Reporting Period", required: true },
      { label: "Accomplishments", required: true },
      { label: "Challenges", required: false },
      { label: "Upcoming Milestones", required: true },
    ],
  },

  // ---------------------------------------------------------------------------
  // OPERATIONS
  // ---------------------------------------------------------------------------
  {
    id: "ops-sop-document",
    title: "Create SOP Document",
    description:
      "Write a clear, step-by-step standard operating procedure for any business process.",
    category: "Operations",
    subcategory: "Process",
    prompt: `You are an operations excellence consultant who creates SOPs that eliminate ambiguity and reduce errors. Write a standard operating procedure for the following process.

**Process Name:** [PROCESS_NAME]
**Process Owner:** [PROCESS_OWNER]
**Purpose:** [PROCESS_PURPOSE]
**Current Pain Points:** [PAIN_POINTS]
**Tools/Systems Involved:** [TOOLS_SYSTEMS]

Structure the SOP:

1. **Document Header** -- Title, version (1.0), effective date placeholder, owner, and review frequency.
2. **Purpose & Scope** -- Why this SOP exists and what it covers (and does not cover).
3. **Roles & Responsibilities** -- RACI matrix for key roles involved in this process.
4. **Prerequisites** -- What must be in place before starting (access, approvals, materials).
5. **Procedure Steps** -- Numbered step-by-step instructions. Each step should include:
   - The action to take
   - Who performs it
   - Expected outcome
   - Screenshot/reference placeholder where helpful
6. **Decision Points** -- Flowchart-style if/then logic for steps that require judgment.
7. **Exception Handling** -- How to handle the 3-5 most common exceptions or errors.
8. **Quality Checks** -- Verification steps to ensure the process was completed correctly.
9. **Revision History** -- Table with version, date, author, and change description placeholders.`,
    inputs: [
      { label: "Process Name", required: true },
      { label: "Process Owner", required: true },
      { label: "Process Purpose", required: true },
      { label: "Pain Points", required: false },
      { label: "Tools/Systems", required: false },
    ],
  },
  {
    id: "ops-incident-postmortem",
    title: "Incident Post-Mortem",
    description:
      "Write a blameless incident post-mortem with timeline, root cause, and action items.",
    category: "Operations",
    subcategory: "Process",
    prompt: `You are a site reliability engineer who writes thorough, blameless post-mortems that drive systemic improvement. Create a post-mortem document for the following incident.

**Incident Title:** [INCIDENT_TITLE]
**Severity Level:** [SEVERITY]
**Duration:** [DURATION]
**Impact:** [IMPACT_DESCRIPTION]
**What Happened:** [WHAT_HAPPENED]

Structure the post-mortem:

1. **Incident Summary** -- 3-4 sentence overview: what happened, who was affected, and the resolution.
2. **Impact** -- Quantified impact: users affected, revenue impact, duration, SLA implications.
3. **Timeline** -- Chronological timeline with timestamps for: detection, escalation, key investigation steps, mitigation, and resolution.
4. **Root Cause Analysis** -- Apply the "5 Whys" technique to identify the true root cause, not just the trigger.
5. **Contributing Factors** -- System, process, and human factors that allowed the incident to occur or delayed resolution.
6. **What Went Well** -- Things that worked during the response (detection, communication, tooling).
7. **What Could Be Improved** -- Specific gaps in detection, response, or communication.
8. **Action Items** -- Concrete follow-ups categorized as:
   - Prevent recurrence (eliminate the root cause)
   - Improve detection (catch it faster)
   - Improve response (fix it faster)
   Each with owner placeholder, priority (P0-P3), and due date placeholder.
9. **Lessons Learned** -- 2-3 broader takeaways for the organization.

Maintain a blameless tone throughout. Focus on systems, not individuals.`,
    inputs: [
      { label: "Incident Title", required: true },
      { label: "Severity", required: true },
      { label: "Duration", required: true },
      { label: "Impact Description", required: true },
      { label: "What Happened", required: true },
    ],
  },
  {
    id: "ops-project-status",
    title: "Project Status Report",
    description:
      "Generate a structured project status report with progress, risks, and next steps.",
    category: "Operations",
    subcategory: "Communication",
    prompt: `You are a program manager who delivers clear, actionable status reports to leadership. Create a project status report based on the following.

**Project Name:** [PROJECT_NAME]
**Reporting Period:** [REPORTING_PERIOD]
**Overall Status:** [OVERALL_STATUS]
**Milestones Completed:** [MILESTONES_COMPLETED]
**Current Activities:** [CURRENT_ACTIVITIES]
**Blockers:** [BLOCKERS]

Format the status report:

1. **Executive Summary** -- 3-sentence overview with a clear RAG status (Red, Amber, Green) and rationale.
2. **Progress Against Plan** -- Table showing each milestone with planned date, actual date, and status.
3. **Key Accomplishments** -- Bulleted list of deliverables completed this period.
4. **Current Work in Progress** -- Active workstreams with percent complete and owner.
5. **Risks & Issues** -- Table with columns: Description, Likelihood, Impact, Mitigation, Owner, Status.
6. **Blockers & Escalations** -- Items that require leadership attention or decisions, with recommended actions.
7. **Budget Status** -- Spend to date vs. budget with variance and forecast.
8. **Next Period Plan** -- Top priorities and expected deliverables for the next reporting period.
9. **Key Decisions Needed** -- Specific decisions with context, options, and recommendations.

Keep the report to one page equivalent. Use data over narrative wherever possible.`,
    inputs: [
      { label: "Project Name", required: true },
      { label: "Reporting Period", required: true },
      { label: "Overall Status", required: true },
      { label: "Milestones Completed", required: true },
      { label: "Current Activities", required: true },
      { label: "Blockers", required: false },
    ],
  },
  {
    id: "ops-risk-assessment",
    title: "Risk Assessment",
    description:
      "Conduct a structured risk assessment with probability, impact, and mitigation plans.",
    category: "Operations",
    subcategory: "Planning",
    prompt: `You are a risk management specialist who helps organizations identify and mitigate operational risks. Conduct a risk assessment for the following initiative.

**Initiative:** [INITIATIVE_NAME]
**Scope:** [INITIATIVE_SCOPE]
**Key Stakeholders:** [STAKEHOLDERS]
**Known Concerns:** [KNOWN_CONCERNS]
**Timeline:** [TIMELINE]

Produce the risk assessment:

1. **Executive Summary** -- Overall risk profile assessment in 2-3 sentences.
2. **Risk Identification** -- Identify 8-12 risks across these categories: Strategic, Operational, Technical, Financial, Compliance, and People.
3. **Risk Register** -- For each risk, a table row with:
   - Risk ID and description
   - Category
   - Probability (1-5)
   - Impact (1-5)
   - Risk Score (Probability x Impact)
   - Risk Rating (Critical, High, Medium, Low)
4. **Heat Map** -- Text-based probability vs. impact matrix showing where each risk falls.
5. **Top 5 Risks Deep Dive** -- For each of the highest-scoring risks:
   - Detailed description and trigger conditions
   - Potential business impact (quantified if possible)
   - Mitigation strategy
   - Contingency plan (if mitigation fails)
   - Owner placeholder
6. **Risk Monitoring Plan** -- How and when to review risks, with leading indicators.
7. **Residual Risk** -- Expected risk level after mitigations are in place.`,
    inputs: [
      { label: "Initiative Name", required: true },
      { label: "Initiative Scope", required: true },
      { label: "Stakeholders", required: false },
      { label: "Known Concerns", required: false },
      { label: "Timeline", required: false },
    ],
  },
  {
    id: "ops-change-management",
    title: "Change Management Plan",
    description:
      "Create a structured change management plan for organizational or process changes.",
    category: "Operations",
    subcategory: "Planning",
    prompt: `You are a change management expert who helps organizations navigate transitions smoothly. Create a change management plan for the following change initiative.

**Change Description:** [CHANGE_DESCRIPTION]
**Reason for Change:** [REASON_FOR_CHANGE]
**Affected Groups:** [AFFECTED_GROUPS]
**Timeline:** [TIMELINE]
**Executive Sponsor:** [EXECUTIVE_SPONSOR]

Build the change management plan:

1. **Change Overview** -- What is changing, why, and what the future state looks like.
2. **Impact Assessment** -- For each affected group: what changes for them, degree of change (low/medium/high), and anticipated resistance level.
3. **Stakeholder Analysis** -- Key stakeholders mapped by influence and support level, with engagement strategy for each.
4. **Communication Plan** -- Timeline of communications with audience, channel, message, sender, and timing for each.
5. **Training Plan** -- Skills or knowledge gaps to address, training format, schedule, and materials needed.
6. **Resistance Management** -- Anticipated sources of resistance with proactive strategies to address each.
7. **Success Metrics** -- How you will measure adoption, proficiency, and satisfaction.
8. **Support Structure** -- Champions network, help resources, and feedback channels.
9. **Rollback Plan** -- Conditions that would trigger a rollback and the rollback procedure.
10. **Timeline & Milestones** -- Phase-by-phase plan with key milestones and checkpoints.`,
    inputs: [
      { label: "Change Description", required: true },
      { label: "Reason for Change", required: true },
      { label: "Affected Groups", required: true },
      { label: "Timeline", required: false },
      { label: "Executive Sponsor", required: false },
    ],
  },
  {
    id: "ops-team-onboarding",
    title: "Team Onboarding Plan",
    description:
      "Design a comprehensive onboarding plan for new team members with milestones and resources.",
    category: "Operations",
    subcategory: "Planning",
    prompt: `You are a people operations specialist who designs onboarding programs that accelerate time-to-productivity. Create an onboarding plan for the following role.

**Role:** [ROLE_TITLE]
**Team/Department:** [TEAM]
**Manager:** [MANAGER_NAME]
**Key Tools & Systems:** [TOOLS_SYSTEMS]
**Role Responsibilities:** [RESPONSIBILITIES]

Structure the onboarding plan:

1. **Pre-Start Checklist** -- Everything to prepare before day one: equipment, accounts, access, welcome materials.
2. **Week 1: Orientation** -- Day-by-day schedule covering:
   - Company overview and values
   - Team introductions and 1:1s to schedule
   - Tool setup and access verification
   - Initial reading materials and documentation
3. **Week 2-4: Foundation** -- Weekly goals covering:
   - Core training on tools and processes
   - Shadowing sessions with key team members
   - First small deliverables or practice tasks
   - Checkpoint meeting with manager
4. **Month 2: Building** -- Goals for independent contribution:
   - Assigned projects with mentorship
   - Process documentation contributions
   - Cross-functional introductions
5. **Month 3: Independence** -- Expectations for full productivity:
   - Independent work delivery
   - 90-day review criteria
   - Ongoing development plan
6. **Buddy/Mentor Assignment** -- Responsibilities of the onboarding buddy.
7. **Success Milestones** -- Clear, measurable checkpoints at 30, 60, and 90 days.
8. **Feedback Schedule** -- When and how to collect feedback from the new hire and their team.`,
    inputs: [
      { label: "Role Title", required: true },
      { label: "Team", required: true },
      { label: "Manager Name", required: false },
      { label: "Tools/Systems", required: false },
      { label: "Responsibilities", required: true },
    ],
  },

  // ---------------------------------------------------------------------------
  // CUSTOMER SUCCESS
  // ---------------------------------------------------------------------------
  {
    id: "cs-escalation-response",
    title: "Handle Escalation Response",
    description:
      "Craft a professional, empathetic response to a customer escalation.",
    category: "Customer Success",
    subcategory: "Communication",
    prompt: `You are a senior customer success manager who resolves escalations in a way that strengthens the customer relationship. Draft a response to the following escalation.

**Customer Name:** [CUSTOMER_NAME]
**Account Context:** [ACCOUNT_CONTEXT]
**Escalation Issue:** [ESCALATION_ISSUE]
**Customer's Emotional State:** [EMOTIONAL_STATE]
**What We Can Offer:** [AVAILABLE_REMEDIES]

Craft the response using this structure:

1. **Subject Line** -- Professional, acknowledges the issue without being alarmist.
2. **Opening** -- Acknowledge the issue and validate their frustration. No deflecting or minimizing.
3. **Ownership Statement** -- Take clear accountability, even if the fault is shared.
4. **What Happened** -- Brief, honest explanation without excessive technical jargon or blame-shifting.
5. **Immediate Resolution** -- What you are doing right now to fix the issue.
6. **Preventive Measures** -- What will change to ensure this does not happen again.
7. **Goodwill Gesture** -- If appropriate, offer a concrete gesture from the available remedies.
8. **Next Steps** -- Specific follow-up actions with timeline.
9. **Closing** -- Reaffirm the value of the relationship and provide direct contact information.

Tone: empathetic, accountable, solution-oriented. Avoid corporate-speak, excessive apologies, or vague promises.`,
    inputs: [
      { label: "Customer Name", required: true },
      { label: "Account Context", required: true },
      { label: "Escalation Issue", required: true },
      { label: "Emotional State", required: false },
      { label: "Available Remedies", required: true },
    ],
  },
  {
    id: "cs-qbr",
    title: "Quarterly Business Review",
    description:
      "Prepare a comprehensive QBR presentation deck outline with metrics and recommendations.",
    category: "Customer Success",
    subcategory: "Communication",
    prompt: `You are a strategic customer success manager who conducts QBRs that demonstrate value and expand relationships. Prepare a QBR outline for the following account.

**Customer Name:** [CUSTOMER_NAME]
**Account Tier:** [ACCOUNT_TIER]
**Products Used:** [PRODUCTS_USED]
**Key Metrics from Last Quarter:** [KEY_METRICS]
**Customer Goals:** [CUSTOMER_GOALS]
**Known Issues or Concerns:** [KNOWN_ISSUES]

Build the QBR deck outline:

1. **Agenda Slide** -- Meeting objectives and time allocation.
2. **Relationship Summary** -- Partnership duration, key contacts, and products in use.
3. **Goals Review** -- Revisit goals set last quarter and report on progress with specific data.
4. **Usage & Adoption Metrics** -- Key adoption metrics with trend lines and benchmarks against similar accounts.
5. **ROI Analysis** -- Quantified business value delivered, mapping product usage to customer outcomes.
6. **Support & Health Summary** -- Ticket volume, resolution times, NPS/CSAT scores, and health score.
7. **Challenges & Resolution** -- Acknowledge known issues and share resolution status.
8. **Product Roadmap Preview** -- Upcoming features relevant to this customer's use cases.
9. **Recommendations** -- 3-5 specific recommendations to increase value (may include expansion opportunities).
10. **Goals for Next Quarter** -- Co-create 3-5 measurable goals.
11. **Open Discussion** -- Placeholder for customer feedback and questions.

Balance value demonstration with genuine partnership. Never make the QBR feel like a sales pitch.`,
    inputs: [
      { label: "Customer Name", required: true },
      { label: "Account Tier", required: true },
      { label: "Products Used", required: true },
      { label: "Key Metrics", required: true },
      { label: "Customer Goals", required: true },
      { label: "Known Issues", required: false },
    ],
  },
  {
    id: "cs-health-assessment",
    title: "Customer Health Assessment",
    description:
      "Evaluate customer health across multiple dimensions with risk indicators and actions.",
    category: "Customer Success",
    subcategory: "Analysis",
    prompt: `You are a customer success analyst who identifies at-risk accounts before churn signals become obvious. Conduct a health assessment for the following account.

**Customer Name:** [CUSTOMER_NAME]
**Contract Details:** [CONTRACT_DETAILS]
**Usage Data:** [USAGE_DATA]
**Support History:** [SUPPORT_HISTORY]
**Relationship Notes:** [RELATIONSHIP_NOTES]

Assess health across these dimensions:

1. **Overall Health Score** -- Assign a score (0-100) with a status (Healthy, Needs Attention, At Risk, Critical) and a one-sentence rationale.
2. **Product Adoption** -- Evaluate feature adoption breadth and depth. Identify underutilized capabilities and adoption trends.
3. **Engagement** -- Assess stakeholder engagement: executive sponsor access, champion strength, breadth of contacts, and meeting cadence.
4. **Support Experience** -- Analyze ticket trends, satisfaction scores, and outstanding issues.
5. **Business Outcomes** -- Are they achieving the goals they bought the product for? What evidence supports this?
6. **Relationship Strength** -- Quality of the partnership, responsiveness, and sentiment indicators.
7. **Financial Health** -- Contract value trajectory, payment history, and expansion/contraction signals.
8. **Risk Indicators** -- Specific early warning signals identified, rated by severity.
9. **Action Plan** -- Prioritized list of 5-7 actions to improve account health, each with owner placeholder and timeline.
10. **Renewal Forecast** -- Likelihood of renewal with rationale and what it would take to increase confidence.`,
    inputs: [
      { label: "Customer Name", required: true },
      { label: "Contract Details", required: true },
      { label: "Usage Data", required: true },
      { label: "Support History", required: false },
      { label: "Relationship Notes", required: false },
    ],
  },
  {
    id: "cs-renewal-proposal",
    title: "Renewal Proposal",
    description:
      "Draft a compelling renewal proposal that demonstrates delivered value and future opportunity.",
    category: "Customer Success",
    subcategory: "Strategy",
    prompt: `You are a customer success leader who drives renewals by demonstrating undeniable value. Create a renewal proposal for the following account.

**Customer Name:** [CUSTOMER_NAME]
**Current Contract:** [CURRENT_CONTRACT]
**Renewal Terms:** [RENEWAL_TERMS]
**Value Delivered:** [VALUE_DELIVERED]
**Expansion Opportunity:** [EXPANSION_OPPORTUNITY]

Structure the renewal proposal:

1. **Partnership Summary** -- Brief recap of the partnership duration and evolution.
2. **Value Delivered** -- Quantified business outcomes achieved during the current contract period. Use specific metrics tied to the customer's original goals.
3. **Usage Highlights** -- Key adoption milestones and power-user success stories.
4. **Challenges Overcome** -- Honest acknowledgment of any difficulties and how they were resolved, demonstrating resilience of the partnership.
5. **Renewal Recommendation** -- The proposed renewal terms with clear rationale for any changes.
6. **What's New** -- Product enhancements and roadmap items relevant to the customer.
7. **Growth Opportunity** -- If applicable, present expansion options with projected additional value. Frame as optional, not required for renewal.
8. **Investment Summary** -- Clear pricing with comparison to current terms and ROI analysis.
9. **Next Steps & Timeline** -- Key dates, decision points, and the process to finalize.
10. **Commitment** -- Personal commitment to the customer's success in the next contract period.

Tone: grateful, value-focused, forward-looking. The customer should feel this is about their success, not your revenue.`,
    inputs: [
      { label: "Customer Name", required: true },
      { label: "Current Contract", required: true },
      { label: "Renewal Terms", required: true },
      { label: "Value Delivered", required: true },
      { label: "Expansion Opportunity", required: false },
    ],
  },
  {
    id: "cs-churn-analysis",
    title: "Churn Analysis",
    description:
      "Analyze a churned account to extract learnings and identify preventable patterns.",
    category: "Customer Success",
    subcategory: "Analysis",
    prompt: `You are a customer success operations analyst who turns churn into actionable intelligence. Conduct a churn analysis for the following lost account.

**Customer Name:** [CUSTOMER_NAME]
**Account Details:** [ACCOUNT_DETAILS]
**Reason Given for Churn:** [STATED_REASON]
**Account History:** [ACCOUNT_HISTORY]
**Competitive Info:** [COMPETITIVE_INFO]

Produce the churn analysis:

1. **Account Overview** -- Contract value, duration, products used, and key contacts.
2. **Churn Timeline** -- Reconstruct the timeline of events leading to churn, identifying when the first warning signs appeared.
3. **Stated vs. Real Reasons** -- Analyze the stated reason for leaving and identify what the underlying issues likely were.
4. **Warning Signals Missed** -- Identify 5-7 signals that, in hindsight, indicated this account was at risk. For each, note when it appeared and what action could have been taken.
5. **Root Cause Analysis** -- Was this churn driven by product gaps, service failures, relationship issues, economic factors, or competitive displacement?
6. **Preventability Assessment** -- Rate this churn as Preventable, Partially Preventable, or Unpreventable with rationale.
7. **Pattern Analysis** -- Does this churn share characteristics with other lost accounts? Identify common patterns.
8. **Recommendations** -- 5-7 specific, actionable recommendations to prevent similar churn:
   - Process changes
   - Product feedback to relay
   - Early warning indicators to monitor
   - Playbook updates needed
9. **Win-Back Assessment** -- Is a win-back attempt viable? If yes, propose a strategy and timeline.`,
    inputs: [
      { label: "Customer Name", required: true },
      { label: "Account Details", required: true },
      { label: "Stated Reason", required: true },
      { label: "Account History", required: true },
      { label: "Competitive Info", required: false },
    ],
  },
  {
    id: "cs-onboarding-checklist",
    title: "Onboarding Checklist",
    description:
      "Create a detailed customer onboarding checklist with milestones and success criteria.",
    category: "Customer Success",
    subcategory: "Strategy",
    prompt: `You are a customer onboarding specialist who designs programs that drive rapid time-to-value. Create an onboarding checklist for the following new customer.

**Customer Name:** [CUSTOMER_NAME]
**Product Purchased:** [PRODUCT]
**Customer Goals:** [CUSTOMER_GOALS]
**Technical Environment:** [TECH_ENVIRONMENT]
**Onboarding Timeline:** [TIMELINE]

Build the onboarding checklist:

1. **Onboarding Overview** -- Welcome message template, timeline summary, and key milestones.
2. **Pre-Kickoff (Before Day 1):**
   - Internal account setup tasks
   - Welcome package preparation
   - Technical prerequisites to communicate
3. **Kickoff Meeting (Day 1):**
   - Agenda template
   - Goals alignment discussion points
   - Roles and responsibilities (RACI)
   - Communication cadence agreement
4. **Technical Setup (Week 1-2):**
   - Integration and configuration steps
   - Data migration checklist
   - Testing and validation criteria
5. **Training Phase (Week 2-3):**
   - Admin training sessions
   - End-user training sessions
   - Self-serve resource handoff
6. **Go-Live (Week 3-4):**
   - Go-live readiness checklist
   - Cutover plan
   - Hypercare support plan
7. **Post-Go-Live (Week 4-6):**
   - Adoption check-in meeting
   - First value milestone assessment
   - Feedback collection
8. **Handoff to Ongoing Success:**
   - Transition from onboarding to CSM
   - 90-day success plan creation
   - First QBR scheduling

Each checklist item should include: task, owner (customer or vendor), due date placeholder, and completion criteria.`,
    inputs: [
      { label: "Customer Name", required: true },
      { label: "Product", required: true },
      { label: "Customer Goals", required: true },
      { label: "Tech Environment", required: false },
      { label: "Timeline", required: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // HR & PEOPLE
  // ---------------------------------------------------------------------------
  {
    id: "hr-job-description",
    title: "Write Job Description",
    description:
      "Create an inclusive, compelling job description that attracts top talent.",
    category: "HR & People",
    subcategory: "Recruiting",
    prompt: `You are a talent acquisition specialist who writes job descriptions that attract diverse, high-caliber candidates. Create a job description for the following role.

**Job Title:** [JOB_TITLE]
**Department:** [DEPARTMENT]
**Level:** [LEVEL]
**Key Responsibilities:** [KEY_RESPONSIBILITIES]
**Required Skills:** [REQUIRED_SKILLS]
**Company Description:** [COMPANY_DESCRIPTION]

Write the job description:

1. **Job Title** -- Clear, industry-standard title (avoid internal jargon or inflated titles).
2. **About Us** -- 3-4 sentences about the company, culture, and mission.
3. **About the Role** -- 3-4 sentences describing the role's purpose, impact, and where it sits in the organization.
4. **What You'll Do** -- 6-8 key responsibilities, starting each with an action verb. Order by importance and time allocation.
5. **What You Bring** -- Split into:
   - Required: 5-7 must-have qualifications (skills, experience, knowledge)
   - Preferred: 3-5 nice-to-have qualifications
6. **What We Offer** -- 5-7 benefits and perks. Go beyond the basics to highlight unique offerings.
7. **Working Arrangement** -- Location, remote/hybrid policy, and travel requirements.
8. **Equal Opportunity Statement** -- Inclusive language that encourages all qualified candidates to apply.

Use "you" language instead of "the ideal candidate." Focus on what the person will do and learn, not just what they need to have. Avoid unnecessary requirements that may discourage underrepresented applicants.`,
    inputs: [
      { label: "Job Title", required: true },
      { label: "Department", required: true },
      { label: "Level", required: true },
      { label: "Key Responsibilities", required: true },
      { label: "Required Skills", required: true },
      { label: "Company Description", required: false },
    ],
  },
  {
    id: "hr-interview-questions",
    title: "Interview Question Set",
    description:
      "Design a structured interview question set with scoring rubrics and evaluation criteria.",
    category: "HR & People",
    subcategory: "Recruiting",
    prompt: `You are a hiring manager who designs structured interviews that predict job performance. Create an interview question set for the following role.

**Role:** [ROLE_TITLE]
**Key Competencies to Assess:** [KEY_COMPETENCIES]
**Interview Stage:** [INTERVIEW_STAGE]
**Interview Duration:** [DURATION]

Design the interview:

1. **Interview Overview** -- Purpose of this interview stage, competencies being assessed, and time allocation.
2. **Opening (5 minutes)** -- Rapport-building questions and agenda setting.
3. **Behavioral Questions (core)** -- For each key competency, provide:
   - The question (using STAR-prompting format: "Tell me about a time when...")
   - What a strong answer looks like
   - What a weak answer looks like
   - Follow-up probes (2-3 per question)
   - Scoring rubric (1-5 scale with descriptions)
4. **Situational Questions** -- 2-3 hypothetical scenarios relevant to the role with evaluation criteria.
5. **Technical/Functional Questions** -- 2-3 role-specific questions that assess hard skills or domain knowledge.
6. **Candidate Questions (10 minutes)** -- Time for the candidate to ask questions, with notes on what their questions might reveal.
7. **Evaluation Scorecard** -- A summary table with each competency, score, and notes fields.
8. **Red Flags** -- 3-5 warning signs to watch for during the interview.

Ensure all questions are legal, inclusive, and focused on job-relevant criteria.`,
    inputs: [
      { label: "Role Title", required: true },
      { label: "Key Competencies", required: true },
      { label: "Interview Stage", required: true },
      { label: "Duration", required: false },
    ],
  },
  {
    id: "hr-performance-review",
    title: "Performance Review Template",
    description:
      "Create a balanced performance review with achievements, growth areas, and goals.",
    category: "HR & People",
    subcategory: "Development",
    prompt: `You are an HR business partner who helps managers write performance reviews that are fair, specific, and growth-oriented. Create a performance review based on the following.

**Employee Name:** [EMPLOYEE_NAME]
**Role:** [EMPLOYEE_ROLE]
**Review Period:** [REVIEW_PERIOD]
**Key Accomplishments:** [KEY_ACCOMPLISHMENTS]
**Areas for Growth:** [GROWTH_AREAS]
**Performance Rating:** [PERFORMANCE_RATING]

Structure the performance review:

1. **Summary Statement** -- 3-4 sentences providing an overall assessment of performance during the review period.
2. **Key Accomplishments** -- For each accomplishment:
   - What was achieved
   - Business impact
   - Competencies demonstrated
3. **Competency Assessment** -- Evaluate 4-6 core competencies (e.g., execution, collaboration, communication, leadership, innovation) with a rating and specific examples for each.
4. **Strengths to Leverage** -- 2-3 standout strengths with examples and suggestions for how to amplify them.
5. **Development Areas** -- 2-3 growth opportunities framed constructively with:
   - Specific observed behavior
   - Impact of the current approach
   - Suggested alternative approach
   - Development resources or actions
6. **Goals for Next Period** -- 3-5 SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound).
7. **Career Discussion** -- Notes on career aspirations and alignment with organizational opportunities.
8. **Overall Rating** -- Final rating with calibration notes.

Use specific examples throughout. Balance recognition with honest, actionable developmental feedback.`,
    inputs: [
      { label: "Employee Name", required: true },
      { label: "Employee Role", required: true },
      { label: "Review Period", required: true },
      { label: "Key Accomplishments", required: true },
      { label: "Growth Areas", required: true },
      { label: "Performance Rating", required: false },
    ],
  },
  {
    id: "hr-employee-feedback",
    title: "Employee Feedback",
    description:
      "Write constructive, specific feedback using the SBI framework for any workplace situation.",
    category: "HR & People",
    subcategory: "Development",
    prompt: `You are a leadership coach who helps managers deliver feedback that drives behavior change. Write feedback for the following situation using the SBI (Situation-Behavior-Impact) framework.

**Employee Name:** [EMPLOYEE_NAME]
**Feedback Type:** [FEEDBACK_TYPE]
**Situation:** [SITUATION]
**Observed Behavior:** [OBSERVED_BEHAVIOR]
**Impact:** [IMPACT]
**Desired Outcome:** [DESIRED_OUTCOME]

Structure the feedback:

1. **Preparation Notes** -- Recommended setting, timing, and mindset for delivering this feedback.
2. **Opening** -- Set a collaborative tone. State the purpose of the conversation.
3. **Situation** -- Describe the specific context clearly and objectively (when, where, what was happening).
4. **Behavior** -- Describe the observable behavior without judgment or interpretation. Use "I observed..." not "You always..."
5. **Impact** -- Explain the concrete impact on the team, project, customer, or individual.
6. **Discussion Prompts** -- 3-4 open-ended questions to invite the employee's perspective and foster dialogue.
7. **Forward-Looking Agreement** -- Specific, actionable changes or continuations to agree on.
8. **Support Offered** -- What you as a manager will do to help.
9. **Follow-Up Plan** -- When and how to check in on progress.

If this is positive feedback, amplify the recognition. If constructive, focus on the behavior and growth opportunity, not the person. Maintain psychological safety throughout.`,
    inputs: [
      { label: "Employee Name", required: true },
      { label: "Feedback Type", required: true },
      { label: "Situation", required: true },
      { label: "Observed Behavior", required: true },
      { label: "Impact", required: true },
      { label: "Desired Outcome", required: true },
    ],
  },
  {
    id: "hr-training-program",
    title: "Training Program Outline",
    description:
      "Design a structured training program with learning objectives, modules, and assessments.",
    category: "HR & People",
    subcategory: "Development",
    prompt: `You are a learning and development specialist who designs training programs that produce measurable skill improvement. Create a training program outline for the following need.

**Training Topic:** [TRAINING_TOPIC]
**Target Audience:** [TARGET_AUDIENCE]
**Current Skill Level:** [CURRENT_LEVEL]
**Desired Outcome:** [DESIRED_OUTCOME]
**Available Time:** [AVAILABLE_TIME]

Design the training program:

1. **Program Overview** -- Title, purpose, target audience, and duration.
2. **Learning Objectives** -- 4-6 measurable objectives using Bloom's Taxonomy verbs (e.g., "Participants will be able to analyze..." not "Participants will understand...").
3. **Pre-Assessment** -- A brief assessment to establish baseline skill levels.
4. **Module Breakdown** -- For each module (aim for 4-6 modules):
   - Module title and duration
   - Learning objectives addressed
   - Content outline (key topics and subtopics)
   - Teaching method (lecture, workshop, case study, role play, etc.)
   - Practice activity or exercise
   - Materials needed
5. **Assessment Strategy** -- How to measure learning at each level:
   - Knowledge check (quiz or test)
   - Skill demonstration (practical exercise)
   - Application (on-the-job assignment)
6. **Reinforcement Plan** -- Post-training activities to ensure knowledge retention (follow-up sessions, practice assignments, peer learning groups).
7. **Success Metrics** -- How to measure the business impact of the training (Kirkpatrick model levels 1-4).
8. **Facilitator Guide Notes** -- Tips for delivery, common questions, and time management.`,
    inputs: [
      { label: "Training Topic", required: true },
      { label: "Target Audience", required: true },
      { label: "Current Level", required: false },
      { label: "Desired Outcome", required: true },
      { label: "Available Time", required: false },
    ],
  },
  {
    id: "hr-company-announcement",
    title: "Company Announcement",
    description:
      "Write a clear, thoughtful company-wide announcement for any organizational change.",
    category: "HR & People",
    subcategory: "Communication",
    prompt: `You are a corporate communications specialist who crafts announcements that inform, align, and maintain trust. Write a company-wide announcement based on the following.

**Announcement Type:** [ANNOUNCEMENT_TYPE]
**Key Information:** [KEY_INFORMATION]
**Affected Audience:** [AFFECTED_AUDIENCE]
**Sender (Executive):** [SENDER]
**Tone Guidance:** [TONE]
**Sensitive Considerations:** [SENSITIVE_CONSIDERATIONS]

Write the announcement:

1. **Subject Line** -- Clear, direct, and professional. No clickbait or ambiguity.
2. **Opening** -- Establish context and state the news clearly in the first 2 sentences. Do not bury the lead.
3. **The "Why"** -- Explain the rationale behind this change or announcement. Be honest and transparent.
4. **The Details** -- Provide specific, factual details: what is changing, when, and how it affects people.
5. **What This Means for You** -- Directly address how this impacts the audience. Segment if different groups are affected differently.
6. **What Stays the Same** -- If applicable, reassure by stating what is NOT changing.
7. **Support & Resources** -- Where to go for questions, who to contact, and what resources are available.
8. **Forward-Looking Statement** -- End with a forward-looking, positive statement that acknowledges the change and expresses confidence.
9. **Q&A Section** -- Anticipate and answer the top 5 questions employees will have.

Be direct but empathetic. Avoid corporate jargon, euphemisms, and spin. People appreciate honesty over polish.`,
    inputs: [
      { label: "Announcement Type", required: true },
      { label: "Key Information", required: true },
      { label: "Affected Audience", required: true },
      { label: "Sender", required: true },
      { label: "Tone", required: false },
      { label: "Sensitive Considerations", required: false },
    ],
  },
];
