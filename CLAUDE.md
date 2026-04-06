# Genie — Claude Code Project Config

## Startup Behavior

When a user opens Claude Code in this directory for the first time, greet them with:

```
Welcome to Genie.

You wished for it. I make it real.

Genie is a voice-triggered autonomous agent — say "genie" in a JellyJelly
video and I spawn a Claude Code instance that executes your wish end-to-end:
building websites, posting on X, ordering Uber Eats, creating Stripe invoices,
reaching out on LinkedIn — anything you can say into a camera.

Status: let me check...
```

Then immediately run these checks and report results inline:
1. `ls .env` — if missing: "No .env found. Run `bash setup.sh` to configure."
2. `launchctl list | grep com.genie.server` — if running: "Server: RUNNING (PID xxx)" / if not: "Server: STOPPED"
3. `curl -s -o /dev/null -w '%{http_code}' --max-time 2 http://127.0.0.1:9222/json/version` — if 200: "Chrome CDP: CONNECTED" / if not: "Chrome CDP: DOWN"
4. `ls ~/.claude/skills/ubereats-order/SKILL.md` — if exists: "Uber Eats skills: INSTALLED (5)" / if not: "Uber Eats skills: NOT INSTALLED — run `bash setup.sh`"

End with:
```
Ready. Record a JellyJelly clip and say "Genie, ..." — or tell me what to fix.
```

If anything is broken, offer to fix it. If everything is green, wait for the user's command. If `setup.sh` hasn't been run (no .env, no launchd agents), say: "First time? Run `bash setup.sh` — it takes 5 minutes." Do NOT run setup.sh automatically.

---

Voice-triggered autonomous agent: JellyJelly video keyword "genie" in transcript spawns a Claude Code subprocess that executes the wish and reports results to Telegram.

## Architecture

```
JellyJelly API (polling) → server.mjs → keyword detected → dispatcher.mjs
  → spawns `claude -p` with system prompt + Playwright MCP + bypass permissions
  → Claude Code executes wish (browse, code, deploy, message, order food, etc.)
  → streams tool-use events as Telegram updates → final report to Telegram
```

Persistent Chrome runs via launchd with CDP on `127.0.0.1:9222`. User is pre-logged into LinkedIn, Gmail, X, Vercel, GitHub, Uber Eats, Stripe. The spawned Claude Code inherits those sessions via Playwright MCP.

## Key Files

| Path | Purpose |
|------|---------|
| `src/core/server.mjs` | Main polling loop — watches JellyJelly firehose |
| `src/core/dispatcher.mjs` | Spawns `claude -p` subprocess with system prompt + MCP |
| `src/core/firehose.mjs` | JellyJelly API client — poll, fetch clip, detect keyword |
| `src/core/interpreter.mjs` | Legacy transcript interpreter (OpenRouter) |
| `src/core/telegram.mjs` | Telegram bot reporting (one-way, user cannot reply) |
| `src/core/trigger.mjs` | Manual trigger: `node src/core/trigger.mjs <clip-id>` |
| `src/core/memory.mjs` | Wish memory / deduplication |
| `config/genie-system.md` | **System prompt** for spawned Claude Code subprocesses |
| `config/mcp.json` | MCP server config (Playwright → CDP endpoint) |
| `config/prompts.mjs` | Prompt templates |
| `src/scripts/` | Helper scripts: build-site, deploy-vercel, research-topic, etc. |
| `src/browser/` | Browser setup/profile utilities |
| `examples/` | LaunchAgent plist templates |
| `test/` | Test scripts (api, deploy, telegram, browser, keyword) |

## Environment Variables (.env)

**Required:**
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — Reporting channel
- `GENIE_KEYWORD` — Trigger word (default: "genie")

**Dispatcher tuning (all have defaults):**
- `GENIE_CLAUDE_BIN` — Path to claude binary (default: auto-detect)
- `GENIE_CLAUDE_MODEL` — Model override (sonnet/opus)
- `GENIE_MAX_TURNS` / `GENIE_MAX_BUDGET_USD` — Safety limits
- `GENIE_CLAUDE_TIMEOUT_MS` — Hard timeout (default: 60min)

