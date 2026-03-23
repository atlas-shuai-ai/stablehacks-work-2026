import os
import requests
import base64
from solders.keypair import Keypair
from solders.transaction import VersionedTransaction
from solana.rpc.api import Client
from solana.rpc.types import TxOpts

RPC_URL = "https://api.mainnet-beta.solana.com"
PRIVATE_KEY = os.environ.get("SOLANA_PRIVATE_KEY")
TXN_B64 = "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAECxu+bpKlflBTbEvpfTEXiEpJU2jlVbVA4ib/d9F6nl5nfUfmADyuEUde0nO7aojD09FXjS9oDFIsGGSNHS48WjbQPASPs3QAgFoHTvqMNkDnNdzraVaR40/CBTeNYOgl+Uia5IEWGJy72YXxg/whLH9Dhq5+cLTdzOmZudDfYzEMxKKtzkFEbypV0GxikMO4s3Y46z9V4rhXU+RE2QcWy83nmCZWC1WF9XChEQYc2XyB+NSXjBMppkxxfiRSw6Bkh7foEc4/fIgw8v7CjDAKQmqY9kxnWxApYWOg5+4VnR9sAwZGb+UhFzL/7K26csOb57yM5bvF9xJrLEObOkAAAACYTkxlSV7zz0oy8+J3SBmR9YhyjSY1CEYp3bJEJfxbrQZML7IFPnBKyw4v76KjYhtSUQlC1mwG4AqYoGDS/9e0LX9fJTQqgPLuhtKt40KxEGEjOvxCvLAQlYyBu82NWm8c0igpg2BM7wE/Sif2LDX08oWZCI+s5J7a8u1Dfup0FgMHAAUCgBoGAAcACQOghgEAAAAAAAgaAAEJDAACAwoNCQkJCQ4ODwwLAAIDDgQQBQZgEXeUI3spDBbujQMAAAAAAEwAAAD4xp6R4XWHyMCGHRVFAAAAaeLGAgAAAAB8nvEBAAAAAAEAAADAhh0VRQAAAAEAAAABAAAAAQAAAE4BAAAAZAAAAAAAAdprbOT2TAYAAemZGcnRevbnnU5WSIy2n4SkRJklyjUKUrntmFJMeph0AQQFzQIG1QE="

def send_tx():
    try:
        keypair = Keypair.from_base58_string(PRIVATE_KEY)
        client = Client(RPC_URL)
        raw_txn = base64.b64decode(TXN_B64)
        txn = VersionedTransaction.from_bytes(raw_txn)
        
        # Sign with recent blockhash
        recent_blockhash = client.get_latest_blockhash().value.blockhash
        txn.message.recent_blockhash = recent_blockhash
        
        signed_txn = VersionedTransaction(txn.message, [keypair])
        res = client.send_transaction(signed_txn, opts=TxOpts(skip_preflight=False))
        print(f"TX_SUCCESS:{res.value}")
    except Exception as e:
        print(f"TX_ERROR:{str(e)}")

if __name__ == "__main__":
    send_tx()
