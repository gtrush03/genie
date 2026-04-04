# GENIE — Complete Build Spec (v2)

> **"You wished for it."**

Agentic social media agent for MischiefClaw hackathon at Betaworks NYC. Built on OpenClaw + JellyJelly Firehose.

---

## Table of Contents

1. [Vision](#1-vision)
2. [The Genie Flywheel](#2-the-genie-flywheel)
3. [Core Principles](#3-core-principles)
4. [System Architecture](#4-system-architecture)
5. [Keyword Activation ("Genie")](#5-keyword-activation)
6. [Transcript Interpreter](#6-transcript-interpreter)
7. [Strategy Layer (Beyond Intent)](#7-strategy-layer)
8. [Defined Capabilities](#8-defined-capabilities)
9. [Browser Automation (Headed Chrome)](#9-browser-automation)
10. [Genie UI (Live Status)](#10-genie-ui)
11. [JellyJelly API Reference](#11-jellyjelly-api-reference)
12. [Deploy Pipeline](#12-deploy-pipeline)
13. [Integrations](#13-integrations)
14. [Zo Computer ($80 Credits)](#14-zo-computer)
15. [NYC Live Feeds](#15-nyc-live-feeds)
16. [Demo Script](#16-demo-script)
17. [Hackathon Positioning](#17-hackathon-positioning)
18. [Build Timeline (8 Hours)](#18-build-timeline)
19. [Fallback Tiers](#19-fallback-tiers)
20. [Pre-Hackathon Prep](#20-pre-hackathon-prep)
21. [Environment Variables](#21-environment-variables)
22. [File Manifest](#22-file-manifest)
23. [Post-Hackathon Vision](#23-post-hackathon-vision)

---

## 1. Vision

**JellyJelly = the mouth. OpenClaw = the brain. Your screen = the proof.**

You post a JellyJelly video and say "Genie" anywhere in it. That's the trigger. Genie is a continuous server watching the firehose. When it hears its name, it:

1. **Listens** — pulls the full transcript, reconstructs what you said
2. **Interprets** — doesn't just extract intent, builds a full **proposal/brief** from your rambling
3. **Strategizes** — figures out what you SHOULD do, not just what you asked for
4. **Acts** — builds the site, opens Chrome on your machine, messages people on LinkedIn, sends Gmail, deploys to Vercel
5. **Reports** — sends you a Telegram message with everything it did. Screenshots, URLs, receipts.

**You cannot message Genie. Genie messages you.** The only input is your JellyJelly videos. You speak it into existence, Genie catches it, does it, and sends you the results.

No Convex. No Convos. No chat interface where you type. JellyJelly is the input. Telegram is the output. Your local machine's Chrome browser is the hands.

**Iqram (JellyJelly founder) described this exact thing today on his own platform:**

> "We just invented a new term, agentic social media. Hey, Wobbles. Go buy me agentic social media dot com. Make the site, sort of describe the power of the jelly fire hose, which allows anyone to consume our public information and build things off of it."

— Clip ID: `01KNCJNWH2T33B6XCQHSQK0RA1`, April 4, 2026

---

## 2. The Genie Flywheel

### Incentive to Post More

The more you post on JellyJelly, the more Genie knows about you (per-user memory in local JSON). The more it knows, the more personalized and ambitious:

- **First wish:** Generic landing page
- **Fifth wish:** Knows your brand, audience, network — builds something that fits YOU
- **Tenth wish:** Proactively suggests strategy before you even ask

This incentivizes posting. JellyJelly becomes your agent's ears. More context = cooler output.

### The Dreams Economy

JellyJelly already has tipping (`tips_total`), pay-to-watch (`pay_to_watch`), and shop items (`has_shop_item`).

```
Post a wish on JellyJelly (say "Genie, build me...")
    → Genie builds a v1 and deploys it
    → Other users see the wish clip + the live site
    → They TIP to fund the dream (JELLYJELLY token → USDC/SOL)
    → You post more, share more context
    → Genie gets smarter, builds better
    → Dreams compound
```

---

## 3. Core Principles

### One-Way Communication
- **You → Genie:** JellyJelly videos only. Say "Genie" to activate.
- **Genie → You:** Telegram messages with results, screenshots, URLs, receipts.
- **You CANNOT message Genie.** No chat. No prompts. No forms. Just talk.

### It Doesn't Ask, It Does
- No confirmation dialogs. No "should I build this?"
- Genie interprets, acts, and reports what it did.
- If it misinterprets, you post another video: "Genie, not that, I meant..."

### Keyword Trigger Only
- Genie watches the ENTIRE firehose (or specific usernames)
- Only activates on clips where the word **"Genie"** appears in the transcript
- Everything else is ignored — your casual clips are safe

### Browser-Native Actions
- Genie opens **real Chrome on your machine** (headed Playwright)
- It can browse LinkedIn, send from your Gmail, navigate websites
- You see it happening in real-time on your screen
- This IS the demo — watching a browser do things autonomously

---

## 4. System Architecture

```
JELLYJELLY FIREHOSE
  (polling every 30s, GET /v3/jelly/search)
         |
         v
KEYWORD DETECTOR
  → fetch transcript for each new clip
  → scan for "Genie" or "genie" in word list
  → if not found: skip
  → if found: activate
         |
         v
TRANSCRIPT INTERPRETER
  → reconstruct full text from Deepgram words
  → LLM processes into a STRUCTURED PROPOSAL:
     {
       title: "AI Consulting Landing Page",
       summary: "George wants a professional landing page for his AI consulting business...",
       wishes: [
         { type: "BUILD", priority: 1, spec: { ... } },
         { type: "OUTREACH", priority: 2, spec: { ... } }
       ],
       strategy: {
         recommendation: "Also set up LinkedIn outreach to CTOs in NYC...",
         reasoning: "Based on the consulting angle, warm intros > cold sites"
       },
       userContext: {
         mood: "excited",
         urgency: "high",
         background: "mentioned having meetings this week"
       }
     }
         |
         v
EXECUTION ENGINE
  → for each wish in priority order:
     ├── BUILD → generate site → deploy Vercel → screenshot → push GitHub
     ├── OUTREACH → open Chrome → navigate LinkedIn → send connection request
     │           → or open Gmail → compose and send email
     ├── PROMOTE → open Chrome → post on Twitter/LinkedIn
     ├── RESEARCH → Apollo enrich + web search → compile report
     ├── CONNECT → find person → draft intro → send via Gmail/LinkedIn
     └── REMIND → store locally → Telegram reminder later
         |
         v
TELEGRAM REPORT
  → sends you a full report message:
     "GENIE REPORT — April 4, 2026
      
      Heard your wish from clip: 'AI Consulting Landing Page'
      
      ✓ Built: https://ai-consulting-xyz.vercel.app (deployed in 11s)
      ✓ GitHub: https://github.com/gtrush03/ai-consulting-xyz
      ✓ Screenshot attached
      ✓ Sent LinkedIn request to John Smith (CTO, Acme Corp)
      ✓ Drafted Gmail to sarah@venture.co — sent from your account
      
      Strategy note: You mentioned meetings this week.
      I also prepared a one-pager PDF you can share. Link: [...]
      
      — Genie"
         |
         v
LOCAL MEMORY UPDATE
  → ~/.genie/users/{username}.json updated with:
     - what was built
     - preferences learned
     - network connections made
     - pending follow-ups
```

### Service Map

| Service | How | Auth |
|---------|-----|------|
| JellyJelly API | HTTP polling | None needed |
| OpenClaw Gateway | Agent runtime | Token auth, localhost:18789 |
| Chrome (Playwright headed) | Local browser automation | Your logged-in sessions |
| Vercel CLI | `vercel deploy --prod` | Pre-authenticated |
| GitHub CLI | `gh` commands | Pre-authenticated (gtrush03) |
| Telegram Bot | Bot API for sending reports | Bot token |
| OpenRouter | LLM for interpretation | API key |
| Gemini Engine | Fast HTML generation | API key |
| Apollo.io | People enrichment | API key |
| Zo Computer | $80 credits, free models | API key |

---

## 5. Keyword Activation

### How It Works

Genie is a **continuous server** (Node.js process or OpenClaw cron every 30s). It:

1. Polls `GET /v3/jelly/search?ascending=false&page_size=50&start_date={cursor}`
2. For each new clip, fetches `GET /v3/jelly/{id}` for full transcript
3. Scans the Deepgram word list for "genie" (case-insensitive)
4. If "genie" found → **ACTIVATE**. Process the clip.
5. If not found → skip silently.

### Detection Code

```javascript
function containsKeyword(transcriptOverlay, keyword = "genie") {
  const words = transcriptOverlay?.results?.channels?.[0]
    ?.alternatives?.[0]?.words || [];
  return words.some(w => 
    w.word.toLowerCase() === keyword.toLowerCase() ||
    w.punctuated_word?.toLowerCase().includes(keyword.toLowerCase())
  );
}
```

### Why Keyword Trigger

- Your casual JellyJelly clips are safe — Genie ignores them
- Saying "Genie" is intentional. It's like saying "Hey Siri" or "Alexa"
- Creates a ritual: "Genie, I wish..." feels magical
- Prevents noise — only processes clips where you actually want action

### Username Filtering (Optional)

Can also restrict to specific usernames:

```javascript
const WATCHED_USERS = ["georgy", "iqram"]; // only process these users' clips
```

---

## 6. Transcript Interpreter

### The Problem with Raw Transcripts

Raw JellyJelly transcripts are messy — filler words, tangents, multiple topics, casual speech. Example:

> "Hey. So like, I've been thinking about this for a while, right? Genie, I need a, uh, landing page for my consulting thing. Like AI consulting. And also, can you reach out to that guy from the panel today? The CTO. I think his name was John or something. At that company... Acme? Yeah. Also I really need coffee. Anyway, make it look professional, dark theme, you know my style."

A raw intent classifier would miss the nuance. The Transcript Interpreter produces a **full structured proposal**:

### Proposal Format

```json
{
  "proposal": {
    "title": "AI Consulting Practice Launch",
    "summary": "George wants to formalize his AI consulting practice with a professional web presence and begin warm outreach to a specific contact met at a recent panel event.",
    "clipContext": {
      "creator": "georgy",
      "clipId": "01KNC...",
      "postedAt": "2026-04-04T15:30:00Z",
      "mood": "excited but scattered",
      "urgency": "high — mentioned meetings this week"
    },
    "wishes": [
      {
        "type": "BUILD",
        "priority": 1,
        "title": "AI Consulting Landing Page",
        "spec": {
          "name": "George Trushevskiy — AI Consulting",
          "tagline": "Enterprise AI Strategy & Implementation",
          "style": "dark, professional, minimal",
          "sections": ["hero", "services", "about", "contact"],
          "colorHint": "dark theme, user's established preference",
          "notes": "User said 'you know my style' — reference past builds for brand consistency"
        }
      },
      {
        "type": "OUTREACH",
        "priority": 2,
        "title": "Connect with CTO from Panel",
        "spec": {
          "targetName": "John",
          "targetRole": "CTO",
          "targetCompany": "Acme",
          "context": "Met at a panel event recently",
          "channel": "LinkedIn first, then email if found",
          "tone": "warm, reference the panel event"
        }
      }
    ],
    "strategy": {
      "recommendation": "The consulting page should go live BEFORE the outreach. When John gets the LinkedIn request, he'll check your profile — have the site URL ready in your LinkedIn bio. Also: the one-pager from the site content would make a strong follow-up attachment.",
      "proactiveActions": [
        "Update LinkedIn headline to mention AI consulting",
        "Generate a PDF one-pager from the site content",
        "Draft a follow-up email for 3 days after the LinkedIn connection"
      ]
    },
    "ignored": [
      "'I really need coffee' — not actionable, skipped"
    ]
  }
}
```

### Interpreter Prompt

```javascript
const INTERPRETER_PROMPT = `You are the Genie Transcript Interpreter. You receive raw, messy video transcripts from JellyJelly clips where a user has said "Genie" to activate you.

Your job is to transform the rambling, casual speech into a STRUCTURED PROPOSAL.

You must:
1. Extract ALL actionable wishes, no matter how casually mentioned
2. Separate signal from noise (skip "I need coffee", keep "I need a website")
3. Infer details the user implied but didn't say explicitly
4. Add a STRATEGY section with proactive recommendations beyond what was asked
5. Note the user's mood, urgency, and context clues
6. Order wishes by logical priority (build before outreach, research before connect)
7. If user references past context ("you know my style"), note it for memory lookup

OUTPUT FORMAT: Valid JSON matching the proposal schema above.
Be thorough. Be opinionated. The user is rambling — your job is to make sense of it and turn it into an action plan.`;
```

### What Makes This Different from Raw Intent Classification

| Raw Intent | Transcript Interpreter |
|-----------|----------------------|
| `{ type: "BUILD", description: "landing page" }` | Full spec with sections, colors, brand reference, style notes |
| `{ type: "OUTREACH", target: "John" }` | Channel strategy (LinkedIn first, then email), tone guidance, context |
| Just classifies | Also adds STRATEGY — what you should do that you didn't ask for |
| Flat list | Priority-ordered, dependency-aware (build before outreach) |
| Ignores noise | Explicitly lists what was ignored and why |

---

## 7. Strategy Layer (Beyond Intent)

### What It Does

The Strategy Layer is what makes Genie more than a command executor. It doesn't just do what you said — it thinks about what you SHOULD do.

Examples:

| You said | Genie also does (proactively) |
|----------|------------------------------|
| "Build me a landing page" | Also generates social media assets, OG image, favicon |
| "Reach out to that investor" | Also researches the investor's portfolio, finds mutual connections |
| "Post about my new project" | Also identifies the best time to post, suggests A/B tweet variants |
| "I need a portfolio site" | Also pulls your GitHub repos and JellyJelly clips to populate it |
| Just shares an idea, no specific ask | Genie proposes what could be built from the idea and estimates impact |

### Strategy Prompt Addition

```javascript
const STRATEGY_ADDITION = `
STRATEGY RULES:
- Always think one step ahead of the user
- If they want a site, think about distribution (how will people find it?)
- If they want outreach, think about timing and warm-up
- If they share an idea without a specific ask, propose what could be built
- Reference their past wishes and builds for continuity
- Suggest follow-up actions with timelines
- Be opinionated — "I'd also do X because Y" not "you could optionally..."
`;
```

### Proactive Mode (No Explicit Wish)

Sometimes a user says "Genie" but doesn't have a specific request — they're just sharing a thought or an idea. Genie still acts:

> "Genie, I was at this event today and everyone was talking about how AI agents are going to change social media. Really cool stuff."

**Genie's Strategy Response:**
```
GENIE REPORT

You shared a thought about AI agents and social media.
I turned it into something:

✓ Built a "State of Agentic Social Media" landing page
  → https://agentic-social-2026.vercel.app
  → Positions you as a thought leader on this topic
  
✓ Drafted a Twitter thread (3 tweets) about the event
  → Ready to post, attached below

✓ Found 4 people at the event who are also building in this space
  → LinkedIn profiles attached

Strategy: You were at an event where this was hot. Strike now.
Post the thread tonight, share the site tomorrow morning.
```

---

## 8. Defined Capabilities

### What Genie Can Do

| Capability | How | Real/Demo |
|------------|-----|-----------|
| **Build a website** | Tailwind template + Gemini generation → Vercel deploy (9s) | REAL |
| **Deploy to GitHub** | Git Data API, zero-clone push | REAL |
| **Take screenshots** | Playwright headless | REAL |
| **Browse LinkedIn** | Headed Playwright Chrome — navigates, sends connection requests, messages | REAL |
| **Send Gmail** | Headed Playwright Chrome — opens Gmail, composes, sends from YOUR account | REAL |
| **Browse any website** | Headed Chrome — can fill forms, click buttons, extract data | REAL |
| **Research a person** | Apollo.io API enrichment (email, phone, company, title, LinkedIn) | REAL |
| **Research a company** | Apollo.io + web scraping via headed browser | REAL |
| **Generate social posts** | LLM copy for Twitter, LinkedIn, general | REAL |
| **Post to Twitter/X** | Headed Chrome (logged into your account) or X API | REAL |
| **Post to LinkedIn** | Headed Chrome (logged into your account) | REAL |
| **Send emails** | Resend API (cold outreach) or Gmail via browser (personal) | REAL |
| **Generate images** | Gemini nano-banana-pro skill | REAL |
| **Generate PDFs** | HTML → PDF via Playwright | REAL |
| **Set reminders** | Local storage + Telegram scheduled message | REAL |
| **Download JellyJelly videos** | ffmpeg + HLS stream from API | REAL |
| **Enrich with NYC live data** | 311, traffic, weather, Citi Bike, MTA, restaurants | REAL |

### What Genie Cannot Do (Yet)

- Can't purchase domains (no registrar API connected)
- Can't process payments
- Can't post directly to Instagram (no API)
- Can't edit video
- Can't make phone calls

---

## 9. Browser Automation (Headed Chrome)

### The Big Demo Feature

Genie opens **real Chrome on your machine** and does things while you watch. This is not headless. You SEE the browser navigating, typing, clicking. It uses your logged-in sessions — your LinkedIn, your Gmail, your Twitter.

### Setup

Genie uses Playwright in **headed mode** with a persistent browser profile that has your logged-in sessions:

```javascript
const { chromium } = require('playwright');

// Launch headed Chrome with your existing profile
const browser = await chromium.launchPersistentContext(
  '/Users/gtrush/.genie/browser-profile', // persistent profile dir
  {
    headless: false,               // HEADED — you see everything
    channel: 'chrome',             // use system Chrome
    viewport: { width: 1280, height: 800 },
    slowMo: 100,                   // slight delay so you can follow along
  }
);
```

### Pre-requisite: Login Once

Before first use, run Genie's browser setup. It opens Chrome:
1. Navigate to LinkedIn → log in manually → session saved
2. Navigate to Gmail → log in manually → session saved
3. Navigate to Twitter/X → log in manually → session saved

After that, Genie can use all these services as you.

### LinkedIn Actions

```javascript
async function sendLinkedInConnection(page, { profileUrl, message }) {
  await page.goto(profileUrl);
  await page.waitForSelector('button:has-text("Connect")');
  await page.click('button:has-text("Connect")');
  
  // Add note
  const addNoteBtn = page.locator('button:has-text("Add a note")');
  if (await addNoteBtn.isVisible()) {
    await addNoteBtn.click();
    await page.fill('textarea[name="message"]', message);
  }
  
  await page.click('button:has-text("Send")');
  return { success: true, profileUrl };
}
```

### Gmail Actions

```javascript
async function sendGmail(page, { to, subject, body }) {
  await page.goto('https://mail.google.com');
  await page.click('div[gh="cm"]'); // Compose button
  await page.waitForSelector('input[name="to"]');
  await page.fill('input[name="to"]', to);
  await page.fill('input[name="subjectbox"]', subject);
  
  // Body is in a contenteditable div
  const bodyEl = page.locator('div[aria-label="Message Body"]');
  await bodyEl.click();
  await bodyEl.fill(body);
  
  // Send
  await page.click('div[aria-label="Send"]');
  return { success: true, to, subject };
}
```

### Twitter/X Actions

```javascript
async function postTweet(page, { text }) {
  await page.goto('https://x.com/compose/post');
  await page.waitForSelector('div[data-testid="tweetTextarea_0"]');
  await page.fill('div[data-testid="tweetTextarea_0"]', text);
  await page.click('button[data-testid="tweetButton"]');
  return { success: true };
}
```

### Why Headed Browser > APIs

| API Approach | Browser Approach |
|-------------|-----------------|
| Need developer accounts, OAuth apps, API keys for each service | Use your existing logged-in sessions |
| LinkedIn API requires approved app (takes days) | Just navigate to linkedin.com |
| Gmail API requires OAuth consent flow | Just open mail.google.com |
| Rate limited by API tier | Rate limited by human-speed browsing |
| Invisible — user has no idea what's happening | **User WATCHES it happen in real time** |
| Looks like any other API demo | **Looks like magic — Chrome moving by itself** |

The headed browser IS the demo. Judges see Chrome open, navigate to LinkedIn, type a message, and hit send. That's the "holy shit" moment.

---

## 10. Genie UI (Live Status)

### Design: Telegram-First + Optional Web Dashboard

**Primary output: Telegram Bot**

Genie sends you Telegram messages. You never send Genie messages. It's one-way:

```
GENIE 🧞 [4:32 PM]
━━━━━━━━━━━━━━━━━━━━━━

Heard you in clip: "AI Consulting Launch"

PROPOSAL:
1. Build professional landing page (dark theme)
2. Connect with John (CTO, Acme) on LinkedIn
3. Strategy: Update LinkedIn bio before sending request

EXECUTING...

━━━━━━━━━━━━━━━━━━━━━━
GENIE 🧞 [4:32 PM]
[1/3] Building site... generating HTML...

GENIE 🧞 [4:32 PM]
[1/3] Deploying to Vercel...

GENIE 🧞 [4:33 PM]
[1/3] ✓ DONE — https://ai-consulting-xyz.vercel.app
[screenshot attached]

GENIE 🧞 [4:33 PM]
[2/3] Opening Chrome... navigating to LinkedIn...

GENIE 🧞 [4:33 PM]
[2/3] Found John Smith, CTO at Acme Corp
[2/3] Sending connection request with note...

GENIE 🧞 [4:34 PM]
[2/3] ✓ LinkedIn request sent to John Smith

GENIE 🧞 [4:34 PM]
[3/3] Strategy: Updated your LinkedIn headline to
"AI Consulting | Enterprise Strategy & Implementation"

GENIE 🧞 [4:34 PM]
━━━━━━━━━━━━━━━━━━━━━━
ALL WISHES GRANTED (3/3)
Time: 47 seconds
Site: https://ai-consulting-xyz.vercel.app
GitHub: https://github.com/gtrush03/ai-consulting-xyz
━━━━━━━━━━━━━━━━━━━━━━
```

### Telegram Bot Setup

```javascript
const TELEGRAM_BOT_TOKEN = "8352813070:AAE6...";
const TELEGRAM_CHAT_ID = "582706965"; // George's Telegram ID

async function sendTelegramMessage(text, options = {}) {
  const body = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "HTML",
    ...options
  };
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function sendTelegramPhoto(photoPath, caption) {
  const form = new FormData();
  form.append("chat_id", TELEGRAM_CHAT_ID);
  form.append("photo", fs.createReadStream(photoPath));
  form.append("caption", caption);
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: form
  });
}
```

### Optional: Live Web Dashboard

A simple local web page that shows Genie's activity in real-time (for demo purposes):

- **Left pane:** JellyJelly clip playing + transcript with highlighted keywords
- **Center pane:** Live activity feed (each step as it happens)
- **Right pane:** Results — deployed URLs, screenshots, sent messages
- **Bottom:** Browser view embed showing Chrome actions
- Built with Vite + React + Server-Sent Events from the Genie server
- Runs on `localhost:5173` for demo projection

---

## 11. JellyJelly API Reference

### Search: `GET /v3/jelly/search`

No auth required.

| Param | Type | Notes |
|-------|------|-------|
| `username` | string | Filter by creator. **Works.** |
| `start_date` | ISO 8601 | Filter after date. **Works.** |
| `end_date` | ISO 8601 | Filter before date. **Works.** |
| `sort_by` | `date\|likes\|views` | Sort field |
| `ascending` | boolean | Default: false (newest first) |
| `page` | number | 1-indexed |
| `page_size` | number | Max: 50 |
| `query` | string | **BROKEN — does not filter. Do not use.** |

### Detail: `GET /v3/jelly/{id}`

Returns EVERYTHING:

- **`transcript_overlay`** — Deepgram word-level: `{ word, punctuated_word, start, end, confidence }[]`
- **`video.hls_master`** — Signed HLS video URL (6 quality levels, downloadable via ffmpeg)
- **`summary`** — AI-generated one-liner
- **`thumbnail_url`** — Signed CloudFront URL
- **`participants`** — `[{ id, username, full_name, pfp_url }]`
- **Commerce:** `price`, `pay_to_watch`, `has_shop_item`, `tips_total`
- **Engagement:** `likes_count`, `comments_count`, `all_views`, `distinct_views`

### Key Facts

- 21,840+ clips, growing ~8-9/hour
- Full transcripts on every clip
- Signed URLs expire ~22 days
- No webhooks — polling only
- No auth needed for any endpoint

---

## 12. Deploy Pipeline

### Verified Timings (tested on this machine)

| Step | Time |
|------|------|
| LLM generates HTML | ~5-8s |
| `vercel deploy --yes --prod` | **9 seconds** |
| Playwright screenshot | ~3s |
| GitHub push (Git Data API) | ~3s |
| **Total: idea → live URL** | **~20-24 seconds** |

### Auth (all pre-configured)

- `gh` CLI: authenticated as gtrush03
- `vercel` CLI v50.1.6: authenticated
- Playwright v1.58.0: installed with chromium

### Site Generation Strategy

**Template interpolation** (fast, reliable) for standard landing pages:
- Pre-built Tailwind template: dark theme, gradients, glass morphism
- String interpolation: `{{NAME}}`, `{{TAGLINE}}`, `{{FEATURES}}`, `{{COLORS}}`
- Instant generation, always looks good

**LLM generation** (Gemini) for complex/custom requests:
- When the interpreter spec says the user wants something specific
- Falls back to template if LLM output is broken

---

## 13. Integrations

### Apollo.io (People Enrichment)
- `POST /v1/people/match` — name + domain → email, phone, title, LinkedIn
- `POST /v1/mixed_people/search` — search 210M+ contacts
- Auth: `x-api-key` header. Rate: 600/hour

### Resend (Cold Email)
- `POST https://api.resend.com/emails`
- Free: 100 emails/day. 3 lines of code.

### Gmail (Personal Email — via Browser)
- Headed Playwright opens gmail.com
- Uses your logged-in session
- Composes and sends as YOU

### LinkedIn (via Browser)
- Headed Playwright opens linkedin.com
- Send connection requests with personalized notes
- View profiles, extract info
- Post updates

### Twitter/X (via Browser or API)
- Headed Playwright opens x.com OR
- X API v2 (500 posts/month free, OAuth 1.0a)

### Gemini Engine (Local)
- `/Users/gtrush/Downloads/NYC/gemini-engine/gemini.sh`
- `gemini-code.sh` for code generation
- Model: gemini-3.1-pro-preview

### Telegram Bot (Reporting)
- Bot token: `8352813070:AAE6...`
- Chat ID: `582706965`
- One-way: Genie → you only

---

## 14. Zo Computer ($80 Credits)

- API: `POST https://api.zo.computer/zo/ask`
- NOT OpenAI-compatible — uses `input` field
- **Free models:** MiniMax 2.7, Kimi K2.5 (zero credits)
- Promo: AITNYC

Strategy: Zo free models for transcript interpretation. OpenRouter (Claude Sonnet) for quality-critical tasks. $80 is more than enough.

---

## 15. NYC Live Feeds

| Feed | Endpoint | Use Case |
|------|----------|----------|
| NYC 311 | `data.cityofnewyork.us/resource/erm2-nwe9.json` | "Genie, what's happening in my neighborhood?" |
| Traffic | `data.cityofnewyork.us/resource/i4gi-tjb9.json` | Live traffic data in generated dashboards |
| Citi Bike | `gbfs.citibikenyc.com/gbfs/en/station_status.json` | "Genie, best bike route to event" |
| Weather | `api.weather.gov/points/40.7128,-74.0060` | Weather-aware site content |
| Restaurants | `data.cityofnewyork.us/resource/43nn-pn8j.json` | "Genie, where should I eat near here?" |
| MTA Subway | `api-endpoint.mta.info/.../nyct%2Fgtfs` | Commute dashboards |

**"Living City" sites:** Generated sites can embed auto-refreshing `fetch()` calls for live NYC data.

---

## 16. Demo Script (3 Minutes)

### 0:00-0:20 — THE SETUP

**Screen:** Split view. Left: JellyJelly firehose scrolling. Right: Terminal showing "Genie server running... listening for keyword..."

**Say:** "This is Genie. It watches every JellyJelly video in real-time. But it only wakes up when you say its name."

### 0:20-0:50 — THE WISH

**Say:** "This morning, Iqram — the founder of JellyJelly — posted this."

**Action:** Show iqram's clip. Transcript appears. The word "Genie" is never in it (he said "Wobbles"). 

**Say:** "He asked his agent Wobbles to build a site. But what if he'd said Genie instead? Let me show you what happens."

**Action:** Load a pre-recorded clip (or live clip) where someone says "Genie, build me a site for agentic social media."

### 0:50-1:40 — THE GRANT (holy shit moment)

Terminal detects the keyword:
```
[GENIE] Keyword detected in clip by @georgy
[GENIE] Interpreting transcript...
[GENIE] Proposal: "Agentic Social Media — Landing Page + Twitter Thread"
[GENIE] Executing wish 1/2: BUILD...
```

Vercel URL appears in ~12 seconds. Click it. Real site loads.

Then: **Chrome opens on screen.** Navigates to Twitter. Composes a tweet about the site. Posts it.

**Say:** "That's a real website and a real tweet. From a video clip. And I didn't touch my keyboard."

### 1:40-2:10 — THE PROOF

Telegram notification pops up on phone. Full report with screenshots, URLs.

**Say:** "Genie sent me the receipt. Site URL, screenshot, tweet link. I just talked. Genie did everything."

### 2:10-2:40 — THE BROWSER MOMENT

**Say:** "But Genie can do more than deploy sites. Watch."

Load a clip: "Genie, reach out to that CTO from the panel."

Chrome opens. Navigates to LinkedIn. Finds the person. Sends a connection request with a personalized note.

**Say:** "That's my real LinkedIn. Genie sent a real connection request. From a video."

### 2:40-3:00 — THE CLOSE

**Say:** "Genie is agentic social media. You speak. It acts. It doesn't ask permission. It sends you what it did. The more you talk, the smarter it gets. You wished for it."

---

## 17. Hackathon Positioning

### Elevator Pitch (30 seconds)

"Genie watches JellyJelly videos. When you say 'Genie' in a clip, it wakes up — interprets what you said, builds websites, opens your browser, sends LinkedIn requests, emails from your Gmail, deploys to Vercel — all from your voice. Then it texts you on Telegram with everything it did. You can't message Genie. You can only wish."

### The Mischief

An agent that has access to your browser, your LinkedIn, your Gmail — and it acts without asking. That's either the future of productivity or the premise of a horror movie. At MischiefClaw, it's both.

### Taglines

1. **"You wished for it."** (primary)
2. "Speak it into existence."
3. "No prompts. No forms. Just talk."
4. "The hesitation tax is dead."
5. "Your browser is my hands."

---

## 18. Build Timeline (8 Hours)

### Hour 0-1: Core Server + Keyword Detection

| Task | Checkpoint |
|------|------------|
| Genie server (Node.js, polls every 30s) | Server running, detects new clips |
| Keyword detector (scan for "Genie") | Correctly filters clips with keyword |
| Transcript interpreter (LLM → proposal JSON) | Returns structured proposal from raw transcript |
| Local memory setup (`~/.genie/users/`) | JSON files created per user |

### Hour 1-2: Build + Deploy Pipeline

| Task | Checkpoint |
|------|------------|
| build-site.mjs (template + LLM fallback) | Generates beautiful HTML |
| deploy-vercel.mjs | Live URL in 9 seconds |
| deploy-github.mjs | Repo created with code |
| take-screenshot.mjs | PNG from live site |

### Hour 2-3: Browser Automation

| Task | Checkpoint |
|------|------------|
| Headed Playwright setup + persistent profile | Chrome launches with sessions |
| LinkedIn: navigate to profile, send connection | Real request sent |
| Gmail: compose and send email | Real email sent |
| Twitter/X: compose and post tweet | Real tweet posted |

### Hour 3-4: Telegram Reporting

| Task | Checkpoint |
|------|------------|
| Telegram bot sends reports | Message received with full report |
| Screenshot attachment | Photo arrives in Telegram |
| Step-by-step live updates | Real-time progress messages |
| Orchestrator: clip → interpret → execute → report | Full pipeline runs |

### Hour 4-5: End-to-End + Strategy Layer

| Task | Checkpoint |
|------|------------|
| Full loop: JellyJelly clip → keyword → interpret → act → report | Works 3x in a row |
| Strategy layer in interpreter prompt | Proactive recommendations appear |
| Multi-wish handling from single clip | Executes 2+ wishes sequentially |
| Error handling + retries | Graceful failures |

### Hour 5-6: Demo Prep

| Task | Checkpoint |
|------|------------|
| Pre-record/select demo clips | 3 clips with "Genie" keyword |
| Optional: live web dashboard (localhost) | Activity feed renders |
| Demo flow rehearsal 2x | Under 3 minutes |
| Backup video recording | Saved |

### Hour 6-7: Polish + Edge Cases

| Task | Checkpoint |
|------|------------|
| Tune interpreter prompt for comedy/accuracy | Good proposals from messy speech |
| Browser automation timing (slowMo for demo) | Visible but not slow |
| Telegram message formatting | Clean, readable reports |
| Test with random firehose clips | No crashes on weird input |

### Hour 7-8: Submit

| Task | Checkpoint |
|------|------------|
| Push to GitHub | Code public |
| Pre-load demo data | Ready |
| Final rehearsal | Confident |
| Submit | Done |

---

## 19. Fallback Tiers

### Tier 1: MUST WORK

**"Say Genie in a video → website deployed → Telegram report received"**

Requires: server + keyword detector + interpreter + build-site + deploy-vercel + Telegram bot. **The core magic.**

### Tier 2: SHOULD WORK

Tier 1 + headed Chrome doing LinkedIn/Gmail/Twitter actions visible on screen. **The wow factor.**

### Tier 3: NICE TO HAVE

Tier 2 + strategy layer, per-user memory personalization, live web dashboard, NYC feed integration, multi-wish from single clip.

---

## 20. Pre-Hackathon Prep

1. **Browser profile setup** — launch Chrome, log into LinkedIn, Gmail, Twitter, save profile to `~/.genie/browser-profile/`
2. **Test Telegram bot** — send a test message, confirm chat ID
3. **Pre-cache 5 clips** with "Genie" keyword (or record them yourself)
4. **Test Vercel deploy speed** — confirm <15 seconds
5. **Install Playwright chromium** — `npx playwright install chromium`
6. **Set up `~/.genie/` directory** — `users/`, `browser-profile/`, `screenshots/`
7. **Verify all CLIs** — node, gh, vercel, ffmpeg
8. **Test OpenRouter API** — confirm Claude Sonnet works
9. **Record a JellyJelly clip** saying "Genie, build me a test site" — verify detection

---

## 21. Environment Variables

```bash
# Core
OPENROUTER_API_KEY=sk-or-v1-73a86...
OPENROUTER_MODEL=anthropic/claude-sonnet-4-6
GEMINI_API_KEY=AIzaSyDD7X...

# Telegram (reporting)
TELEGRAM_BOT_TOKEN=8352813070:AAE6...
TELEGRAM_CHAT_ID=582706965

# Deploy
GH_OWNER=gtrush03
# vercel + gh CLIs pre-authenticated

# People (optional)
APOLLO_API_KEY=
RESEND_API_KEY=

# Zo Computer
ZO_API_KEY=
ZO_BASE_URL=https://api.zo.computer

# Browser
GENIE_BROWSER_PROFILE=/Users/gtrush/.genie/browser-profile
GENIE_HEADED=true
GENIE_SLOW_MO=100

# Firehose
JELLY_API_URL=https://api.jellyjelly.com/v3
GENIE_KEYWORD=genie
GENIE_POLL_INTERVAL=30000
GENIE_WATCHED_USERS=georgy,iqram
```

---

## 22. File Manifest

```
~/.genie/                              # Genie home directory
├��─ server.mjs                         # Main continuous server (poll + detect + execute)
├── interpreter.mjs                    # Transcript → structured proposal
├── executor.mjs                       # Proposal → action execution
├── browser.mjs                        # Headed Playwright automation
├── telegram.mjs                       # Telegram reporting
├── memory.mjs                         # Per-user JSON memory
├── users/                             # Per-user memory files
│   └── georgy.json
├── browser-profile/                   # Persistent Chrome profile (logged-in sessions)
├── screenshots/                       # Captured screenshots
└── cursor.json                        # Polling state

~/.openclaw/workspace/skills/genie/    # OpenClaw skill integration
├── SKILL.md
└── scripts/
    ├── build-site.mjs                 # Template + LLM site generation
    ├── deploy-vercel.mjs              # vercel --prod (9s)
    ├── deploy-github.mjs              # Git Data API push
    ├── take-screenshot.mjs            # Playwright screenshot
    ├── enrich-person.mjs              # Apollo.io lookup
    ├── send-email.mjs                 # Resend API
    ├── generate-promo.mjs             # LLM copy generation
    └── scan-firehose.mjs              # JellyJelly polling + keyword filter

~/Downloads/genie/                     # Project root
├── GENIE-SPEC.md                      # This document
├── package.json                       # Dependencies
└── dashboard/                         # Optional web dashboard (Tier 3)
    ├── index.html
    └── app.js
```

---

## 23. Post-Hackathon Vision

### Week 1: Stabilize
- Fix bugs from demo day
- Deploy server to always-on hosting (Zo $80 credits or Railway)
- Product Hunt: "AI that grants wishes from video clips"

### Week 2: Expand
- More browser actions (Notion, Google Docs, Calendly)
- Voice cloning — Genie responds with a voice note back on JellyJelly
- Multi-user support — anyone can say "Genie" on JellyJelly

### Week 3: Monetize
- $5/wish for premium builds (custom LLM-generated, not template)
- $10/month subscription: Genie watches all your clips automatically
- White-label: "Genie for Teams"

### Week 4: Platform
- Plugin system: anyone can add new capabilities to Genie
- JellyJelly partnership: official "Genie" integration
- "Wish Wall" — public page showing all granted wishes
- Dreams economy: others tip/fund wishes through JellyJelly's payment rails

### 90-Day Vision
Genie becomes the **voice-first agent interface** — any intent expressed in video gets fulfilled by specialized AI. JellyJelly first, then YouTube, TikTok, voice memos. "Zapier for wishes, triggered by your voice."

---

*Built at MischiefClaw, Betaworks NYC.*
*Powered by: OpenClaw + JellyJelly Firehose + Playwright + Vercel + Telegram*
*You wished for it.*
