const { execSync } = require('child_process');
const ApprovalEngine = require('./approval_engine');
const fs = require('fs');
const path = require('path');

const intentText = process.argv[2] || "Transfer 5000 USDC to vault:001";
console.log(`[Bridge] Received intent: "${intentText}"`);

// 1. Run intent engine to parse
let parsed;
try {
    const output = execSync(`node Agentic-Treasury/src/intent_engine.js "${intentText}"`).toString();
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error("[Bridge] Failed to parse intent JSON.");
        process.exit(1);
    }
    parsed = JSON.parse(jsonMatch[0]);
} catch (e) {
    console.error("[Bridge] Error running intent_engine:", e.message);
    process.exit(1);
}

// 2. Run approval engine if amount > 1000 or specific action
const engine = new ApprovalEngine();
if (parseFloat(parsed.amount) > 1000 || parsed.action === 'TRANSFER') {
    engine.requestApproval(parsed).then(id => {
        console.log(`[Bridge] High-value transaction blocked. Request ID: ${id}`);
        console.log(`[Bridge] Human must approve in /root/.openclaw/workspace/pending_approvals.json`);
    });
} else {
    console.log(`[Bridge] Auto-approved: ${parsed.action} ${parsed.amount} ${parsed.asset}`);
}
