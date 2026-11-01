# BloodAid — Next.js + TypeScript + MySQL

This project migrates the BloodAid backend from Spring Boot to Next.js Route Handlers while retaining the original HTML/CSS/JavaScript frontend assets to preserve the existing UI/UX and interactions.

## Stack
- Next.js App Router + TypeScript
- Next.js Route Handlers (`/api/...`)
- MySQL Server (managed using MySQL Workbench)
- `mysql2` for database access
- `bcryptjs` for password hashing

## Setup

1. Install Node.js 20.9+ (Node.js 22 LTS recommended).
2. Open MySQL Workbench and run `database/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Set the database host, port, database name, user, and password in `.env.local`. Do not commit `.env.local`.
5. From this project folder, run:

   ```bash
   npm install
   npm run dev
   ```

6. Open `http://localhost:3000`.

## API routes retained
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/user/:id`
- `GET /api/donors`
- `GET /api/donors/:id`
- `GET /api/donors/search?bloodGroup=A%2B&city=Mumbai`
- `POST /api/donors`
- `GET /api/requests`
- `GET /api/requests/user/:userId`
- `POST /api/requests`
- `POST /api/requests/:requestId/respond`
- `GET /api/requests/:requestId/responses`
- `GET /api/requests/responses/user/:userId`

## UI preservation
The supplied `index.html`, `style.css`, and `script.js` are preserved under `public/bloodaid/`. The only API-related frontend change is switching the API base from the Spring Boot localhost URL to same-origin `/api`. The home page displays this original UI full-screen.

## Security notes
- Passwords created through signup are BCrypt-hashed.
- Existing legacy plain-text passwords can still be verified and are upgraded to BCrypt after a successful login.
- This is a college-project starter, not a production-ready authentication system. The current frontend stores the logged-in user in browser storage and the API trusts user IDs sent by the client. Before public deployment, implement server-managed sessions or secure authentication, authorization checks, rate limits, CSRF protections where relevant, and HTTPS.
- Never commit real database credentials. Use a dedicated database user rather than the MySQL root account for deployment.

## Troubleshooting
- If API calls return a database error, verify MySQL Server is running, run `database/schema.sql`, and confirm `.env.local`.
- After changing `.env.local`, restart `npm run dev`.
- Do not open `public/bloodaid/index.html` directly from the filesystem; open `http://localhost:3000` so its `/api` calls reach Next.js.
