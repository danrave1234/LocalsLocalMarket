#!/bin/bash

# GCP Setup Script for LocalsLocalMarket
# This script helps set up the initial GCP configuration

set -e

PROJECT_ID="localslocalmarket"
REGION="asia-east1"
REPOSITORY_NAME="cloud-run-source-deploy"

echo "🚀 Setting up GCP for LocalsLocalMarket deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com

# Create Artifact Registry repository
echo "📦 Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPOSITORY_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for LocalsLocalMarket" \
    --quiet || echo "Repository already exists"

# Grant Cloud Build service account necessary permissions
echo "🔐 Setting up IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/storage.admin"

# Grant Cloud Run service account permission to invoke itself
gcloud run services add-iam-policy-binding backend \
    --region=$REGION \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/run.invoker" || echo "Backend service not found yet"

gcloud run services add-iam-policy-binding frontend \
    --region=$REGION \
    --member="serviceAccount:${CLOUDBUILD_SA}" \
    --role="roles/run.invoker" || echo "Frontend service not found yet"

echo "✅ GCP setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Configure your Cloud Build trigger in the Google Cloud Console"
echo "2. Set up a Cloud SQL instance for the database"
echo "3. Configure environment variables in Cloud Run"
echo "4. Push your code to trigger the first deployment"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
