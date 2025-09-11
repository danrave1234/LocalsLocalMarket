# Sitemap Testing Guide

## 🧪 **Testing Steps**

### **1. Test Basic Functionality**
```bash
# Test if shops can be fetched
curl "https://localslocalmarket.com/api/sitemap/test"

# Expected response:
{
  "totalShops": 5,
  "testShops": 5,
  "shops": [
    {"id": 1, "name": "Shop Name 1"},
    {"id": 2, "name": "Shop Name 2"},
    ...
  ]
}
```

### **2. Test Sitemap Statistics**
```bash
# Get sitemap statistics
curl "https://localslocalmarket.com/api/sitemap/stats"

# Expected response:
{
  "totalShops": 5,
  "shopsPerSitemap": 1000,
  "totalShopSitemaps": 1,
  "sitemapIndexUrl": "https://localslocalmarket.com/api/sitemap.xml",
  "mainPagesSitemapUrl": "https://localslocalmarket.com/api/sitemap/main.xml",
  "robotsTxtUrl": "https://localslocalmarket.com/api/robots.txt",
  "shopSitemapUrls": ["https://localslocalmarket.com/api/sitemap/shops-0.xml"]
}
```

### **3. Test Sitemap Index**
```bash
# Test main sitemap index
curl "https://localslocalmarket.com/api/sitemap.xml"

# Expected response: XML with sitemap references
```

### **4. Test Main Pages Sitemap**
```bash
# Test main pages sitemap
curl "https://localslocalmarket.com/api/sitemap/main.xml"

# Expected response: XML with static pages
```

### **5. Test Shop Sitemap**
```bash
# Test shop sitemap (page 0)
curl "https://localslocalmarket.com/api/sitemap/shops-0.xml"

# Expected response: XML with shop URLs
```

### **6. Test Robots.txt**
```bash
# Test dynamic robots.txt
curl "https://localslocalmarket.com/api/robots.txt"

# Expected response: Text with sitemap references
```

## 🔍 **Troubleshooting**

### **If Test Endpoint Fails**
1. Check database connection
2. Check if Shop entity is properly configured
3. Check if there are any shops in the database

### **If Sitemap Endpoints Fail**
1. Check server logs for specific error messages
2. Verify database table exists and has data
3. Check if Spring Data JPA is properly configured

### **Common Issues**

#### **"Internal Server Error"**
- Check server logs for stack trace
- Verify database connection
- Check if Shop entity is properly mapped

#### **"No shops found"**
- Verify shops exist in database
- Check if pagination is working correctly
- Verify Shop entity fields are not null

#### **"XML parsing error"**
- Check if shop names contain invalid XML characters
- Verify slug generation is working
- Check for null values in shop data

## 📊 **Expected Results**

### **With 5 Shops**
- `totalShops`: 5
- `totalShopSitemaps`: 1 (since 5 < 1000)
- `shopSitemapUrls`: ["shops-0.xml"]

### **With 1500 Shops**
- `totalShops`: 1500
- `totalShopSitemaps`: 2 (since 1500 > 1000)
- `shopSitemapUrls`: ["shops-0.xml", "shops-1.xml"]

### **XML Structure**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://localslocalmarket.com/shops/shop-name-1</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  ...
</urlset>
```

## 🚀 **Next Steps After Testing**

1. **If all tests pass**: Submit sitemaps to search engines
2. **If tests fail**: Check server logs and fix issues
3. **Monitor**: Use Google Search Console to track indexing

## 📝 **Debug Information**

The system now includes detailed logging:
- Shop fetching progress
- Pagination details
- Error messages with stack traces
- Sitemap generation status

Check your server logs for these messages:
```
Generating shop sitemap for page: 0
Fetching shops for page: 0, size: 1000
Found 5 shops for page 0 (total: 5)
```


