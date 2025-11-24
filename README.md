# ☕ Caphè Workflows - Business Automation Platform

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new)

A professional-grade workflow automation platform built with FastAPI, featuring 2000+ pre-built n8n workflows for business automation, integration, and productivity.

## 🚀 Features

- **2000+ Pre-built Workflows**: Ready-to-use automation templates
- **RESTful API**: Full-featured API with filtering, search, and pagination
- **Category Organization**: Workflows organized by integration/service
- **Tier System**: Free, Premium, and Enterprise workflow tiers
- **Real-time Search**: Fast search and filtering capabilities
- **Download Support**: Direct workflow JSON downloads
- **Health Monitoring**: Built-in health checks for deployment
- **Swagger Documentation**: Interactive API docs at `/docs`

## 📋 Quick Start

### Deploy to Railway (Recommended)

1. Click the "Deploy on Railway" button above
2. Connect your GitHub account
3. Railway will automatically:
   - Build and deploy the application
   - Assign a public URL
   - Set up environment variables
4. Your API will be live in minutes!

### Local Development

```bash
# Clone the repository
git clone https://github.com/Zo-Valentine/Caphe-Workflows.git
cd Caphe-Workflows

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py

# Or with custom settings
python run.py --host 0.0.0.0 --port 8000
```

### Docker Deployment

```bash
# Build the image
docker build -t caphe-workflows .

# Run the container
docker run -p 8000:8000 \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  caphe-workflows
```

## 🔧 Configuration

### Environment Variables

Configure the application using these environment variables:

| Variable              | Description                    | Default                 | Required        |
| --------------------- | ------------------------------ | ----------------------- | --------------- |
| `PORT`                | Server port                    | `8000`                  | No              |
| `HOST`                | Server host                    | `127.0.0.1`             | No              |
| `JWT_SECRET_KEY`      | Secret for JWT tokens          | -                       | Production only |
| `ADMIN_PASSWORD`      | Admin password                 | -                       | Production only |
| `ADMIN_TOKEN`         | API admin token                | -                       | Production only |
| `WORKFLOW_DB_PATH`    | Database path                  | `database/workflows.db` | No              |
| `ALLOWED_ORIGINS`     | CORS origins (comma-separated) | -                       | No              |
| `RATE_LIMIT_REQUESTS` | Rate limit requests            | `60`                    | No              |
| `RATE_LIMIT_WINDOW`   | Rate limit window (seconds)    | `60`                    | No              |

### Railway Environment Setup

In your Railway project:

1. Go to **Variables** tab
2. Add your environment variables
3. Railway provides `PORT` automatically
4. Recommended variables for production:
   - `HOST=0.0.0.0`
   - `JWT_SECRET_KEY=your-secure-secret-key`
   - `ADMIN_TOKEN=your-secure-admin-token`

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:8000`
- **Railway**: `https://your-app.railway.app`

### Key Endpoints

#### Health Check

```
GET /health
```

Returns server health status and database info.

#### Get All Workflows

```
GET /api/workflows?page=1&limit=20&category=Slack&tier=free&search=automation
```

**Query Parameters:**

- `page` (int): Page number (default: 1)
- `limit` (int): Results per page (default: 20, max: 100)
- `category` (string): Filter by category/integration
- `tier` (string): Filter by tier (free, premium, enterprise)
- `search` (string): Search in workflow names and descriptions

**Response:**

```json
{
  "workflows": [...],
  "total": 2000,
  "page": 1,
  "pages": 100,
  "has_next": true,
  "has_prev": false
}
```

#### Get Workflow Details

```
GET /api/workflows/{filename}
```

Returns complete workflow details including metadata and JSON content.

#### Download Workflow

```
GET /api/workflows/{filename}/download
```

Downloads the workflow JSON file.

#### Get Categories

```
GET /api/categories
```

Returns all available workflow categories with counts.

#### Get Statistics

```
GET /api/stats
```

Returns platform statistics (total workflows, categories, tiers).

### Interactive API Docs

- **Swagger UI**: `http://your-domain/docs`
- **ReDoc**: `http://your-domain/redoc`

## 🏗️ Project Structure

