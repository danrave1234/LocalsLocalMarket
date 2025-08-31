# Custom Domain Setup Guide

This guide covers setting up custom domains for your LocalsLocalMarket application:

- **Backend**: `api.localslocalmarket.com` (Cloud Run)
- **Frontend**: `www.localslocalmarket.com` and `localslocalmarket.com` (Vercel)

## Backend Domain Setup (Cloud Run)

### 1. Map Custom Domain to Cloud Run

```bash
# Map the custom domain to your Cloud Run service
gcloud run domain-mappings create \
    --service=backend \
    --domain=api.localslocalmarket.com \
    --region=asia-east1 \
    --force-override
```

### 2. Verify Domain Mapping

```bash
# Check domain mapping status
gcloud run domain-mappings describe \
    --domain=api.localslocalmarket.com \
    --region=asia-east1
```

### 3. DNS Configuration

You'll need to add a CNAME record in your DNS provider:

```
Type: CNAME
Name: api
Value: ghs.googlehosted.com
TTL: 300 (or as recommended by your DNS provider)
```

## Frontend Domain Setup (Vercel)

### 1. Add Custom Domains in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add the following domains:
   - `www.localslocalmarket.com`
   - `localslocalmarket.com`

### 2. DNS Configuration

Add these records to your DNS provider:

```
# For www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300

# For root domain (optional, if you want both www and non-www)
Type: A
Name: @
Value: 76.76.19.36
TTL: 300
```

### 3. Redirect Configuration (Optional)

If you want to redirect `localslocalmarket.com` to `www.localslocalmarket.com`:

1. In Vercel, go to **Settings** → **Domains**
2. Click on `localslocalmarket.com`
3. Enable **Redirect** and set it to redirect to `www.localslocalmarket.com`

## SSL Certificate Setup

### Cloud Run (Backend)
- SSL certificates are automatically provisioned by Google Cloud
- No additional configuration needed

### Vercel (Frontend)
- SSL certificates are automatically provisioned by Vercel
- No additional configuration needed

## Environment Variables

### Frontend (Vercel)
Set these environment variables in your Vercel project:

```
REACT_APP_API_URL=https://api.localslocalmarket.com
```

### Backend (Cloud Run)
The CORS configuration is already set up to allow your custom domains.

## Verification Steps

### 1. Test Backend API
```bash
# Test health endpoint
curl https://api.localslocalmarket.com/actuator/health

# Test CORS preflight
curl -X OPTIONS https://api.localslocalmarket.com \
  -H "Origin: https://www.localslocalmarket.com" \
  -H "Access-Control-Request-Method: GET"
```

### 2. Test Frontend
- Visit `https://www.localslocalmarket.com`
- Check browser console for any CORS errors
- Test API calls from the frontend

### 3. Test SSL
```bash
# Check SSL certificate
openssl s_client -connect api.localslocalmarket.com:443 -servername api.localslocalmarket.com
```

## Troubleshooting

### Common Issues

1. **DNS Propagation**
   - DNS changes can take up to 48 hours to propagate
   - Use tools like `dig` or `nslookup` to check propagation

2. **CORS Errors**
   - Ensure the backend CORS configuration includes your exact domain
   - Check that the frontend is making requests to the correct API URL

3. **SSL Certificate Issues**
   - Cloud Run and Vercel handle SSL automatically
   - If you see SSL errors, wait a few minutes for certificate provisioning

4. **Domain Mapping Errors**
   - Ensure the Cloud Run service is deployed and running
   - Check that the domain mapping was created successfully

### Useful Commands

```bash
# Check DNS propagation
dig api.localslocalmarket.com
dig www.localslocalmarket.com

# Test domain mapping
gcloud run domain-mappings list --region=asia-east1

# Check Cloud Run service status
gcloud run services describe backend --region=asia-east1
```

## Security Considerations

1. **HTTPS Only**: Both Cloud Run and Vercel enforce HTTPS
2. **CORS**: Configured to only allow your specific domains
3. **DNS Security**: Consider using DNSSEC for additional security
4. **Monitoring**: Set up monitoring for both domains

## Next Steps

1. Set up monitoring and alerting for both domains
2. Configure backup DNS providers
3. Set up domain monitoring for uptime
4. Consider implementing rate limiting
5. Set up logging and analytics
