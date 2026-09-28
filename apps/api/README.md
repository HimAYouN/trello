# Trello API

This document lists the API routes currently mounted in the Express app at [apps/api/src/app.ts](src/app.ts).

## Base behavior

- Public routes: `/auth/*` and `/api/v1/health`
- Protected routes: all routes below are mounted after the authentication middleware in [apps/api/src/app.ts](src/app.ts)
- Auth header format:
  - `Authorization: Bearer <token>`

## Public endpoints

### Health

- `GET /api/v1/health`
  - Returns server health info

### Auth

- `POST /auth/register`
  - Register a new user
  - Body: `{ name, email, password }`
- `POST /auth/login`
  - Log in and receive a JWT
  - Body: `{ email, password }`

## Protected endpoints

All protected routes require a valid bearer token.

### Organisation

- `POST /organisation`
  - Create a new organisation
  - Body: `{ name, description }`
- `DELETE /organisation/:id`
  - Delete an organisation by id
  - Body: `{ confirmation: true }`

### Board

- `POST /:organisationId/board`
  - Create a board inside an organisation
  - Body: `{ title }`
- `GET /:organisationId/boards`
  - Fetch all boards in an organisation
- `GET /board/:id`
  - Fetch a single board by id
- `DELETE /board/:id`
  - Delete a board by id

### Section

- `POST /:boardId/section`
  - Create a section in a board
  - Body: `{ title }`
- `GET /:boardId/section`
  - Fetch sections for a board
- `DELETE /section/:id`
  - Delete a section by id

### Issue

- `POST /:sectionId/issue`
  - Create an issue inside a section
  - Body: `{ title, desc }` or `{ title, description }`
- `GET /:sectionId/issues`
  - Fetch all issues in a section
- `GET /issue/:issueId`
  - Fetch one issue by id
- `DELETE /issue/:issueId`
  - Delete an issue by id

### User

- `GET /me`
  - Fetch the authenticated user
- `PUT /me`
  - Present but not implemented yet
- `DELETE /me`
  - Present but not implemented yet
- `GET /me/organisation`
  - Present but not implemented yet
- `GET /me/boards`
  - Present but not implemented yet

## Notes

- Some routes are mounted but still only partially implemented and may return placeholders or be future work.
- In [apps/api/src/modules/organisation/org.route.ts](src/modules/organisation/org.route.ts), the invite/accept routes are commented out and are not active in the running app.
- The API is served with Express and mounted in [apps/api/src/app.ts](src/app.ts).
