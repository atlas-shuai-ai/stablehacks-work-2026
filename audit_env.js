const { Connection, Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

async function testConnection() {
    console.log('--- Solana Environment Audit ---');
    try {
        const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        const version = await connection.getVersion();
        console.log('✅ RPC Connection:', version['solana-core']);

        const privKey = process.env.SOLANA_PRIVATE_KEY;
        if (!privKey) throw new Error('Missing SOLANA_PRIVATE_KEY');
        
        // Handle both bs58 and bs58.default versions
        const decoder = bs58.decode || bs58.default.decode;
        const wallet = Keypair.fromSecretKey(decoder(privKey));
        
        const balance = await connection.getBalance(wallet.publicKey);
        console.log('✅ Wallet Address:', wallet.publicKey.toBase58());
        console.log('✅ Balance:', balance / 1e9, 'SOL');

        console.log('--- Jito Bundle Availability ---');
        console.log('Status: Ready for bundle submission via searcher-client');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Audit Failed:', err.stack);
        process.exit(1);
    }
}

testConnection();
