// StableAgentPro.js - Core Executive Agent for StableHacks 2026
// Integrates Intent Parsing, Compliance Checks, and Execution via WDK

const AgenticTreasury = require('./lib_test/agentic_treasury');
const ApprovalEngine = require('./lib_test/approval_engine');
const { IntentParser } = require('./lib_test/intent_engine');

class StableAgentPro {
    constructor() {
        this.treasury = new AgenticTreasury(
            process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
            process.env.SOLANA_PRIVATE_KEY
        );
        this.intentEngine = new IntentParser();
        this.approvalEngine = new ApprovalEngine();
    }

    async processIntent(userInput) {
        console.log(`[StableAgentPro] Parsing intent: "${userInput}"`);
        const intent = await this.intentEngine.parse(userInput);
        
        console.log(`[StableAgentPro] Running compliance for: ${intent.action}`);
        const compliance = await this.treasury.runComplianceCheck(intent);
        
        if (!compliance.approved) {
            console.error(`[StableAgentPro] Compliance REJECTED: ${compliance.reason}`);
            return { status: 'rejected', reason: compliance.reason };
        }

        console.log(`[StableAgentPro] Requesting multisig/manager approval...`);
        const requestId = await this.approvalEngine.requestApproval(intent);
        
        // Mocking checkStatus logic for simulator
        const approvalStatus = await this.approvalEngine.checkStatus(requestId);
        
        if (approvalStatus === 'APPROVED') {
            console.log(`[StableAgentPro] FINAL EXECUTION TRIGGERED`);
            // TODO: WDK Cross-chain execution logic
            return { status: 'executed', txid: 'MOCK_TX_7788' };
        }

        return { status: 'pending_approval', id: requestId };
    }
}

module.exports = { StableAgentPro };
