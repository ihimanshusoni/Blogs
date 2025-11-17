# Tech Stories Platform

Full-stack blogging platform featuring a modern admin dashboard (React + Vite + Chakra UI) and a secure REST API (Express + MongoDB). The admin app lets editors draft, publish, and curate technology stories, while authenticated APIs handle content management, authentication, and public blog delivery.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Running Locally](#running-locally)
8. [API Overview](#api-overview)
9. [Deployment Notes](#deployment-notes)
10. [Contributing](#contributing)
11. [License](#license)

## Project Structure

```
Work/Blogs
├── api/           # Express server, Mongo models, controllers, routes
└── blog-admin/    # React admin dashboard (Vite + Chakra UI)
```

## Key Features

### Admin Dashboard (blog-admin)

- Responsive dashboard built with Chakra UI.
- Authentication guard with JWT token storage and auto-redirects.
- Blog CRUD workflows with rich metadata (status, tags, excerpts, slugs).
- Public preview pages powered by the same API.
- Social sharing metadata + preview image (`/public/social-preview.png`).

### REST API (api)

- Express 5 server with modular controllers and routers.
- JWT authentication with bcrypt-secured passwords.
- Blog endpoints for public consumption and authenticated authoring.
- Habit endpoints included for extension experiments.
- MongoDB models managed via Mongoose.

## Tech Stack

- **Frontend:** React 19, Vite 7, Chakra UI 2, React Router 7, Axios.
- **Backend:** Node.js, Express 5, Mongoose 8, JWT, bcryptjs, CORS, dotenv.
- **Database:** MongoDB (Atlas or self-hosted).

## Getting Started

Clone the repository and install dependencies in both workspaces.

```bash
# Clone
git clone <repo-url>
cd Blogs

# Backend deps
cd api
npm install

# Frontend deps
cd ../blog-admin
npm install
```

## Environment Variables

Create `.env` files in each workspace.

### `/api/.env`

```
PORT=3002
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/tech-stories
JWT_SECRET=super-secret-string
```

### `/blog-admin/.env`

```
VITE_API_URL=https://your-api-host.com
```

> The provided example `.env` already targets the hosted API on Render; update as needed for local development.

## Available Scripts

| Location     | Command           | Description                      |
| ------------ | ----------------- | -------------------------------- |
| `api`        | `npm run dev`     | Start Express API with `nodemon` |
| `api`        | `npm start`       | Start Express API with Node      |
| `blog-admin` | `npm run dev`     | Launch Vite dev server           |
| `blog-admin` | `npm run build`   | Production build                 |
| `blog-admin` | `npm run preview` | Preview production build         |
| `blog-admin` | `npm run lint`    | Run ESLint                       |

## Running Locally

1. **Start MongoDB** (local `mongod` or ensure Atlas connection string is reachable).
2. **API**
   ```bash
   cd api
   npm run dev
   ```
   The API defaults to `http://localhost:3002` (configure `PORT`).
3. **Admin**
   ```bash
   cd blog-admin
   npm run dev
   ```
   Vite serves the dashboard at `http://localhost:5173`. Ensure `VITE_API_URL` points to the API URL from step 2.

## API Overview

- `POST /api/auth/login` – Authenticate admin users, returns JWT.
- `POST /api/auth/register` – (Optional) Create new admin accounts.
- `GET /api/blogs/public` – Public feed for published blogs.
- `GET /api/blogs/public/:slug` – Fetch a single published blog.
- Authenticated routes (require `Authorization: Bearer <token>`):
  - `GET /api/blogs` – List all blogs.
  - `POST /api/blogs` – Create a blog entry.
  - `GET /api/blogs/:id` – Retrieve blog by ID.
  - `PUT /api/blogs/:id` – Update blog.
  - `DELETE /api/blogs/:id` – Remove blog.
- Habit routes available under `/api/habits` for future expansion.

## Deployment Notes

- **API:** Deploy Node/Express app to services like Render, Railway, or Heroku. Provide `MONGO_URI`, `JWT_SECRET`, and `PORT` ENV vars. Enable CORS for the frontend origin.
- **Admin:** Deploy Vite build to Netlify, Vercel, or S3/CloudFront. Set `VITE_API_URL` (or runtime equivalent) to the deployed API URL.
- **Social Preview:** Keep `/blog-admin/public/social-preview.png` at 1200×630 for rich link cards.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing`.
3. Commit changes with clear messages.
4. Push the branch and open a pull request describing the change and testing.

## License

This project is provided under the ISC license (see `package.json`).
