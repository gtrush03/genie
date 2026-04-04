# GENIE — Phased Build Plan

Target: **Testing by 3 PM.** Each phase has a pre-written prompt, exact files, and a test checkpoint.

---

## Phase 0: Record Test Video (5 min) — DO THIS FIRST

**Action:** Open JellyJelly app. Record a short video (~15 seconds) saying:

> "Hey Genie, I want you to build me a landing page for an AI meetup event I'm hosting in NYC. Call it 'AI Builders NYC' — make it look clean, dark theme, and include the date April 12th, a location section, and a signup button."

Post it publicly. Note the clip ID from the URL.

**Why first:** The server needs a real clip with the keyword "Genie" in the transcript. No clip = nothing to test against. Do this NOW, it takes 2 minutes, and by the time Phase 1 is done, JellyJelly will have processed the transcript.

---

## Phase 1: Firehose + Keyword Detection (25 min)

**Files to implement:**
- `src/core/firehose.mjs` — poll JellyJelly, track cursor, return new clips
- `src/core/server.mjs` — continuous loop, calls firehose, detects keyword
- `test/test-jelly-api.mjs` — verify API works
- `test/test-keyword.mjs` — verify keyword detection

**What it does:**
1. Polls `GET /v3/jelly/search?ascending=false&page_size=50&start_date={cursor}` every 15s
2. For each new clip, fetches `GET /v3/jelly/{id}` for full transcript
3. Scans `transcript_overlay.results.channels[0].alternatives[0].words` for "genie"
4. If found → logs the clip + reconstructed transcript text
5. If not → skips silently

**Test checkpoint:**
```bash
# Should return a list of recent clips
npm run test:api

# Should detect "genie" in a known transcript
npm run test:keyword

# Should poll and log new clips
npm start
# (let it run for 30 seconds, verify it detects your test video)
```

**Depends on:** Phase 0 (test video recorded)

---

## Phase 2: Interpreter + Site Builder + Deploy (30 min)

**Files to implement:**
- `src/core/interpreter.mjs` — transcript → structured proposal JSON
- `config/prompts.mjs` — interpreter system prompt + strategy prompt
- `src/scripts/build-site.mjs` — template interpolation → index.html
- `src/templates/landing.html` — full Tailwind template (dark, glass, responsive)
- `src/scripts/deploy-vercel.mjs` — shell out to vercel CLI
- `src/core/trigger.mjs` — manual trigger for a specific clip ID
- `test/test-interpreter.mjs` — verify proposal JSON from sample transcript
- `test/test-vercel-deploy.mjs` — deploy test HTML, verify URL

**What it does:**
1. Takes reconstructed transcript + creator username
2. Sends to OpenRouter (Claude Sonnet) with interpreter prompt
3. Returns structured proposal: `{ title, summary, wishes[], strategy, ignored[] }`
4. For BUILD wishes: interpolates Tailwind template with proposal data
5. Writes HTML to `/tmp/genie/{slug}/index.html`
6. Runs `vercel deploy --yes --prod` → captures live URL
7. Returns `{ url, dir, deployTime }`

