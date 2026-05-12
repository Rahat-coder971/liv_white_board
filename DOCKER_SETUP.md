# Docker Setup Guide

This guide explains how to use Docker and Docker Compose to run the Liv Whiteboard application.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Rahat-coder971/liv_white_board.git
cd liv_white_board
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration (optional)
nano .env
```

### 3. Build and Start Services
```bash
# Build all images and start services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend (Client)**: http://localhost:5173
- **Backend (Server)**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## Available Commands

### Start Services
```bash
# Start all services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Rebuild images and start
docker-compose up --build
```

### Stop Services
```bash
# Stop all running services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### View Logs
```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f server
```

### Manage Services
```bash
# List running containers
docker-compose ps

# Execute command in a service
docker-compose exec server npm run dev
docker-compose exec client npm run dev

# Restart services
docker-compose restart

# Rebuild a specific service
docker-compose build server
docker-compose build client
```

## Service Configuration

### Server (Express.js)
- **Port**: 5000
- **Environment**: Node.js 18 Alpine
- **Dependencies**: Express, MongoDB, Socket.io
- **Health Check**: Configured for automatic restart on failure

### Client (React + Vite)
- **Port**: 5173
- **Environment**: Node.js 18 Alpine with Serve
- **Build Tool**: Vite
- **Health Check**: Configured for automatic restart on failure

### MongoDB
- **Port**: 27017
- **Version**: 7.0 Alpine
- **Default User**: admin
- **Default Password**: password
- **Database**: liv_whiteboard
- **Volumes**: Persistent storage for data and config

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Environment type |
| MONGO_ROOT_USER | admin | MongoDB root username |
| MONGO_ROOT_PASSWORD | password | MongoDB root password |
| MONGODB_URI | mongodb://... | MongoDB connection string |
| PORT | 5000 | Server port |
| CORS_ORIGIN | http://localhost:5173 | CORS allowed origin |
| VITE_API_URL | http://localhost:5000 | Client API endpoint |

## Troubleshooting

### Services won't start
```bash
# Check service logs
docker-compose logs [service-name]

# Verify service health
docker-compose ps

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Port already in use
```bash
# Change ports in docker-compose.yml or use environment variables
# Kill process using the port (Linux/Mac)
lsof -ti:5000 | xargs kill -9
```

### Database connection issues
```bash
# Check MongoDB is running
docker-compose logs mongodb

# Verify connection string in .env
MONGODB_URI=mongodb://admin:password@mongodb:27017/liv_whiteboard?authSource=admin
```

### Building takes too long
```bash
# Use cached layers (don't use --no-cache)
docker-compose build

# Clean up unused images
docker image prune
```

## Production Deployment

For production deployment:

1. Update `.env` with secure credentials
2. Change `NODE_ENV` to `production`
3. Use strong MongoDB passwords
4. Configure proper CORS origins
5. Set up reverse proxy (Nginx/Apache)
6. Use Docker secrets or environment files for sensitive data

## Development Workflow

### Hot Reload Development
```bash
# Services automatically reload on code changes due to volume mounts
docker-compose up
```

### Running Database Migrations
```bash
# Execute scripts inside the server container
docker-compose exec server node scripts/migrate.js
```

### Accessing MongoDB Shell
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh -u admin -p password

# Or use a GUI tool like MongoDB Compass
# Connection: mongodb://admin:password@localhost:27017
```

## Performance Tips

1. **Use .dockerignore**: Reduces build context size
2. **Multi-stage builds**: Reduces final image size
3. **Layer caching**: Order Dockerfile commands efficiently
4. **Resource limits**: Set CPU and memory limits in docker-compose.yml
5. **Volume mounts**: Use for development only; remove for production

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
