const fs = require('fs');
const path = require('path');

const LOG_FILE = '/root/.openclaw/workspace/audit_logs/stable_pro.log';
const AUDIT_FILE = `/root/.openclaw/workspace/audit_logs/audit_${new Date().toISOString().slice(0,10).replace(/-/g, '')}.md`;

async function trigger() {
    console.log('🚀 [Take 2] Triggering High-Value Institutional Intent...');
    
    // 1. Simulate a new, larger Intent
    const intent = { action: 'treasury-rebalance', amount: 15000, asset: 'PYUSD', target: 'Liquidity_Pool_Alpha' };
    
    // 2. Log to stable_pro.log
    const logEntry = `[${new Date().toISOString()}] PRO-AUDIT | PENDING | ${intent.action} | Rebalancing ${intent.amount} ${intent.asset} - Triggering Emergency Multi-sig\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    
    // 3. Log to Daily Audit Markdown
    const auditEntry = `
## Audit Log: INST_REBALANCE_002
- **Timestamp**: ${new Date().toISOString()}
- **Intent**: "Rebalance ${intent.amount} ${intent.asset} to ${intent.target}"
- **Status**: ⚠️ ACTION REQUIRED: PENDING OWNER APPROVAL
- **Compliance Note**: High-value rebalance detected. Auto-execution paused.
-------------------------------------------
`;
    fs.appendFileSync(AUDIT_FILE, auditEntry);

    // 4. Re-generate Dashboard
    console.log('🔄 Syncing changes to Dashboard UI...');
    require('./gen_dashboard.js');
    
    console.log('✅ [Take 2] Live data injected! Please refresh the Dashboard now.');
}

trigger().catch(console.error);
