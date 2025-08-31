# Google Cloud Platform Deployment Guide

This guide covers deploying the LocalsLocalMarket **backend** to Google Cloud Platform using Cloud Build and Cloud Run. The frontend is deployed separately on Vercel.

## Prerequisites

1. **Google Cloud Project**: Ensure you have a GCP project with billing enabled
2. **Required APIs**: Enable the following APIs in your project:
   - Cloud Build API
   - Cloud Run API
   - Container Registry API
   - Artifact Registry API

3. **IAM Permissions**: Ensure your service account has the following roles:
   - Cloud Build Service Account
   - Cloud Run Admin
   - Storage Admin
   - Artifact Registry Admin

## Project Structure

```
LocalsLocalMarket/
├── Backend/                 # Spring Boot application
│   ├── Dockerfile          # Backend container configuration
│   ├── pom.xml            # Maven dependencies
│   └── src/
├── Frontend/               # React application (deployed on Vercel)
├── cloudbuild.yaml        # Cloud Build configuration (backend only)
└── DEPLOYMENT_GUIDE.md    # This file
```

## Configuration Files

### 1. cloudbuild.yaml
The main Cloud Build configuration that:
- Builds the Spring Boot backend application
- Creates Docker container
- Pushes image to Artifact Registry
- Deploys to Cloud Run

### 2. Environment Variables
The following substitution variables are used in the Cloud Build trigger:

| Variable | Value | Description |
|----------|-------|-------------|
| `_AR_HOSTNAME` | `asia-east1-docker.pkg.dev` | Artifact Registry hostname |
| `_AR_PROJECT_ID` | `localslocalmarket` | Your GCP project ID |
| `_AR_REPOSITORY` | `cloud-run-source-deploy` | Artifact Registry repository |
| `_DEPLOY_REGION` | `asia-east1` | Cloud Run deployment region |
| `_PLATFORM` | `managed` | Cloud Run platform |
| `_SERVICE_NAME` | `localslocalmarket` | Service name |

## Deployment Steps

### 1. Initial Setup

```bash
# Set your project ID
gcloud config set project localslocalmarket

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create cloud-run-source-deploy \
    --repository-format=docker \
    --location=asia-east1 \
    --description="Docker repository for LocalsLocalMarket"
```

### 3. Configure Cloud Build Trigger

1. Go to Cloud Build > Triggers in the Google Cloud Console
2. Create a new trigger or edit existing trigger
3. Configure the following settings:
   - **Source**: Connect to your GitHub repository
   - **Branch**: `^master$` (or your main branch)
   - **Configuration**: Cloud Build configuration file (yaml or json)
   - **Location**: `/cloudbuild.yaml`

### 4. Set Environment Variables

For the backend service, you'll need to set these environment variables in Cloud Run:

```bash
# Database configuration
LLM_DB_URL=jdbc:postgresql://your-postgres-instance:5432/localslocalmarket
LLM_DB_DRIVER=org.postgresql.Driver
LLM_DB_USER=your-db-user
LLM_DB_PASS=your-db-password
LLM_DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
LLM_JPA_DDL=validate

# Security
LLM_JWT_SECRET=your-32-character-secret-key

# File uploads
LLM_UPLOADS_DIR=/tmp/uploads
LLM_UPLOADS_IMAGE_FORMAT=webp
LLM_UPLOADS_IMAGE_QUALITY=0.85

# Caching
LLM_CACHE_ENABLED=true
LLM_CACHE_TTL_SECONDS=300
LLM_CACHE_MAX_SIZE=500

# CORS configuration for production domains
LLM_CORS_ALLOWED_ORIGINS=https://www.localslocalmarket.com,https://localslocalmarket.com
```

### 5. Database Setup

For production, it's recommended to use Cloud SQL (PostgreSQL):

```bash
# Create Cloud SQL instance
gcloud sql instances create localslocalmarket-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=asia-east1 \
    --root-password=your-root-password

# Create database
gcloud sql databases create localslocalmarket \
    --instance=localslocalmarket-db

# Create user
gcloud sql users create localslocalmarket-user \
    --instance=localslocalmarket-db \
    --password=your-user-password
```

### 6. Deploy

The deployment happens automatically when you push to the master branch. The Cloud Build trigger will:

1. Build the Spring Boot backend application
2. Create Docker container
3. Push image to Artifact Registry
4. Deploy to Cloud Run

## Service URLs

After deployment, your backend service will be available at:

- **Backend**: `https://api.localslocalmarket.com` (custom domain)
- **Backend (Cloud Run)**: `https://backend-xxxxx-xx.a.run.app` (temporary, until custom domain is configured)

## Frontend Integration

Since your frontend is deployed on Vercel with custom domains, you'll need to:

1. **Update API endpoints** in your frontend to point to the backend API domain
2. **Configure CORS** in your backend to allow requests from your custom domains
3. **Set environment variables** in Vercel to point to your backend API

### Example Frontend Configuration

In your Vercel environment variables:
```
REACT_APP_API_URL=https://api.localslocalmarket.com
```

### Custom Domain Setup

1. **Backend Domain**: Configure `api.localslocalmarket.com` to point to your Cloud Run service
2. **Frontend Domains**: Configure `www.localslocalmarket.com` and `localslocalmarket.com` in Vercel
3. **SSL Certificates**: Both Cloud Run and Vercel provide automatic SSL certificates

## Monitoring and Logging

### Cloud Run Logs
```bash
# View backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=backend"
```

### Health Checks
- Backend: `https://api.localslocalmarket.com/actuator/health`
- Backend (Cloud Run): `https://backend-xxxxx-xx.a.run.app/actuator/health`

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Cloud Build logs in the console
   - Verify all dependencies are correctly specified
   - Ensure Dockerfile is properly configured

2. **Deployment Failures**
   - Check Cloud Run logs
   - Verify environment variables are set correctly
   - Ensure database connection is working

3. **Runtime Issues**
   - Check application logs in Cloud Run
   - Verify health check endpoints are responding
   - Check database connectivity

4. **CORS Issues**
   - Ensure CORS is configured to allow your custom domains
   - Check that preflight requests are handled correctly

### Useful Commands

```bash
# List Cloud Run services
gcloud run services list

# Update environment variables
gcloud run services update backend \
    --set-env-vars KEY=VALUE

# View service details
gcloud run services describe backend

# Stream logs
gcloud run services logs tail backend
```

## Cost Optimization

1. **Resource Limits**: Set appropriate CPU and memory limits
2. **Scaling**: Configure min/max instances based on traffic
3. **Database**: Use appropriate Cloud SQL instance size
4. **Storage**: Use Cloud Storage for file uploads instead of local storage

## Security Considerations

1. **Secrets Management**: Use Secret Manager for sensitive data
2. **Network Security**: Configure VPC connector if needed
3. **Authentication**: Implement proper authentication mechanisms
4. **HTTPS**: Cloud Run provides HTTPS by default
5. **CORS**: Configure CORS to only allow your custom domains

## Next Steps

1. Set up a custom domain for your backend
2. Configure SSL certificates
3. Set up monitoring and alerting
4. Implement CI/CD pipeline improvements
5. Add database migrations
6. Set up backup strategies
7. Configure proper CORS settings for custom domain integration
