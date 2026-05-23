# 🚀 Setup Instructions

## Step 1: Download These Files

Download all the files from this folder and save them somewhere on your computer.

## Step 2: Copy to Your Repository

Open a terminal in your `nebula` repository and run:

```bash
# Make sure you're in the nebula directory
cd ~/Documents/nebula

# Copy GitHub Actions workflow
mkdir -p .github/workflows
cp /path/to/downloaded/.github/workflows/deploy.yml .github/workflows/

# Copy backend files
cp /path/to/downloaded/backend/railway.json backend/
cp /path/to/downloaded/backend/Dockerfile backend/
cp /path/to/downloaded/backend/HealthController.java \
   backend/src/main/java/com/virtualworld/controller/

# Copy frontend files
cp /path/to/downloaded/frontend/vercel.json frontend/

# Copy setup script and docs
cp /path/to/downloaded/prepare-deployment.sh .
cp /path/to/downloaded/*.md .
```

Replace `/path/to/downloaded/` with where you actually saved the files!

## Step 3: Run the Preparation Script

```bash
chmod +x prepare-deployment.sh
./prepare-deployment.sh
```

This will generate:
- Secure JWT secret
- Environment variable templates
- Deployment checklist

## Step 4: Follow the Deployment Guide

Open `DEPLOYMENT_GUIDE.md` and follow the instructions.

---

## Or Use This Direct Approach

Instead of downloading, you can create the files directly:

### 1. Create GitHub Actions Workflow

```bash
cd ~/Documents/nebula
mkdir -p .github/workflows
```

Then copy the content from `deploy.yml` file into `.github/workflows/deploy.yml`

### 2. Create Backend Files

Copy content from:
- `railway.json` → `backend/railway.json`
- `Dockerfile` → `backend/Dockerfile`
- `HealthController.java` → `backend/src/main/java/com/virtualworld/controller/HealthController.java`

### 3. Create Frontend Files

Copy content from:
- `vercel.json` → `frontend/vercel.json`

### 4. Generate JWT Secret

```bash
openssl rand -hex 64
```

Save this securely - you'll need it for Railway!

---

## Files You Need

```
nebula/
├── .github/workflows/
│   └── deploy.yml              ← Copy this
├── backend/
│   ├── railway.json            ← Copy this
│   ├── Dockerfile              ← Copy this (replaces existing)
│   └── src/main/java/com/virtualworld/controller/
│       └── HealthController.java  ← Copy this
├── frontend/
│   └── vercel.json             ← Copy this
├── DEPLOYMENT_GUIDE.md         ← Read this!
├── QUICK_REFERENCE.md          ← Reference guide
└── prepare-deployment.sh       ← Run this first
```

## Quick Deploy Steps

After copying files:

1. **Generate JWT Secret**
   ```bash
   openssl rand -hex 64
   ```
   
2. **Deploy to Railway**
   - Go to railway.app
   - Create project from GitHub
   - Add PostgreSQL & Redis
   - Set environment variables
   
3. **Deploy to Vercel**
   - Go to vercel.com
   - Import GitHub repo
   - Set root to `frontend/`
   - Add `NEXT_PUBLIC_API_URL`
   
4. **Setup CI/CD**
   - Get Railway token
   - Add to GitHub secrets
   - Push to trigger deploy

**See DEPLOYMENT_GUIDE.md for detailed steps!**
