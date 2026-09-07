# Genie

A voice-triggered agent prototype that connects a video transcript to a coding-agent process and reports progress through Telegram.

The project explores a practical interface question: how can a short spoken request become an inspectable sequence of tool actions? Genie supplies the trigger, process orchestration and reporting around Anthropic's Claude Code.

## Architecture

```text
JellyJelly transcript
  → keyword watcher
  → dispatcher starts a Claude Code subprocess
  → tool events and process output
  → Telegram progress and result messages
```

- [Watcher](src/core/server.mjs): polls for clips and waits for transcript availability.
- [Dispatcher](src/core/dispatcher.mjs): constructs the subprocess invocation, parses streamed events and reports progress.
- [Memory](src/core/memory.mjs): stores wish-history context.
- [Telegram adapter](src/core/telegram.mjs): sends the application's progress and result messages.
- [Browser setup notes](docs/BROWSER-SETUP.md): the original macOS browser integration.

The dispatcher delegates execution to an existing coding agent instead of maintaining a separate hardcoded handler for every request. That expands the available actions but also makes the coding agent's permissions and the surrounding environment part of the application's trust boundary.

## Scope and attribution

Application integration and configuration live in this repository. Development was AI-assisted; commit coauthors record that assistance. Claude Code provides the execution engine. JellyJelly provides video/transcript access, Telegram provides messaging, and Playwright supplies browser automation. Optional deployment and payment integrations depend on their respective providers.

This is a prototype. The original README contained examples of completed wishes; those are historical self-reports, not results independently reproduced in the September 2026 review.

## Review before running

The existing dispatcher requests broad permissions, including `bypassPermissions`, and can inherit an authenticated environment. Setup can install persistent processes, and integrations can send messages, deploy sites or create payment objects. Use an isolated test account and review the configuration before enabling any execution.

Start with source inspection and syntax checks:

```bash
node --check src/core/trigger.mjs
node --check src/core/dispatcher.mjs
node --check src/core/memory.mjs
node --check src/core/executor.mjs
```

These four syntax checks passed on September 7, 2026. No live wish, message, booking, deployment or payment was executed as part of that review. The configured subprocess turn and spending limits are configuration values, not measured latency, cost or successful budget-enforcement results.

## Tradeoffs and next work

The thin wrapper keeps the product surface small and makes new engine capabilities accessible. It also leaves important work around explicit approval boundaries, isolated credentials, restart-safe action tracking and validation of completion claims.

A progress message or generated URL is evidence to inspect, not proof that every requested action succeeded. That distinction is the main engineering lesson this prototype carries into more durable agent systems.
