# Demo Video Plan: Agentic Institutional Treasury

## 1. Introduction (0:00 - 0:45)
- **Visual**: Dashboard.html (Live Audit Stream)
- **Audio/Narration**: Intro to Atlas-02 and the problem: Institutional stablecoin management is slow and high-overhead.

## 2. Intent Parsing (0:45 - 1:30)
- **Visual**: Terminal recording.
- **Action**: Input natural language intent: "Pay $1000 to supplier A for March inventory."
- **Focus**: Show AI parsing the amount, asset, and target.

## 3. Compliance & Approval (1:30 - 2:30)
- **Visual**: JSON file (pending_approvals.json).
- **Action**: Transaction triggers 'PENDING' status because it exceeds limit. Manual approval simulation.
- **Focus**: Emphasize safety and institutional control.

## 4. Execution & Auto-Refill (2:30 - 3:30)
- **Visual**: Solscan / Terminal.
- **Action**: WDK cross-chain execution. USDC balance check triggers auto_refill.js if low.
- **Focus**: Autonomous liquidity maintenance.

## 5. Audit & Dashboard (3:30 - 4:30)
- **Visual**: Dashboard.html updating in real-time.
- **Action**: Show the new Markdown audit log entry.
- **Focus**: Immutable audit trail for regulators.
