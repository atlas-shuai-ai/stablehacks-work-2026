const { Connection, PublicKey } = require('@solana/web3.js');
async function checkBalance() {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const balance = await connection.getBalance(new PublicKey('2sJRkki8M84qHu9Yk7BAW8wAvK11ayqGFSgVTyVX4bWv'));
    console.log(`Balance: ${balance / 1e9} SOL`);
}
checkBalance().catch(console.error);
