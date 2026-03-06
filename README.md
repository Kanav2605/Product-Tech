# E-commerce Catalog Experiment (MongoDB + Mongoose + React)

Full-stack experiment for advanced MongoDB catalog modeling:
- Nested schemas (category, variants, reviews, shipping)
- Review + rating summary support
- Aggregation queries for analytics
- Performance indexes
- Stock update methods for reserve/restock
- Non-basic colorful frontend theme (orange + green + yellow)

## Project Structure

- `backend/` Express + Mongoose API
- `frontend/` React + Vite dashboard

## 1) Backend Setup

```bash
cd backend
cp .env.example .env
# add your MongoDB Atlas URI in .env
npm install
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`.

### Main API Endpoints

- `GET /api/health`
- `POST /api/products` create product
- `GET /api/products` list/search/filter products
- `GET /api/products/slug/:slug` product details
- `POST /api/products/:id/reviews` add review + recompute rating summary
- `PATCH /api/products/:id/stock/reserve` reserve variant stock
- `PATCH /api/products/:id/stock/restock` restock variant

### Aggregation Endpoints

- `GET /api/products/analytics/top-rated?limit=5`
- `GET /api/products/analytics/price-stats`
- `GET /api/products/analytics/low-stock?threshold=3`
- `GET /api/products/analytics/summary`

## 2) Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## 3) MongoDB Requirements Mapping

### Nested Schemas
- Product includes nested `category`, `variants`, `reviews`, `shipping`, `ratingSummary`

### Variant + Review Support
- Multiple variants with `sku`, `color`, `size`, `price`, `stock`
- Embedded review documents with automatic rating summary recompute

### Aggregation
- Top rated products
- Price stats by category
- Low stock variant alerts
- Faceted catalog summary

### Index Optimization
- Text index for search
- Category index
- Variant SKU unique index
- Rating and createdAt indexes

### Stock Methods
- `adjustVariantStock()`
- `reserveStock()`
- `restockVariant()`

## 4) Push to GitHub

```bash
git init
git add .
git commit -m "Build full-stack ecommerce catalog experiment"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 5) Deploy Tips

- Backend: Render/Railway/Fly.io (set `MONGODB_URI`, `FRONTEND_URL`)
- Frontend: Vercel/Netlify (set `VITE_API_URL` to deployed backend `/api` URL)

