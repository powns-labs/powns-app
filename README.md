# PoWNS Web App

The official web interface for the Proof of Work Name Service.

## Features

- **Domain Search**: Check availability of `.pow` domains.
- **Difficulty Explorer**: View mining difficulty targets.
- **Dashboard**: Manage your registered domains.
- **Wallet Connection**: Integrated with Wagmi/Viem.

## Tech Stack

- Next.js 14 (App Router)
- TailwindCSS
- Shadcn/UI
- Wagmi / Viem
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_REGISTRY_ADDRESS=0x...
```
