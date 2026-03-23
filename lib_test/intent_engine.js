// Intent Parser for StableAgentPro - Simple Mockup
class IntentParser {
    constructor() {
        console.log("[IntentParser] Loaded engine with NLU fallback");
    }

    async parse(userInput) {
        console.log(`[IntentParser] User query: "${userInput}"`);
        // Simple mock parsing logic
        const words = userInput.toLowerCase().split(' ');
        const amountIdx = words.indexOf('swap') + 1 || words.indexOf('transfer') + 1;
        const amount = amountIdx ? parseFloat(words[amountIdx]) || 100 : 100;
        const action = words.includes('swap') ? 'swap' : 'transfer';

        return { 
            id: 'INTENT_' + Math.floor(Math.random()*10000),
            action: action,
            amount: amount,
            mint: 'USDC',
            asset: 'USDC' 
        };
    }
}

module.exports = { IntentParser };
