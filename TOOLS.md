# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

### Models & Strategy

- **Trading execution:** `google/gemini-3.1-flash-lite-preview` (Fast response)
- **Decision & Planning:** `google/gemini-3-flash-preview` (Deep reasoning)

### Crypto Infrastructure

- APIs (CoinGecko, CMC, Birdeye, Helius) loaded in environment variables.
- WebSocket Endpoints:
  - Binance (Spot): `wss://stream.binance.com:9443/ws`
  - Binance (Futures): `wss://fstream.binance.com/ws`
  - OKX (Public): `wss://ws.okx.com:8443/ws/v5/public`
  - OKX (Private): `wss://ws.okx.com:8443/ws/v5/private`
  - DEX Screener: `https://api.dexscreener.com/latest/dex/tokens/`

---

