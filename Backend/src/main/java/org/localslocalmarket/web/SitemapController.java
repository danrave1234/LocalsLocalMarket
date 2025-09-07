package org.localslocalmarket.web;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.service.SearchEngineNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SitemapController {

    @Autowired
    private ShopRepository shopRepository;
    
    @Autowired
    private SearchEngineNotificationService searchEngineNotificationService;

    private static final int SHOPS_PER_SITEMAP = 1000; // Max 50,000 URLs per sitemap (Google's limit)
    private static final String BASE_URL = "https://localslocalmarket.com";
    private static final String SITEMAP_BASE_URL = BASE_URL + "/api/sitemap";

    /**
     * Main sitemap index - lists all other sitemaps
     */
    @Cacheable(cacheNames = "sitemap", key = "'sitemap_index'")
    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateSitemapIndex() {
        try {
            // Get total shop count
            long totalShops = shopRepository.count();
            int totalShopSitemaps = (int) Math.ceil((double) totalShops / SHOPS_PER_SITEMAP);
            
            // Generate current timestamp
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            StringBuilder sitemapIndex = new StringBuilder();
            sitemapIndex.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            sitemapIndex.append("<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
            
            // Add main pages sitemap
            sitemapIndex.append("  <sitemap>\n");
            sitemapIndex.append("    <loc>").append(SITEMAP_BASE_URL).append("/main.xml</loc>\n");
            sitemapIndex.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemapIndex.append("  </sitemap>\n");
            
            // Add shop sitemaps
            for (int i = 0; i < totalShopSitemaps; i++) {
                sitemapIndex.append("  <sitemap>\n");
                sitemapIndex.append("    <loc>").append(SITEMAP_BASE_URL).append("/shops-").append(i).append(".xml</loc>\n");
                sitemapIndex.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
                sitemapIndex.append("  </sitemap>\n");
            }
            
            sitemapIndex.append("</sitemapindex>");
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/xml; charset=utf-8")
                    .header("Cache-Control", "public, max-age=3600")
                    .header("X-Robots-Tag", "index, follow")
                    .body(sitemapIndex.toString());
                    
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error generating sitemap index: " + e.getMessage());
        }
    }

    /**
     * Main pages sitemap (static pages)
     */
    @Cacheable(cacheNames = "sitemap", key = "'main_pages'")
    @GetMapping(value = "/sitemap/main.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateMainPagesSitemap() {
        try {
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            StringBuilder sitemap = new StringBuilder();
            sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
            
            // Define main pages with their priorities and change frequencies
            Map<String, Map<String, String>> mainPages = new HashMap<>();
            mainPages.put("/", Map.of("priority", "1.0", "changefreq", "daily"));
            mainPages.put("/login", Map.of("priority", "0.8", "changefreq", "monthly"));
            mainPages.put("/register", Map.of("priority", "0.8", "changefreq", "monthly"));
            mainPages.put("/donate", Map.of("priority", "0.7", "changefreq", "monthly"));
            mainPages.put("/about", Map.of("priority", "0.6", "changefreq", "monthly"));
            mainPages.put("/contact", Map.of("priority", "0.6", "changefreq", "monthly"));
            mainPages.put("/support", Map.of("priority", "0.5", "changefreq", "monthly"));
            mainPages.put("/help", Map.of("priority", "0.5", "changefreq", "monthly"));
            mainPages.put("/privacy", Map.of("priority", "0.3", "changefreq", "yearly"));
            mainPages.put("/terms", Map.of("priority", "0.3", "changefreq", "yearly"));
            mainPages.put("/cookies", Map.of("priority", "0.3", "changefreq", "yearly"));
            mainPages.put("/gdpr", Map.of("priority", "0.3", "changefreq", "yearly"));
            
            for (Map.Entry<String, Map<String, String>> page : mainPages.entrySet()) {
                String url = page.getKey();
                Map<String, String> metadata = page.getValue();
                
                sitemap.append("  <url>\n");
                sitemap.append("    <loc>").append(BASE_URL).append(url).append("</loc>\n");
                sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
                sitemap.append("    <changefreq>").append(metadata.get("changefreq")).append("</changefreq>\n");
                sitemap.append("    <priority>").append(metadata.get("priority")).append("</priority>\n");
                sitemap.append("  </url>\n");
            }
            
            sitemap.append("</urlset>");
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/xml; charset=utf-8")
                    .header("Cache-Control", "public, max-age=3600")
                    .header("X-Robots-Tag", "index, follow")
                    .body(sitemap.toString());
                    
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error generating main pages sitemap: " + e.getMessage());
        }
    }

    /**
     * Shop sitemaps - paginated by shop ID ranges
     */
    @Cacheable(cacheNames = "sitemap", key = "'shops_' + #page")
    @GetMapping(value = "/sitemap/shops-{page}.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateShopSitemap(@RequestParam("page") int page) {
        try {
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            // Calculate offset and limit for this page
            int offset = page * SHOPS_PER_SITEMAP;
            int limit = SHOPS_PER_SITEMAP;
            
            // Get shops for this page (ordered by ID for consistent pagination)
            List<Shop> shops = shopRepository.findShopsPaginated(offset, limit);
            
            StringBuilder sitemap = new StringBuilder();
            sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
            
            for (Shop shop : shops) {
                String shopSlug = generateShopSlug(shop.getName(), shop.getId());
                String shopUrl = BASE_URL + "/shops/" + shopSlug;
                
                sitemap.append("  <url>\n");
                sitemap.append("    <loc>").append(shopUrl).append("</loc>\n");
                sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
                sitemap.append("    <changefreq>weekly</changefreq>\n");
                sitemap.append("    <priority>0.9</priority>\n");
                sitemap.append("  </url>\n");
            }
            
            sitemap.append("</urlset>");
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/xml; charset=utf-8")
                    .header("Cache-Control", "public, max-age=3600")
                    .header("X-Robots-Tag", "index, follow")
                    .body(sitemap.toString());
                    
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error generating shop sitemap: " + e.getMessage());
        }
    }

    /**
     * Dynamic robots.txt that references the sitemap index
     */
    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> generateRobotsTxt() {
        try {
            StringBuilder robots = new StringBuilder();
            
            // User-agent rules
            robots.append("User-agent: *\n");
            robots.append("Allow: /\n\n");
            
            // Sitemap location - points to our sitemap index
            robots.append("# Dynamic sitemap index with all shop pages\n");
            robots.append("Sitemap: ").append(SITEMAP_BASE_URL).append(".xml\n\n");
            
            // Disallow admin and private areas
            robots.append("# Disallow admin and private areas\n");
            robots.append("Disallow: /dashboard/\n");
            robots.append("Disallow: /profile/\n");
            robots.append("Disallow: /settings/\n");
            robots.append("Disallow: /shop-management/\n");
            robots.append("Disallow: /product-management/\n\n");
            
            // Disallow API endpoints (except sitemap)
            robots.append("# Disallow API endpoints (except sitemap)\n");
            robots.append("Disallow: /api/\n");
            robots.append("Allow: /api/sitemap\n");
            robots.append("Allow: /api/robots.txt\n\n");
            
            // Disallow search parameters and filters
            robots.append("# Disallow search parameters and filters\n");
            robots.append("Disallow: /*?*\n");
            robots.append("Disallow: /*&*\n\n");
            
            // Allow important pages and directories
            robots.append("# Allow important pages and directories\n");
            robots.append("Allow: /\n");
            robots.append("Allow: /shops/\n");
            robots.append("Allow: /login\n");
            robots.append("Allow: /register\n");
            robots.append("Allow: /donate\n");
            robots.append("Allow: /about\n");
            robots.append("Allow: /contact\n");
            robots.append("Allow: /support\n");
            robots.append("Allow: /help\n");
            robots.append("Allow: /privacy\n");
            robots.append("Allow: /terms\n");
            robots.append("Allow: /cookies\n");
            robots.append("Allow: /gdpr\n\n");
            
            // Allow static assets
            robots.append("# Allow static assets\n");
            robots.append("Allow: /images/\n");
            robots.append("Allow: /css/\n");
            robots.append("Allow: /js/\n");
            robots.append("Allow: /assets/\n\n");
            
            // Crawl delay to be respectful to the server
            robots.append("# Crawl delay to be respectful to the server\n");
            robots.append("Crawl-delay: 1\n\n");
            
            // Special instructions for major search engines
            robots.append("# Special instructions for major search engines\n");
            robots.append("User-agent: Googlebot\n");
            robots.append("Crawl-delay: 1\n\n");
            
            robots.append("User-agent: Bingbot\n");
            robots.append("Crawl-delay: 2\n\n");
            
            robots.append("User-agent: Slurp\n");
            robots.append("Crawl-delay: 2\n");
            
            return ResponseEntity.ok()
                    .header("Content-Type", "text/plain; charset=utf-8")
                    .header("Cache-Control", "public, max-age=3600")
                    .body(robots.toString());
                    
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error generating robots.txt: " + e.getMessage());
        }
    }

    /**
     * Generate a slug from shop name and ID (matches frontend logic)
     */
    private String generateShopSlug(String shopName, Long shopId) {
        if (shopName == null || shopId == null) {
            return shopId != null ? shopId.toString() : "unknown";
        }
        
        String nameSlug = shopName
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters except spaces and hyphens
                .replaceAll("\\s+", "-") // Replace spaces with hyphens
                .replaceAll("-+", "-") // Replace multiple hyphens with single hyphen
                .replaceAll("^-|-$", ""); // Remove leading/trailing hyphens
        
        return nameSlug + "-" + shopId;
    }

    /**
     * Manual endpoint to ping search engines about sitemap updates
     * Useful for immediate indexing requests
     */
    @PostMapping("/sitemap/ping")
    public ResponseEntity<String> pingSearchEngines() {
        try {
            // Ping search engines about sitemap updates
            searchEngineNotificationService.notifySitemapUpdated();
            
            return ResponseEntity.ok("Search engines have been notified about sitemap updates. " +
                    "Check the server logs for ping results. " +
                    "You can also manually submit your sitemap at: " +
                    "https://search.google.com/search-console/");
                    
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error pinging search engines: " + e.getMessage());
        }
    }

    /**
     * Get sitemap statistics for monitoring
     */
    @GetMapping("/sitemap/stats")
    public ResponseEntity<Map<String, Object>> getSitemapStats() {
        try {
            long totalShops = shopRepository.count();
            int totalShopSitemaps = (int) Math.ceil((double) totalShops / SHOPS_PER_SITEMAP);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalShops", totalShops);
            stats.put("shopsPerSitemap", SHOPS_PER_SITEMAP);
            stats.put("totalShopSitemaps", totalShopSitemaps);
            stats.put("sitemapIndexUrl", SITEMAP_BASE_URL + ".xml");
            stats.put("mainPagesSitemapUrl", SITEMAP_BASE_URL + "/main.xml");
            stats.put("robotsTxtUrl", BASE_URL + "/api/robots.txt");
            
            // Generate shop sitemap URLs
            List<String> shopSitemapUrls = new java.util.ArrayList<>();
            for (int i = 0; i < totalShopSitemaps; i++) {
                shopSitemapUrls.add(SITEMAP_BASE_URL + "/shops-" + i + ".xml");
            }
            stats.put("shopSitemapUrls", shopSitemapUrls);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error getting sitemap stats: " + e.getMessage()));
        }
    }
}