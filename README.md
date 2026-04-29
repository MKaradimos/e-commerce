# Electro Shop — Full-Stack E-Commerce App

Full-stack e-commerce εφαρμογή με React frontend και Node.js/Express backend.

**Tech:** React · TypeScript · Vite · Tailwind · Node.js · Express · PostgreSQL · Prisma · JWT

---

## Προαπαιτούμενα

Πριν ξεκινήσεις χρειάζεσαι:

- [Node.js](https://nodejs.org/) v18 ή νεότερο
- [Docker](https://www.docker.com/) (για PostgreSQL)
- [Git](https://git-scm.com/)

---

## 1. Κατέβασε τον κώδικα

```bash
git clone https://github.com/MKaradimos/e-commerce.git
cd e-commerce
```

---

## 2. Backend (ecommerce-api)

### 2.1 Εγκατάσταση dependencies

```bash
cd ecommerce-api
npm install
```

### 2.2 Ρύθμιση περιβάλλοντος

```bash
cp .env.example .env
```

Το `.env` έχει ήδη τις σωστές τιμές για local development — δεν χρειάζεται να αλλάξεις τίποτα.

### 2.3 Εκκίνηση βάσης δεδομένων (PostgreSQL μέσω Docker)

```bash
docker compose up -d
```

> Ξεκινά PostgreSQL στο port **5433**.

### 2.4 Migrations & Seed

```bash
npx prisma migrate deploy
npm run db:seed
```

Το seed δημιουργεί:

| Role     | Email             | Password     |
|----------|-------------------|--------------|
| Admin    | admin@shop.com    | Password123! |
| Customer | customer@shop.com | Password123! |

### 2.5 Εκκίνηση backend

```bash
npm run dev
```

Το API τρέχει στο **http://localhost:4000**

| URL | Περιγραφή |
|-----|-----------|
| http://localhost:4000/api | REST API |
| http://localhost:4000/api/docs | Swagger UI (interactive docs) |
| http://localhost:4000/health | Health check |

---

## 3. Frontend (ecommerce-ui)

Άνοιξε **νέο terminal** και:

### 3.1 Εγκατάσταση dependencies

```bash
cd ecommerce-ui
npm install
```

### 3.2 Ρύθμιση περιβάλλοντος

```bash
cp .env.example .env
```

### 3.3 Εκκίνηση frontend

```bash
npm run dev
```

Το UI τρέχει στο **http://localhost:5173**

---

## 4. Χρήση

1. Άνοιξε http://localhost:5173
2. Κάνε login ή register
3. Browse products, πρόσθεσε στο cart, checkout, πληρωμή (mock)

> **Demo:** Για γρήγορη δοκιμή χρησιμοποίησε `customer@shop.com` / `Password123!`

---

## Δομή Project

```
e-commerce/
├── ecommerce-api/        # Node.js + Express + Prisma backend
│   ├── prisma/           # Schema & migrations & seed
│   ├── src/
│   │   ├── modules/      # auth, products, cart, orders, payments...
│   │   ├── middlewares/  # auth, validation, error handling
│   │   ├── config/       # env, prisma client, swagger
│   │   └── utils/        # JWT, ApiError, asyncHandler
│   ├── tests/            # Integration tests (Jest + Supertest)
│   ├── docker-compose.yml
│   └── .env.example
│
└── ecommerce-ui/         # React + Vite + TypeScript frontend
    ├── src/
    │   ├── pages/        # ProductsPage, CartPage, CheckoutPage...
    │   ├── components/   # Layout, ProtectedRoute, shadcn/ui
    │   ├── api/          # axios client + endpoints
    │   ├── store/        # Zustand auth store
    │   └── types/        # TypeScript interfaces
    └── .env.example
```

---

## Συχνά προβλήματα

**`EADDRINUSE: address already in use :::4000`**
Κάτι τρέχει ήδη στο port 4000. Σκότωσέ το:
```bash
lsof -ti:4000 | xargs kill
```

**`Connection refused` στη βάση**
Βεβαιώσου ότι το Docker container τρέχει:
```bash
docker compose up -d
```

**`prisma: command not found`**
Χρησιμοποίησε `npx prisma` αντί για `prisma`.
