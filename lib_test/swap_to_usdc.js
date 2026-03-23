const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

async function swap() {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const privKey = process.env.SOLANA_PRIVATE_KEY;
    const decoder = bs58.decode || bs58.default.decode;
    const wallet = Keypair.fromSecretKey(decoder(privKey));

    console.log('Wallet:', wallet.publicKey.toBase58());

    // 使用 public.jupiterapi.com
    const amount = 10000000; // 0.01 SOL
    const quoteUrl = `https://public.jupiterapi.com/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${amount}&slippageBps=50`;
    
    console.log('Fetching quote...');
    const quoteResponse = await fetch(quoteUrl).then(res => res.json());

    if (!quoteResponse.outAmount) {
        console.error('Quote failed:', quoteResponse);
        return;
    }
    console.log('Quote received. Expected USDC:', quoteResponse.outAmount / 1e6);

    console.log('Fetching swap transaction...');
    const { swapTransaction } = await fetch('https://public.jupiterapi.com/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toBase58(),
            wrapAndUnwrapSol: true,
        })
    }).then(res => res.json());

    if (!swapTransaction) {
        console.error('Failed to get swap transaction');
        return;
    }

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([wallet]);

    const rawTransaction = transaction.serialize();
    console.log('Sending transaction...');
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });

    console.log(`Transaction sent! ID: https://solscan.io/tx/${txid}`);
    console.log('Waiting for confirmation (max 60s)...');
    
    let confirmed = false;
    for (let i = 0; i < 30; i++) {
        const status = await connection.getSignatureStatus(txid);
        if (status && status.value && status.value.confirmationStatus === 'confirmed') {
            console.log('✅ Transaction Confirmed!');
            confirmed = true;
            break;
        }
        await new Promise(r => setTimeout(r, 2000));
    }
    if (!confirmed) console.log('Transaction is taking longer than expected. Check Solscan.');
}

swap().catch(console.error);
