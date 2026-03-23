const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const fetch = require('cross-fetch');
const bs58 = require('bs58');

async function swap() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const walletAddress = keypair.publicKey.toBase58();

    console.log(`Wallet: ${walletAddress}`);

    const fromMint = '44bzge9EZJGPJRYNmsA64mdKZ1eeLdDcDiczRmoyAtez'; // LOS
    const toMint = 'So11111111111111111111111111111111111111112';   // SOL
    const amount = 296707; 
    const slippage = 50; // 50% slippage to force execution

    const url = `https://swap-api.solanatracker.io/swap?from=${fromMint}&to=${toMint}&fromAmount=${amount}&slippage=${slippage}&payer=${walletAddress}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const txnB64 = data.txn;

        const txnBuf = Buffer.from(txnB64, 'base64');
        const txn = VersionedTransaction.deserialize(txnBuf);

        txn.sign([keypair]);

        const txid = await connection.sendRawTransaction(txn.serialize(), {
            skipPreflight: true,
            maxRetries: 2
        });

        console.log(`TX_SUCCESS:https://solscan.io/tx/${txid}`);
    } catch (e) {
        console.error(`TX_ERROR:${e.message}`);
    }
}

swap();
