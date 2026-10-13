# StudentHub Authentication API

A REST API providing user registration, secure password storage, login, and JWT-based authentication for StudentHub.

This is Codveda Internship Level 3 — Task 2: Authentication. It runs separately from Task 1's student CRUD backend and uses its own PostgreSQL database.

## Features

- User registration with full name, email, and password.
- Password hashing using bcrypt.
- Login with email and password.
- JSON Web Token (JWT) generation and verification.
- Protected endpoint for retrieving the authenticated user's profile.
- PostgreSQL persistence.
- Duplicate email handling.
- Environment-based configuration for credentials and secrets.

## Technologies Used

- Node.js
- Express
- PostgreSQL
- `pg`
- bcrypt
- `jsonwebtoken`
- dotenv
- CORS

## Project Structure

```text
Task-2-Authentication/
├── database/
│   └── schema.sql
├── server/
│   ├── db.js
│   ├── middleware.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Requirements

- Node.js and npm
- PostgreSQL
- Task 1 StudentHub frontend and CRUD backend for integration testing

## Installation and Setup

### 1. Create the PostgreSQL database

Open PostgreSQL and create the authentication database:

```sql
CREATE DATABASE codveda_auth_db;
```

If the database already exists, continue using it.

### 2. Create the users table

From the `Level-3-Advanced` directory, run:

```bash
psql -U postgres -d codveda_auth_db -f Task-2-Authentication/database/schema.sql
```

Replace `postgres` with your PostgreSQL username if necessary.

### 3. Configure environment variables

From `Task-2-Authentication/server`, copy the example file:

```bash
cp .env.example .env
```

Edit `.env` and replace the database username and password with your local credentials. Generate a strong JWT secret using:

```bash
openssl rand -hex 32
```

Put the generated value in `JWT_SECRET`. Task 1's backend must use the same JWT secret to verify tokens issued by this API.

Keep `.env` private. Never commit it or share its contents.

### 4. Install dependencies

From `Task-2-Authentication/server`, run:

```bash
npm install
```

### 5. Start the authentication server

For development:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The API runs at `http://localhost:5001` with the default configuration.

## API Endpoints

Base URL: `http://localhost:5001`

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| GET | `/api/health` | Check API health | Public |
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |
| GET | `/api/auth/me` | Retrieve the authenticated user's profile | Bearer token |

### Register

`POST /api/auth/register`

Example JSON request:

```json
{
  "fullName": "Aisha Ali",
  "email": "aisha@example.com",
  "password": "UseAUniquePassword123!"
}
```

Successful registration returns the user's public profile. A duplicate email address returns `409 Conflict`.

### Login

`POST /api/auth/login`

Example JSON request:

```json
{
  "email": "aisha@example.com",
  "password": "UseAUniquePassword123!"
}
```

Successful login returns a JWT and the user's public profile.

### Get the authenticated user's profile

`GET /api/auth/me`

Send the token returned by login in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The endpoint returns the authenticated user's public profile. Missing or invalid tokens should be rejected.

## Integration with Task 1

- Task 1's student CRUD backend runs on port `5000`.
- This authentication API runs on port `5001`.
- The frontend signs users in through Task 2 and stores the JWT for the current browser session.
- The frontend sends the token when requesting student records from Task 1.
- Task 1 verifies the token using the shared `JWT_SECRET`.
- Requests to `/api/students` without a valid token should return `401 Unauthorized`.

Both backends must use the same JWT secret. Restart both servers after changing it.

## Testing Checklist

- [ ] Authentication server starts successfully.
- [ ] Health endpoint responds successfully.
- [ ] A new user can register.
- [ ] Duplicate registration is rejected.
- [ ] Correct credentials return a JWT.
- [ ] Incorrect credentials are rejected.
- [ ] Profile endpoint requires a valid token.
- [ ] Missing or invalid tokens are rejected.
- [ ] Student API rejects requests without a token.
- [ ] Student API accepts a valid token issued by Task 2.
- [ ] Frontend login and session handling work as expected.

## Security Notes

- Store passwords as bcrypt hashes, never as plaintext.
- Keep database credentials and JWT secrets in environment variables.
- Use a strong, randomly generated JWT secret.
- Never commit `.env` files, real passwords, or tokens.
- Do not expose password hashes in API responses.
- Use HTTPS and suitable deployment security settings outside local development.
- Validate request data on the backend, not only in the frontend.
- Configure CORS for the intended frontend origin.

## Project Goal

This project demonstrates user registration, password hashing, login, JWT verification, protected routes, and integration with a PostgreSQL-backed student management system.
