# Genie 🧞

> **"You wished for it."**

Agentic social media agent that watches JellyJelly videos, interprets your spoken wishes, and makes them real — deploying websites, sending emails, reaching out on LinkedIn, posting on Twitter — all from your voice. Then sends you the receipt on Telegram.

Built for [MischiefClaw](https://www.betaworks.com/event/mischiefclaw-hack-ny) hackathon at Betaworks NYC.

## How It Works

1. Record a JellyJelly video and say **"Genie"** anywhere in it
2. Genie's server detects the keyword in your transcript
3. Interprets your rambling into a structured proposal
4. Executes: builds sites, deploys to Vercel, opens Chrome, sends LinkedIn requests, emails from Gmail
5. Sends you a Telegram report with everything it did

**You can't message Genie. You can only wish.**

## Stack

- **Input:** JellyJelly Firehose API (public, no auth, word-level Deepgram transcripts)
- **Brain:** Claude Sonnet 4.6 via OpenRouter / Zo Computer
- **Hands:** Playwright (headed Chrome with your logged-in sessions)
- **Deploy:** Vercel CLI (9-second deploys) + GitHub Git Data API
- **Output:** Telegram Bot (one-way reporting)
- **Runtime:** OpenClaw agent framework

## Quick Start

```bash
# Clone
git clone https://github.com/gtrush03/genie.git
cd genie

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your API keys

# Run
npm start
```

## Capabilities

| You say in a video... | Genie does... |
|----------------------|---------------|
| "Genie, build me a site for X" | Generates + deploys to Vercel, sends URL |
| "Genie, reach out to [person]" | Opens Chrome, finds them on LinkedIn, sends request |
| "Genie, email [person] about Y" | Opens Gmail, composes and sends from your account |
| "Genie, post about this on Twitter" | Opens Chrome, posts tweet |
| "Genie, research [company]" | Apollo.io enrichment + web research → report |
| "Genie, I have an idea for..." | Interprets idea, builds a site, suggests strategy |

## Architecture

```
JellyJelly Video → Keyword "Genie" Detected → Transcript Interpreted
  → Wishes Extracted → Executed (Build/Deploy/Browse/Email)
    → Telegram Report Sent
```

See [GENIE-SPEC.md](./GENIE-SPEC.md) for the complete build specification.
See [PHASES.md](./PHASES.md) for the phased build plan.

## License

MIT

---

*Built at MischiefClaw, Betaworks NYC. April 2026.*
