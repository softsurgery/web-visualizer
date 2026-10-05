# Web Visualizer 🌐

A modern, responsive multi-URL dashboard and website visualizer built with **Next.js**, **TypeScript**, **Tailwind CSS v4**, and **Payload CMS**. 

Web Visualizer enables users to curate, organize, and monitor multiple web pages simultaneously across customizable grid layouts, complete with an intelligent reverse-proxy API to bypass restrictive iframe framing headers (`X-Frame-Options` and `CSP frame-ancestors`).

---

## ✨ Features

- 🗂️ **Workspace & Group Management**: Organize your web applications, dashboards, reference links, and tools into distinct groups.
- 🔐 **User Authentication & Access Control**: Secure your dashboard with Payload CMS user authentication and group-level access controls.
- 📐 **Adaptive Grid Layouts & Drag-and-Drop**: Switch dynamically between **Small**, **Medium**, **Large**, and **List** views according to your screen size and workflow needs. Seamlessly reorder iframe cards using drag-and-drop.
- 🖥️ **Responsive Desktop Viewport Scaling**: Simulates full 1280px desktop viewports for embedded sites, smoothly auto-scaling down with `ResizeObserver` to fit any card dimension without horizontal breaking.
- 🛡️ **Intelligent Frameability Detection & Proxy Fallback**:
  - Checks target sites against `X-Frame-Options` and `Content-Security-Policy: frame-ancestors` via `/api/check-frameable`.
  - Automatically routes blocked sites through a built-in Next.js proxy API (`/api/proxy`) that strips restrictive headers, enabling sites to render inside iframes seamlessly.
  - Visual status pill indicators:
    - 🟢 **Green**: Direct connection (natively frameable)
    - 🟠 **Orange**: Proxied connection (bypassing frame restrictions)
    - 🟡 **Yellow**: Checking frameability
- 🔍 **Site Details & Metadata Inspector**:
  - Detailed drill-down view (`/details/:urlId`) with expanded preview.
  - Backend metadata scraper (`/api/metadata`) extracts page `<title>`, `<meta description>`, generator tags, and server headers.
