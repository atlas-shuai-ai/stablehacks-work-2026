import requests
import json
import time

def get_sol_balance(address):
    url = "https://api.mainnet-beta.solana.com"
    headers = {"Content-Type": "application/json"}
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address]
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        data = response.json()
        if "result" in data:
            return data["result"]["value"] / 10**9 # Lamports to SOL
        else:
            return None
    except Exception as e:
        return f"Error: {e}"

wallet = "2sJRLB2Xb3f5m9Q9u398kHk7X9957mUj4B78b5M84bWv"
balance = get_sol_balance(wallet)
print(f"Wallet: {wallet}")
print(f"Balance: {balance} SOL")
