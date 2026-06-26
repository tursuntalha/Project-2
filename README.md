# E-Commerce Microservices Architecture Demo

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

A hands-on demonstration of microservices architecture for an e-commerce platform. Each service is independently deployable via Docker. Built for learning distributed systems design patterns.

---

## Architecture

```
                         ┌──────────────────┐
                         │   React Frontend  │
                         └────────┬─────────┘
                                  │ HTTP
                         ┌────────▼─────────┐
                         │   API Gateway    │  Rate limiting, routing,
                         │   (Express)      │  request validation
                         └──┬──┬──┬──┬──┬──┘
                            │  │  │  │  │
           ┌────────────────┘  │  │  │  └──────────────────┐
           │             ┌─────┘  └─────┐                  │
           ▼             ▼              ▼                   ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐
    │   Auth   │  │ Product  │  │  Order   │  │  Notification     │
    │ Service  │  │ Service  │  │ Service  │  │  Service (Email)  │
    └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┬─────────┘
         │              │              │                  │
    ┌────▼─────┐  ┌─────▼─────┐  ┌────▼─────┐           │
    │  MongoDB │  │  MongoDB  │  │  MongoDB │        ┌───▼────┐
    │  (users) │  │(products) │  │ (orders) │        │RabbitMQ│
    └──────────┘  └───────────┘  └──────────┘        └────────┘
                                       │
                                 ┌─────▼─────┐
                                 │   Redis   │
                                 │  (cache)  │
                                 └───────────┘
```

---

## Planned Services

| Service | Port | Responsibility |
|---------|------|---------------|
| API Gateway | 3000 | Route requests, rate limit, auth token validation |
| Auth Service | 3001 | Register, login, JWT issuance and refresh |
| Product Service | 3002 | Product catalog, search, inventory |
| Order Service | 3003 | Cart, checkout, order status |
| Notification Service | 3004 | Email notifications via nodemailer |
| Frontend (React) | 5173 | Customer-facing UI |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Frontend | React, Vite |
| Database | MongoDB (per-service) |
| Cache | Redis |
| Message Queue | RabbitMQ |
| Containerization | Docker, Docker Compose |
| Auth | JWT (access + refresh token pattern) |

---

## Roadmap

| Phase | Task | Status |
|-------|------|--------|
| Phase 1 | Docker Compose setup, service scaffolding | [ ] |
| Phase 2 | Auth Service (register, login, JWT refresh) | [ ] |
| Phase 3 | API Gateway (routing + rate limiting) | [ ] |
| Phase 4 | Product Service (CRUD + search) | [ ] |
| Phase 5 | Order Service (cart + checkout) | [ ] |
| Phase 6 | RabbitMQ event bus (order-created → notification) | [ ] |
| Phase 7 | Notification Service (order confirmation email) | [ ] |
| Phase 8 | Redis caching (product catalog) | [ ] |
| Phase 9 | React frontend (browse → cart → checkout) | [ ] |
| Phase 10 | Health checks + centralized logging | [ ] |

---

## Getting Started (planned)

```bash
git clone https://github.com/tursuntalha/Project-2.git
cd Project-2

# Start all services
docker compose up --build
```

Individual services will be reachable on their respective ports. See `docker-compose.yml` for the full service map.
