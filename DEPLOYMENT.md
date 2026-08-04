# Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] Rotate all exposed credentials (MongoDB, Cloudinary, JWT secrets)
- [ ] Update .env with production values
- [ ] Ensure .env is not committed to git
- [ ] Verify CSRF protection is working
- [ ] Test authentication flow
- [ ] Review security headers
- [ ] Enable HTTPS in production

### Database
- [ ] Configure MongoDB connection string
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Test database connectivity
- [ ] Set up database indexes

### Environment Variables
Required environment variables for production:

```bash
# Server
NODE_ENV=production
PORT=4000
FRONTEND_ORIGIN=https://your-frontend-domain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_ACCESS_SECRET=32-byte-random-secret
JWT_REFRESH_SECRET=different-32-byte-random-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=bcrypt-hash-of-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment Options

### Option 1: Docker Compose (Recommended for Development/Testing)

1. **Build and start services:**
```bash
docker-compose up -d
```

2. **View logs:**
```bash
docker-compose logs -f
```

3. **Stop services:**
```bash
docker-compose down
```

### Option 2: Docker Swarm (Production)

1. **Initialize Swarm:**
```bash
docker swarm init
```

2. **Deploy stack:**
```bash
docker stack deploy -c docker-compose.yml blht
```

3. **Scale services:**
```bash
docker service scale blht_backend=3 blht_frontend=2
```

### Option 3: Kubernetes (Enterprise)

Use the provided Kubernetes manifests (if created) or use a managed service like GKE, EKS, or AKS.

## Monitoring

### Health Checks
- Frontend: `http://your-domain/health`
- Backend: `http://your-api-domain/api/health`
- Readiness: `http://your-api-domain/api/ready`
- Metrics: `http://your-api-domain/api/metrics`

### Log Locations
- Backend logs: `backend/logs/`
- Error logs: `backend/logs/error.log`
- Combined logs: `backend/logs/combined.log`

### Monitoring Tools
- **Logs**: Check Winston logs in `/logs` directory
- **Metrics**: Available at `/api/metrics` endpoint
- **Health**: Available at `/api/health` endpoint

## Backup Strategy

### Database Backups
1. **Manual backup:**
```bash
mongodump --uri="mongodb://user:pass@host:port/db" --out=./backup
```

2. **Automated backup:**
- Set up MongoDB Atlas automated backups
- Configure backup retention policy
- Test restore procedure

### Application Backups
- Back up environment variables
- Back up Cloudinary configurations
- Back up any local data files

## Performance Optimization

### Database
- Indexes are automatically created on `collection` and `data.slug`
- Connection pooling is configured (max 50, min 5)
- Query optimization implemented

### Caching
- Redis is included in docker-compose for future caching
- Static assets are cached via nginx
- API responses can be cached in Redis

### CDN
- Configure CloudFront or similar CDN for static assets
- Enable image optimization
- Set up cache headers

## Scaling

### Horizontal Scaling
- Backend: Use load balancer with multiple instances
- Frontend: Use CDN + multiple instances
- Database: Use MongoDB read replicas

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Add caching layer

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MONGODB_URI in .env
   - Verify MongoDB is accessible
   - Check network connectivity

2. **CSRF Token Errors**
   - Verify CSRF middleware is working
   - Check cookie settings
   - Ensure frontend is sending CSRF token

3. **Authentication Failures**
   - Verify JWT secrets are set
   - Check admin credentials
   - Review token expiration

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript compilation
   - Verify all dependencies are installed

## Security Considerations

### Production Security
- Always use HTTPS
- Keep dependencies updated
- Regular security audits
- Monitor access logs
- Implement rate limiting
- Use secrets management service

### Network Security
- Configure firewall rules
- Use VPC in cloud environments
- Implement network segmentation
- Use SSL/TLS for all communications

### Application Security
- Input validation is implemented
- CSRF protection is enabled
- Security headers are configured
- Rate limiting is active
- Authentication is JWT-based

## Rollback Procedure

1. **Docker Compose:**
```bash
docker-compose down
git checkout previous-version
docker-compose up -d
```

2. **Database Rollback:**
```bash
mongorestore --uri="mongodb://user:pass@host:port/db" ./backup
```

3. **Code Rollback:**
```bash
git revert <commit-hash>
docker-compose build
docker-compose up -d
```

## Support

For issues or questions:
- Check logs in `/logs` directory
- Review health check endpoints
- Verify environment variables
- Check GitHub issues