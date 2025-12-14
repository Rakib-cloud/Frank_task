# MyFrank - Product Admin UI

A modern, responsive Product Admin Dashboard built with **Vue 3 (Composition API)** and **Tailwind CSS v4**. This project demonstrates a clean architecture with reusable components, state management, and a service layer for API interactions.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss)
![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859)

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Installation Steps

**1. Clone the repository**

```bash
git clone https://github.com/your-username/Frank_Task.git
```

**2. Navigate to the project folder**

```bash
cd Frank_Task
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm start
```

This will start both the frontend and backend servers:

| Service   | URL                     |
|-----------|-------------------------|
| Frontend  | http://localhost:5173   |
| API       | http://localhost:3001   |

**5. Open in browser**

Visit [http://localhost:5173](http://localhost:5173) to view the application.

---

## 🔐 Login Credentials

The login form comes with **pre-filled credentials** that are ready to use:

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `admin` |

> **Note:** The login fields are disabled and cannot be edited. Simply click the **Sign In** button to log in.

---

## 🏗️ Architecture

### Application Structure

```
Component → Composable → Store → Service → API
```

This architecture ensures:
- **Separation of Concerns** - Each layer has a single responsibility
- **Reusability** - Components and composables can be reused across the app
- **Testability** - Each layer can be tested independently
- **Maintainability** - Easy to modify and extend

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │ ──▶ │  Composable │ ──▶ │    Store    │ ──▶ │   Service   │
│   (View)    │     │  (useXxx)   │     │   (Pinia)   │     │   (API)     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   ▼
       │                   │                   │            ┌─────────────┐
       │                   │                   │            │  json-server│
       │                   │                   │            │  (db.json)  │
       └───────────────────┴───────────────────┴────────────┴─────────────┘
                              Reactive Data Binding
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Views** | `src/views/` | Page components, UI layout |
| **Components** | `src/components/` | Reusable UI elements |
| **Composables** | `src/composables/` | Business logic, data transformation |
| **Stores** | `src/stores/` | Global state management (Pinia) |
| **Services** | `src/services/` | API calls via Axios |

---

## 📁 Project Structure

```
Frank_Task/
├── db.json                  # Mock database for json-server
├── index.html               # Entry HTML file
├── package.json             # Project dependencies & scripts
├── vite.config.js           # Vite configuration
├── public/                  # Static assets
└── src/
    ├── main.js              # Application entry point
    ├── App.vue              # Root component
    ├── assets/
    │   └── main.css         # Global styles & Tailwind imports
    ├── components/
    │   ├── base/            # Reusable base components
    │   │   ├── BaseBadge.vue
    │   │   ├── BaseButton.vue
    │   │   ├── BaseCard.vue
    │   │   ├── BaseDropdown.vue
    │   │   ├── BaseEmptyState.vue
    │   │   ├── BaseInput.vue
    │   │   ├── BaseModal.vue
    │   │   ├── BasePagination.vue
    │   │   ├── BaseSearch.vue
    │   │   ├── BaseSelect.vue
    │   │   ├── BaseSkeleton.vue
    │   │   ├── BaseTable.vue
    │   │   ├── BaseTabs.vue
    │   │   ├── DataTable.vue
    │   │   └── PageHeader.vue
    │   ├── dashboard/       # Dashboard-specific components
    │   │   ├── DashboardCampaignCard.vue
    │   │   ├── DashboardCompetitors.vue
    │   │   ├── DashboardStatCard.vue
    │   │   └── DashboardTeamRanking.vue
    │   ├── campaigns/
    │   │   └── CampaignCard.vue
    │   ├── products/
    │   │   └── ProductCard.vue
    │   └── layout/
    │       ├── TheHeader.vue
    │       ├── TheSidebar.vue
    │       ├── TheSidebarMobile.vue
    │       └── TheBottomNav.vue
    ├── composables/
    │   ├── useAuth.js
    │   ├── useCampaigns.js
    │   ├── useCompetitors.js
    │   ├── useDashboard.js
    │   └── useProducts.js
    ├── layouts/
    │   └── MainLayout.vue
    ├── router/
    │   └── index.js
    ├── services/
    │   ├── api.js           # Axios instance configuration
    │   ├── authService.js
    │   ├── campaignService.js
    │   ├── competitorService.js
    │   ├── dashboardService.js
    │   ├── productService.js
    │   └── teamService.js
    ├── stores/
    │   ├── auth.js
    │   ├── campaigns.js
    │   ├── competitors.js
    │   ├── dashboard.js
    │   ├── products.js
    │   └── ui.js
    └── views/
        ├── BillingView.vue
        ├── CampaignsView.vue
        ├── CompetitorsView.vue
        ├── DashboardView.vue
        ├── LoginView.vue
        ├── NetworkView.vue
        ├── ProductsView.vue
        ├── ReviewsView.vue
        ├── RewardsView.vue
        ├── SettingsView.vue
        └── TeamView.vue
```

---

## 🎯 Features

### Implemented Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | KPIs, campaigns overview, team rankings, competitors table |
| **Products** | Full CRUD with search, filter, sort, pagination |
| **Campaigns** | Full CRUD with tabs (All, Upcoming, In Progress, Completed, Archive) |
| **Team Members** | Full CRUD with filter, sort, pagination |
| **Competitors Table** | Table with actions menu (View, Edit, Delete) |
| **Sidebar** | Collapsible navigation with icons |
| **Navbar** | Dropdowns for user, language, business selection |
| **Mobile Bottom Nav** | Fixed bottom navigation for mobile devices |
| **Responsive Design** | Desktop and mobile layouts |
| **Authentication** | Login with route guards |

### Reusable Components

| Component | Description |
|-----------|-------------|
| `BaseButton` | Button with variants (primary, secondary, danger, outline) |
| `BaseInput` | Input field with label, validation, disabled state |
| `BaseSelect` | Dropdown select component |
| `BaseModal` | Modal dialog with header, body, footer slots |
| `BasePagination` | Pagination with page numbers |
| `BaseSkeleton` | Loading skeleton (text, circle, rect, card) |
| `BaseTable` | Table component with sorting and custom cells |
| `DataTable` | Full-featured table with filters, pagination |
| `BaseTabs` | Tab navigation component |
| `BaseDropdown` | Dropdown menu with click-outside detection |
| `BaseBadge` | Status badge with variants |
| `BaseCard` | Card container component |
| `BaseEmptyState` | Empty/placeholder state component |
| `BaseSearch` | Search input with icon |
| `PageHeader` | Page header with title and actions |

### Dashboard Components

| Component | Description |
|-----------|-------------|
| `DashboardStatCard` | Stat card with icon, title, and value |
| `DashboardCampaignCard` | Campaign card with progress and status |
| `DashboardTeamRanking` | Team ranking section with sorting |
| `DashboardCompetitors` | Competitors table section |

---

## 📜 Available Scripts

| Script             | Command              | Description                          |
|--------------------|----------------------|--------------------------------------|
| Start Both Servers | `npm start`          | Runs API + Frontend simultaneously   |
| Frontend Only      | `npm run dev`        | Start Vite development server        |
| API Only           | `npm run server`     | Start json-server on port 3001       |
| Build              | `npm run build`      | Build for production                 |
| Preview            | `npm run preview`    | Preview the production build         |

---

## 🛠️ Tech Stack

| Technology      | Version | Purpose                    |
|-----------------|---------|----------------------------|
| Vue 3           | 3.5.x   | Frontend framework (Composition API) |
| Tailwind CSS    | v4      | Utility-first CSS          |
| Pinia           | 3.0.x   | State management           |
| Vue Router      | 4.5.x   | Client-side routing        |
| Axios           | 1.7.x   | HTTP client                |
| json-server     | 1.0.x   | Fake REST API for dev      |
| Vite            | 6.x     | Build tool & dev server    |

---

## 🔗 API Endpoints

| Endpoint           | Method | Description            |
|--------------------|--------|------------------------|
| `/users`           | GET    | User authentication    |
| `/stats`           | GET    | Dashboard statistics   |
| `/campaigns`       | GET/POST/PATCH/DELETE | Campaign CRUD |
| `/teamRankings`    | GET/POST/PATCH/DELETE | Team member CRUD |
| `/competitors`     | GET    | Competitor data        |
| `/products`        | GET/POST/PATCH/DELETE | Product CRUD |
| `/categories`      | GET    | Product categories     |

---

## 🎨 Design System

### Colors

| Color      | Hex       | Usage           |
|------------|-----------|-----------------|
| Primary    | `#3B82F6` | Buttons, Links  |
| Sidebar    | `#0F172A` | Dark Navy       |
| Background | `#F8FAFC` | Light Gray      |
| Success    | `#22C55E` | Green           |
| Warning    | `#F59E0B` | Amber           |
| Danger     | `#EF4444` | Red             |

### Typography

- **Font**: Inter
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

---

## 📱 Responsive Design

| Breakpoint | Width        | Layout         |
|------------|--------------|----------------|
| Mobile     | < 1024px     | Bottom nav, simplified views |
| Desktop    | ≥ 1024px     | Full sidebar, multi-column |

### Mobile Features
- Fixed bottom navigation bar (Home, Campaigns, Review, Members, More)
- Establishment search in header
- 2-column stat cards (4 on desktop)
- Horizontal scrollable tabs
- Touch-friendly buttons and inputs
- No horizontal scrolling
- Responsive tables with horizontal scroll

### Desktop Features
- Collapsible sidebar navigation
- Full header with dropdowns
- 4-column stat cards
- Team ranking section
- Competitors table section
