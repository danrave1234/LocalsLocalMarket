@echo off
REM GCP Setup Script for LocalsLocalMarket Backend (Windows)
REM This script helps set up the initial GCP configuration for backend deployment

setlocal enabledelayedexpansion

set PROJECT_ID=localslocalmarket
set REGION=asia-east1
set REPOSITORY_NAME=cloud-run-source-deploy

echo 🚀 Setting up GCP for LocalsLocalMarket backend deployment...

REM Check if gcloud is installed
gcloud --version >nul 2>&1
if errorlevel 1 (
    echo ❌ gcloud CLI is not installed. Please install it first:
    echo    https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

REM Set the project
echo 📋 Setting project to %PROJECT_ID%...
gcloud config set project %PROJECT_ID%

REM Enable required APIs
echo 🔧 Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com

REM Create Artifact Registry repository
echo 📦 Creating Artifact Registry repository...
gcloud artifacts repositories create %REPOSITORY_NAME% --repository-format=docker --location=%REGION% --description="Docker repository for LocalsLocalMarket" --quiet 2>nul || echo Repository already exists

REM Grant Cloud Build service account necessary permissions
echo 🔐 Setting up IAM permissions...
for /f "tokens=*" %%i in ('gcloud projects describe %PROJECT_ID% --format="value(projectNumber)"') do set PROJECT_NUMBER=%%i
set CLOUDBUILD_SA=%PROJECT_NUMBER%@cloudbuild.gserviceaccount.com

gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%CLOUDBUILD_SA%" --role="roles/run.admin"
gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%CLOUDBUILD_SA%" --role="roles/artifactregistry.admin"
gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%CLOUDBUILD_SA%" --role="roles/storage.admin"

REM Grant Cloud Run service account permission to invoke itself
gcloud run services add-iam-policy-binding backend --region=%REGION% --member="serviceAccount:%CLOUDBUILD_SA%" --role="roles/run.invoker" 2>nul || echo Backend service not found yet

echo ✅ GCP setup completed successfully!
echo.
echo 📝 Next steps:
echo 1. Configure your Cloud Build trigger in the Google Cloud Console
echo 2. Set up a Cloud SQL instance for the database
echo 3. Configure environment variables in Cloud Run
echo 4. Update your Vercel frontend to point to the backend API
echo 5. Push your code to trigger the first deployment
echo.
echo 📚 See DEPLOYMENT_GUIDE.md for detailed instructions
pause
