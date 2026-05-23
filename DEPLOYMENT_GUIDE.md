# 🚀 Production Deployment Guide

Complete guide to deploy VirtualWorld to production with CI/CD pipeline.

## Architecture Overview

```
GitHub Repository
    │
    ├─── Push to main branch
    │
    ├─── GitHub Actions CI/CD
    │    ├─── Backend: Build + Test + Deploy to Railway
    │    └─── Frontend: Build + Test → Auto-deploy via Vercel
    │
    ├─── Railway (Backend + Database)
    │    ├─── Spring Boot Backend (Docker)
    │    ├─── PostgreSQL (managed)
    │    └─── Redis (managed)
    │
    └─── Vercel (Frontend)
         └─── Next.js (static + serverless)
```

---

## 📋 Prerequisites

1. **GitHub account** (for source control + CI/CD)
2. **Railway account** (for backend + database)
3. **Vercel account** (for frontend)
4. **Domain** (optional, but recommended)

---

## Part 1: Backend Deployment on Railway

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Authorize Railway to access your `nebula` repository
6. Select the repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will create a managed PostgreSQL instance
3. Note the connection details (Railway provides these as environment variables)

### Step 3: Add Redis

1. Click **"New"** → **"Database"** → **"Redis"**
2. Railway will create a managed Redis instance

### Step 4: Configure Backend Service

1. Click **"New"** → **"GitHub Repo"** → Select your repo
2. Set **Root Directory** to `backend`
3. Click **"Variables"** tab and add:

```env
# Database (Railway auto-provides these, but verify)
DATABASE_URL=${POSTGRES_URL}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_URL=jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}

# Redis (Railway auto-provides)
REDIS_URL=${REDIS_URL}

# JWT (CRITICAL: Generate a new secret!)
JWT_SECRET=YOUR_SUPER_SECRET_KEY_HERE_MINIMUM_256_BITS
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS (update after deploying frontend)
CORS_ORIGINS=https://your-frontend.vercel.app

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
```

**⚠️ SECURITY: Generate a secure JWT secret:**
```bash
# On Mac/Linux
openssl rand -hex 64

# Or use online generator
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

4. Click **"Settings"** tab:
   - Set **Start Command**: `java -jar app.jar`
   - Set **Healthcheck Path**: `/api/health`
   - Set **Port**: `8080`

5. Click **"Deploy"**

Railway will:
- Build your Docker image
- Deploy the backend
- Provide a public URL (e.g., `https://virtualworld-backend.railway.app`)

### Step 5: Verify Backend Deployment

```bash
# Test health endpoint
curl https://your-backend-url.railway.app/api/health

# Should return:
# {"status":"UP","timestamp":"...","service":"virtualworld-backend"}
```

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your `nebula` repository
5. Vercel will auto-detect Next.js

### Step 2: Configure Build Settings

1. **Root Directory**: `frontend`
2. **Framework Preset**: Next.js
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

Replace `your-backend-url.railway.app` with your actual Railway backend URL.

### Step 4: Deploy

Click **"Deploy"**

Vercel will:
- Install dependencies
- Build the Next.js app
- Deploy to global CDN
- Provide a public URL (e.g., `https://nebula.vercel.app`)

### Step 5: Update Backend CORS

Go back to Railway → Backend service → Variables → Update:

```env
CORS_ORIGINS=https://your-frontend.vercel.app
```

Replace with your actual Vercel URL. Redeploy the backend.

---

## Part 3: GitHub Actions CI/CD Setup

### Step 1: Add Railway Token to GitHub Secrets

1. Get Railway token:
   - Go to Railway → Account Settings → Tokens
   - Create a new token
   - Copy it

2. Add to GitHub:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click **"New repository secret"**
   - Name: `RAILWAY_TOKEN`
   - Value: Paste the Railway token
   - Click **"Add secret"**

### Step 2: Add GitHub Actions Workflow

Copy the `.github/workflows/deploy.yml` file to your repository:

```bash
# In your local nebula repo
mkdir -p .github/workflows
# Copy the deploy.yml file from this guide
```

Commit and push:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Step 3: Verify CI/CD

Go to GitHub → Actions tab. You should see the workflow running.

On every push to `main`:
1. Tests run for backend and frontend
2. Backend deploys to Railway (if tests pass)
3. Frontend auto-deploys via Vercel GitHub integration

---

## Part 4: Custom Domain (Optional)

