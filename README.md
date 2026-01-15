# 📝 Resume Builder

A modern, full-stack web application for creating professional resumes with multiple templates and real-time preview. Built with React, Node.js, and MongoDB, featuring comprehensive monitoring with Prometheus and Grafana.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

## 🌟 Features

- **Multiple Resume Templates** - Choose from professionally designed templates
- **Real-time Preview** - See changes as you type
- **User Authentication** - Secure JWT-based authentication
- **Image Upload** - Add profile pictures to your resume
- **Template Customization** - Customize colors and themes
- **PDF Export** - Download your resume as PDF
- **Cloud Storage** - MongoDB Atlas for reliable data persistence
- **Production Monitoring** - Prometheus metrics and Grafana dashboards
- **Containerized Deployment** - Docker and Docker Compose support

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Nginx** - Production web server

### Backend
- **Node.js 20** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **prom-client** - Prometheus metrics

### DevOps & Monitoring
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy and static file serving

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **Docker** and **Docker Compose** (for containerized deployment)
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/santoshreddy-1362004/resumebuilder.git
cd resumebuilder
```

### 2. Environment Variables

Create `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resumebuilder
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
PORT=4000
```

**Note:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

### 3. Local Development (Without Docker)

#### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:4000`

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Docker Development (Recommended)

Start all services (backend, frontend, Prometheus, Grafana):

```bash
docker-compose up -d
```

**Services:**
- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:4000
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000 (admin/admin)

Stop all services:

```bash
docker-compose down
```

Rebuild after code changes:

```bash
docker-compose up -d --build
```

## 📊 Monitoring

### Prometheus Metrics

Access metrics at `http://localhost:4000/metrics`

**Available Metrics:**
- HTTP request rate and latency
- Active requests in progress
- CPU and memory usage
- MongoDB connection status
- Business metrics (users, resumes)

### Grafana Dashboards

1. Access Grafana at `http://localhost:3000`
2. Login with `admin/admin`
3. Pre-configured dashboard: **Resume Builder Overview**

**Dashboard Panels:**
- HTTP Request Rate
- Request Duration (p50, p95, p99)
- Resumes Created
- Active Resumes
- Total Users
- User Logins
- CPU Usage
- Memory Usage

## 🐳 Docker Hub

Pre-built images are available on Docker Hub:

```bash
# Pull backend image
docker pull 2004369/resumebuilder-backend:latest

# Pull frontend image
docker pull 2004369/resumebuilder-frontend:latest
```

## 🔄 CI/CD Pipeline

GitHub Actions automatically builds and pushes Docker images on every push to `main`:

**Workflow:** `.github/workflows/docker-build-push.yml`

**Required GitHub Secrets:**
- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub Personal Access Token

**Image Tags:**
- `latest` - Latest build from main branch
- `<commit-sha>` - Specific commit version (e.g., `abc123f`)

## 🌐 Deployment

### Option 1: Azure Container Apps (Production)

#### Prerequisites
- Azure account with active subscription
- Azure CLI installed

#### Step 1: Create Resource Group

```bash
az group create \
  --name resumebuilder-rg \
  --location eastus
```

#### Step 2: Create Container Registry (ACR)

```bash
az acr create \
  --resource-group resumebuilder-rg \
  --name resumebuilderacr \
  --sku Basic \
  --admin-enabled true
```

#### Step 3: Get ACR Credentials

```bash
az acr credential show --name resumebuilderacr
```

#### Step 4: Login to ACR

```bash
docker login resumebuilderacr.azurecr.io -u resumebuilderacr -p <password>
```

#### Step 5: Tag and Push Images

```bash
# Tag images
docker tag 2004369/resumebuilder-backend:latest resumebuilderacr.azurecr.io/resumebuilder-backend:latest
docker tag 2004369/resumebuilder-frontend:latest resumebuilderacr.azurecr.io/resumebuilder-frontend:latest

# Push to ACR
docker push resumebuilderacr.azurecr.io/resumebuilder-backend:latest
docker push resumebuilderacr.azurecr.io/resumebuilder-frontend:latest
```

#### Step 6: Create Container App Environment

```bash
az containerapp env create \
  --name resumebuilder-env \
  --resource-group resumebuilder-rg \
  --location eastus
```

#### Step 7: Deploy Backend Container App

```bash
az containerapp create \
  --name resumebuilder-backend \
  --resource-group resumebuilder-rg \
  --environment resumebuilder-env \
  --image resumebuilderacr.azurecr.io/resumebuilder-backend:latest \
  --registry-server resumebuilderacr.azurecr.io \
  --registry-username resumebuilderacr \
  --registry-password <ACR_PASSWORD> \
  --target-port 4000 \
  --ingress external \
  --env-vars \
    MONGO_URI=<your-mongodb-uri> \
    JWT_SECRET=<your-jwt-secret> \
    NODE_ENV=production \
    PORT=4000 \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3
```

#### Step 8: Deploy Frontend Container App

```bash
az containerapp create \
  --name resumebuilder-frontend \
  --resource-group resumebuilder-rg \
  --environment resumebuilder-env \
  --image resumebuilderacr.azurecr.io/resumebuilder-frontend:latest \
  --registry-server resumebuilderacr.azurecr.io \
  --registry-username resumebuilderacr \
  --registry-password <ACR_PASSWORD> \
  --target-port 80 \
  --ingress external \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 1 \
  --max-replicas 2
```

#### Step 9: Get Application URLs

```bash
# Backend URL
az containerapp show \
  --name resumebuilder-backend \
  --resource-group resumebuilder-rg \
  --query properties.configuration.ingress.fqdn

# Frontend URL
az containerapp show \
  --name resumebuilder-frontend \
  --resource-group resumebuilder-rg \
  --query properties.configuration.ingress.fqdn
```

