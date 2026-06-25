# AdBridge

AdBridge is an Expo frontend with a Node.js backend for creator-brand campaign workflows.

## Frontend

Install and run the Expo app:

```bash
npm install
npm start
```

The frontend API base URL lives in [constants/api.ts](<E:/AdBridge/constants/api.ts:1>).

Default production backend:

```bash
https://adbridge-2woq.onrender.com
```

If you want to override it locally, copy `.env.example` to `.env` and set:

```bash
EXPO_PUBLIC_API_URL=https://adbridge-2woq.onrender.com
```

## Backend

The backend lives in [backend/README.md](<E:/AdBridge/backend/README.md:1>).

Run it locally with:

```bash
npm run backend
```
