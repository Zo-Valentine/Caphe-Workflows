# 🚂 Railway Deployment Guide for Caphè Workflows

Complete guide to deploying the Caphè Workflows API on Railway.app

## Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- This repository

## Method 1: Deploy from GitHub (Recommended)

### Step 1: Push to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit: Caphè Workflows API"
git remote add origin https://github.com/Zo-Valentine/Caphe-Workflows.git
git push -u origin master
```

### Step 2: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Zo-Valentine/Caphe-Workflows`
5. Railway will automatically detect the configuration

### Step 3: Configure Environment Variables

In the Railway dashboard:

1. Click on your service
2. Go to **"Variables"** tab
3. Add these variables:

```env
# Required for production
HOST=0.0.0.0

# Optional but recommended
JWT_SECRET_KEY=your-secure-random-secret-key-here
ADMIN_TOKEN=your-secure-admin-token-here
ADMIN_PASSWORD=your-secure-admin-password

# Optional: CORS configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-domain.com

# Optional: Rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

**Note**: Railway automatically provides the `PORT` variable. Don't set it manually.

### Step 4: Deploy

1. Railway will automatically build and deploy
2. Wait for the build to complete (2-5 minutes)
3. Your app will be available at: `https://your-app.up.railway.app`

### Step 5: Verify Deployment

Visit these endpoints to verify:

- **Health Check**: `https://your-app.up.railway.app/health`
- **API Docs**: `https://your-app.up.railway.app/docs`
- **Statistics**: `https://your-app.up.railway.app/api/stats`
- **Workflows**: `https://your-app.up.railway.app/api/workflows`

## Method 2: Deploy with Railway CLI

### Install Railway CLI

```bash
# macOS
brew install railway

# npm
npm install -g @railway/cli

# Or download from: https://docs.railway.app/develop/cli
```

### Deploy

```bash
# Login to Railway
railway login

# Link to project (or create new)
railway link

# Deploy
railway up

# Open in browser
railway open
```

## Configuration Files Explained

### railway.json

