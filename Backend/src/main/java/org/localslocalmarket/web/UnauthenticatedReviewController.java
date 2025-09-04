package org.localslocalmarket.web;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.UnauthenticatedShopReview;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.repo.UnauthenticatedShopReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/shops")
public class UnauthenticatedReviewController {
    private final ShopRepository shops;
    private final UnauthenticatedShopReviewRepository reviews;

    public UnauthenticatedReviewController(ShopRepository shops, UnauthenticatedShopReviewRepository reviews) {
        this.shops = shops;
        this.reviews = reviews;
    }

    public record UnauthenticatedReviewRequest(
        Integer stars,
        String reviewText,
        String reviewerName,
        String deviceId
    ) {}

    public record UnauthenticatedReviewResponse(
        Long id,
        Integer stars,
        String reviewText,
        String reviewerName,
        String deviceId,
        Instant createdAt
    ) {}

    @PostMapping("/{shopId}/reviews")
    public ResponseEntity<?> submitReview(
        @PathVariable("shopId") Long shopId,
        @RequestBody @Validated UnauthenticatedReviewRequest req
    ) {
        try {
            // Validate input
            if (req.stars() == null || req.stars() < 1 || req.stars() > 5) {
                return ResponseEntity.badRequest().body("Stars must be between 1 and 5");
            }

            if (req.deviceId() == null || req.deviceId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Device ID is required");
            }

            // Check if shop exists
            Optional<Shop> shopOpt = shops.findById(shopId);
            if (shopOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Check if this device has already reviewed this shop
            Optional<UnauthenticatedShopReview> existingReview = 
                reviews.findByShopIdAndDeviceId(shopId, req.deviceId());
            
            if (existingReview.isPresent()) {
                return ResponseEntity.badRequest().body("You have already reviewed this shop");
            }

            // Create and save the review
            UnauthenticatedShopReview review = new UnauthenticatedShopReview();
            review.setShop(shopOpt.get());
            review.setStars(req.stars());
            review.setReviewText(req.reviewText());
            review.setReviewerName(req.reviewerName() != null ? req.reviewerName() : "Anonymous Customer");
            review.setDeviceId(req.deviceId());
            review.setCreatedAt(Instant.now());

            UnauthenticatedShopReview savedReview = reviews.save(review);

            return ResponseEntity.ok(new UnauthenticatedReviewResponse(
                savedReview.getId(),
                savedReview.getStars(),
                savedReview.getReviewText(),
                savedReview.getReviewerName(),
                savedReview.getDeviceId(),
                savedReview.getCreatedAt()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to submit review: " + e.getMessage());
        }
    }

    @GetMapping("/{shopId}/reviews")
    public ResponseEntity<?> getReviews(@PathVariable("shopId") Long shopId) {
        try {
            // Check if shop exists
            if (!shops.existsById(shopId)) {
                return ResponseEntity.notFound().build();
            }

            List<UnauthenticatedShopReview> shopReviews = reviews.findByShopIdOrderByCreatedAtDesc(shopId);
            
            List<UnauthenticatedReviewResponse> response = shopReviews.stream()
                .map(review -> new UnauthenticatedReviewResponse(
                    review.getId(),
                    review.getStars(),
                    review.getReviewText(),
                    review.getReviewerName(),
                    review.getDeviceId(),
                    review.getCreatedAt()
                ))
                .toList();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch reviews: " + e.getMessage());
        }
    }

    @GetMapping("/{shopId}/reviews/summary")
    public ResponseEntity<?> getReviewSummary(@PathVariable("shopId") Long shopId) {
        try {
            // Check if shop exists
            if (!shops.existsById(shopId)) {
                return ResponseEntity.notFound().build();
            }

            long count = reviews.countByShopId(shopId);
            Double average = reviews.averageStarsByShopId(shopId);

            return ResponseEntity.ok(Map.of(
                "count", count,
                "average", average != null ? Math.round(average * 10.0) / 10.0 : 0.0
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch review summary: " + e.getMessage());
        }
    }
}