### For Frontend (Vercel)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `virtualworld.com`)
3. Follow Vercel's DNS configuration instructions
4. SSL is automatic

### For Backend (Railway)

1. Railway Dashboard → Backend Service → Settings → Domains
2. Click **"Generate Domain"** for a railway.app subdomain
3. Or add custom domain:
   - Add domain (e.g., `api.virtualworld.com`)
   - Update DNS CNAME record
   - Railway handles SSL automatically

**Update CORS after domain setup:**

Railway backend variables:
```env
CORS_ORIGINS=https://virtualworld.com,https://www.virtualworld.com
```

---

## Part 5: Database Migrations

Railway runs Flyway migrations automatically on deploy. To add new migrations:

1. Create migration file in `backend/src/main/resources/db/migration/`
2. Name it: `V2__Your_migration_name.sql`
3. Commit and push
4. Railway will apply migrations on next deploy

**Example migration:**

```sql
-- backend/src/main/resources/db/migration/V2__Add_avatar_customization.sql
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);
CREATE INDEX idx_users_avatar ON users(avatar_url);
```

---

## Part 6: Monitoring & Logs

### Railway Logs

1. Railway Dashboard → Backend Service → Deployments → Click latest
2. View real-time logs
3. Set up log alerts in Settings

### Vercel Logs

1. Vercel Dashboard → Your Project → Deployments → Click latest
2. View Function Logs for API routes
3. View Build Logs for build issues

### Health Monitoring

Set up uptime monitoring:
- [UptimeRobot](https://uptimerobot.com) (free)
- [Better Uptime](https://betteruptime.com) (free tier)

Monitor these endpoints:
- Backend: `https://your-backend.railway.app/api/health`
- Frontend: `https://your-frontend.vercel.app`

---

## Part 7: Environment-Specific Configs

### Local Development

```env
# backend/src/main/resources/application.properties
spring.profiles.active=dev
```

### Production

Railway auto-sets:
```env
SPRING_PROFILES_ACTIVE=prod
```

This uses `application-prod.properties` with production settings.

---

## 🔒 Security Checklist

- [ ] JWT secret is 256+ bits and unique (not the example one!)
- [ ] Database passwords are strong
- [ ] CORS is restricted to your frontend domain
- [ ] HTTPS is enabled (Railway + Vercel do this automatically)
- [ ] Secrets are in environment variables, not in code
- [ ] `.env` files are in `.gitignore`
- [ ] GitHub secrets are used for CI/CD tokens

---

## 📊 Cost Estimate

| Service | Plan | Cost |
|---------|------|------|
| Railway | Starter | $5/month (includes $5 credit) |
| Vercel | Hobby | Free (generous limits) |
| **Total** | | **~$5/month** |

Railway Starter includes:
- PostgreSQL (500MB storage)
- Redis (100MB)
- Backend hosting
- $5 usage credit

Vercel Hobby includes:
- Unlimited websites
- 100GB bandwidth
- Automatic HTTPS
- Global CDN

---

## 🚨 Troubleshooting

### Backend won't start

Check Railway logs for:
```
Error: Unable to access jarfile app.jar
```
**Fix**: Ensure `pom.xml` packaging is `jar`, not `war`

```
Connection refused to PostgreSQL
```
**Fix**: Use Railway's provided `DATABASE_URL` variable

### Frontend can't reach backend

```
CORS error in browser console
```
**Fix**: Update `CORS_ORIGINS` in Railway to match Vercel URL

### Database migrations fail

```
Flyway migration checksum mismatch
```
**Fix**: Don't edit old migration files. Create new ones for changes.

---

## 🎯 Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created on Railway
- [ ] Redis created on Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Health endpoints responding
- [ ] Can register a user
- [ ] Can login
- [ ] Can view dashboard
- [ ] GitHub Actions workflow running
- [ ] Custom domain configured (optional)

---

## 📚 Next Steps

After successful deployment:

1. **Test production thoroughly**
   - Register test accounts
   - Login/logout flows
   - Profile updates

2. **Set up monitoring**
   - Add UptimeRobot checks
   - Set up error tracking (Sentry free tier)

3. **Start Phase 2: Avatar Customization**
   - Build locally
   - Test with production backend
   - Deploy via CI/CD

---

## 🆘 Getting Help

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- GitHub Actions: [docs.github.com/actions](https://docs.github.com/en/actions)

**Discord Communities:**
- Railway: [discord.gg/railway](https://discord.gg/railway)
- Vercel: [vercel.com/discord](https://vercel.com/discord)
