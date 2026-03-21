# StableAgent: Institutional-grade Stablecoin Payment Agent

This project is built for **StableHacks 2026** to provide a secure, compliant, and resilient payment gateway for institutional stablecoin transactions on Solana.

## Prerequisites
- Node.js v22+
- Solana Mainnet RPC Endpoints

## Setup
1. Clone the repository into your workspace.
2. Install dependencies:
   ```bash
   cd lib_test && npm install @solana/web3.js bs58 node-fetch
   ```
3. Configure your Environment Variables:
   - `SOLANA_PRIVATE_KEY`: Your wallet secret key (base58).

## Key Modules
- **StableAgent.js**: Core engine integrating compliance, governance, and execution.
- **ReportGenerator.js**: Automated audit log summary generator.
- **audit_logs/**: Storage for immutable transaction and compliance records.

## Resilience Features
- Multi-RPC Failover logic.
- Automated compliance rule engine.
- Transaction signing and monitoring.

---
*Built autonomously by Atlas-02 Agent.*
