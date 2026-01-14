# Docker Compose for Prometheus & Grafana (GitHub Codespaces)

## ⚡ Quick Start (Codespaces)

### Step 1: Ensure Backend is Running
```bash
cd /workspaces/resumebuilder/backend
npm start
# Backend runs at http://localhost:4000
# Metrics available at http://localhost:4000/metrics
```

### Step 2: Start Monitoring Stack
```bash
cd /workspaces/resumebuilder
docker-compose up -d
```

### Step 3: Access Services via Codespaces Port Forwarding

**Open the PORTS tab** in VS Code (bottom panel):

1. **Prometheus** - Port 9090
   - Click the forwarded URL or open in browser
   - Targets page: check if backend is "UP"

2. **Grafana** - Port 3000
   - Click the forwarded URL or open in browser
   - Login: `admin` / `admin`
   - Dashboard auto-loads with metrics

3. **Backend Metrics** - Port 4000
   - Already exposed and scraping

---

## 🐳 What Docker Compose Does

```
docker-compose up -d
     ↓
Creates 2 containers on Codespaces:
├── Prometheus (port 9090) - collects metrics
└── Grafana (port 3000) - visualizes data
     ↓
Reads config files from:
├── prometheus/prometheus.yml
└── grafana/provisioning/
     ↓
Connects to backend running on host:4000
  (via host.docker.internal in containers)
```

---

## 📁 File Structure (Already Created)

```
/workspaces/resumebuilder/
├── docker-compose.yml                 # Main file - run this!
├── prometheus/
│   └── prometheus.yml                 # Prometheus config (scrapes backend)
└── grafana/
    ├── provisioning/
    │   ├── datasources/
    │   │   └── prometheus.yml         # Tells Grafana where Prometheus is
    │   └── dashboards/
    │       └── dashboard.yml          # Dashboard provisioning
    └── dashboards/
        └── resumebuilder-overview.json # Pre-built dashboard
```

---

## 🎯 How It Works (Codespaces)

### Backend (Your Machine)
```
npm start → Port 4000 → /metrics endpoint
```

### Docker Containers
```
Prometheus Container:
  - Connects to host.docker.internal:4000 ✅
  - Scrapes /metrics every 10 seconds ✅
  - Stores data in volumes ✅

Grafana Container:
  - Connects to Prometheus ✅
  - Loads dashboard automatically ✅
  - Exposes port 3000 ✅
```

### Codespaces Port Forwarding
```
Container Port → Codespaces Forwarded URL
9090 → https://[your-codespace]-9090.app.github.dev
3000 → https://[your-codespace]-3000.app.github.dev
4000 → https://[your-codespace]-4000.app.github.dev
```

---

## 🔧 Useful Commands

```bash
# Start monitoring stack
docker-compose up -d

# View logs (all services)
docker-compose logs -f

# View specific service
docker-compose logs -f prometheus
docker-compose logs -f grafana

# Stop monitoring (data persists)
docker-compose stop

# Start again (data still there)
docker-compose start

# Stop and remove everything
docker-compose down

# Stop and remove all data (clean slate)
docker-compose down -v

# Check status
docker-compose ps
```

---

## ✅ Verify It's Working

### 1. Check Prometheus Targets
- Open Prometheus: Port 9090
- Go to **Status → Targets**
- Look for `resumebuilder-backend` job
- State should be **"UP"** (green)

### 2. Check Grafana Dashboard
- Open Grafana: Port 3000
- Should auto-load "Resume Builder - Overview" dashboard
- See metrics graphs populate

### 3. Test Metrics Endpoint
```bash
curl http://localhost:4000/metrics
```
You should see Prometheus format output

---

## 🚨 Troubleshooting (Codespaces)

### "Backend is DOWN in Prometheus"
```
✓ Backend running on port 4000?
✓ In docker-compose.yml: "host.docker.internal:4000" ✅
✓ Test: curl http://localhost:4000/metrics
```

### "Can't reach Prometheus/Grafana"
```
✓ Check PORTS tab - is port forwarding active?
✓ docker-compose ps (shows all containers)
✓ docker-compose logs (check for errors)
```

### "Grafana shows no data"
```
✓ Wait 30 seconds (first scrape)
✓ Check Prometheus scraped data (go to port 9090)
✓ docker-compose restart grafana
```

---

## 📊 Pre-configured Dashboard

Your dashboard shows:
- HTTP requests per second
- Request duration (95th percentile)
- Resumes created
- Active resumes
- Total users
- User logins
- CPU usage
- Memory usage

Add more metrics by editing: [grafana/dashboards/resumebuilder-overview.json](grafana/dashboards/resumebuilder-overview.json)

---

## 🎓 Key Codespaces Difference

**Normal Machine:**
```
Prometheus → localhost:4000/metrics
```

**Codespaces (Docker):**
```
Prometheus Container → host.docker.internal:4000/metrics
```

We already configured this for you! ✅

---

## 🚀 Ready?

```bash
docker-compose up -d
```

Then check the **PORTS** tab in VS Code! 🎉

