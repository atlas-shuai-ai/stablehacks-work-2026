import os
import json
import time
import requests
from datetime import datetime

# Configuration
RPC_URL = "https://api.mainnet-beta.solana.com"
WALLET_ADDRESS = "2sJRkki8M84qHu9Yk7BAW8wAvK11ayqGFSgVTyVX4bWv"
THRESHOLD_SOL = 0.05
LOG_FILE = "/root/.openclaw/workspace/wallet_monitor.json"

def get_balance(address):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address]
    }
    try:
        response = requests.post(RPC_URL, json=payload, timeout=10)
        result = response.json()
        if "result" in result:
            lamports = result["result"]["value"]
            return lamports / 10**9
        return None
    except Exception as e:
        print(f"Error fetching balance: {e}")
        return None

def monitor():
    balance = get_balance(WALLET_ADDRESS)
    timestamp = datetime.utcnow().isoformat()
    
    status = "ok"
    if balance is None:
        status = "error"
    elif balance < THRESHOLD_SOL:
        status = "critical"
        
    data = {
        "address": WALLET_ADDRESS,
        "balance_sol": balance,
        "last_check": timestamp,
        "status": status,
        "threshold": THRESHOLD_SOL
    }
    
    with open(LOG_FILE, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"[{timestamp}] Balance: {balance} SOL | Status: {status}")
    
    if status == "critical":
        # Create a trigger file for the assistant to notice in next heartbeat
        with open("/root/.openclaw/workspace/WALLET_ALERT", "w") as f:
            f.write(f"CRITICAL: Balance {balance} SOL is below threshold {THRESHOLD_SOL} SOL")
    elif os.path.exists("/root/.openclaw/workspace/WALLET_ALERT"):
        os.remove("/root/.openclaw/workspace/WALLET_ALERT")

if __name__ == "__main__":
    monitor()
