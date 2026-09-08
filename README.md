# Trello-style project management app

This repository is a monorepo for a Trello-inspired task and team collaboration application. The current implementation is primarily a backend API built with Express, Prisma, and PostgreSQL, and it models the main entities needed for a Kanban-style workflow: users, organisations, memberships, boards, sections, and issues.

The project is intended to evolve into a collaborative board system similar to Trello, where teams can create organisations, manage members, and organize work into boards and cards.

## Overview

### Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL via Prisma ORM
- Turbo repo for monorepo orchestration
- JWT-based authentication
- CORS and cookie parsing for browser clients

### Project structure

```text
.
├── apps/
│   ├── api/
│   │   ├── src/
│   │   └── tests/
│   ├── client/
│   └── ws/
├── packages/
│   ├── db/
│   ├── env/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Functionalities implemented

At the moment, the app includes the following working backend capabilities:

- User registration
- User login
- Password hashing with bcrypt
- JWT token generation on successful login
- Basic app bootstrap with Express
- PostgreSQL data layer through Prisma
- Organisation creation and ownership validation logic
- Data model for boards, sections, and issues

## Core domain model

The Prisma schema defines a Trello-style entity structure:

### User
- id
- name
- email
- password
- refreshToken
- memberships
- owned organisations

### Organisation
- id
- name
- description
- ownerId
- memberships
- boards

### Membership
- id
- userId
- organisationId
- role (`OWNER`, `ADMIN`, `MEMBER`)

### Board
- id
- title
- organisationId
- sections
- issues

### Section
- id
- title
- boardId
- issues

### Issue
- id
- title
- description
- boardId
- sectionId

This structure matches the expected workflow for a project board app: an organisation owns boards, a board contains sections, and each section contains issues/tasks.

## API endpoints

The active API is mounted in the Express app from `apps/api/src/app.ts`.

### Server base

```http
GET /
```

Returns a simple text response:

```json
"This is the home page..."
```

### Authentication routes

#### Register a user

```http
POST /user/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

Example successful response:

```json
{
  "success": true,
  "message": "Register successful",
  "data": {
    "user": {
      "id": "cuid",
      "email": "jane@example.com"
    }
  }
}
```

#### Log in a user

```http
POST /user/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

Example successful response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cuid",
      "email": "jane@example.com"
    },
    "token": "jwt-token"
  }
}
```

### Organisation routes (defined but not mounted yet)

The organisation module contains route definitions for the following endpoints:

```http
POST /organisation/create-organisation
DELETE /organisation/delete-organisation/:id
```

Those are implemented in the organisation controller and service layer, but they are not currently connected to the main Express app in `app.ts`. The controller expects an authenticated user from `req.user.id` and validates ownership before deletion.

## Authentication behaviour

The current auth implementation does the following:

- Checks whether the supplied email already exists
- Hashes the user password before saving it
- Verifies the password using bcrypt during login
- Generates a JWT using the user ID
- Returns the token in the login response payload

Important note: the service currently uses `process.env.JWT_SECRET`, while the environment validation schema also expects `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. For local development, it is safer to define both forms in the environment to avoid mismatches.

## Database and migrations

The app uses Prisma with a PostgreSQL database. The schema is stored in:

- `packages/db/prisma/schema.prisma`

Migrations are stored in:

- `packages/db/prisma/migrations/`

Common commands:

```bash
cd packages/db
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio
```

## Local setup

### 1) Install dependencies

```bash
cd /home/huma/PROGRAMS/trello
pnpm install
```

### 2) Configure environment variables

Create a `.env` file in the project root or configure the environment with variables like:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trello
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trello_test
PORT=3002
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
JWT_ACCESS_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### 3) Run database migrations

```bash
cd packages/db
pnpm prisma migrate dev
```

### 4) Start the API

```bash
cd apps/api
pnpm dev
```

The server listens on the port configured by `PORT` (default in the environment schema is `3000`, while the app’s current startup code uses the environment value or `3002`).

### 5) Run tests

```bash
cd apps/api
pnpm test
```

## Monorepo commands

From the repository root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
```

## Current status and gaps

This project is a functional backend foundation rather than a complete finished product.

### Already present

- Authentication flow
- Prisma-based data model
- Organisation ownership validations
- Trello-like schema design
- API bootstrapping and routing structure

### Missing or incomplete

- The app does not yet mount the organisation routes in the main server
- No auth middleware is currently wired for protected routes
- Board, section, issue, membership, and comment modules are not fully implemented in the API
- The client app and websocket app are not yet developed
- Frontend UI and user flows are still missing

## Intended product direction

The data model and route structure point toward a collaborative Kanban board application with:

- user accounts
- team organisations
- board creation and management
- section-based columns
- issue/card management
- roles and permissions for organisation members

## Summary

This repository is best described as a Trello-inspired backend foundation. It already has the correct architecture and most of the core data model needed for a project board app, but it still requires additional route wiring, middleware, and frontend implementation to become a complete application.
