# Web Visualizer 🌐

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload%20CMS-3.90-black?style=flat&logo=payloadcms)](https://payloadcms.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-Image-2496ed?style=flat&logo=docker)](https://hub.docker.com/repository/docker/softsurgery/web-visualizer/general)

A modern, responsive multi-URL dashboard and website visualizer built with **Next.js**, **TypeScript**, **Tailwind CSS v4**, and **Payload CMS**.

Web Visualizer empowers teams and developers to curate, organize, monitor, and share collections of live web pages simultaneously across customizable grid layouts—featuring an intelligent reverse-proxy API that transparently bypasses restrictive iframe headers (`X-Frame-Options` and `CSP: frame-ancestors`).

---

## ✨ Features

- 🗂️ **Workspace & Group Management**: Group websites, dashboards, and tools into organized workspaces with custom ordering.
- 🔒 **Privacy & Access Control**: 
  - Toggle groups between **Private** (authenticated users only) and **Public**.
  - Automatically generates unique secure UUIDs for sharing public groups with stakeholders without exposing administration rights.
- 🔗 **Public Shareable Links (`/share/:uuid`)**: Share complete group dashboards via lightweight, dedicated share routes with zero navigation chrome.
- 🖥️ **Responsive Desktop Viewport Simulation**: Simulates full 1280px desktop viewports for embedded pages, auto-scaling down via `ResizeObserver` to fit any card dimension without horizontal overflow or mobile layout shifts.
- 📐 **Adaptive Grid Layouts & Drag-and-Drop**:
  - Switch between **Small** (high density), **Medium** (2x2), **Large** (single column focus), and **List** views.
  - Seamlessly reorder iframe cards with smooth drag-and-drop interactions powered by `@dnd-kit`.
- 🛡️ **Intelligent Header-Stripping Proxy Middleware**:
  - Automatically tests URLs against `X-Frame-Options` and `Content-Security-Policy: frame-ancestors` via `/api/check-frameable`.
  - Transparently falls back to `/api/proxy?url=...` to strip blocking headers and inject permissive CORS headers for sites that forbid framing.
  - Real-time visual status pills:
    - 🟢 **Green**: Direct connection (native iframe support)
    - 🟠 **Orange**: Proxied connection (restrictions bypassed)
    - 🟡 **Yellow**: Testing connection / evaluating frameability
- 🔍 **Site Details & Live Metadata Inspector (`/details/:urlId`)**:
  - Dedicated drill-down view with expanded viewport preview.
  - Built-in metadata scraper (`/api/metadata`) extracts page `<title>`, `<meta name="description">`, generator tags, and server headers.
- 🎯 **Point to Center**: Vertically centers iframe scroll positions automatically upon loading for applications with content focused in the mid-page.
- ⚙️ **Centralized Settings Navigation**: Relocated settings page (`/settings`) accessible from the sidebar for managing themes, authentication sessions, and preferences.
- 🌓 **Dynamic Theme Switching**: Seamless Dark, Light, and System themes powered by `next-themes`.
- ⏳ **Global Loading Spinner**: Smooth initialization state transitions preventing UI flicker during client hydration and database sync.

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    User([User Browser])
    Visualizer[Web Visualizer Frontend]
    CheckAPI["/api/check-frameable"]
    ProxyAPI["/api/proxy"]
    MetaAPI["/api/metadata"]
    Payload[Payload CMS Backend]
    Postgres[(PostgreSQL Database)]
    TargetWeb[External Web Page]

    User -->|Views Dashboard / Share Link| Visualizer
    Visualizer -->|1. Check Headers| CheckAPI
    CheckAPI -->|HEAD / GET Request| TargetWeb

    CheckAPI -->|Frameable = true| Visualizer
    Visualizer -.->|Direct Embed| TargetWeb

    CheckAPI -->|Frameable = false| Visualizer
    Visualizer -->|2. Route through Proxy| ProxyAPI
    ProxyAPI -->|Fetch & Strip Framing Headers| TargetWeb
    ProxyAPI -->|Stream Body with Permissive Headers| Visualizer

    Visualizer -->|Fetch Details| MetaAPI
    MetaAPI -->|Extract Meta Tags| TargetWeb

    Visualizer <-->|Sync State & Auth| Payload
    Payload <-->|Store Groups, URLs & Users| Postgres
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Turbopack, Standalone Output) |
| **Backend & CMS** | [Payload CMS v3](https://payloadcms.com/) with `@payloadcms/db-postgres` |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` |
| **Component Primitives** | Radix UI / Shadcn UI primitives |
| **Drag and Drop** | [dnd-kit](https://dndkit.com/) |
| **State & Data Fetching** | Zustand, TanStack React Query v5 |
| **Icons & Theming** | Lucide React, `next-themes` |
| **Linting** | [Oxlint](https://oxc.rs/) |
| **Containerization** | Docker, Docker Compose, Alpine Linux |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or v20/v22 recommended)
- [Yarn](https://yarnpkg.com/) or `npm`
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher) or Docker

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd web-visualizer
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure your database connection and secret key:
   ```env
   PAYLOAD_SECRET=your-secure-random-secret-key-at-least-32-chars
   POSTGRES_URL=postgres://postgres:postgres@127.0.0.1:5432/web_visualizer
   DATABASE_URI=postgres://postgres:postgres@127.0.0.1:5432/web_visualizer
   PORT=3000
   ```

4. **Start the development server**:
   ```bash
   yarn dev
   ```

5. Access the application:
   - **Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **Payload Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Runs the Next.js development server with hot-reload and Turbopack. |
| `yarn build` | Builds the optimized production application with standalone output. |
| `yarn start` | Starts the production server from compiled assets. |
| `yarn lint` | Runs [Oxlint](https://oxc.rs/) for ultra-fast code verification. |
| `yarn payload` | Executes Payload CMS CLI commands. |

---

## 🐳 Docker & Docker Compose Deployment

The official Docker image is available on [Docker Hub](https://hub.docker.com/repository/docker/softsurgery/web-visualizer/general).

The repository includes a production-grade multi-stage `Dockerfile` (leveraging Alpine Linux and Next.js standalone output for minimal image size) and a full-stack `docker-compose.yml`.

### Option A: Docker Compose (App + PostgreSQL)

Run the entire stack with a single command:

```bash
# Build and start services in the background
docker compose up -d --build

# Inspect service logs
docker compose logs -f app

# Tear down services
docker compose down
```

### Option B: Build and Run Standalone Docker Container

```bash
# Build the Docker image
docker build -t web-visualizer:latest .

# Run the container connecting to an external or host Postgres instance
docker run -d \
  -p 3000:3000 \
  --name web-visualizer \
  -e PAYLOAD_SECRET="your-secure-payload-secret" \
  -e DATABASE_URI="postgres://postgres:postgres@host.docker.internal:5432/web_visualizer" \
  web-visualizer:latest
```

---

## 🚢 Automated CI/CD: Push to Docker Hub

A production GitHub Actions workflow is provided at [`.github/workflows/docker-publish.yml`](file:///.github/workflows/docker-publish.yml).

### Workflow Capabilities
- **Multi-Platform Builds**: Automatically compiles `linux/amd64` and `linux/arm64` images via QEMU and Docker Buildx.
- **Automated Triggers**:
  - Pushes to `main` tag as `:latest` and branch name.
  - Pushes to `develop` tag as `:develop`.
  - Git Release Tags (`v*.*.*`) tag semver releases (`:1.0.0`, `:1.0`, `:1`).
  - Pull Requests run a dry-run compile without publishing.
  - **Manual Trigger** (`workflow_dispatch`) with custom tag parameter.
- **GitHub Layer Caching**: Leverages GitHub Actions Cache (`type=gha`) for fast incremental builds.

### Required GitHub Secrets
In your GitHub repository, go to **Settings > Secrets and variables > Actions > Secrets** and add:

| Secret | Description | Example |
|---|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub account username or organization | `myusername` |
| `DOCKERHUB_TOKEN` | Docker Hub Personal Access Token with write permissions | `dckr_pat_...` |
| `DOCKERHUB_REPO` *(Optional)* | Custom image repository (defaults to `<DOCKERHUB_USERNAME>/web-visualizer`) | `myorg/web-visualizer` |

---

## 📡 API Reference

Web Visualizer exposes internal API endpoints for proxying, verification, and workspace state synchronization:

### 1. Check Frameability
`GET /api/check-frameable?url=<target_url>`
- **Description**: Inspects HTTP response headers (`X-Frame-Options` and `Content-Security-Policy: frame-ancestors`) to determine if a website allows iframe embedding.
- **Response**:
  ```json
  { "frameable": true }
  ```

### 2. Header-Stripping Proxy
`GET /api/proxy?url=<target_url>`
- **Description**: Reverse-proxies the target webpage, stripping restrictive framing headers (`x-frame-options`, `content-security-policy`, `strict-transport-security`) and injecting permissive CORS headers.
- **Methods Supported**: `GET`, `POST`, `PUT`, `DELETE`

### 3. Website Metadata Scraper
`GET /api/metadata?url=<target_url>`
- **Description**: Scrapes metadata from target webpage HTML to populate the Details Inspector view.
- **Response**:
  ```json
  {
    "title": "Example Domain",
    "description": "Domain for use in illustrative examples in documents",
    "generator": "WordPress 6.4",
    "server": "cloudflare"
  }
  ```

### 4. Group Synchronization
`POST /api/groups/sync`
- **Description**: Synchronizes groups, ordering, layout preference, and URL configurations for the authenticated user with the Payload database.
- **Auth**: Requires valid Payload session / JWT header.

### 5. Public Share Group
`GET /api/groups/share/:uuid`
- **Description**: Fetches public group data by UUID or name without requiring user authentication. Returns 404 if the group is set to private.

---

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PAYLOAD_SECRET` | **Yes** | — | Strong secret string used to sign auth tokens and encrypt Payload CMS data. |
| `DATABASE_URI` | **Yes** | — | PostgreSQL connection string (`postgres://user:pass@host:port/dbname`). |
| `POSTGRES_URL` | No | Fallback to `DATABASE_URI` | Alternative environment variable for Postgres connection string. |
| `PORT` | No | `3000` | Port on which the application server listens. |
| `NODE_ENV` | No | `development` | Node environment (`development` or `production`). |
| `NEXT_TELEMETRY_DISABLED` | No | `1` | Disables anonymous Next.js telemetry collection. |

---

## 📁 Directory Structure

```text
web-visualizer/
├── .github/
│   └── workflows/
│       └── docker-publish.yml   # Multi-arch Docker Hub automated CI/CD
├── public/                      # Static assets & brand icons
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (app)/               # Application views
│   │   │   ├── details/[urlId]/ # Website metadata and inspector view
│   │   │   ├── settings/        # Centralized settings & account view
│   │   │   ├── share/[uuid]/    # Public shareable clean group view
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── ClientLayout.tsx # Global responsive shell & provider wiring
│   │   │   └── page.tsx         # Main dashboard view
│   │   ├── (payload)/           # Payload CMS admin routes (/admin)
│   │   └── api/                 # API endpoints
│   │       ├── check-frameable/ # Frameability evaluator
│   │       ├── groups/          # Group sync & public share APIs
│   │       ├── metadata/        # Meta tag extractor
│   │       └── proxy/           # CORS & frame header stripper proxy
│   ├── components/              # Modular UI components
│   │   ├── layout/              # Sidebar, Header, Footer
│   │   ├── main/                # Iframe cards, Group views, Grid controls
│   │   ├── settings/            # Settings view
│   │   ├── shared/              # Reusable spinners & dialogs
│   │   └── ui/                  # Radix UI primitives & custom inputs
│   ├── contexts/                # React context providers (UI, Intro, Footer)
│   ├── hooks/                   # Custom hooks (dnd-kit reordering, visualizer store)
│   ├── payload/                 # Payload configuration & schema collections
│   │   └── collections/         # Users and Groups collection schemas
│   ├── types.ts                 # Shared TypeScript models
│   └── index.css                # Tailwind CSS v4 variables & styles
├── Dockerfile                   # Multi-stage production container image
├── docker-compose.yml           # Local & production compose stack
├── next.config.mjs              # Next.js config with standalone output
├── payload.config.ts            # Payload CMS configuration
└── package.json                 # Dependencies and scripts
```

---

## 💡 Usage Guide

### 1. Creating Groups & Adding URLs
- Click **+ Add Group** in the left sidebar to create categories (e.g. *Monitoring*, *Design Systems*, *Production APIs*).
- Click **Add URL** in the header to add site links with custom titles.
- Toggle **Point to Center** if the target page has critical content located in the center.

### 2. Privacy & Sharing Dashboards
- In group settings, toggle **Public** to make the dashboard accessible to team members.
- Copy the public share link (`/share/<uuid>`). Anyone with the link can view live pages with zero UI clutter.

### 3. Layout Switching & Reordering
- Use the layout switcher in the top right to switch between **Small Grid** (`3x3`), **Medium Grid** (`2x2`), **Large Focus** (`1 col`), or **List View**.
- Drag and drop cards by their drag handles to customize order; changes persist automatically.

### 4. Inspecting Sites
- Click on an iframe card to open the **Website Details** view, displaying response headers, meta descriptions, generators, and an expanded viewport preview.

---

## 📄 License

This project is private and intended for internal use.
