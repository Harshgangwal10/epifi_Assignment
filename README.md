# Notes App Backend

REST backend for a multi-user notes service.

## Features

- `POST /register`
- `POST /login` (JWT returns `access_token`)
- Authenticated notes CRUD:
  - `GET /notes`
  - `GET /notes/:id`
  - `POST /notes`
  - `PUT /notes/:id`
  - `DELETE /notes/:id`
- Sharing:
  - `POST /notes/:id/share`
- Docs:
  - `GET /openapi.json`
  - `GET /about`

## Extra (Optional / Stretch)

- Pagination on `GET /notes` via `page` and `limit` query params (also returns pagination in `X-*` headers).
- Full-text search: `GET /notes/search?q=keyword`.
- Pin notes: `POST /notes/{id}/pin` and `POST /notes/{id}/unpin` (pinned notes appear first in `GET /notes`).

## Run Locally

```bash
cd notes-app
npm install
npm start
```

Create a `.env` file:

```env
PORT=3000
CORS_ORIGIN=*
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
ABOUT_NAME=Your Name
ABOUT_EMAIL=your.email@example.com
```

## Docker

Build & run with Docker Compose:

```bash
docker compose up --build
```

(You must provide `MONGODB_URI` and `JWT_SECRET` as environment variables.)

## Frontend (Minimal)

A very small vanilla HTML frontend is located at:

- `notes-app/frontend/index.html`

Open it in a browser and set the correct API Base URL.
