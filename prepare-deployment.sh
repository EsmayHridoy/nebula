#!/bin/bash

# VirtualWorld Deployment Preparation Script
# This script helps you prepare your project for production deployment

set -e

echo "🚀 VirtualWorld Deployment Preparation"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Step 1: Generating secure JWT secret..."
JWT_SECRET=$(openssl rand -hex 64)
echo "✅ Generated JWT secret (save this securely!):"
echo "   $JWT_SECRET"
echo ""

echo "📋 Step 2: Creating .env.production files..."

# Create backend production env template
cat > backend/.env.production.template << EOF
# Railway will provide these automatically
DATABASE_URL=\${POSTGRES_URL}
DB_USERNAME=\${PGUSER}
DB_PASSWORD=\${PGPASSWORD}
DB_URL=jdbc:postgresql://\${PGHOST}:\${PGPORT}/\${PGDATABASE}

# Redis (Railway auto-provides)
REDIS_URL=\${REDIS_URL}

# JWT Secret (REPLACE THIS WITH YOUR GENERATED SECRET!)
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS (UPDATE with your Vercel URL after deployment)
CORS_ORIGINS=https://your-frontend.vercel.app

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
EOF

echo "✅ Created backend/.env.production.template"

# Create frontend production env template
cat > frontend/.env.production.template << EOF
# Update this with your Railway backend URL after deployment
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
EOF

echo "✅ Created frontend/.env.production.template"
echo ""

echo "📋 Step 3: Creating GitHub Actions workflow..."
mkdir -p .github/workflows
if [ ! -f ".github/workflows/deploy.yml" ]; then
    echo "⚠️  Please copy the deploy.yml file from the deployment guide"
else
    echo "✅ GitHub Actions workflow already exists"
fi
echo ""

echo "📋 Step 4: Adding health check endpoint..."
HEALTH_CONTROLLER="backend/src/main/java/com/virtualworld/controller/HealthController.java"
if [ ! -f "$HEALTH_CONTROLLER" ]; then
    echo "⚠️  Please copy HealthController.java to your backend/src/main/java/com/virtualworld/controller/ directory"
else
    echo "✅ HealthController already exists"
fi
echo ""

echo "📋 Step 5: Verifying project structure..."
REQUIRED_FILES=(
    "backend/pom.xml"
    "backend/Dockerfile"
    "frontend/package.json"
    "docker-compose.yml"
)

ALL_GOOD=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ALL_GOOD=false
    fi
done
echo ""

if [ "$ALL_GOOD" = true ]; then
    echo "✅ All required files present!"
else
    echo "❌ Some required files are missing. Please check your project structure."
fi
echo ""

echo "📋 Step 6: Deployment Checklist"
echo "================================"
echo ""
echo "To deploy your application, follow these steps:"
echo ""
echo "1. 🔐 Security Setup:"
echo "   - Save your JWT secret securely: $JWT_SECRET"
echo "   - Add it to Railway environment variables"
echo "   - Never commit it to Git!"
echo ""
echo "2. 🗄️  Railway (Backend + Database):"
echo "   - Go to railway.app and create a new project"
echo "   - Add PostgreSQL database"
echo "   - Add Redis"
echo "   - Deploy backend from GitHub"
echo "   - Copy the values from backend/.env.production.template to Railway variables"
echo "   - Update CORS_ORIGINS with your Vercel URL"
echo ""
echo "3. 🌐 Vercel (Frontend):"
echo "   - Go to vercel.com and import your GitHub repo"
echo "   - Set root directory to 'frontend'"
echo "   - Add environment variable: NEXT_PUBLIC_API_URL=https://your-backend.railway.app"
echo "   - Deploy"
echo ""
echo "4. ⚙️  GitHub Actions:"
echo "   - Get Railway API token from railway.app/account/tokens"
echo "   - Add it to GitHub repo secrets as RAILWAY_TOKEN"
echo "   - Copy .github/workflows/deploy.yml from deployment guide"
echo "   - Push to main branch to trigger deployment"
echo ""
echo "5. ✅ Verify Deployment:"
echo "   - Test backend health: curl https://your-backend.railway.app/api/health"
echo "   - Test frontend: visit https://your-frontend.vercel.app"
echo "   - Register a test user"
echo "   - Login and test all features"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Preparation complete! You're ready to deploy."