#### Step 10: Update Frontend API Configuration

Update the backend URL in your frontend environment or rebuild with:

```bash
VITE_API_URL=https://<backend-fqdn> npm run build
```

### Option 2: Render (Free Tier)

#### Backend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** resumebuilder-backend
   - **Environment:** Docker
   - **Docker Image:** `2004369/resumebuilder-backend:latest`
   - **Port:** 4000
5. Add Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=4000`
6. Deploy

#### Frontend Deployment (Static Site)

1. Click **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name:** resumebuilder-frontend
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Add Environment Variable:
   - `VITE_API_URL=<render-backend-url>`
5. Deploy

### Option 3: Railway

1. Go to [Railway](https://railway.app/)
2. Click **New Project** → **Deploy from Docker Hub**
3. Enter image: `2004369/resumebuilder-backend:latest`
4. Add environment variables
5. Deploy

### Option 4: Vercel (Frontend Only)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

Add environment variable in Vercel dashboard:
- `VITE_API_URL=<your-backend-url>`

## 📁 Project Structure

```
resumebuilder/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── resumeController.js   # Resume CRUD operations
│   │   ├── userController.js     # User authentication
│   │   └── uploadImage.js        # Image upload handler
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── uploadMiddleware.js   # Multer configuration
│   ├── models/
│   │   ├── resumeModel.js        # Resume schema
│   │   └── userModel.js          # User schema
│   ├── routes/
│   │   ├── resumeRouter.js       # Resume routes
│   │   └── userRouter.js         # Auth routes
│   ├── uploads/                  # User uploaded images
│   ├── metrics.js                # Prometheus metrics
│   ├── server.js                 # Express app entry point
│   ├── Dockerfile                # Backend container image
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── context/              # React context (UserContext)
│   │   ├── pages/                # Page components
│   │   ├── utils/                # Helper functions & API config
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── nginx.conf                # Nginx configuration for production
│   ├── Dockerfile                # Frontend container image
│   ├── vite.config.js            # Vite configuration
│   └── package.json
├── prometheus/
│   └── prometheus.yml            # Prometheus scrape config
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/          # Auto-configure Prometheus
│   │   └── dashboards/           # Dashboard config
│   └── dashboards/
│       └── resumebuilder-overview.json  # Pre-built dashboard
├── .github/
│   └── workflows/
│       └── docker-build-push.yml # CI/CD pipeline
├── docker-compose.yml            # Multi-container orchestration
├── .env                          # Environment variables (not in git)
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/user/signup     # Register new user
POST   /api/user/login      # Login user
GET    /api/user/profile    # Get user profile (protected)
```

### Resumes

```
POST   /api/resume          # Create new resume (protected)
GET    /api/resume          # Get all user resumes (protected)
GET    /api/resume/:id      # Get single resume (protected)
PUT    /api/resume/:id      # Update resume (protected)
DELETE /api/resume/:id      # Delete resume (protected)
```

### Image Upload

```
POST   /api/upload          # Upload profile image (protected)
```

### Monitoring

```
GET    /metrics             # Prometheus metrics endpoint
```

## 🧪 Testing

### Manual Testing

1. Start the application (Docker or local)
2. Navigate to frontend URL
3. Test user registration and login
4. Create a new resume
5. Test template selection and customization
6. Verify image upload
7. Test PDF export

### Health Checks

```bash
# Backend health
curl http://localhost:4000/metrics

# Frontend health
curl http://localhost:80

# Prometheus targets
curl http://localhost:9090/api/v1/targets
```

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Environment Variables** - Secrets stored securely
- **CORS Configuration** - Restricted origins
- **Password Hashing** - Bcrypt for user passwords
- **Input Validation** - Mongoose schema validation
- **.gitignore** - Prevents committing sensitive files

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `ENOTFOUND` or connection timeout

**Solution:**
- Verify `MONGO_URI` in `.env` file
- Check MongoDB Atlas whitelist (allow all IPs: `0.0.0.0/0`)
- Ensure network connectivity

### CORS Errors

**Error:** `Access-Control-Allow-Origin` error

**Solution:**
- In production, frontend uses Nginx proxy (same origin)
- In development, ensure `BASE_URL` in `apiPath.js` points to correct backend
- Update CORS origins in `backend/server.js` if needed

### Docker Build Fails

**Error:** `failed to read dockerfile`

**Solution:**
- Ensure Dockerfiles are not in `.gitignore`
- Commit Dockerfiles to git
- Run `git add backend/Dockerfile frontend/Dockerfile`

### Grafana Dashboard Empty

**Solution:**
- Wait 10-15 seconds for Prometheus to scrape metrics
- Verify backend is running: `curl http://localhost:4000/metrics`
- Check Prometheus targets: http://localhost:9090/targets
- Ensure time range in Grafana is set to "Last 5 minutes"

## 📈 Performance

- **Frontend:** Vite for fast HMR and optimized builds
- **Backend:** Node.js clustering (can be enabled for multi-core)
- **Database:** MongoDB indexes on user and resume queries
- **Caching:** Nginx static file caching with 1-year max-age
- **Image Optimization:** Serve compressed images via Nginx gzip

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Santosh Reddy**
- GitHub: [@santoshreddy-1362004](https://github.com/santoshreddy-1362004)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the minimal web framework
- MongoDB team for the flexible database
- Prometheus and Grafana for monitoring solutions
- Docker for containerization platform
- Vite for lightning-fast build tool

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**⭐ If you find this project helpful, please give it a star!**
