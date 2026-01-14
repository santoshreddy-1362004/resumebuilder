# Docker & Deployment Guide

## Local Development with Docker

### Prerequisites
- Docker & Docker Compose installed
- MongoDB Atlas cluster (connection string ready)
- Codespaces with 4-core machine (recommended)

### Setup

1. **Create `.env` file in project root:**
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resumebuilder?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

2. **Build and run locally:**
```bash
docker-compose up -d
```

3. **Access services:**
- **Frontend:** http://localhost (port 80)
- **Backend:** http://localhost:4000 (port 4000)
- **Prometheus:** http://localhost:9090 (port 9090)
- **Grafana:** http://localhost:3000 (port 3000, admin/admin)

4. **View logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

5. **Stop:**
```bash
docker-compose down
```

---

## Deployment to Azure Container Apps

### Step 1: Create Azure Container Registry (ACR)

```bash
# Login to Azure
az login

# Create resource group
az group create --name resumebuilder-rg --location eastus

# Create ACR
az acr create --resource-group resumebuilder-rg \
  --name resumebuilderacr --sku Basic
```

### Step 2: Build & Push Images to ACR

```bash
# Login to ACR
az acr login --name resumebuilderacr

# Build backend
docker build -t resumebuilderacr.azurecr.io/resumebuilder-backend:v1 ./backend
docker push resumebuilderacr.azurecr.io/resumebuilder-backend:v1

# Build frontend
docker build -t resumebuilderacr.azurecr.io/resumebuilder-frontend:v1 ./frontend
docker push resumebuilderacr.azurecr.io/resumebuilder-frontend:v1
```

### Step 3: Create Container Apps Environment

```bash
az containerapp env create --name resumebuilder-env \
  --resource-group resumebuilder-rg \
  --location eastus
```

### Step 4: Deploy Backend Container App

```bash
az containerapp create --name resumebuilder-backend \
  --resource-group resumebuilder-rg \
  --environment resumebuilder-env \
  --image resumebuilderacr.azurecr.io/resumebuilder-backend:v1 \
  --target-port 4000 \
  --ingress internal \
  --env-vars \
    MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/resumebuilder" \
    JWT_SECRET="your-secret" \
    NODE_ENV="production"
```

### Step 5: Deploy Frontend Container App

```bash
az containerapp create --name resumebuilder-frontend \
  --resource-group resumebuilder-rg \
  --environment resumebuilder-env \
  --image resumebuilderacr.azurecr.io/resumebuilder-frontend:v1 \
  --target-port 80 \
  --ingress external \
  --env-vars VITE_API_URL="https://resumebuilder-backend.xxx.azurecontainerapps.io"
```

Replace `resumebuilder-backend.xxx.azurecontainerapps.io` with your actual backend URL.

---

## GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy to ACR

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to ACR
        run: |
          echo ${{ secrets.ACR_PASSWORD }} | docker login -u ${{ secrets.ACR_USERNAME }} --password-stdin resumebuilderacr.azurecr.io
      
      - name: Build & push backend
        run: |
          docker build -t resumebuilderacr.azurecr.io/resumebuilder-backend:${{ github.sha }} ./backend
          docker push resumebuilderacr.azurecr.io/resumebuilder-backend:${{ github.sha }}
      
      - name: Build & push frontend
        run: |
          docker build -t resumebuilderacr.azurecr.io/resumebuilder-frontend:${{ github.sha }} ./frontend
          docker push resumebuilderacr.azurecr.io/resumebuilder-frontend:${{ github.sha }}
```

Add secrets to GitHub: Settings → Secrets → ACR_USERNAME, ACR_PASSWORD

---

## File Structure

```
/workspaces/resumebuilder/
├── backend/
│   ├── Dockerfile          ← Backend container
│   ├── .dockerignore
│   └── ... (source)
├── frontend/
│   ├── Dockerfile          ← Frontend container (multi-stage)
│   ├── nginx.conf          ← Nginx SPA config
│   ├── .dockerignore
│   └── ... (source)
├── docker-compose.yml      ← Local dev orchestration
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   ├── provisioning/
│   └── dashboards/
└── .env                    ← Secrets (don't commit)
```

---

## Important Notes

- **Secrets:** Use Azure Key Vault in production, never commit `.env`.
- **Networking:** Backend and Frontend communicate via `backend` service name locally; in Azure, use internal ingress + backend URL.
- **Monitoring:** Use Azure Monitor in production; keep Prometheus/Grafana for local dev.
- **Scaling:** Container Apps auto-scales; adjust CPU/Memory in Azure portal.

---

## Troubleshooting

**Frontend can't reach backend:**
- Check Nginx config: `proxy_pass http://backend:4000`
- Locally: `docker-compose exec frontend curl http://backend:4000/metrics`
- Azure: Verify backend URL in frontend env vars.

**Images not pushing to ACR:**
- `az acr login` before building.
- Check ACR_PASSWORD in GitHub Secrets is valid.

**Backend can't reach MongoDB:**
- Verify MONGO_URI in `.env` or env vars.
- Test locally: `docker-compose exec backend curl mongodb+srv://...` (connection test).
