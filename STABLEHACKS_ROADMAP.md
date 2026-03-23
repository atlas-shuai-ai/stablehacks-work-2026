# StableHacks 2026 - Execution Strategy (Draft v1)

## Project: Agentic Institutional Treasury
**Concept**: A programmable treasury system on Solana where an AI agent manages stablecoin flows based on predefined compliance rules and auto-generates audit reports.

## Roadmap
1.  **Phase 1: Compliance Core (DONE)**
    *   Hardcoded rules (Max amount, Whitelisted assets).
    *   Automatic audit logging in Markdown format.
2.  **Phase 2: Automated Payouts (IN PROGRESS)**
    *   Integration with Jupiter API for stablecoin swaps.
    *   Scheduled batch payments (Cron integration).
3.  **Phase 3: Integration & Dashboard (UPCOMING)**
    *   Feishu/Lark notification for approval requests.
    *   Real-time reporting generator.

## Tasks for Today (2026-03-17)
- [x] Switch to FULL THROTTLE mode (Priority 1: StableHacks).
- [x] Verify environment and basic audit logging.
- [x] Create a "Request API" mockup (simple JSON receiver).
- [x] Implement SOL -> USDC auto-refill logic for treasury. (Done: auto_refill.js)
