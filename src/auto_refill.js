const { Connection, Keypair, VersionedTransaction, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
const REFILL_THRESHOLD_USDC = 5.0; // Refill if USDC < 5
const REFILL_AMOUNT_SOL = 0.05;   // Swap 0.05 SOL to USDC

async function getUsdcBalance(connection, walletPublicKey) {
    try {
        const accounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
            mint: USDC_MINT
        });
        if (accounts.value.length === 0) return 0;
        return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    } catch (e) {
        console.error('Error fetching USDC balance:', e);
        return 0;
    }
}

async function performRefill(connection, wallet) {
    const amountLamports = REFILL_AMOUNT_SOL * 1e9;
    const quoteUrl = `https://public.jupiterapi.com/quote?inputMint=${SOL_MINT.toBase58()}&outputMint=${USDC_MINT.toBase58()}&amount=${amountLamports}&slippageBps=50`;
    
    console.log(`[Auto-Refill] Fetching quote for ${REFILL_AMOUNT_SOL} SOL...`);
    const quoteResponse = await fetch(quoteUrl).then(res => res.json());

    if (!quoteResponse.outAmount) {
        console.error('[Auto-Refill] Quote failed:', quoteResponse);
        return;
    }

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
        console.error('[Auto-Refill] Failed to get swap transaction');
        return;
    }

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([wallet]);

    const txid = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: true,
        maxRetries: 2
    });

    console.log(`[Auto-Refill] Transaction sent: https://solscan.io/tx/${txid}`);
}

async function autoRefill() {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const privKey = process.env.SOLANA_PRIVATE_KEY;
    if (!privKey) throw new Error('SOLANA_PRIVATE_KEY missing');
    
    const decoder = bs58.decode || bs58.default.decode;
    const wallet = Keypair.fromSecretKey(decoder(privKey));

    console.log(`[Auto-Refill] Checking wallet: ${wallet.publicKey.toBase58()}`);
    
    const balance = await getUsdcBalance(connection, wallet.publicKey);
    const solBalance = await connection.getBalance(wallet.publicKey);
    console.log(`[Auto-Refill] Current USDC Balance: ${balance}`);
    console.log(`[Auto-Refill] Current SOL Balance: ${solBalance / 1e9}`);

    if (balance < REFILL_THRESHOLD_USDC) {
        console.log(`[Auto-Refill] Balance ${balance} < Threshold ${REFILL_THRESHOLD_USDC}. Triggering refill...`);
        await performRefill(connection, wallet);
    } else {
        console.log('[Auto-Refill] Balance sufficient. No action needed.');
    }
}

autoRefill().catch(console.error);
