# AdBridge Backend

This backend is a small Node.js + Express API designed to support the Expo app in this repo while the product is still being shaped.

## What it includes

- JWT auth with advertiser and creator roles
- Campaign listing and creation
- Creator profile listing and upsert
- Campaign applications with advertiser-side status updates
- File-based persistence, so it runs locally without a database

## Run it

```bash
cd backend
npm install
npm run dev
```

The API starts on `http://localhost:4000` by default.

Current deployed base URL:

```bash
https://adbridge-2woq.onrender.com
```

## Demo accounts

- Advertiser: `brand@adbridge.demo` / `password123`
- Creator: `creator@adbridge.demo` / `password123`

## Useful endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `GET /api/campaigns/mine/listings`
- `GET /api/creators`
- `PUT /api/creators/me`
- `GET /api/applications`
- `POST /api/applications/campaigns/:campaignId`
- `PATCH /api/applications/:applicationId/status`

## Environment

Copy `.env.example` to `.env` if you want to override defaults.

```bash
PORT=4000
JWT_SECRET=change-me
DATA_FILE=./data/db.json
```
