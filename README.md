# Rentora Frontend

## Project Overview

Rentora Frontend is the client application for a role-based rental marketplace, built with React and Vite. It allows users to register as owners or renters, browse available products, create rental requests, and manage request lifecycles from dedicated dashboards. The app integrates with a separate backend API for authentication, product management, request processing, and owner contact details.

## Tech Stack

### Core
- `React` (UI)
- `React DOM`
- `Vite` (build tool and dev server)
- `React Router DOM` (routing)

### State and Data
- `Redux Toolkit`
- `RTK Query` (API layer via `@reduxjs/toolkit/query`)
- `React Redux`

### Forms and Validation
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

### UI and Styling
- `@mui/material`
- `@mui/x-date-pickers`
- `@emotion/react`
- `@emotion/styled`
- CSS modules/files in page and component folders
- `dayjs`

### Tooling
- `ESLint` (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

## Project Structure

```text
rentora/
├── public/                  # Static assets served as-is
├── src/
│   ├── app/                 # App root component
│   ├── components/          # Shared UI, including modals and top bar
│   ├── config/              # Runtime environment mapping
│   ├── constants/           # Roles, storage keys, API endpoint constants
│   ├── context/             # Auth context/provider and hooks
│   ├── layout/              # Shared page layout (topbar + outlet)
│   ├── pages/               # Route-level pages (auth, dashboard, owner, renter)
│   ├── routes/              # Route directory and route guards/wrappers
│   ├── services/            # API request helpers
│   ├── store/               # Redux store + RTK Query API slices
│   ├── theme/               # Theme tokens/configuration
│   ├── utils/               # Storage and validation helpers
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── .env                     # Local environment variables
├── eslint.config.js         # Lint configuration
├── vite.config.js           # Vite config
└── package.json             # Scripts and dependencies
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended; project uses modern Vite/React toolchain)
- npm (comes with Node.js)
- A running backend API for the full app flow
- Cloudinary account/preset values for product image uploads

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Starts the Vite development server with HMR.

### Build for Production

```bash
npm run build
```

Generates an optimized production build in `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Environment Variables

The project currently reads environment values from `src/config/env.js`.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL for backend API requests (example: `http://localhost:5000/api`). |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes (for product image upload) | Cloudinary cloud name used by the add-product image upload flow. |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Yes (for product image upload) | Cloudinary unsigned upload preset used when uploading product images. |

## Key Features / Pages (Frontend)

- `Login` (`/login`): Authenticates users and stores token/user in client storage.
- `Register` (`/register`): Creates owner or renter accounts with validated form input.
- `Dashboard` (`/dashboard`): Product listing with filters, pagination, owner details, and request initiation.
- `Owner Dashboard` (`/owner/products`, `/owner/requests`): Manage owned products and process incoming rental requests (accept/reject).
- `Renter Dashboard` (`/renter`): Track the renter's submitted requests and statuses.
- `Not Found` (`*`): Fallback page for undefined routes.

## Connection to the Other Repo

This repository contains only the **frontend** portion of the Rentora MERN application.  
The backend (API, database models, and server-side business logic) is maintained separately:  
[PASTE OTHER REPO URL HERE](PASTE OTHER REPO URL HERE)

## Scripts

Defined in `package.json`:

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the app for production into `dist/`.
- `npm run lint` - Runs ESLint across the project.
- `npm run preview` - Serves the production build locally for verification.

## Deployment

No platform-specific deployment config (such as `vercel.json`, `netlify.toml`, or Docker files) is currently present in this repository.

Since this is a Vite React frontend, it can be deployed as a static site to platforms like Vercel, Netlify, Cloudflare Pages, or any static host by:

1. Running `npm run build`
2. Deploying the generated `dist/` directory
3. Setting required `VITE_*` environment variables in the hosting platform
