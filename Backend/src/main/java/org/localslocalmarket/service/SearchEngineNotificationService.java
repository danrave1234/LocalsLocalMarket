package org.localslocalmarket.service;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service to notify search engines when new content is added
 */
@Service
public class SearchEngineNotificationService {

    @Value("${llm.seo.google.ping.enabled:true}")
    private boolean googlePingEnabled;

    @Value("${llm.seo.bing.ping.enabled:true}")
    private boolean bingPingEnabled;

    @Value("${llm.seo.site.url:https://localslocalmarket.com}")
    private String siteUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Notify search engines that the sitemap has been updated
     */
    @Async
    public CompletableFuture<Void> notifySitemapUpdated() {
        if (!googlePingEnabled && !bingPingEnabled) {
            return CompletableFuture.completedFuture(null);
        }

        String sitemapUrl = siteUrl + "/api/sitemap.xml";
        
        if (googlePingEnabled) {
            pingGoogle(sitemapUrl);
        }
        
        if (bingPingEnabled) {
            pingBing(sitemapUrl);
        }

        return CompletableFuture.completedFuture(null);
    }

    /**
     * Notify Google about sitemap updates
     */
    private void pingGoogle(String sitemapUrl) {
        try {
            String googlePingUrl = "https://www.google.com/ping?sitemap=" + sitemapUrl;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.getForEntity(googlePingUrl, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("SearchEngineNotificationService: Successfully pinged Google with sitemap: " + sitemapUrl);
            } else {
                System.out.println("SearchEngineNotificationService: Google ping failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("SearchEngineNotificationService: Error pinging Google: " + e.getMessage());
        }
    }

    /**
     * Notify Bing about sitemap updates
     */
    private void pingBing(String sitemapUrl) {
        try {
            String bingPingUrl = "https://www.bing.com/ping?sitemap=" + sitemapUrl;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.getForEntity(bingPingUrl, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("SearchEngineNotificationService: Successfully pinged Bing with sitemap: " + sitemapUrl);
            } else {
                System.out.println("SearchEngineNotificationService: Bing ping failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("SearchEngineNotificationService: Error pinging Bing: " + e.getMessage());
        }
    }

    /**
     * Notify search engines about new URLs (for immediate indexing)
     */
    @Async
    public CompletableFuture<Void> notifyNewUrls(List<String> urls) {
        if (!googlePingEnabled && !bingPingEnabled) {
            return CompletableFuture.completedFuture(null);
        }

        // For now, we'll just ping the sitemap
        // In the future, you could implement individual URL submission
        return notifySitemapUpdated();
    }

    /**
     * Notify about a single new URL
     */
    @Async
    public CompletableFuture<Void> notifyNewUrl(String url) {
        return notifyNewUrls(Arrays.asList(url));
    }
}
