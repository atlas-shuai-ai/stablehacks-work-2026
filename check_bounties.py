import json

def fetch_superteam_bounties():
    # 模拟抓取 Superteam Earn 任务
    print("Scanning Superteam Earn for AI-compatible bounties...")
    bounties = [
        {"title": "Write a Technical Deep Dive on Solana Actions", "reward": "$500", "type": "Content"},
        {"title": "Data Analysis: Jupiter LFG Launchpad Performance", "reward": "$300", "type": "Data"},
        {"title": "Audit Smart Contract for a New Meme Project", "reward": "$200", "type": "Audit"}
    ]
    return bounties

if __name__ == "__main__":
    res = fetch_superteam_bounties()
    print(json.dumps(res, indent=2))
