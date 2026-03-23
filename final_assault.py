import os
import sys
import json
import base64
import requests

# ATLAS-02 暴力执行引擎 v4.0 (NATIVE CURL & RAW RPC)

PRIVATE_KEY = os.environ.get("SOLANA_PRIVATE_KEY")
RPC_URL = "https://api.mainnet-beta.solana.com"

def get_swap_txn(from_mint, to_mint, amount, slippage=30):
    payer = "2sJRkki8M84qHu9Yk7BAW8wAvK11ayqGFSgVTyVX4bWv"
    url = f"https://swap-api.solanatracker.io/swap?from={from_mint}&to={to_mint}&fromAmount={amount}&slippage={slippage}&payer={payer}"
    try:
        resp = requests.get(url).json()
        return resp.get('txn')
    except: return None

def get_recent_blockhash():
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getLatestBlockhash"
    }
    resp = requests.post(RPC_URL, json=payload).json()
    return resp['result']['value']['blockhash']

if __name__ == "__main__":
    # 第一步: 确认依赖
    print("Checking system dependencies...")
    try:
        import base58
        import nacl.signing
        print("Required libraries found.")
    except ImportError:
        print("Missing libraries. Attempting emergency install...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "base58", "pynacl"])
        import base58
        import nacl.signing

    # 第二步: 获取交易
    print("Fetching swap transaction...")
    txn_b64 = get_swap_txn("44bzge9EZJGPJRYNmsA64mdKZ1eeLdDcDiczRmoyAtez", "So11111111111111111111111111111111111111112", 296707)
    
    if not txn_b64:
        print("Failed to fetch transaction.")
        sys.exit(1)

    # 第三步: 签名并发送 (手动构造签名)
    # 由于没有 solders，直接提取消息并用 nacl 签名
    print("Raw Transaction (Base64):", txn_b64)
    print("--- MANUAL SIGNING REQUIRED OR USE NATIVE SOLANA CLI ---")
    
    # 尝试使用系统安装的 solana-cli (如果存在)
    solana_check = subprocess.run(["solana", "--version"], capture_output=True)
    if solana_check.returncode == 0:
        print("Solana CLI detected. Using CLI for secure execution.")
        # 这里可以通过 CLI 发送
    else:
        print("Solana CLI not found. Falling back to emergency script.")

