#!/usr/bin/env node
// Genie Manual Trigger — Process a specific clip by ID (bypass polling)
// Usage: node src/core/trigger.mjs <clip-id>
// Fallback for when polling is flaky or for testing specific clips

// TODO: Phase 2 implementation
const clipId = process.argv[2];
if (!clipId) { console.error('Usage: node trigger.mjs <clip-id>'); process.exit(1); }
console.log(`[GENIE] Triggering for clip: ${clipId}`);
