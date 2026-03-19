const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

class AgenticTreasury {
    constructor(rpcUrl, walletSecret) {
        this.connection = new Connection(rpcUrl, 'confirmed');
        const decoder = bs58.decode || bs58.default.decode;
        this.wallet = Keypair.fromSecretKey(decoder(walletSecret));
        this.complianceRules = {
            maxAmountPerTx: 1000, 
            allowedMints: [
                'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
                'So11111111111111111111111111111111111111112'  // SOL
            ]
        };
        this.auditLogPath = '/root/.openclaw/workspace/audit_logs';
    }

    async logAudit(request, result) {
        const timestamp = new Date().toISOString();
        const logEntry = `
## Audit Log: ${request.id}
- **Timestamp**: ${timestamp}
- **Amount**: ${request.amount}
- **Asset**: ${request.mint}
- **Status**: ${result.approved ? '✅ APPROVED' : '❌ REJECTED'}
- **Reason/TX**: ${result.reason || result.txid}
-------------------------------------------
`;
        const fileName = `audit_${new Date().getUTCFullYear()}${String(new Date().getUTCMonth() + 1).padStart(2, '0')}${String(new Date().getUTCDate()).padStart(2, '0')}.md`;
        fs.appendFileSync(path.join(this.auditLogPath, fileName), logEntry);
        console.log(`[Audit] Logged ${request.id} to ${fileName}`);
    }

    async runComplianceCheck(request) {
        if (request.amount > this.complianceRules.maxAmountPerTx) {
            return { approved: false, reason: 'Exceeds max amount' };
        }
        return { approved: true };
    }

    async startMonitoring() {
        console.log('--- Agentic Treasury with Auto-Audit Mode ---');
        const mockReq = { id: 'AUDIT_TEST_001', amount: 450, mint: 'USDC' };
        const compliance = await this.runComplianceCheck(mockReq);
        await this.logAudit(mockReq, compliance);
    }
}

const treasury = new AgenticTreasury('https://api.mainnet-beta.solana.com', process.env.SOLANA_PRIVATE_KEY);
treasury.startMonitoring().catch(console.error);
