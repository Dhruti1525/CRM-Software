# Orbit CRM Dashboard

A modern, responsive CRM dashboard built with React, Redux Toolkit, React Router, Tailwind CSS, Axios and the [DummyJSON](https://dummyjson.com) API.

## Features

- **Dashboard** — KPI cards, revenue trend chart, pipeline-by-stage chart, recent customers
- **Customers** — searchable, paginated table backed by `/users`, with a detail modal
- **Leads** — searchable, paginated table backed by `/products`, mapped into CRM leads
- **Sales Pipeline** — drag-and-drop Kanban board across 6 pipeline stages
- **Analytics** — revenue, growth and lead-source charts (Recharts)
- **Reports** — pipeline summary table with CSV export
- **Search** — debounced search on Customers & Leads
- **Pagination** — reusable pagination component
- **Notifications** — activity feed panel with unread indicators
- **Dark mode** — class-based Tailwind dark mode, persisted to `localStorage`
- **Settings** — appearance, notification & account preferences
- **Responsive sidebar** — collapsible on desktop, drawer on mobile

## Tech stack

React 18 · Redux Toolkit · React Router v6 · Tailwind CSS · Axios · Recharts · lucide-react · Vite

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Build for production
npm run build
npm run preview
```

The app runs on `http://localhost:5173` and talks directly to `https://dummyjson.com` (no API key required, no backend needed).

## Project structure

```
crm-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                  # React root, wraps App with Redux + Router
    ├── App.jsx                   # syncs dark mode class, renders routes
    ├── index.css                 # Tailwind directives + base styles
    │
    ├── api/
    │   └── axios.js              # DummyJSON axios instance
    │
    ├── redux/
    │   ├── store.js
    │   └── slices/
    │       ├── uiSlice.js            # dark mode, sidebar state, notif panel
    │       ├── customersSlice.js     # /users → customers (search + pagination)
    │       ├── leadsSlice.js         # /products → leads + pipeline deals
    │       ├── salesSlice.js         # /carts → revenue data
    │       └── notificationsSlice.js # activity feed
    │
    ├── routes/
    │   └── AppRoutes.jsx          # all route definitions
    │
    ├── hooks/
    │   └── useDebounce.js
    │
    ├── utils/
    │   └── formatters.js          # currency/number/initials helpers
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx         # sidebar + topbar + <Outlet/>
    │   │   ├── Sidebar.jsx        # responsive nav (desktop rail + mobile drawer)
    │   │   └── Topbar.jsx         # search, dark mode toggle, notifications, avatar
    │   ├── common/
    │   │   ├── Card.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Loader.jsx         # Spinner, TableSkeleton, CardSkeleton
    │   │   ├── SearchBar.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── Modal.jsx
    │   │   └── Table.jsx
    │   ├── charts/
    │   │   ├── RevenueChart.jsx
    │   │   ├── PipelineChart.jsx
    │   │   └── CustomerGrowthChart.jsx
    │   └── notifications/
    │       └── NotificationPanel.jsx
    │
    └── pages/
        ├── Dashboard.jsx
        ├── Customers.jsx
        ├── Leads.jsx
        ├── SalesPipeline.jsx      # Kanban board
        ├── Analytics.jsx
        ├── Reports.jsx
        ├── Settings.jsx
        └── NotFound.jsx
```

## Notes on data

DummyJSON has no dedicated CRM endpoints, so real collections are mapped into CRM concepts, deterministically (seeded by `id`, so values stay stable across reloads):

| CRM concept     | DummyJSON source     |
|------------------|----------------------|
| Customers        | `/users`              |
| Leads / Deals     | `/products`            |
| Pipeline stages  | derived from product id |
| Revenue / Sales   | `/carts`               |
| Notifications     | `/todos` + `/products` |

## Design tokens

- **Font**: Sora (display) + Inter (body) + JetBrains Mono (data)
- **Palette**: navy sidebar (`#101426`), indigo-violet brand accent (`#6F5CFF`), teal/amber/rose/emerald semantic accents
- **Dark mode**: Tailwind `class` strategy, toggled via Redux + persisted in `localStorage`
