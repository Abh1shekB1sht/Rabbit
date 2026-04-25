# Rabbit

Rabbit is a full-stack fashion e-commerce project built with the MERN stack.

This started as a learning + real build project: not just a tutorial clone, but a working app with customer flow, admin flow, cart logic, checkout, and order tracking. It is still evolving, but the core experience is already in place.

## What this project does

- Browse products by collection, category, color, size, brand, material, price range, and search
- View product details and similar product suggestions
- Add to cart as guest or logged-in user
- Merge guest cart into user cart after login
- Register/login with JWT auth
- Checkout flow with payment status + order finalization
- View user orders (list + details)
- Admin dashboard for:
  - user management
  - product management
  - order management
- Product image upload via Cloudinary
- Newsletter subscribe endpoint

## Tech stack

### Frontend

- React (Vite)
- Redux Toolkit + React Redux
- React Router
- Axios
- Tailwind CSS
- Sonner (toasts)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Multer + Cloudinary upload pipeline
- Bcrypt password hashing

## Project structure

```text
rabbit/
  backend/   # Express API + MongoDB models/routes
  frontend/  # React app (Vite + Redux)
```

## Quick start

### 1) Clone and install

```bash
git clone <your-repo-url>
cd rabbit

cd backend
npm install

cd ../frontend
npm install
```

### 2) Create environment files

Create a `.env` file in `backend/`:

```env
PORT=9000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:9000
```

### 3) (Optional but recommended) Seed sample data

```bash
cd backend
npm run seed
```

The seed script creates sample products and one admin user.

Default seeded admin credentials:

- Email: `example@gmail.com`
- Password: `123456`

Change this immediately for any shared/demo/prod environment.

### 4) Run both apps

Terminal 1:

```bash
cd backend
npm start
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Frontend usually runs on `http://localhost:5173` and talks to backend at `http://localhost:9000`.

## Available scripts

### Backend

- `npm start` - run API server with nodemon
- `npm run seed` - seed sample products + admin user

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run eslint

## API overview

Base URL: `http://localhost:9000/api`

- `POST /users/register`
- `POST /users/login`
- `GET /products`
- `GET /products/:id`
- `GET /products/best-seller`
- `GET /products/new-arrivals`
- `GET /products/similar/:id`
- `POST /cart`
- `PUT /cart`
- `DELETE /cart`
- `GET /cart`
- `POST /cart/merge` (auth)
- `POST /checkout` (auth)
- `PUT /checkout/:id/pay` (auth)
- `POST /checkout/:id/finalize` (auth)
- `GET /orders/my-orders` (auth)
- `GET /orders/:id` (auth)
- `POST /upload` (Cloudinary image upload)
- `POST /subscribe`
- Admin routes under `/admin/users`, `/admin/products`, `/admin/orders` (admin auth)

## Current status

Implemented:

- End-to-end customer shopping flow
- End-to-end admin management flow
- Checkout-to-order conversion
- Guest-to-user cart migration

In progress / planned polish:

- tighter validation and error states
- stronger automated test coverage
- deployment hardening and environment automation

## Why this repo exists

This project is my practical sandbox to understand real e-commerce behavior: auth edge cases, cart merge logic, checkout states, and admin workflows.

If you're reviewing or using this code, feedback is always welcome.
