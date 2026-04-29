# E-commerce REST API

Full-featured backend για ένα κατάστημα ηλεκτρονικών ειδών.
Χτισμένο με **Express, PostgreSQL & Prisma**. Σχεδιασμένο για να δείχνει
clean architecture, proper database design και επαγγελματικές πρακτικές.

## Tech Stack

- **Node.js + Express** — REST API
- **PostgreSQL + Prisma** — type-safe ORM, migrations
- **JWT + bcrypt** — stateless authentication
- **Zod** — schema validation στο HTTP boundary
- **Jest + Supertest** — integration tests
- **Swagger / OpenAPI** — auto-generated API docs
- **Helmet, CORS, Morgan** — security & logging middleware

## Architecture

Layered, module-based:

```
routes → controllers → services → repositories → Prisma
```

Κάθε feature είναι ένα module (`auth`, `users`, `products`, `categories`,
`cart`, `orders`, `payments`). Τα services έχουν την business logic, τα
repositories κάνουν data access. Έτσι:

- Ο controller ασχολείται μόνο με HTTP (parsing, responses).
- Η business logic ζει στο service και είναι testable με mocked repos.
- Αν αύριο αλλάξει ORM, αλλάζει μόνο το repository layer.

## Features

- Authentication (register, login) με roles (`CUSTOMER`, `ADMIN`)
- Users: profile (`/users/me`), admin list
- Products: CRUD (admin), search, filters (category/brand/price), pagination
- Categories: CRUD + προϊόντα ανά category
- Cart: add / update / remove / view με stock validation
- Orders: checkout με transactional stock decrement, history, admin view
- Payments: mock provider, αλλάζει order σε `PAID`
- Soft-delete σε products για ακεραιότητα ιστορικού παραγγελιών

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. PostgreSQL με Docker

```bash
docker compose up -d
```

### 3. Migrations & seed

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Άνοιξε:

- API: http://localhost:4000/api
- Swagger UI: http://localhost:4000/api/docs
- Health: http://localhost:4000/health
- Prisma Studio (DB GUI): `npx prisma studio` → http://localhost:5555

## Demo accounts

| Role     | Email              | Password      |
| -------- | ------------------ | ------------- |
| Admin    | admin@shop.com     | Password123!  |
| Customer | customer@shop.com  | Password123!  |

## Tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint                          | Auth     | Description           |
| ------ | --------------------------------- | -------- | --------------------- |
| POST   | `/api/auth/register`              | –        | Register              |
| POST   | `/api/auth/login`                 | –        | Login                 |
| GET    | `/api/users/me`                   | Auth     | Profile               |
| PATCH  | `/api/users/me`                   | Auth     | Update profile        |
| GET    | `/api/users`                      | ADMIN    | List all users        |
| GET    | `/api/products`                   | –        | List w/ filters       |
| GET    | `/api/products/:id`               | –        | Product details       |
| POST   | `/api/products`                   | ADMIN    | Create                |
| PATCH  | `/api/products/:id`               | ADMIN    | Update                |
| DELETE | `/api/products/:id`               | ADMIN    | Soft delete           |
| GET    | `/api/categories`                 | –        | List categories       |
| GET    | `/api/categories/:id`             | –        | Category w/ products  |
| POST   | `/api/categories`                 | ADMIN    | Create category       |
| PATCH  | `/api/categories/:id`             | ADMIN    | Update category       |
| DELETE | `/api/categories/:id`             | ADMIN    | Delete category       |
| GET    | `/api/cart`                       | Auth     | View cart             |
| POST   | `/api/cart/items`                 | Auth     | Add to cart           |
| PATCH  | `/api/cart/items/:productId`      | Auth     | Update quantity       |
| DELETE | `/api/cart/items/:productId`      | Auth     | Remove from cart      |
| POST   | `/api/orders/checkout`            | Auth     | Checkout cart         |
| GET    | `/api/orders/me`                  | Auth     | My orders             |
| GET    | `/api/orders`                     | ADMIN    | All orders            |
| GET    | `/api/orders/:id`                 | Auth     | Order details         |
| PATCH  | `/api/orders/:id/status`          | ADMIN    | Update order status   |
| POST   | `/api/payments/:orderId`          | Auth     | Mock pay              |

Πλήρες schema στο Swagger UI.

## Quick Smoke Test

```bash
# Login as customer
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shop.com","password":"Password123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# List products
curl http://localhost:4000/api/products

# View my cart
curl http://localhost:4000/api/cart -H "Authorization: Bearer $TOKEN"

# Add product to cart (replace PRODUCT_ID)
curl -X POST http://localhost:4000/api/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'

# Checkout
curl -X POST http://localhost:4000/api/orders/checkout \
  -H "Authorization: Bearer $TOKEN"
```

## Design Decisions

- **Decimal αντί Float για χρήματα** — αποφυγή rounding errors
- **Snapshot product data στο OrderItem** — οι παλιές παραγγελίες
  διατηρούν αρχικές τιμές ακόμα κι αν αλλάξει/σβηστεί το προϊόν
- **Soft delete** σε προϊόντα (`isActive: false`) — ακεραιότητα FK
  σε ιστορικά
- **Transactions στο checkout** — atomicity μεταξύ order creation,
  stock decrement και cart clearing. Αν οτιδήποτε αποτύχει, όλα κάνουν
  rollback.
- **Re-check stock μέσα στο transaction** — race-condition safe για
  ταυτόχρονες αγορές του ίδιου προϊόντος
- **Stateless JWT** — horizontally scalable
- **Validation στο HTTP boundary** — services δέχονται καθαρά δεδομένα
- **Indexes** σε email, slug, brand, price, categoryId, status — όλα
  τα query patterns που έχει το feature spec

## Possible Extensions (για interview discussion)

- Refresh tokens & token rotation
- Redis cache για product listing
- Real payment provider (Stripe)
- Image uploads σε S3
- Rate limiting (express-rate-limit)
- Email notifications μέσω BullMQ queue
- Full-text search με Postgres `tsvector` ή Meilisearch
- Structured logging με Pino
- Connection pooling με PgBouncer

## Project Structure

```
ecommerce-api/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   └── swagger.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── payments/
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── jwt.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── auth.test.js
│   ├── products.test.js
│   └── cart.test.js
├── docker-compose.yml
├── .env.example
├── jest.config.js
├── package.json
└── README.md
```
