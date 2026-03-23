import os
import sys
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from eth_account import Account
from loguru import logger

def check_solana_balance():
    # Use public RPC for now
    sol_client = Client("https://api.mainnet-beta.solana.com")
    private_key_str = os.getenv("SOLANA_PRIVATE_KEY")
    
    if not private_key_str:
        logger.error("Missing SOLANA_PRIVATE_KEY")
        return

    # In Solana-py/Solders, we usually need the Keypair
    # But for a quick balance check, we can just derive the pubkey if it's in a known format
    # The user provided a 5tEwh... string (Base58)
    try:
        import base58
        raw_pk = base58.b58decode(private_key_str)
        # Check if it's 32 or 64 bytes
        if len(raw_pk) == 64:
            pubkey = Pubkey(raw_pk[32:])
        else:
            # If 32, we'd need to derive it. Solders Keypair.from_bytes(raw_pk).pubkey()
            from solders.keypair import Keypair
            pubkey = Keypair.from_bytes(raw_pk).pubkey()
            
        balance = sol_client.get_balance(pubkey)
        sol_amount = balance.value / 10**9
        logger.info(f"Solana Address: {pubkey}")
        logger.info(f"Balance: {sol_amount} SOL")
        
        # Get SOL price to estimate USD
        import requests
        price_res = requests.get("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
        sol_price = float(price_res.json()['price'])
        usd_value = sol_amount * sol_price
        logger.info(f"Estimated USD Value: ${usd_value:.2f}")
        
    except Exception as e:
        logger.error(f"Balance check failed: {e}")

if __name__ == "__main__":
    check_solana_balance()
