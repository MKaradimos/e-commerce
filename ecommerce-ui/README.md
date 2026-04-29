# Electro Shop UI

React + TypeScript frontend για το `ecommerce-api` backend.

## Tech Stack

- **React 18 + Vite** — fast dev server, lightning HMR
- **TypeScript** — type-safe components & API contracts
- **Tailwind CSS + shadcn/ui** — utility-first styling με accessible components
- **React Router v6** — client-side routing
- **TanStack Query (React Query)** — server state management, caching, mutations
- **Zustand** — minimal global state για auth (persist σε localStorage)
- **Axios** — HTTP client με auto-attach JWT interceptor

## Architecture

```
src/
├── api/          # axios client + endpoints
├── components/
│   ├── ui/       # shadcn/ui primitives
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── pages/        # route-level components
├── store/        # zustand stores (auth)
├── lib/          # utilities (cn, formatPrice)
├── types/        # TypeScript interfaces
├── App.tsx       # router setup
└── main.tsx      # entry
```

**Key decisions:**

- **React Query για server state** — αυτόματο caching, refetching, invalidation
  (π.χ. όταν προσθέτεις στο cart, invalidate `["cart"]` και το header
  ξανανανεώνεται αυτόματα).
- **Zustand μόνο για auth** — server state πάει σε React Query, client state
  σε Zustand. Δύο tools, σαφής διαχωρισμός.
- **Axios interceptors** — Authorization header και 401 handling κεντρικά,
  όχι σε κάθε call.
- **Protected routes με wrapper component** — declarative, composable.

## Setup

### Προαπαιτείται

Πρέπει το backend API να τρέχει στο `http://localhost:4000`. Δες το
`ecommerce-api` README.

### Install & run

```bash
npm install
npm run dev
```

Άνοιξε http://localhost:5173

### Demo credentials

- Customer: `customer@shop.com` / `Password123!`
- Admin: `admin@shop.com` / `Password123!`

(Pre-filled στη φόρμα login.)

## Pages / Features

- `/` — Products listing με search, filters (category/brand/price), pagination
- `/products/:id` — Product details + add to cart
- `/login`, `/register` — Authentication
- `/cart` — Cart με update quantity / remove (protected)
- `/checkout/:orderId` — Order confirmation + mock payment (protected)

## Build for production

```bash
npm run build
npm run preview
```

## Possible Extensions

- Order history page (`/orders`)
- Profile page (`/profile`)
- Admin panel (CRUD products, manage orders)
- Toast notifications με sonner ή react-hot-toast
- Skeleton loaders αντί για "Loading..."
- Image uploads / product gallery
- Dark mode toggle
