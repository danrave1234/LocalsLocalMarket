package org.localslocalmarket.web;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.ShopRating;
import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.ShopRatingRepository;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.security.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/shops")
public class ShopRatingController {
    private final ShopRepository shops;
    private final ShopRatingRepository ratings;
    private final AuthorizationService auth;

    public ShopRatingController(ShopRepository shops, ShopRatingRepository ratings, AuthorizationService auth) {
        this.shops = shops;
        this.ratings = ratings;
        this.auth = auth;
    }

    public record RatingRequest(Integer stars) {}
    public record RatingSummary(long count, double average) {
        public static RatingSummary of(long c, Double avg){
            return new RatingSummary(c, avg == null ? 0.0 : Math.round(avg * 10.0) / 10.0);
        }
    }

    @PostMapping("/{shopId}/ratings")
    public ResponseEntity<?> rateShop(@PathVariable("shopId") Long shopId,
                                      @RequestBody @Validated RatingRequest req){
        try {
            if(req == null || req.stars() == null || req.stars() < 1 || req.stars() > 5){
                return ResponseEntity.badRequest().body("Stars must be between 1 and 5");
            }
            User user = auth.getCurrentUserOrThrow();
            return shops.findById(shopId).<ResponseEntity<?>>map(shop -> {
                ShopRating rating = ratings.findByUser_IdAndShop_Id(user.getId(), shop.getId())
                        .orElseGet(() -> {
                            ShopRating r = new ShopRating();
                            r.setUser(user);
                            r.setShop(shop);
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

    @GetMapping("/{shopId}/ratings/summary")
    public ResponseEntity<?> getShopRatingSummary(@PathVariable("shopId") Long shopId){
        return shops.findById(shopId)
                .<ResponseEntity<?>>map(shop -> {
                    long count = ratings.countByShop_Id(shop.getId());
                    Double avg = ratings.averageStarsByShop(shop.getId());
                    return ResponseEntity.ok(RatingSummary.of(count, avg));
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
