// bridge_engine.js - The Intent-to-Approval Connector for Agentic Institutional Treasury

const { StableAgentPro } = require('./StableAgentPro');

async function main() {
    const agent = new StableAgentPro();
    console.log('[BridgeEngine] Initializing connection between Intent Parsing and Approval Flow...');
    
    const mockIntent = "Swap 100 USDC to SOL for treasury auto-rebalance";
    const result = await agent.processIntent(mockIntent);
    
    console.log(`[BridgeEngine] Final outcome: ${result.status} | TXID/ID: ${result.txid || result.id || 'N/A'}`);
}

main().catch(err => {
    console.error(`[BridgeEngine] Execution ERROR: ${err.message}`);
    process.exit(1);
});