```
caphe-workflows/
├── api_server.py           # Main FastAPI application
├── workflow_db.py          # Database management
├── run.py                  # Server launcher
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker configuration
├── railway.json           # Railway deployment config
├── railway.toml           # Alternative Railway config
├── Procfile               # Process configuration
├── nixpacks.toml          # Nixpacks build config
├── .env.example           # Environment variables template
├── workflows/             # 2000+ workflow JSON files
│   ├── Slack/
│   ├── Google/
│   ├── Notion/
│   └── ...
├── static/                # Static assets
├── templates/             # HTML templates
├── database/              # SQLite database (auto-created)
└── docs/                  # Additional documentation
```

## 🔐 Security

- **Environment Variables**: Never commit secrets to Git
- **CORS**: Configure `ALLOWED_ORIGINS` for production
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Health Checks**: Use `/health` endpoint for monitoring
- **JWT Authentication**: Optional JWT support for protected endpoints

## 🐳 Docker Support

### Using Docker Compose

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up
```

### Manual Docker Build

```bash
docker build -t caphe-workflows:latest .
docker run -p 8000:8000 caphe-workflows:latest
```

## 📊 Database

The application uses SQLite for workflow metadata:

- **Auto-initialization**: Database created on first run
- **Auto-indexing**: Workflows indexed automatically
- **Persistent**: Database stored in `database/` directory
- **Reindexing**: Use `python run.py --reindex` to rebuild

### Database Schema

- **workflows**: Workflow metadata
  - filename, name, description
  - category, tier, type
  - complexity, tags
  - created_at, updated_at

## 🛠️ Development

### Running in Development Mode

```bash
# With auto-reload
python run.py --dev

# Force database reindex
python run.py --reindex

# Custom port
python run.py --port 3000 --host 0.0.0.0
```

### Testing

```bash
# Run API tests
./test_api.sh

# Run security tests
./test_security.sh

# Run workflow tests
python test_workflows.py
```

## 📦 Deployment Platforms

### Railway ⭐ (Recommended)

- **One-click deployment**
- Automatic HTTPS
- Environment variable management
- Built-in monitoring
- Easy scaling

### Other Platforms

The application is compatible with:

- **Heroku**: Use `Procfile`
- **Render**: Use `Dockerfile`
- **Fly.io**: Use `Dockerfile`
- **DigitalOcean App Platform**: Use `Dockerfile`
- **Google Cloud Run**: Use `Dockerfile`
- **AWS Elastic Beanstalk**: Use `Dockerfile`

## 🔄 Updates and Maintenance

### Updating Workflows

1. Add new workflow JSON files to `workflows/` directory
2. Run reindexing: `python run.py --reindex`
3. Database automatically updates

### Monitoring

- **Health endpoint**: `/health` - Returns status and metrics
- **Stats endpoint**: `/api/stats` - Platform statistics
- **Logs**: Check Railway logs dashboard or local stdout

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

See [LICENSE](LICENSE) for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Zo-Valentine/Caphe-Workflows/issues)
- **Documentation**: See `docs/` folder for detailed guides
- **API Docs**: Visit `/docs` endpoint when server is running

## 🎯 Use Cases

- **Business Automation**: Automate repetitive tasks
- **Integration Platform**: Connect multiple services
- **Workflow Templates**: Pre-built solutions for common scenarios
- **API Backend**: Use as a workflow repository API
- **Learning Resource**: Study n8n workflow patterns

## 📈 Performance

- **Fast API**: Built with FastAPI for high performance
- **Efficient Search**: Optimized database queries
- **Caching**: Response caching for better performance
- **Pagination**: Efficient data loading
- **Compression**: GZip compression enabled

## 🌟 Features in Detail

### Filtering System

Filter workflows by:

- **Category**: Integration/service name (Slack, Google, etc.)
- **Tier**: free, premium, enterprise
- **Search**: Text search in names and descriptions
- **Pagination**: Control page size and navigation

### Workflow Tiers

- **Free Tier**: ~600 workflows, no restrictions
- **Premium Tier**: ~800 workflows, advanced features
- **Enterprise Tier**: ~600 workflows, complex integrations

### API Features

- RESTful design
- JSON responses
- Comprehensive error handling
- Rate limiting
- CORS support
- Health checks
- Swagger documentation

## 🚦 Getting Help

1. Check the `/docs` endpoint for API documentation
2. Review the `DEPLOYMENT.md` file for detailed deployment guides
3. Check `SECURITY.md` for security best practices
4. Open an issue on GitHub for bugs or feature requests

---

Made with ☕ by Caphè Technologies | Powered by FastAPI & n8n
