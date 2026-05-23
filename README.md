# VirtualWorld — Phase 1: Auth & User Management

A virtual social world built with Spring Boot + Next.js (JavaScript).

## Stack

| Layer | Tech |
|---|---|
| Backend | Java 21, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (access + refresh tokens), BCrypt |
| Database | PostgreSQL |
| Frontend | Next.js 14 (App Router, JavaScript), Zustand, Axios |
| Styling | CSS Variables + scoped JSX styles |
| Infra | Docker Compose (Postgres + Redis) |

---

## Project Structure

```
virtualworld/
├── backend/                    # Spring Boot
│   └── src/main/java/com/virtualworld/
│       ├── config/             # SecurityConfig, GlobalExceptionHandler
│       ├── controller/         # AuthController, UserController
│       ├── dto/                # Request/Response DTOs
│       ├── entity/             # User, RefreshToken
│       ├── repository/         # JPA repositories
│       ├── security/           # JwtService, JwtAuthFilter
│       └── service/            # AuthService, UserService
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── dashboard/          # Protected dashboard
│   │   └── profile/            # Protected profile page
│   ├── components/auth/        # AuthGuard (route protection)
│   ├── lib/api.js              # Axios client + auth interceptors
│   └── store/authStore.js      # Zustand global state
└── docker-compose.yml          # Postgres + Redis
```

---

## Quick Start

### 1. Start the database

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432` (db: `virtualworld`, user: `postgres`, pass: `password`)
- Redis on port `6379`

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on **http://localhost:8080**

Spring JPA auto-creates the `users` and `refresh_tokens` tables on first run.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## API Reference

### Auth Endpoints (public)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{username, email, password, displayName?}` | Register new user |
| POST | `/api/auth/login` | `{usernameOrEmail, password}` | Login |
| POST | `/api/auth/refresh` | `{refreshToken}` | Rotate tokens |
| POST | `/api/auth/logout` | — | Invalidate refresh token |
| GET | `/api/auth/me` | — | Current user (requires auth) |

### User Endpoints (protected — requires Bearer token)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/users/me` | — | Get my profile |
| PATCH | `/api/users/me` | `{displayName?, bio?, avatarConfig?}` | Update profile |
| GET | `/api/users/{id}` | — | Get public profile by ID |

### Example: Register + Login

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"alice","password":"password123"}'

# Use the returned accessToken
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <accessToken>"
```

---

## Auth Flow

```
1. User registers/logs in
   → server returns { accessToken (24h), refreshToken (7d), user }

2. Frontend stores tokens in cookies (js-cookie)
   → Axios interceptor attaches Bearer token to every request

3. On 401 response (token expired)
   → Interceptor auto-calls /api/auth/refresh with refreshToken
   → Gets new tokens, retries original request
   → User never notices

4. On logout
   → Server deletes refresh token from DB
   → Cookies cleared locally
```

---

## Frontend Pages

| Route | Auth required | Description |
|---|---|---|
| `/` | No | Redirect to `/dashboard` or `/login` |
| `/login` | No | Login form |
| `/register` | No | Registration form |
| `/dashboard` | **Yes** | Room list (Phase 3: live rooms) |
| `/profile` | **Yes** | View & edit profile |

`AuthGuard` wraps protected pages — redirects to `/login` if not authenticated.

---

## Environment Variables

### Backend (`src/main/resources/application.properties`)
```properties
DB_URL=jdbc:postgresql://localhost:5432/virtualworld
DB_USERNAME=postgres
DB_PASSWORD=password
JWT_SECRET=<64-char hex string>
JWT_EXPIRATION=86400000          # 24 hours in ms
JWT_REFRESH_EXPIRATION=604800000 # 7 days in ms
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Next Phases

- **Phase 2**: Avatar customization (SVG composer, JSONB storage)
- **Phase 3**: Phaser 3 virtual rooms with WebSocket presence sync
- **Phase 4**: Real-time chat (room + DMs, STOMP over WebSocket)
- **Phase 5**: Friends & groups with private rooms
- **Phase 6**: Deployment (Railway + Vercel)
