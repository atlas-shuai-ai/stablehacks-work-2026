const { Connection, PublicKey } = require('@solana/web3.js');

async function test() {
    try {
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const balance = await connection.getBalance(new PublicKey("6nUCmre6k7vj866c1bN6Gq7H8J8v6N6y6R6J6R6J6R6J")); // Placeholder
        console.log("SUCCESS: Connection established.");
    } catch (e) {
        console.error("FAILED:", e.message);
    }
}
test();
