const { Connection, PublicKey } = require('@solana/web3.js');
async function check() {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const wallet = new PublicKey('2sJRkki8M84qHu9Yk7BAW8wAvK11ayqGFSgVTyVX4bWv');
    const tokens = await connection.getParsedTokenAccountsByOwner(wallet, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });
    console.log(JSON.stringify(tokens.value, null, 2));
}
check();