**Polling:**
- `JELLY_API_URL` — JellyJelly endpoint
- `GENIE_POLL_INTERVAL` / `GENIE_FAST_RETRY_INTERVAL` / `GENIE_FAST_RETRY_MAX_MS`

**Optional integrations:**
- `OPENROUTER_API_KEY` — Legacy interpreter
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — Payment wishes
- `GEMINI_API_KEY` — Vision/grounding
- `GH_OWNER` — GitHub username for Vercel deploys

**Browser:**
- `GENIE_BROWSER_PROFILE` — Chrome profile path (default: `~/.genie/browser-profile`)
- `GENIE_CDP_ENDPOINT` — CDP URL (default: `http://127.0.0.1:9222`)

## Start / Stop / Restart

```bash
# Start (both services)
launchctl load -w ~/Library/LaunchAgents/com.genie.chrome.plist
launchctl load -w ~/Library/LaunchAgents/com.genie.server.plist

# Stop
launchctl unload ~/Library/LaunchAgents/com.genie.server.plist
launchctl unload ~/Library/LaunchAgents/com.genie.chrome.plist

# Restart server only
launchctl unload ~/Library/LaunchAgents/com.genie.server.plist
launchctl load -w ~/Library/LaunchAgents/com.genie.server.plist

# Dev mode (foreground)
npm start

# Check status
launchctl list | grep genie
curl http://127.0.0.1:9222/json/version
```

## How the Dispatcher Works

`dispatcher.mjs` spawns: `claude -p "<wish transcript>" --system-prompt <config/genie-system.md> --mcp-config <config/mcp.json> --output-format stream-json --model <model> --max-turns <N> --permission-mode bypassPermissions`

The child process streams JSON events. Dispatcher parses them, forwards tool-use summaries to Telegram (throttled to 1 msg per 3s), and sends the final assistant text as the completion report.

## Uber Eats Skills

Located at `~/.claude/skills/ubereats-*/` (5 skills: search, add-to-cart, order, checkout, pay). These are user-level Claude Code skills the spawned subprocess can invoke for food/grocery ordering. The repo has copies in `skills/` — `setup.sh` installs them.

## Testing

```bash
# Trigger a fake wish (needs a real clip ID from JellyJelly)
node src/core/trigger.mjs <clip-id>
npm run trigger

# Test individual subsystems
npm run test:api        # JellyJelly API connectivity
npm run test:telegram   # Telegram bot send
npm run test:browser    # Chrome CDP connectivity
npm run test:keyword    # Keyword detection logic
npm run test:deploy     # Vercel deploy flow
npm run test:all        # Run everything
```

## Resuming a Killed Wish

If a wish subprocess dies (timeout, crash, OOM): check `/tmp/genie-logs/launchd.err.log` for the transcript. Re-trigger manually: `node src/core/trigger.mjs <clip-id>`. The dispatcher deduplicates by clip ID via `memory.mjs`, so clear the memory file or use a fresh clip ID if needed.

## Known Bug Fixes Applied

1. **transcript_overlay field** — JellyJelly API changed field name; firehose.mjs handles both old and new field names
2. **Vercel deploy URL** — deploy-vercel.mjs was constructing wrong project URLs; fixed to use actual Vercel API response
3. **Search focus** — Uber Eats search input requires clicking the overlay first before typing; skills handle the two-step focus

## Settings

Project permissions for spawned Claude Code sessions (also in `.claude/settings.json`):

```json
{
  "permissions": {
    "allow": [
      "Bash(*)", "Read", "Write", "Edit", "MultiEdit", "Glob", "Grep",
      "Task", "TodoWrite", "WebSearch", "WebFetch(*)", "Skill(*)",
      "mcp__playwright__*"
    ],
    "deny": [],
    "defaultMode": "bypassPermissions"
  }
}
```

## Logs

- Server stdout: `/tmp/genie-logs/launchd.out.log`
- Server stderr: `/tmp/genie-logs/launchd.err.log`
- Chrome stdout: `/tmp/genie-logs/chrome.out.log`
- Chrome stderr: `/tmp/genie-logs/chrome.err.log`
