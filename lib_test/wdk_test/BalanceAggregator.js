const WDK = require('@tetherto/wdk').default;

class BalanceAggregator {
    constructor(seed) {
        this.wdk = new WDK(seed || WDK.getRandomSeedPhrase());
        this.chains = ['solana', 'ethereum', 'tron', 'bitcoin'];
    }

    async fetchAllBalances() {
        console.log('--- WDK Unified Balance Aggregator ---');
        const summary = {};
        for (const chain of this.chains) {
            try {
                // In actual WDK implementation: 
                // const account = await this.wdk.getAccount(chain, 0);
                // const balance = await account.getBalance();
                
                // Mocking unified interface response for logic verification
                const mockBalance = (Math.random() * 100).toFixed(4);
                summary[chain] = mockBalance;
                console.log(`[WDK] Fetched ${chain} balance: ${mockBalance}`);
            } catch (err) {
                console.error(`[WDK] Failed to fetch ${chain}:`, err.message);
            }
        }
        return summary;
    }
}

const aggregator = new BalanceAggregator();
aggregator.fetchAllBalances().then(res => {
    console.log('\nFinal Aggregate Report:', res);
});
