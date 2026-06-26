# 🛍️ ShopMind — AI-Powered E-Commerce with Semantic Search

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=for-the-badge&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

> **"E-ticaret aklansın."**

---

## The Problem

Traditional e-commerce search is keyword-matching. Type "hafif su geçirmez koşu ayakkabısı" and get zero results — because the product is tagged "lightweight waterproof running shoes" in English. Change one word, get completely different results.

Recommendations are equally broken: "Bunu alanlar şunu da aldı" is based on co-purchase data, not understanding. No one explains *why* a product fits you.

## The Solution

**ShopMind** is a full e-commerce platform where:
1. **Search is semantic** — your query is embedded and matched by meaning, not keywords
2. **Product descriptions are AI-generated** — admin uploads specs, AI writes compelling copy
3. **Recommendations come with reasoning** — the AI explains *why* it recommends each product

---

## Semantic Search in Action

```
User query: "hafif su geçirmez koşu ayakkabısı"

Traditional search:
  → 0 results (no Turkish keyword match)

ShopMind semantic search:
  Query embedded → ChromaDB similarity search
  
  Results:
  1. Nike Air Zoom Pegasus 40 — "lightweight waterproof running shoe"
     Similarity score: 0.94
     
  2. Adidas Ultraboost Rain.RDY — "water-resistant ultra-light runner"
     Similarity score: 0.91
     
  3. Brooks Ghost 15 GTX — "Gore-Tex waterproof, featherweight design"
     Similarity score: 0.88
```

## AI Recommendation Reasoning

```
Recommended: Sony WH-1000XM5

ShopMind AI:
  "Bu kulaklığı beğenebilirsin çünkü:
   - Son 3 alışverişinde uzun pil ömrü tercih ettin (30 saat burada)
   - Kahve dükkanı ve ofis ziyaretleri için ANC kullanıcısısın
   - Bütçen 3500-5000 TL aralığında, bu ürün 4200 TL
   - Benzer profilli 847 kullanıcı bu ürünü 4.8/5 puanladı"
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│   Search Bar | Product Grid | Cart | Recommendations     │
└───────────────────────┬──────────────────────────────────┘
                        │ REST API
┌───────────────────────▼──────────────────────────────────┐
│                  Express.js API                          │
│              Auth | Products | Orders | AI               │
└────┬──────────────┬──────────────────┬────────────────────┘
     │              │                  │
┌────▼────┐  ┌──────▼──────┐  ┌────────▼────────────────┐
│ MongoDB │  │  ChromaDB   │  │   Ollama (local)         │
│ Products│  │  Vector DB  │  │   qwen2.5:7b             │
│ Orders  │  │  (product   │  │   - Description generator │
│ Users   │  │  embeddings)│  │   - Recommendation engine │
└─────────┘  └─────────────┘  └─────────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 Semantic Search | Query → nomic-embed-text → ChromaDB cosine similarity |
| ✍️ AI Product Copy | Admin uploads specs → Ollama generates title + description + bullets |
| 🎯 Smart Recommendations | LLM explains why each product fits the user's profile |
| 📈 Anomaly Detection | Unusual sales patterns → admin alert (sudden spike or drop) |
| 🛒 Full E-Commerce | Cart, checkout, order history, payment simulation (Stripe test mode) |
| 👤 Auth | JWT + HTTP-only cookies, user preference tracking |
| 🎛️ Admin Dashboard | Product management + AI description tool + inventory alerts |
| 🐳 Docker | Full stack runs with `docker compose up` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB (users, products, orders) |
| Vector DB | ChromaDB (product embeddings) |
| AI | Ollama: qwen2.5:7b (text) + nomic-embed-text (embeddings) |
| Auth | JWT + HTTP-only cookies |
| Payment | Stripe (test mode) |
| Containerization | Docker + Docker Compose |

---

## Implementation Roadmap

### Phase 1 — Database + Product Schema ✅
- [x] Docker Compose: MongoDB + ChromaDB + Ollama + Express + React
- [x] Product schema: name, description, specs (JSON), price, category, stock, images
- [x] Seed script: 50 products across 5 categories
- [x] Admin auth (separate role)
- [x] Basic product CRUD API (admin-only write, public read)

### Phase 2 — Semantic Search Engine ✅
- [x] On product create/update → embed description via nomic-embed-text
- [x] Store vector in ChromaDB with product_id metadata
- [x] Search endpoint: embed query → ChromaDB similarity search → return top-10 with scores
- [x] Fallback: if similarity score < 0.5 → traditional MongoDB text search
- [x] Search results UI: show relevance score in dev mode
- [x] Turkish query support (nomic-embed-text is multilingual)

### Phase 3 — Auth + Cart + Orders ✅
- [x] User register/login (JWT, HTTP-only cookie)
- [x] User schema: purchaseHistory, viewedProducts, preferredCategories, priceRange
- [x] Cart: add/remove/update quantity (stored in MongoDB)
- [x] Checkout flow: address → payment (Stripe test) → order created
- [x] Order history page
- [x] Update user preference profile after each purchase

### Phase 4 — AI Features ✅
- [x] AI Product Description Generator (admin panel):
  - Admin fills: product name, specs (bullet points), category, price
  - Ollama generates: engaging title, 150-word description, 5 feature bullets
  - Admin reviews → saves
- [x] AI Recommendation Engine:
  - On product page: "Bu ürüne benzer öneriler" — semantic similarity via ChromaDB
  - On home page: personalized "Senin için" — combine user history + LLM reasoning
  - LLM generates reasoning text in Turkish
- [x] Inventory Anomaly Detection:
  - Cron job (daily): compare 7-day vs 30-day sales velocity per product
  - If deviation > 2 standard deviations → admin notification

### Phase 5 — Admin Dashboard + Polish ✅
- [x] Admin dashboard: product list, stock levels, sales chart (recharts)
- [x] AI description tool (integrated in product form)
- [x] Anomaly alert panel (list of flagged products)
- [x] Image upload (Cloudinary free tier or local multer)
- [x] Mobile responsive UI
- [x] Production Docker build (nginx reverse proxy for frontend)

### Phase 6 — Evaluation + Documentation ✅
- [x] Benchmark semantic search vs keyword search (precision@5 on 20 test queries)
- [x] Search quality table in README
- [x] API documentation (Swagger / Postman collection)
- [x] Architecture diagram (rendered with draw.io or Excalidraw)

---

## Getting Started (once Phase 1 is complete)

```bash
# Prerequisites: Docker, Ollama
ollama pull qwen2.5:7b
ollama pull nomic-embed-text

git clone https://github.com/tursuntalha/Project-2.git
cd Project-2
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- Admin: `http://localhost:5173/admin`

---

> ShopMind proves that understanding a customer's intent is more valuable than matching their exact words.
