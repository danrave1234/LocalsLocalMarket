#!/bin/bash

# Database Setup Script for LocalsLocalMarket
# This script sets up a Cloud SQL PostgreSQL instance

set -e

PROJECT_ID="localslocalmarket"
REGION="asia-east1"
INSTANCE_NAME="localslocalmarket-db"
DATABASE_NAME="localslocalmarket"
DB_USER="localslocalmarket-user"

echo "🗄️ Setting up Cloud SQL database for LocalsLocalMarket..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Prompt for database password
echo "🔐 Please enter a password for the database user:"
read -s DB_PASSWORD
echo ""

# Create Cloud SQL instance
echo "🏗️ Creating Cloud SQL instance..."
gcloud sql instances create $INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password=$DB_PASSWORD \
    --storage-type=SSD \
    --storage-size=10GB \
    --backup-start-time="02:00" \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=03 \
    --availability-type=zonal \
    --quiet || echo "Instance already exists"

# Create database
echo "📊 Creating database..."
gcloud sql databases create $DATABASE_NAME \
    --instance=$INSTANCE_NAME \
    --quiet || echo "Database already exists"

# Create user
echo "👤 Creating database user..."
gcloud sql users create $DB_USER \
    --instance=$INSTANCE_NAME \
    --password=$DB_PASSWORD \
    --quiet || echo "User already exists"

# Get connection information
echo "🔍 Getting connection information..."
INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe $INSTANCE_NAME --format="value(connectionName)")
PUBLIC_IP=$(gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)")

echo "✅ Database setup completed successfully!"
echo ""
echo "📋 Database Information:"
echo "Instance Name: $INSTANCE_NAME"
echo "Database: $DATABASE_NAME"
echo "User: $DB_USER"
echo "Connection Name: $INSTANCE_CONNECTION_NAME"
echo "Public IP: $PUBLIC_IP"
echo ""
echo "🔗 Connection String:"
echo "jdbc:postgresql://$PUBLIC_IP:5432/$DATABASE_NAME"
echo ""
echo "📝 Environment Variables for Cloud Run:"
echo "LLM_DB_URL=jdbc:postgresql://$PUBLIC_IP:5432/$DATABASE_NAME"
echo "LLM_DB_DRIVER=org.postgresql.Driver"
echo "LLM_DB_USER=$DB_USER"
echo "LLM_DB_PASS=$DB_PASSWORD"
echo "LLM_DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect"
echo "LLM_JPA_DDL=validate"
echo ""
echo "⚠️  Security Note:"
echo "- Store the database password securely (e.g., in Secret Manager)"
echo "- Consider using private IP for production"
echo "- Enable SSL connections for production use"
