package org.localslocalmarket.web;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.repo.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SitemapController {

    @Autowired
    private ShopRepository shopRepository;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateSitemap() {
        try {
            // Get all shops
            List<Shop> allShops = shopRepository.findAll();
            
            // Generate current timestamp
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            // Build sitemap XML
            StringBuilder sitemap = new StringBuilder();
            sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
            
            // Add static pages
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://localslocalmarket.com/</loc>\n");
            sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemap.append("    <changefreq>daily</changefreq>\n");
            sitemap.append("    <priority>1.0</priority>\n");
            sitemap.append("  </url>\n");
            
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://localslocalmarket.com/login</loc>\n");
            sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemap.append("    <changefreq>monthly</changefreq>\n");
            sitemap.append("    <priority>0.8</priority>\n");
            sitemap.append("  </url>\n");
            
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://localslocalmarket.com/register</loc>\n");
            sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemap.append("    <changefreq>monthly</changefreq>\n");
            sitemap.append("    <priority>0.8</priority>\n");
            sitemap.append("  </url>\n");
            
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://localslocalmarket.com/donate</loc>\n");
            sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemap.append("    <changefreq>monthly</changefreq>\n");
            sitemap.append("    <priority>0.7</priority>\n");
            sitemap.append("  </url>\n");
            
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://localslocalmarket.com/about</loc>\n");
            sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemap.append("    <changefreq>monthly</changefreq>\n");
            sitemap.append("    <priority>0.6</priority>\n");
            sitemap.append("  </url>\n");
            
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://localslocalmarket.com/contact</loc>\n");
            sitemap.append("    <lastmod>").append(currentDate).append("</lastmod>\n");
            sitemap.append("    <changefreq>monthly</changefreq>\n");
            sitemap.append("    <priority>0.6</priority>\n");
            sitemap.append("  </url>\n");
            
            // Add shop pages with proper slug format
            for (Shop shop : allShops) {
                String shopSlug = generateShopSlug(shop.getName(), shop.getId());
                String shopUrl = "https://localslocalmarket.com/shops/" + shopSlug;
                
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
                    .body("Error generating sitemap: " + e.getMessage());
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
}
