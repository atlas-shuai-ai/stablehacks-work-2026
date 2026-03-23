const fetch = require('node-fetch');
const apiKey = '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';

async function search() {
    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: apiKey,
            query: 'StableHacks 2026 challenge tracks focus areas institutional stablecoin infrastructure',
            search_depth: 'advanced'
        })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}
search();
