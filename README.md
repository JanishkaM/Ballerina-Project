# Logaira – Fullstack Personal Finance Tracker

A small personal finance tracker with:
- Server: Ballerina HTTP API (auth + incomes + expenses, in-memory storage)
- Client: Next.js (App Router) with Tailwind UI and a simple weekly chart

Default ports:
- API: http://localhost:9092
- Web: http://localhost:3000

## Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- npm (bundled with Node)
- Ballerina Swan Lake 2201.12.7 (or newer in the 2201.12.x line)

Optional:
- VS Code + REST Client extension (to run sample requests in `server/client.rest`)

## Project structure

```
.
├─ server/      # Ballerina API
└─ client/      # Next.js app
```


npm run dev

## How to Set Up and Run

### 1. Install what you need

- Node.js (version 18 or newer)
- npm (comes with Node.js)
- Ballerina (version 2201.12.7 or newer)
- MySQL (any recent version)

### 2. Set up the database

- Open MySQL on your computer.
- Create a new database called `logaira`.
- Import the file `server/resources/sql/logaira.sql` into MySQL. This sets up all the tables.

### 3. Start the server (API)

- Go to the `server` folder:
  ```bash
  cd server
  ```
- Run the server:
  ```bash
  bal run
  ```
- The server will start on http://localhost:9092

### 4. Start the web app (client)

- Go to the `client` folder:
  ```bash
  cd client
  ```
- Install the needed packages:
  ```bash
  npm install
  ```
- Make sure there is a file called `.env.local` in the `client` folder. If not, create it and add this line:
  ```
  NEXT_PUBLIC_API_ENDPOINT=http://localhost:9092
  ```
- Start the web app:
  ```bash
  npm run dev
  ```
- Open http://localhost:3000 in your browser.

## Environment variables (client)

- `NEXT_PUBLIC_API_ENDPOINT` (required): Base URL of the API (default `http://localhost:9092`).

Used by the client for:
- `POST /auth`
- `GET /income/all?token=...`
- `DELETE /income/remove`
- `POST /income/add`
- `GET /expense/all?token=...`
- `DELETE /expense/remove`
- `POST /expense/add`

## API overview (server)

Base URL: `http://localhost:9092`

Seed users (in-memory):
- Alice — email: `alice@example.com`, password: `password123`, id: `1`
- Bob — email: `bob@example.com`, password: `password456`, id: `2`

Token model: after login the token is `SECRET_KEY + userId` where `SECRET_KEY = 9878787`.

Endpoints:
- `POST /auth` — body `{ email, password }` → `{ token, code: 200 }`
- `POST /income/add` — body `{ token: int, amount: number, date: {year,month,day}, name }`
- `GET  /income/all?token=<int>` — list incomes
- `DELETE /income/remove` — body `{ token: int, id: int }`
- `POST /expense/add` — body `{ token: int, amount: number, date: {year,month,day}, name }`
- `GET  /expense/all?token=<int>` — list expenses
- `DELETE /expense/remove` — body `{ token: int, id: int }`

CORS allows `http://localhost:3000` with `GET, POST, DELETE, OPTIONS` and headers `Content-Type, CORELATION_ID`.

## Client behavior & protected routes

- Login (`client/src/components/Login.jsx`) posts to `${NEXT_PUBLIC_API_ENDPOINT}/auth`.
- On success, the token is stored in `localStorage` and mirrored to a `userID` cookie (checked by `client/src/middleware.js`).
- Logout clears both (`client/src/components/Header.jsx`).

Protected routes (redirect to `/login` if unauthenticated):
- `/` (Dashboard)
- `/incomes`, `/incomes/add`
- `/expenses`, `/expenses/add`

## Production

Server:
```bash
cd server
bal build
# artifact: target/bin/ballerina_project.jar
bal run
```

Client:
```bash
cd client
npm run build
npm run start  # respects PORT; defaults to 3000
```

Ensure the client’s `NEXT_PUBLIC_API_ENDPOINT` points to the deployed API URL.

## Troubleshooting

- Redirected to `/login` unexpectedly
  - Ensure `/auth` returns `{ code: 200 }`
  - Confirm a `userID` cookie is set (middleware can’t read `localStorage`)
  - Verify `NEXT_PUBLIC_API_ENDPOINT` and that the API is running

- Lists are empty
  - Check `/income/all` and `/expense/all` responses
  - Ensure the `token` is valid and passed as an integer where required

- Port in use
  - API: change the listener port in `server/main.bal` or stop the other process
  - Web: set `PORT` before `npm run start`

## Scripts reference

Server:
- `bal run` — start API
- `bal build` — build distributable JAR

Client:
- `npm run dev` — start Next.js dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — lint the project

## License

MIT
