const fs = require('fs');
const path = require('path');

const intent = process.argv[2] || "";
console.log(`[Intent] Processing: "${intent}"`);

const patterns = {
    transfer: /(?:transfer|send|pay)\s+(\d+(?:\.\d+)?)\s+(usdc|sol)\s+(?:to\s+)?([\w:_]+)/i,
    swap: /(?:swap|exchange)\s+(\d+(?:\.\d+)?)\s+(sol|usdc)\s+(?:for|to)\s+(sol|usdc)/i,
    balance: /(?:check|show|get)\s+(?:my\s+)?balance/i
};

function parse(text) {
    if (patterns.transfer.test(text)) {
        const match = text.match(patterns.transfer);
        return { action: 'TRANSFER', amount: match[1], asset: match[2].toUpperCase(), recipient: match[3] };
    }
    if (patterns.swap.test(text)) {
        const match = text.match(patterns.swap);
        return { action: 'SWAP', amount: match[1], from: match[2].toUpperCase(), to: match[3].toUpperCase() };
    }
    if (patterns.balance.test(text)) {
        return { action: 'BALANCE_CHECK' };
    }
    return { action: 'UNKNOWN' };
}

const result = parse(intent);
console.log(`[Result] Action: ${result.action}`);
if (result.action !== 'UNKNOWN') {
    console.log(JSON.stringify(result, null, 2));
} else {
    console.log("Could not parse intent. Try: 'Transfer 5 USDC to user:alice'");
}
