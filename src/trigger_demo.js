const fs = require('fs');
const path = require('path');

const LOG_FILE = '/root/.openclaw/workspace/audit_logs/stable_pro.log';
const AUDIT_FILE = `/root/.openclaw/workspace/audit_logs/audit_${new Date().toISOString().slice(0,10).replace(/-/g, '')}.md`;

async function trigger() {
    console.log('🚀 Triggering Live Demo Intent...');
    
    // 1. Simulate Intent Parsing
    const intent = { action: 'cross-chain-payment', amount: 2500, asset: 'USDC', target: 'Berlin_Office_Vault' };
    
    // 2. Log to stable_pro.log (Internal Logic Flow)
    const logEntry = `[${new Date().toISOString()}] PRO-AUDIT | PENDING | ${intent.action} | Amount: ${intent.amount} ${intent.asset} - Awaiting Multi-sig Approval\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    
    // 3. Log to Daily Audit Markdown (Formal Report)
    const auditEntry = `
## Audit Log: DEMO_REALTME_001
- **Timestamp**: ${new Date().toISOString()}
- **Intent**: "Transfer ${intent.amount} ${intent.asset} to ${intent.target}"
- **Status**: ⏳ PENDING APPROVAL
- **Compliance Note**: Transaction exceeds $1000 threshold. Verification required.
-------------------------------------------
`;
    fs.appendFileSync(AUDIT_FILE, auditEntry);

    // 4. Re-generate Dashboard
    console.log('🔄 Refreshing Dashboard data...');
    require('./gen_dashboard.js');
    
    console.log('✅ Demo data injected! User should refresh Dashboard now.');
}

trigger().catch(console.error);