- 🔗 **State Synchronization**: Active group state syncs with URL query parameters, providing dynamic document titles for better browser navigation.
- 🎯 **Point to Center**: Option to auto-scroll vertically to the center of taller web applications upon loading.
- 🌓 **Theme Support**: Seamless Dark, Light, and System themes powered by `next-themes`.
- ⚡ **Modern UI**: Built with Tailwind CSS v4, Lucide icons, and accessible component primitives.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **CMS**: [Payload CMS](https://payloadcms.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Drag and Drop**: [dnd-kit](https://dndkit.com/)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or later recommended)
- [Yarn](https://yarnpkg.com/) or `npm`
- Postgres database (as configured in Payload CMS)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-visualizer
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Configure environment variables for Next.js and Payload CMS by duplicating `.env.example` or setting up a `.env` file.

4. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open your browser and navigate to the local address (typically `http://localhost:3000`).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Starts the Next.js development server with Payload CMS running. |
| `yarn build` | Builds the Next.js application for production. |
| `yarn start` | Starts the production server. |
| `yarn lint` | Runs [Oxlint](https://oxc.rs/) for fast JavaScript/TypeScript linting. |
| `yarn payload` | Payload CMS CLI. |

---

## 🐳 Docker Setup & Deployment

Web Visualizer provides an optimized multi-stage `Dockerfile` and a ready-to-use `docker-compose.yml` configured for production performance with minimal image size via Next.js standalone output.

### 1. Running with Docker Compose (Recommended)

The easiest way to spin up Web Visualizer alongside a PostgreSQL 16 database is via Docker Compose:

```bash
# Build and start all services (app + Postgres) in detached mode
docker compose up -d --build

# View application logs
docker compose logs -f app

# Stop the containers
docker compose down
```

The application will be available at `http://localhost:3000` and the Payload CMS admin at `http://localhost:3000/admin`.

### 2. Manual Docker Build & Run

You can also build and run the Docker image independently:

```bash
# Build the production image
docker build -t web-visualizer:latest .

# Run the container
docker run -d \
  -p 3000:3000 \
  --name web-visualizer \
  -e PAYLOAD_SECRET="your-secure-payload-secret" \
  -e DATABASE_URI="postgres://postgres:postgres@host.docker.internal:5432/web_visualizer" \
  web-visualizer:latest
```

---

## 🚀 Automated Deployment to Docker Hub (CI/CD)

An automated GitHub Actions workflow is set up at [`.github/workflows/docker-publish.yml`](file:///.github/workflows/docker-publish.yml) to automatically build and push multi-platform (`linux/amd64`, `linux/arm64`) images to Docker Hub.

### Trigger Events
- **Push to `main`**: Automatically builds and tags as `:latest` and branch name.
- **Push to `develop`**: Builds and tags image as `:develop`.
- **Git Tags (`v*.*.*`)**: Builds and tags semver versions (e.g. `:v1.0.0`, `:1.0`, `:1`).
- **Pull Requests to `main`**: Runs a test build without pushing to verify Docker compilation.
- **Manual Dispatch**: Triggerable from GitHub Actions tab with custom tag inputs.

### Setting Up Docker Hub Credentials in GitHub
To enable automatic publishing, configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions > Secrets**):

1. `DOCKERHUB_USERNAME`: Your Docker Hub account username.
2. `DOCKERHUB_TOKEN`: A Docker Hub Personal Access Token (generate at [Docker Hub Account Settings > Security > New Access Token](https://hub.docker.com/settings/security)).
3. `DOCKERHUB_REPO` *(Optional)*: If you are pushing to an organization or custom repository path (defaults to `<DOCKERHUB_USERNAME>/web-visualizer`).

---

## 🔍 How the Proxy Middleware Works

Modern web applications often set HTTP headers such as:
- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors ...`

These security headers prevent unauthorized third-party websites from framing content in iframes. 

Web Visualizer solves this for local visualization via custom Next.js API routes:

1. **`/api/check-frameable?url=<target>`**: Sends a `HEAD` / `GET` request to inspect headers and returns `{ frameable: boolean }`.
2. **`/api/proxy?url=<target>`**: If a site is not frameable directly, requests route through this proxy API, which fetches the remote site, removes restrictive framing headers, injects permissive CORS headers, and streams the content back safely to the preview iframe.
3. **`/api/metadata?url=<target>`**: Extracts document meta tags (title, description, generator) and server headers to provide insight in the Details view.

---

## 📁 Project Structure

```text
web-visualizer/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router definitions & API routes
│   │   ├── (app)/          # Frontend pages and layout
│   │   ├── (payload)/      # Payload CMS admin interface
│   │   └── api/            # API endpoints (proxy, metadata, check-frameable, groups/sync)
│   ├── components/         # React components (layout, main, sidebar, ui)
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks (dnd-kit, UI state)
│   ├── payload/            # Payload CMS configuration and collections
│   │   └── collections/    # Data models (Groups, Users, etc.)
│   ├── types.ts            # Data models and TS types
│   └── index.css           # Global Tailwind CSS styles and theme variables
├── payload.config.ts       # Payload CMS core configuration
├── next.config.mjs         # Next.js build config
└── package.json            # Scripts and project dependencies
```

---

## 💡 Usage

### Creating Groups & Adding URLs
1. Click **+ Add Group** in the left sidebar to create a new category (e.g., "Monitoring", "Design System", "Daily Feeds").
2. Select the group, then click **Add URL** in the top header.
3. Provide a friendly name and the destination URL.
4. Optionally toggle **Point to Center** if the page has essential content in the middle.

### Switching Layouts & Reordering
Use the layout icons in the top-right corner to toggle between:
- **Small Grid** (`3x3` / `4x4`): High-density bird's-eye overview.
- **Medium Grid** (`2x2`): Balanced view for active inspection.
- **Large Grid** (`1 column`): Expanded view for detailed reading.
- **List View**: Vertical stack layout.

You can drag and drop cards to reorder them in any grid view!

### Inspecting Sites
Click anywhere on an iframe card to navigate to its **Website Details** view, where you can see extracted meta tags, headers, and an expanded viewport.

---

## 📄 License

This project is private and intended for internal use.
