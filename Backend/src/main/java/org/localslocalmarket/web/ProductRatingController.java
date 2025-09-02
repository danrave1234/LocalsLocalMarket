package org.localslocalmarket.web;

import org.localslocalmarket.model.Product;
import org.localslocalmarket.model.ProductRating;
import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.ProductRepository;
import org.localslocalmarket.repo.ProductRatingRepository;
import org.localslocalmarket.security.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductRatingController {
    private final ProductRepository products;
    private final ProductRatingRepository ratings;
    private final AuthorizationService auth;

    public ProductRatingController(ProductRepository products, ProductRatingRepository ratings, AuthorizationService auth) {
        this.products = products;
        this.ratings = ratings;
        this.auth = auth;
    }

    public record RatingRequest(Integer stars) {}
    public record RatingSummary(long count, double average) {
        public static RatingSummary of(long c, Double avg){
            return new RatingSummary(c, avg == null ? 0.0 : Math.round(avg * 10.0) / 10.0);
        }
    }

    @PostMapping("/{productId}/ratings")
    public ResponseEntity<?> rateProduct(@PathVariable("productId") Long productId,
                                         @RequestBody @Validated RatingRequest req){
        try {
            if(req == null || req.stars() == null || req.stars() < 1 || req.stars() > 5){
                return ResponseEntity.badRequest().body("Stars must be between 1 and 5");
            }
            User user = auth.getCurrentUserOrThrow();
            return products.findById(productId).<ResponseEntity<?>>map(product -> {
                ProductRating rating = ratings.findByUser_IdAndProduct_Id(user.getId(), product.getId())
                        .orElseGet(() -> {
                            ProductRating r = new ProductRating();
                            r.setUser(user);
                            r.setProduct(product);
                            return r;
                        });
                rating.setStars(req.stars());
                ratings.save(rating);
                return ResponseEntity.ok(Map.of("success", true));
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (SecurityException e){
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @GetMapping("/{productId}/ratings/summary")
    public ResponseEntity<?> getProductRatingSummary(@PathVariable("productId") Long productId){
        return products.findById(productId)
                .<ResponseEntity<?>>map(product -> {
                    long count = ratings.countByProduct_Id(product.getId());
                    Double avg = ratings.averageStarsByProduct(product.getId());
                    return ResponseEntity.ok(RatingSummary.of(count, avg));
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
