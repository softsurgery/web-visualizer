# Web Visualizer 🌐

A modern, responsive multi-URL dashboard and website visualizer built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**. 

Web Visualizer enables users to curate, organize, and monitor multiple web pages simultaneously across customizable grid layouts, complete with an intelligent local reverse-proxy to bypass restrictive iframe framing headers (`X-Frame-Options` and `CSP frame-ancestors`).

---

## ✨ Features

- 🗂️ **Workspace & Group Management**: Organize your web applications, dashboards, reference links, and tools into distinct groups.
- 📐 **Adaptive Grid Layouts**: Switch dynamically between **Small**, **Medium**, **Large**, and **List** views according to your screen size and workflow needs.
- 🖥️ **Responsive Desktop Viewport Scaling**: Simulates full 1280px desktop viewports for embedded sites, smoothly auto-scaling down with `ResizeObserver` to fit any card dimension without horizontal breaking.
- 🛡️ **Intelligent Frameability Detection & Proxy Fallback**:
  - Checks target sites against `X-Frame-Options` and `Content-Security-Policy: frame-ancestors` via `/__check-frameable`.
  - Automatically routes blocked sites through a built-in Vite proxy middleware (`/__proxy`) that strips restrictive headers, enabling sites to render inside iframes seamlessly.
  - Visual status pill indicators:
    - 🟢 **Green**: Direct connection (natively frameable)
    - 🟠 **Orange**: Proxied connection (bypassing frame restrictions)
    - 🟡 **Yellow**: Checking frameability
- 🔍 **Site Details & Metadata Inspector**:
  - Detailed drill-down view (`/details/:urlId`) with expanded preview.
  - Backend metadata scraper (`/__metadata`) extracts page `<title>`, `<meta description>`, generator tags, and server headers.
- 🎯 **Point to Center**: Option to auto-scroll vertically to the center of taller web applications upon loading.
- 💾 **Data Portability**: Full backup and restore capabilities—export your groups and URLs to JSON and import them anytime.
- 🌓 **Theme Support**: Seamless Dark, Light, and System themes powered by `next-themes`.
- ⚡ **Modern UI**: Built with Tailwind CSS v4, Lucide icons, and accessible component primitives.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or later recommended)
- [Yarn](https://yarnpkg.com/) or `npm`

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

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to the local address printed by Vite (typically `http://localhost:5173`).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Starts the Vite development server with HMR and proxy middleware. |
| `yarn build` | Runs TypeScript compilation (`tsc -b`) and bundles for production with Vite. |
| `yarn preview` | Locally serves the production build. |
| `yarn lint` | Runs [Oxlint](https://oxc.rs/) for ultra-fast JavaScript/TypeScript linting. |

---

## 🔍 How the Proxy Middleware Works

Modern web applications often set HTTP headers such as:
- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors ...`

These security headers prevent unauthorized third-party websites from framing content in iframes. 

Web Visualizer solves this for local visualization via custom Vite server middleware configured in [vite.config.ts](file:///home/cardinal/Documents/Commit%20Labs/web-visualizer/vite.config.ts):

1. **`/__check-frameable?url=<target>`**: Sends a `HEAD` / `GET` request to inspect headers and returns `{ frameable: boolean }`.
2. **`/__proxy?url=<target>`**: If a site is not frameable directly, requests route through the dev proxy, which fetches the remote site, removes restrictive framing headers, injects permissive CORS headers, and streams the content back safely to the preview iframe.
3. **`/__metadata?url=<target>`**: Extracts document meta tags (title, description, generator) and server headers to provide insight in the Details view.

---

## 📁 Project Structure

```text
web-visualizer/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── main/           # Core view components
│   │   │   ├── EmptyState.tsx          # Placeholders for empty groups/URLs
│   │   │   ├── IframeCard.tsx          # Scaled iframe card with controls & proxy logic
│   │   │   ├── MainHeader.tsx          # Group title, stats, and "Add URL" action
│   │   │   ├── MainView.tsx            # Main layout container with layout switcher
│   │   │   ├── SettingsView.tsx        # Import/Export JSON configuration
│   │   │   └── WebsiteDetailsView.tsx  # Metadata inspector and full-height preview
│   │   ├── sidebar/        # Collapsible navigation & group management
│   │   │   ├── GroupItem.tsx           # Group list item with active states
│   │   │   ├── Sidebar.tsx             # Main sidebar wrapper
│   │   │   ├── SidebarActions.tsx      # Add group modal trigger
│   │   │   └── SidebarHeader.tsx       # Branding and dark/light mode toggle
│   │   ├── ui/             # Reusable UI primitives (dialogs, buttons, sidebar, etc.)
│   │   └── mode-toggle.tsx # Theme switcher button
│   ├── hooks/              # Custom React hooks (dialogs, sheets)
│   ├── services/
│   │   └── StorageService.ts # LocalStorage persistence and JSON import/export
│   ├── types.ts            # Data models (Group, UrlEntry, LayoutType)
│   ├── App.tsx             # Root application and route definitions
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind CSS styles and theme variables
├── vite.config.ts          # Vite build config & proxy middleware
└── package.json            # Scripts and project dependencies
```

---

## 💡 Usage

### Creating Groups & Adding URLs
1. Click **+ Add Group** in the left sidebar to create a new category (e.g., "Monitoring", "Design System", "Daily Feeds").
2. Select the group, then click **Add URL** in the top header.
3. Provide a friendly name and the destination URL.
4. Optionally toggle **Point to Center** if the page has essential content in the middle.

### Switching Layouts
Use the layout icons in the top-right corner to toggle between:
- **Small Grid** (`3x3` / `4x4`): High-density bird's-eye overview.
- **Medium Grid** (`2x2`): Balanced view for active inspection.
- **Large Grid** (`1 column`): Expanded view for detailed reading.
- **List View**: Vertical stack layout.

### Inspecting Sites
Click anywhere on an iframe card to navigate to its **Website Details** view, where you can see extracted meta tags, headers, and an expanded viewport.

### Exporting & Importing
Navigate to **Settings** from the sidebar footer to export your saved groups and URLs to a `.json` backup file or restore an existing configuration.

---

## 📄 License

This project is private and intended for internal use.
