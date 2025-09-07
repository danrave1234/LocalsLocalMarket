package org.localslocalmarket.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service for pinging search engines when sitemaps are updated
 */
@Service
public class SearchEnginePingService {

    @Value("${app.base-url:https://localslocalmarket.com}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Ping Google about sitemap updates
     */
    @Async
    public CompletableFuture<Void> pingGoogle() {
        try {
            String sitemapUrl = baseUrl + "/api/sitemap.xml";
            String pingUrl = "https://www.google.com/ping?sitemap=" + sitemapUrl;
            
            restTemplate.getForEntity(pingUrl, String.class);
            System.out.println("✅ Google pinged successfully for sitemap: " + sitemapUrl);
        } catch (Exception e) {
            System.err.println("❌ Failed to ping Google: " + e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Ping Bing about sitemap updates
     */
    @Async
    public CompletableFuture<Void> pingBing() {
        try {
            String sitemapUrl = baseUrl + "/api/sitemap.xml";
            String pingUrl = "https://www.bing.com/ping?sitemap=" + sitemapUrl;
            
            restTemplate.getForEntity(pingUrl, String.class);
            System.out.println("✅ Bing pinged successfully for sitemap: " + sitemapUrl);
        } catch (Exception e) {
            System.err.println("❌ Failed to ping Bing: " + e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Ping all major search engines
     */
    @Async
    public CompletableFuture<Void> pingAllSearchEngines() {
        CompletableFuture<Void> googlePing = pingGoogle();
        CompletableFuture<Void> bingPing = pingBing();
        
        return CompletableFuture.allOf(googlePing, bingPing);
    }

    /**
     * Ping search engines with custom sitemap URL
     */
    @Async
    public CompletableFuture<Void> pingSearchEngines(String sitemapUrl) {
        try {
            // Ping Google
            String googlePingUrl = "https://www.google.com/ping?sitemap=" + sitemapUrl;
            restTemplate.getForEntity(googlePingUrl, String.class);
            
            // Ping Bing
            String bingPingUrl = "https://www.bing.com/ping?sitemap=" + sitemapUrl;
            restTemplate.getForEntity(bingPingUrl, String.class);
            
            System.out.println("✅ All search engines pinged for sitemap: " + sitemapUrl);
        } catch (Exception e) {
            System.err.println("❌ Failed to ping search engines: " + e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }
}
