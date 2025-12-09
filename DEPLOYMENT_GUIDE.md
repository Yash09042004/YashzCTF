# YashzCTF Backend Deployment Guide

## Overview
The YashzCTF backend is a Go-based REST API that manages user progress, flag submissions, and leaderboard management. It uses MongoDB Atlas for data storage and is designed to deploy on Render.

---

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account with the repository pushed to `https://github.com/Yash09042004/YashzCTF`
- ✅ MongoDB Atlas account with a cluster and connection string
- ✅ Render account (free tier available at https://render.com)
- ✅ Go 1.20+ (for local testing)

---

## Step 1: Prepare Your Repository

### 1.1 Verify Repository Structure
Ensure your GitHub repository contains:
```
YashzCTF/
├── main.go              # Go backend code
├── go.mod               # Go module definition
├── .gitignore           # Git ignore file
└── README.md            # Project documentation
```

### 1.2 Commit and Push Code
```bash
cd /home/yash/Desktop/CTF

# Pull latest remote changes (safe rebase)
git fetch origin
git pull --rebase origin main

# Add all files
git add .

# Commit
git commit -m "Deploy: Go backend with MongoDB Atlas integration"

# Push to GitHub
git push -u origin main
```

If rebase conflicts occur:
```bash
git status  # View conflicts
# Edit conflicted files manually
git add <resolved-files>
git rebase --continue
git push -u origin main
```

### 1.3 Verify GitHub
- Go to https://github.com/Yash09042004/YashzCTF
- Confirm `main.go`, `go.mod`, and `.gitignore` are visible

---

## Step 2: Set Up on Render

### 2.1 Create a New Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**

### 2.2 Connect GitHub Repository
1. Click **"Connect GitHub"**
2. Authorize Render to access your GitHub account
3. Select repository: **`YashzCTF`**
4. Branch: **`main`**
5. Click **"Connect"**

### 2.3 Configure Service Settings

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `ctf-backend` (or any name you prefer) |
| **Root Directory** | Leave empty (root of repo) |
| **Environment** | **Go** |
| **Build Command** | `go build -o ctf-backend .` |
| **Start Command** | `./ctf-backend` |
| **Instance Type** | **Starter** (free tier) |

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables (do **NOT** commit them to git):

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `10000` | Server listening port |
| `MONGODB_URI` | Your Atlas connection string |

**⚠️ IMPORTANT**: Set `MONGODB_URI` in Render Secrets/Environment, NOT in code.

### 2.5 Health Check Configuration

1. Click **"Advanced"** → **"Health Check"**
2. **Health Check Path**: `/api/test`
3. **Check Interval**: `30s` (default)
4. Save configuration

### 2.6 Deploy

Click **"Create Web Service"**

Render will:
- Clone your repository
- Build the Go binary: `go build -o ctf-backend .`
- Start the server: `./ctf-backend`
- Monitor health via `/api/test`

---

## Step 3: Verify Deployment

### 3.1 Monitor Build and Deployment Logs

1. On the Render dashboard, click on your service **`ctf-backend`**
2. Go to the **"Logs"** tab
3. Wait for build to complete (2-5 minutes)
4. Confirm you see:
   ```
   listening on :10000
   Connected to MongoDB
   ```

### 3.2 Test Endpoints

Once deployed, your backend will be available at:
```
https://<your-service-name>.onrender.com
```

Example service name: `ctf-backend-a1b2c3d4.onrender.com`

**Test the health endpoint:**
```bash
curl https://ctf-backend-a1b2c3d4.onrender.com/api/test
# Expected: "CTF API is up and running!"
```

### 3.3 Full Integration Test

**Test all API endpoints:**
```bash
# 1. Get level for new user
curl "https://ctf-backend-a1b2c3d4.onrender.com/getLevel?userId=testuser"
# Expected: {"level":1}

# 2. Submit correct flag
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"userId":"testuser","flag":"flag{welcome_to_the_game}"}' \
  https://ctf-backend-a1b2c3d4.onrender.com/checkFlag
# Expected: {"correct":true,"newLevel":2}

# 3. Get leaderboard
curl https://ctf-backend-a1b2c3d4.onrender.com/api/leaderboard
# Expected: Array of users sorted by score

# 4. Get challenges
curl https://ctf-backend-a1b2c3d4.onrender.com/api/challenges
# Expected: Array of challenges with level and points
```

---

## Step 4: Update Your Client (play.py)

Update the `play.py` script to point to your deployed backend:

```python
# In play.py, change:
BACKEND_URL = "https://ctf-backend-a1b2c3d4.onrender.com"  # Your Render URL
```

Then test locally:
```bash
python3 play.py
```

---

## API Endpoints Reference

All endpoints are available at `https://<your-service-name>.onrender.com`

| Method | Endpoint | Description | Params/Body |
|--------|----------|-------------|-------------|
| `GET` | `/api/test` | Health check | - |
| `GET` | `/getLevel` | Get current level for user | `userId=<username>` |
| `POST` | `/checkFlag` | Submit flag | `{"userId":"<user>","flag":"<flag>"}` |
| `POST` | `/resetUser` | Reset user progress | `{"userId":"<user>"}` |
| `POST` | `/deleteUser` | Delete user | `{"userId":"<user>"}` |
| `GET` | `/api/leaderboard` | Get top 100 users | - |
| `GET` | `/api/challenges` | Get all challenges | - |

---

## Troubleshooting

### Build Fails
- Check logs: Render Dashboard → Logs tab
- Common issues:
  - Go version: Render uses Go 1.20+
  - Missing `go.mod`: Ensure it's in repo root
  - **Solution**: Verify `go.mod` is committed to GitHub

### MongoDB Connection Error
- Error: `failed to connect to mongo: ...`
- **Solution**:
  1. Verify `MONGODB_URI` is set correctly in Render Environment Variables
  2. Check MongoDB Atlas Network Access: Allow `0.0.0.0/0` (all IPs)
  3. Ensure connection string includes `/ctf_db?retryWrites=true&w=majority`

### Service Won't Start
- Error: `MONGODB_URI must be set in the environment`
- **Solution**: Verify environment variable is set in Render dashboard
  - Go to Service Settings → Environment Variables
  - Check `MONGODB_URI` and `PORT` are present

### Endpoint Returns 404
- **Solution**: Ensure you're calling the correct endpoint
  - Test: `curl https://<service-url>/api/test`
  - Should return: `"CTF API is up and running!"`

### Deploy Again After Code Changes
1. Push code to GitHub `main` branch
2. Render auto-deploys OR manually trigger:
   - Render Dashboard → Service → "Deploy" button
   - Check logs for build progress

---

## Optional: Custom Domain

To use a custom domain instead of `onrender.com`:

1. Render Dashboard → Service → Settings → Custom Domain
2. Add your domain (e.g., `api.ctf.com`)
3. Follow DNS instructions to point to Render
4. Update `play.py` to use custom domain

---

## Monitoring and Logs

### View Logs
- Render Dashboard → Service → Logs tab
- Filter by keyword: `error`, `listening`, `MongoDB`
- Export logs for debugging

### Database Monitoring
- Go to MongoDB Atlas → Cluster → Monitoring
- View connection stats, throughput, latency
- Check Network Access logs for failed connections

---

## Support & Debugging

If deployment fails:

1. **Check Render Logs** for exact error message
2. **Verify Environment Variables**:
   ```bash
   # In Render logs, you should see:
   # "listening on :10000"
   # "Connected to MongoDB"
   ```
3. **Test MongoDB Atlas connection** locally:
   ```bash
   export MONGODB_URI='mongodb+srv://yashkiran:Thor@cluster0.zkumq4a.mongodb.net/ctf_db?retryWrites=true&w=majority'
   export PORT=10000
   go run main.go
   ```
4. **Contact Render Support** if issues persist: https://render.com/support

---

## Deployment Checklist

- [ ] Code pushed to GitHub `main` branch
- [ ] `main.go`, `go.mod`, `.gitignore` present
- [ ] Render Web Service created
- [ ] Build Command: `go build -o ctf-backend .`
- [ ] Start Command: `./ctf-backend`
- [ ] Environment Variables set:
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=<your-atlas-string>`
- [ ] Health Check Path: `/api/test`
- [ ] Build completed successfully
- [ ] `/api/test` endpoint returns success
- [ ] All API endpoints tested
- [ ] `play.py` updated with Render URL

---

**Deployment Status**: Ready to deploy! 🚀

For questions, refer to:
- [Render Go Deployment Docs](https://render.com/docs/deploy-go)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
