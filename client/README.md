## Logaira – Client App (Next.js)

Logaira is a small personal finance tracker built with Next.js (App Router). It lists incomes and expenses, provides add/remove flows, and shows a dashboard with weekly charts. Authentication is token-based.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm (bundled with Node)
- A running backend API exposing endpoints like `/auth`, `/income/*`, and `/expense/*` (see Environment)

## Quick start

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local # if you have an example file
```

Then set the required variable (replace with your API URL):

```bash
echo "NEXT_PUBLIC_API_ENDPOINT=http://localhost:9092" >> .env.local
```

3) Run the app (dev)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment variables

- `NEXT_PUBLIC_API_ENDPOINT` (required): Base URL of the backend, e.g. `http://localhost:9092`.

The app uses this base URL for:

- `POST /auth`
- `GET /income/all?token=...`
- `DELETE /income/remove`
- `POST /income/add`
- `GET /expense/all?token=...`
- `DELETE /expense/remove`
- `POST /expense/add`

## Scripts

- `npm run dev` – Start the development server (Turbopack)
- `npm run build` – Create a production build
- `npm run start` – Start the production server
- `npm run lint` – Lint the project

## Authentication flow and protected routes

- Login: `src/components/Login.jsx` posts credentials to `${NEXT_PUBLIC_API_ENDPOINT}/auth`.
- On success, the token is stored in both `localStorage` and a `userID` cookie.
	- The cookie enables server/edge checks in `middleware.js` (middleware cannot read localStorage).
- Logout clears both localStorage and the cookie in `src/components/Header.jsx`.

Protected routes (redirect to `/login` if unauthenticated):

- `/` (Dashboard)
- `/incomes` and `/incomes/add`
- `/expenses` and `/expenses/add`

## Features overview

- Dashboard (`src/components/DashBoard.jsx`)
	- Current month income, expenses, and balance
	- Weekly income vs expense chart (Recharts via `src/components/ui/chart.jsx`)
- Incomes list and delete (`src/components/base/Incomes.jsx`)
	- Filter by month (client-side)
	- Confirm delete with a dialog
- Expenses list and delete (`src/components/base/Expenses.jsx`)
	- Filter by month (client-side)
	- Confirm delete with a dialog
- Add forms (`/incomes/add`, `/expenses/add`) via `src/components/Form.jsx`

UI: Tailwind CSS v4, shadcn/ui-style components (Card, Dialog, Button, Input, etc.).

## Production build

```bash
npm run build
npm run start
```

By default, the server listens on port 3000. Set `PORT` if you need a different port.

## Troubleshooting

- Redirected to `/login` unexpectedly
	- Ensure a successful login (backend returns `code == 200`)
	- Confirm a `userID` cookie is present (auth token is mirrored to cookie)
	- Verify `NEXT_PUBLIC_API_ENDPOINT` is correct and backend is running

- Lists are empty
	- Check the API responses for `/income/all` and `/expense/all`
	- Confirm your `token` is valid and matches the backend expectations

## Project structure (selected)

- `src/app/*` – App routes (App Router)
- `src/components/*` – UI and feature components
	- `base/Incomes.jsx`, `base/Expenses.jsx` – list views
	- `Form.jsx` – add income/expense
	- `DashBoard.jsx` – monthly stats and weekly chart
	- `ui/*` – shadcn-style UI primitives and chart helpers
- `middleware.js` – route protection based on `userID` cookie

---

If you need a dockerized setup or API stubs for local development, let me know and I’ll add them.