**The Tailwind template must be BEAUTIFUL:** dark bg (#0a0a0a), glass panels, gradient accents, responsive, hero section, features grid, CTA button, footer with "Built by Genie" credit.

**Test checkpoint:**
```bash
# Interpret a sample transcript
npm run test:interpret

# Deploy a test site
npm run test:deploy

# Manual trigger: process your recorded clip
node src/core/trigger.mjs <your-clip-id>
# Should: interpret → build → deploy → print live URL
```

**Depends on:** Phase 1 (firehose working)

---

## Phase 3: Telegram Reporting + Full Loop (25 min)

**Files to implement:**
- `src/core/telegram.mjs` — send messages, photos, reports
- `src/scripts/take-screenshot.mjs` — Playwright screenshot of deployed URL
- `src/core/executor.mjs` — orchestrator: proposal → execute wishes → compile report
- Wire `server.mjs` to full loop: detect → interpret → execute → report
- `test/test-telegram.mjs` — send test message

**What it does:**
1. After each wish is executed, sends progress update to Telegram
2. After all wishes done, sends final report with:
   - Proposal summary
   - Live URL(s)
   - Screenshot(s)
   - Strategy recommendations
   - Timing stats
3. Server now runs full loop automatically

**Telegram message format:**
```
GENIE REPORT
━━━━━━━━━━━━━━━
Heard you in: "AI Builders NYC Meetup"

✓ Built: https://ai-builders-nyc.vercel.app (12s)
✓ Screenshot attached

Strategy: Share this on LinkedIn tonight.
The event market in NYC is hot right now.

— Genie (47s total)
```

**Test checkpoint:**
```bash
# Send test message to Telegram
npm run test:telegram

# Full loop: start server, it detects your clip, builds, deploys, sends report
npm start
# Telegram notification should arrive within 60 seconds
```

**Depends on:** Phase 2 (build + deploy working)

---

## Phase 4: Capabilities Expansion (Tier 2, after 3 PM)

**Files to implement:**
- `src/browser/automation.mjs` — headed Playwright with persistent profile
- `src/browser/setup-profile.mjs` — one-time login setup
- `src/scripts/enrich-person.mjs` — Apollo.io lookup
- `src/scripts/send-email.mjs` — Resend API
- `src/scripts/generate-promo.mjs` — LLM promo copy
- `src/scripts/deploy-github.mjs` — Git Data API push
- `src/core/memory.mjs` — per-user JSON memory
- `test/test-browser.mjs` — headed Chrome test

**Capabilities added:**
- LinkedIn connection requests (headed Chrome)
- Gmail sending (headed Chrome)
- Twitter/X posting (headed Chrome)
- Apollo.io person enrichment
- Cold email via Resend
- Promo copy generation
- GitHub repo creation
- Per-user memory (preferences, past builds)

**Priority order within Phase 4:**
1. Browser setup + LinkedIn connect (biggest demo impact)
2. Gmail send (second biggest)
3. Promo copy generation
4. GitHub push
5. Apollo enrichment
6. Per-user memory
7. Resend email

**Depends on:** Phase 3 (full loop working)

---

## Phase 5: Dashboard + Polish (Tier 3, time permitting)

**Files to implement:**
- `dashboard/server.mjs` — local Express + SSE server
- `dashboard/index.html` — live activity dashboard

**Features:**
- Left: JellyJelly clip playing + transcript
- Center: Live activity feed (each step as it happens)
- Right: Results — deployed URLs, screenshots
- Bottom: Browser view showing Chrome actions

**Depends on:** Phase 4

---

## Prompt Execution Strategy

Each phase gets a **pre-written prompt** that an Opus agent can execute independently. The prompts include:
- Exact file paths to create/modify
- Full code to write (not pseudocode)
- Test commands to verify
- Clear "DONE when:" criteria

**Execution flow:**
```
Phase 0: YOU record video on JellyJelly (2 min)
Phase 1: Agent 1 builds firehose + keyword detection (25 min)
Phase 2: Agent 2 builds interpreter + site builder + deploy (30 min)  
Phase 3: Agent 3 builds Telegram + executor + full loop wiring (25 min)
Phase 4: Agent 4 builds browser automation + capabilities (after 3 PM)
```

Phases 1-3 are sequential (each depends on the previous). Phase 4+ can run after Phase 3 is verified working.

---

## Timeline

```
1:00 PM  — Phase 0: Record JellyJelly test video
1:05 PM  — Phase 1: Firehose + keyword detection
1:30 PM  — Phase 2: Interpreter + build + deploy
2:00 PM  — Phase 3: Telegram + full loop
2:25 PM  — End-to-end test (your clip → Telegram report)
2:40 PM  — Fix bugs, tune prompts
3:00 PM  — TESTING CHECKPOINT: full pipeline working
3:00+ PM — Phase 4: Browser automation, capabilities expansion
```

---

## Repo Structure

```
genie/
├── README.md                  # Project overview
├── GENIE-SPEC.md              # Complete build specification (v2)
├── PHASES.md                  # This file
├── package.json               # Node.js project config (ESM)
├── .env                       # API keys (gitignored)
├── .env.example               # Template for env vars
├── .gitignore
│
├── src/
│   ├── core/                  # Core pipeline
│   │   ├── server.mjs         # Main continuous server (Phase 1)
│   │   ├── trigger.mjs        # Manual clip trigger (Phase 2)
│   │   ├── firehose.mjs       # JellyJelly polling + keyword detection (Phase 1)
│   │   ├── interpreter.mjs    # Transcript → proposal JSON (Phase 2)
│   │   ├── executor.mjs       # Proposal → execute wishes (Phase 3)
│   │   ├── telegram.mjs       # One-way Telegram reporting (Phase 3)
│   │   └── memory.mjs         # Per-user JSON memory (Phase 4)
│   │
│   ├── scripts/               # Individual action scripts
│   │   ├── build-site.mjs     # Template → HTML generation (Phase 2)
│   │   ├── deploy-vercel.mjs  # Vercel CLI deploy (Phase 2)
│   │   ├── deploy-github.mjs  # Git Data API push (Phase 4)
│   │   ├── take-screenshot.mjs # Playwright screenshot (Phase 3)
│   │   ├── enrich-person.mjs  # Apollo.io lookup (Phase 4)
│   │   ├── send-email.mjs     # Resend API (Phase 4)
│   │   └── generate-promo.mjs # LLM promo copy (Phase 4)
│   │
│   ├── browser/               # Headed Chrome automation
│   │   ├── automation.mjs     # LinkedIn, Gmail, Twitter actions (Phase 4)
│   │   └── setup-profile.mjs  # One-time login setup (Phase 4)
│   │
│   └── templates/             # HTML templates
│       └── landing.html       # Tailwind landing page template (Phase 2)
│
├── config/
│   └── prompts.mjs            # Centralized LLM prompts
│
├── test/                      # Test scripts
│   ├── test-jelly-api.mjs     # Phase 1
│   ├── test-keyword.mjs       # Phase 1
│   ├── test-interpreter.mjs   # Phase 2
│   ├── test-vercel-deploy.mjs # Phase 2
│   ├── test-telegram.mjs      # Phase 3
│   ├── test-browser.mjs       # Phase 4
│   └── run-all.mjs            # Run all tests
│
└── dashboard/                 # Optional live UI (Phase 5)
    └── server.mjs
```

---

## Capabilities Demo Plan

For the hackathon demo, show variety — not just "build a site":

**Demo 1 (main):** "Genie, build me a landing page for AI Builders NYC"
→ Site deploys, URL appears, screenshot in Telegram

**Demo 2 (outreach):** "Genie, reach out to that CTO from the panel"
→ Chrome opens, navigates LinkedIn, sends connection request

**Demo 3 (social):** "Genie, post about this on Twitter"
→ Chrome opens Twitter, posts tweet about the deployed site

**Demo 4 (proactive):** "Genie, I had this idea about a creator economy platform"
→ Genie interprets the idea, builds a site for it, suggests strategy

**For other people testing:** They record a JellyJelly clip saying "Genie, [wish]" and watch it happen. The variety proves it's not hardcoded.
