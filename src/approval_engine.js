const fs = require('fs');
const path = require('path');

const APPROVAL_FILE = '/root/.openclaw/workspace/pending_approvals.json';
const LOG_FILE = '/root/.openclaw/workspace/audit_logs/stable_pro.log';

class ApprovalEngine {
    constructor() {
        if (!fs.existsSync(APPROVAL_FILE)) {
            fs.writeFileSync(APPROVAL_FILE, JSON.stringify([]));
        }
    }

    // Agent submits a request for human approval
    async requestApproval(intent) {
        console.log(`[Approval] High-value intent detected: ${intent.action} ${intent.amount} ${intent.asset || 'USDC'}`);
        const requests = JSON.parse(fs.readFileSync(APPROVAL_FILE));
        const newRequest = {
            id: 'req_' + Date.now(),
            intent,
            status: 'PENDING',
            timestamp: new Date().toISOString()
        };
        requests.push(newRequest);
        fs.writeFileSync(APPROVAL_FILE, JSON.stringify(requests, null, 2));
        console.log(`[Approval] Request ${newRequest.id} saved. Waiting for human to set status to 'APPROVED' in ${APPROVAL_FILE}`);
        return newRequest.id;
    }

    // Checks if a request has been approved by the user
    async checkStatus(requestId) {
        const requests = JSON.parse(fs.readFileSync(APPROVAL_FILE));
        const req = requests.find(r => r.id === requestId);
        return req ? req.status : 'NOT_FOUND';
    }
}

// Demo usage simulation
if (require.main === module) {
    const engine = new ApprovalEngine();
    engine.requestApproval({ action: 'transfer', amount: 5000, target: 'institution_vault_001' });
}

module.exports = ApprovalEngine;