Primary Railway configuration:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install --no-cache-dir -r requirements.txt"
  },
  "deploy": {
    "startCommand": "python run.py --port $PORT --host 0.0.0.0",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### railway.toml

Alternative TOML format configuration.

### Procfile

Process configuration for Railway:

```
web: python run.py --port $PORT --host 0.0.0.0
```

### nixpacks.toml

Build configuration for Nixpacks builder.

## Environment Variables Reference

### Essential Variables

| Variable | Purpose                           | Example   |
| -------- | --------------------------------- | --------- |
| `PORT`   | Server port (auto-set by Railway) | `8000`    |
| `HOST`   | Bind address                      | `0.0.0.0` |

### Security Variables (Recommended)

| Variable         | Purpose           | Generation             |
| ---------------- | ----------------- | ---------------------- |
| `JWT_SECRET_KEY` | JWT token signing | `openssl rand -hex 32` |
| `ADMIN_TOKEN`    | API admin access  | `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | Admin password    | Strong random password |

### Optional Variables

| Variable              | Purpose             | Default                 |
| --------------------- | ------------------- | ----------------------- |
| `ALLOWED_ORIGINS`     | CORS origins        | None                    |
| `RATE_LIMIT_REQUESTS` | Requests per window | `60`                    |
| `RATE_LIMIT_WINDOW`   | Window in seconds   | `60`                    |
| `WORKFLOW_DB_PATH`    | Database location   | `database/workflows.db` |

## Monitoring and Logs

### View Logs

Railway Dashboard:

1. Click on your service
2. Go to **"Deployments"** tab
3. Click on active deployment
4. View real-time logs

CLI:

```bash
railway logs
```

### Health Monitoring

Railway automatically monitors the `/health` endpoint:

```bash
curl https://your-app.up.railway.app/health
```

Response:

```json
{
  "status": "healthy",
  "database": "connected",
  "workflows_count": 2000,
  "version": "1.0.0"
}
```

## Scaling

### Vertical Scaling (Resources)

1. Go to **"Settings"** tab
2. Adjust **"Memory"** and **"CPU"**
3. Save changes (will redeploy)

### Horizontal Scaling (Instances)

Railway Pro plan:

1. Go to **"Settings"** tab
2. Enable **"Horizontal Scaling"**
3. Set number of replicas

## Custom Domain

### Add Custom Domain

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain
5. Add CNAME record to your DNS:
   - Name: `api` (or your subdomain)
   - Value: `your-app.up.railway.app`

### SSL/HTTPS

Railway automatically provides SSL certificates for all domains (free).

## Database Management

### Persistent Storage

Railway provides persistent volumes. Data in `/app/database/` is preserved across deployments.

### Backup Database

Using Railway CLI:

```bash
# Connect to service
railway run bash

# Inside container
cp /app/database/workflows.db /tmp/backup.db
exit

# Download backup
railway run cat /app/database/workflows.db > local_backup.db
```

### Reindex Workflows

Trigger reindexing remotely:

```bash
railway run python run.py --reindex
```

Or via API (if admin endpoints are enabled):

```bash
curl -X POST https://your-app.up.railway.app/api/reindex \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Troubleshooting

### Build Fails

**Issue**: Dependencies not installing

**Solution**:

```bash
# Verify requirements.txt is in root
# Check Python version compatibility
# Review build logs in Railway dashboard
```

### App Not Starting

**Issue**: Server fails to start

**Solution**:

1. Check environment variables (especially `HOST=0.0.0.0`)
2. Review startup logs
3. Verify port binding: `--port $PORT`
4. Check health endpoint accessibility

### Database Issues

**Issue**: Workflows not appearing

**Solution**:

```bash
# Trigger reindexing
railway run python run.py --reindex

# Or restart the service
railway restart
```

### Slow Performance

**Issue**: API responses are slow

**Solution**:

1. Increase memory/CPU in Railway settings
2. Enable caching in application
3. Check database queries in logs
4. Consider adding Redis (Railway Redis plugin)

## Cost Optimization

### Free Tier Limits

Railway Free Tier:

- 500 hours per month
- $5 credit
- Great for testing and small projects

### Tips to Reduce Costs

1. **Efficient queries**: Optimize database queries
2. **Caching**: Implement response caching
3. **Compression**: GZip already enabled
4. **Limit logs**: Reduce verbose logging
5. **Sleep inactive apps**: Enable auto-sleep for dev environments

## Advanced Configuration

### Add Redis Caching

1. In Railway dashboard, click **"New"**
2. Select **"Database"** → **"Redis"**
3. Railway provides connection URL automatically
4. Update your app to use `REDIS_URL` environment variable

### Add PostgreSQL

If you need a more robust database:

1. Add PostgreSQL service in Railway
2. Update `workflow_db.py` to use PostgreSQL
3. Set `DATABASE_URL` environment variable

### CI/CD Integration

Railway automatically deploys on every push to main/master branch.

Customize in `railway.json`:

```json
{
  "deploy": {
    "branch": "production"
  }
}
```

## Security Best Practices

1. **Never commit secrets**: Use Railway environment variables
2. **Enable CORS**: Set `ALLOWED_ORIGINS` for production
3. **Use strong tokens**: Generate with `openssl rand -hex 32`
4. **Rate limiting**: Configure appropriate limits
5. **HTTPS only**: Railway enforces HTTPS automatically
6. **Monitor logs**: Check for suspicious activity

## Performance Tuning

### Recommended Railway Plan Settings

**Starter/Hobby Projects**:

- Memory: 512MB - 1GB
- CPU: Shared
- Instances: 1

**Production**:

- Memory: 2GB - 4GB
- CPU: 2-4 vCPU
- Instances: 2-3 (for high availability)

### Application Optimization

```python
# In api_server.py, consider:
- Response caching
- Database connection pooling
- Async operations where possible
- Compression (already enabled)
```

## Backup and Recovery

### Automated Backups

Create a scheduled task:

```bash
# Using Railway cron (if available)
railway run python scripts/backup_database.py
```

### Manual Backup

```bash
# Download database
railway run cat /app/database/workflows.db > backup_$(date +%Y%m%d).db

# Or using scp if SSH is enabled
scp railway:/app/database/workflows.db ./local_backup.db
```

### Restore from Backup

```bash
# Upload database
railway run bash -c "cat > /app/database/workflows.db" < backup.db

# Restart service
railway restart
```

## Support and Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Status Page**: [status.railway.app](https://status.railway.app)
- **API Issues**: [GitHub Issues](https://github.com/Zo-Valentine/Caphe-Workflows/issues)

## Quick Reference

### Common Commands

```bash
# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# Open dashboard
railway open

# Run command
railway run <command>

# Restart service
railway restart

# Environment variables
railway variables

# Service info
railway status
```

### Important URLs

- Dashboard: `https://railway.app/dashboard`
- Your App: `https://your-app.up.railway.app`
- Health: `https://your-app.up.railway.app/health`
- API Docs: `https://your-app.up.railway.app/docs`
- Stats: `https://your-app.up.railway.app/api/stats`

---

Need help? Open an issue or check the Railway Discord community!
