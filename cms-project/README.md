# Desk — Content Management System

A full-stack CMS: Node/Express + MongoDB API on the backend, React (Vite) + Tailwind
admin panel and public post feed on the frontend. JWT-based auth protects all
write operations; anyone can read published posts.

```
cms-project/
├── server/   Express API (MongoDB via Mongoose, JWT auth, image upload)
└── client/   React (Vite) admin dashboard + public post feed
```

## Features

- **Auth**: JWT login for admin/editor accounts. `npm run seed:admin` creates the
  first account; admins can create more via `POST /api/auth/register`.
- **Posts CRUD**: title, body, excerpt, category, cover image, draft/published status.
- **Public feed**: anyone can browse and search published posts, with pagination.
- **Admin dashboard**: table of all posts (drafts included), filter by status,
  create/edit/delete, image upload, publish or save as draft.

## 1. Backend setup

```bash
cd server
cp .env.example .env      # then edit values, especially JWT_SECRET and MONGO_URI
npm install
npm run seed:admin        # creates the first admin login (see .env for the credentials)
npm run dev                # starts on http://localhost:5000
```

Requires a running MongoDB instance (local `mongod`, or a connection string from
MongoDB Atlas pasted into `MONGO_URI`).

## 2. Frontend setup

```bash
cd client
cp .env.example .env      # points at the API; edit if your server runs elsewhere
npm install
npm run dev                 # starts on http://localhost:5173
```

Open http://localhost:5173 — the home page shows published posts, and
`/login` takes you to the admin dashboard using the seeded admin credentials.

## API reference

| Method | Route                | Access        | Description                          |
|--------|-----------------------|---------------|---------------------------------------|
| POST   | /api/auth/login        | Public        | Log in, returns a JWT                 |
| GET    | /api/auth/me            | Private       | Current user profile                  |
| POST   | /api/auth/register      | Admin only    | Create another admin/editor account   |
| GET    | /api/posts               | Public/Private | List posts (published only if no token; `?status=` for authed users) |
| GET    | /api/posts/:idOrSlug     | Public/Private | Single post by id or slug             |
| POST   | /api/posts               | Private       | Create a post                         |
| PUT    | /api/posts/:id           | Private       | Update a post                         |
| DELETE | /api/posts/:id           | Private       | Delete a post                         |
| POST   | /api/posts/upload        | Private       | Upload a cover image, returns its URL |

Posts support `?page=`, `?limit=`, `?category=`, and `?search=` query params on
the list endpoint.

## Notes

- Uploaded images are stored under `server/uploads` and served statically at
  `/uploads/<filename>`. For production, swap this for S3/Cloudinary.
- Change the seeded admin password after first login — there's no in-app
  "change password" flow yet; update it directly via MongoDB or extend
  `authRoutes.js`.
