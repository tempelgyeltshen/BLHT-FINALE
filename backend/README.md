# Backend

This Express API handles server-side functionality for the website.

## Layout

- `src/config/` — environment configuration
- `src/middleware/` — reusable Express middleware

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

The default API port is `4001`. Change `PORT` in `.env` if that port is already in use.

## API endpoints

- `GET /api/health` checks API availability.
- `POST /api/ai-itinerary` generates an itinerary using Gemini.
- `POST /api/inquiries` saves travel inquiries in `data/inquiries.json` for local development.
