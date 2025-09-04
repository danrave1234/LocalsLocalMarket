package org.localslocalmarket.web;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.repo.UserRepository;
import org.localslocalmarket.repo.ShopRatingRepository;
import org.localslocalmarket.repo.UnauthenticatedShopReviewRepository;
import org.localslocalmarket.security.AuthorizationService;
import org.localslocalmarket.security.AuditService;
import org.localslocalmarket.security.InputValidationService;
import org.localslocalmarket.web.dto.ShopDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private final ShopRepository shops;
    private final UserRepository users;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;
    private final InputValidationService inputValidationService;
    private final ShopRatingRepository shopRatings;
    private final UnauthenticatedShopReviewRepository unauthReviews;

    public ShopController(ShopRepository shops, UserRepository users, 
                         AuthorizationService authorizationService, 
                         AuditService auditService,
                         InputValidationService inputValidationService,
                         ShopRatingRepository shopRatings,
                         UnauthenticatedShopReviewRepository unauthReviews){
        this.shops = shops;
        this.users = users;
        this.authorizationService = authorizationService;
        this.auditService = auditService;
        this.inputValidationService = inputValidationService;
        this.shopRatings = shopRatings;
        this.unauthReviews = unauthReviews;
    }

    @PostMapping
    @Caching(evict = {
            @CacheEvict(cacheNames = "shops_list", allEntries = true),
            @CacheEvict(cacheNames = "shops_by_id", allEntries = true),
            @CacheEvict(cacheNames = "all_shops", allEntries = true)
    })
    public ResponseEntity<?> create(@RequestBody @Validated ShopDtos.CreateShopRequest req){
        try {
            // Verify user is authenticated
            User owner = authorizationService.getCurrentUserOrThrow();
            
            // Validate and sanitize input
            String validatedName = inputValidationService.validateName(req.name());
            String validatedDescription = inputValidationService.validateDescription(req.description());
            String validatedCategory = inputValidationService.validateCategory(req.category());
            String validatedAddressLine = inputValidationService.sanitizeText(req.addressLine());
            String validatedPhone = inputValidationService.validatePhone(req.phone());
            String validatedWebsite = inputValidationService.validateUrl(req.website());
            String validatedEmail = req.email() != null ? inputValidationService.validateEmail(req.email()) : null;
            String validatedFacebook = inputValidationService.validateUrl(req.facebook());
            String validatedInstagram = inputValidationService.validateUrl(req.instagram());
            String validatedTwitter = inputValidationService.validateUrl(req.twitter());
            String validatedLogoPath = inputValidationService.validateFilePath(req.logoPath());
            String validatedCoverPath = inputValidationService.validateFilePath(req.coverPath());
            
            Double validatedLat = inputValidationService.validateLatitude(req.lat());
            Double validatedLng = inputValidationService.validateLongitude(req.lng());
            
            Shop s = new Shop();
            s.setOwner(owner);
            s.setName(validatedName);
            s.setDescription(validatedDescription);
            s.setCategory(validatedCategory);
            s.setAddressLine(validatedAddressLine);
            s.setLat(validatedLat);
            s.setLng(validatedLng);
            s.setLogoPath(validatedLogoPath);
            s.setCoverPath(validatedCoverPath);
            s.setPhone(validatedPhone);
            s.setWebsite(validatedWebsite);
            s.setEmail(validatedEmail);
            s.setFacebook(validatedFacebook);
            s.setInstagram(validatedInstagram);
            s.setTwitter(validatedTwitter);
            s.setBusinessHoursJson(req.businessHoursJson());
            
            shops.save(s);
            
            // Log the action
            auditService.logUserAction(AuditService.AuditEventType.SHOP_CREATE, 
                    owner.getId().toString(), "CREATE", "shop:" + s.getId());
            
            return ResponseEntity.ok(s.getId());
        } catch (SecurityException e) {
            auditService.logPermissionDenied("unknown", "/api/shops", "CREATE");
            return ResponseEntity.status(401).body("Unauthorized");
        } catch (IllegalArgumentException e) {
            auditService.logSuspiciousActivity("unknown", "shop_creation", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        }
    }

    @GetMapping("/my-shops")
    public ResponseEntity<?> getMyShops(){
        try {
            User owner = authorizationService.getCurrentUserOrThrow();
            return ResponseEntity.ok(shops.findByOwner(owner).stream()
                    .map(ShopDtos.ShopResponse::fromShop)
                    .toList());
        } catch (SecurityException e) {
            auditService.logPermissionDenied("unknown", "/api/shops/my-shops", "READ");
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @Cacheable(cacheNames = "shops_by_id", key = "#slug")
    @GetMapping("/{slug}")
    public ResponseEntity<?> get(@PathVariable("slug") String slug){
        // Try to parse as Long first (for backward compatibility with direct IDs)
        try {
            Long shopId = Long.parseLong(slug);
            return shops.findById(shopId)
                    .<ResponseEntity<?>>map(shop -> ResponseEntity.ok(ShopDtos.ShopResponse.fromShop(shop)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {
            // Handle slug format: "shop-name-123"
            String[] parts = slug.split("-");
            if (parts.length >= 2) {
                try {
                    // Extract ID from the last part
                    Long shopId = Long.parseLong(parts[parts.length - 1]);
                    return shops.findById(shopId)
                            .<ResponseEntity<?>>map(shop -> ResponseEntity.ok(ShopDtos.ShopResponse.fromShop(shop)))
                            .orElseGet(() -> ResponseEntity.notFound().build());
                } catch (NumberFormatException ex) {
                    // If last part is not a number, fall back to old behavior
                    String shopName = slug.replace("-", " ");
                    return shops.findByNameIgnoreCase(shopName)
                            .<ResponseEntity<?>>map(shop -> ResponseEntity.ok(ShopDtos.ShopResponse.fromShop(shop)))
                            .orElseGet(() -> ResponseEntity.notFound().build());
                }
            } else {
                // Fall back to old behavior for simple names
                String shopName = slug.replace("-", " ");
                return shops.findByNameIgnoreCase(shopName)
                        .<ResponseEntity<?>>map(shop -> ResponseEntity.ok(ShopDtos.ShopResponse.fromShop(shop)))
                        .orElseGet(() -> ResponseEntity.notFound().build());
            }
        }
    }



    @Cacheable(cacheNames = "shops_list", key = "'q=' + #q.orElse('') + '&category=' + #category.orElse('') + '&page=' + #page + '&size=' + #size")
    @GetMapping
    public Page<ShopDtos.ShopResponse> list(@RequestParam("q") Optional<String> q,
                                           @RequestParam("category") Optional<String> category,
                                           @RequestParam(value = "page", defaultValue = "0") int page,
                                           @RequestParam(value = "size", defaultValue = "20") int size){
        Specification<Shop> spec = Specification.where(null);
        if(q.isPresent()){
            String like = "%" + q.get().toLowerCase() + "%";
            spec = spec.and((root, cq, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.get("addressLine")), like),
                    cb.like(cb.lower(root.get("category")), like)
                )
            );
        }
        if(category.isPresent()){
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("category"), category.get()));
        }
        Page<Shop> shopPage = shops.findAll(spec, PageRequest.of(page, size));
        return shopPage.map(ShopDtos.ShopResponse::fromShop);
    }

    // Simple paginated endpoint for landing page
    @GetMapping("/paginated")
    public Page<ShopDtos.ShopResponse> getPaginatedShops(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        Page<Shop> shopPage = shops.findAll(PageRequest.of(page, size));
        return shopPage.map(ShopDtos.ShopResponse::fromShop);
    }

    // Enhanced paginated endpoint with ratings for landing page
    @GetMapping("/paginated-with-ratings")
    public Page<ShopDtos.ShopResponseWithRatings> getPaginatedShopsWithRatings(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        Page<Shop> shopPage = shops.findAll(PageRequest.of(page, size));
        return shopPage.map(shop -> {
            // Temporarily disable ratings calculation to debug 500 error
            Double avgRating = 0.0;
            Long totalReviews = 0L;
            
            // TODO: Re-enable ratings calculation once backend is stable
            /*
            try {
                // Get authenticated ratings
                long authCount = shopRatings.countByShop_Id(shop.getId());
                Double authAvg = shopRatings.averageStarsByShop(shop.getId());
                
                // Get unauthenticated ratings
                long unauthCount = unauthReviews.countByShopId(shop.getId());
                Double unauthAvg = unauthReviews.averageStarsByShopId(shop.getId());
                
                // Calculate combined totals
                totalReviews = authCount + unauthCount;
                
                if (totalReviews > 0) {
                    double authTotal = authCount * (authAvg != null ? authAvg : 0.0);
                    double unauthTotal = unauthCount * (unauthAvg != null ? unauthAvg : 0.0);
                    avgRating = Math.round(((authTotal + unauthTotal) / totalReviews) * 10.0) / 10.0;
                }
            } catch (Exception e) {
                // If there's any error accessing ratings, set defaults
                avgRating = 0.0;
                totalReviews = 0L;
            }
            */
            
            return new ShopDtos.ShopResponseWithRatings(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getCategory(),
                shop.getAddressLine(),
                shop.getLat(),
                shop.getLng(),
                shop.getLogoPath(),
                shop.getCoverPath(),
                shop.getPhone(),
                shop.getWebsite(),
                shop.getEmail(),
                shop.getFacebook(),
                shop.getInstagram(),
                shop.getTwitter(),
                shop.getAdsImagePathsJson(),
                shop.getAdsEnabled(),
                shop.getBusinessHoursJson(),
                shop.getCreatedAt(),
                shop.getOwner() != null ? shop.getOwner().getId() : null,
                avgRating,
                totalReviews
            );
        });
    }

    @Cacheable(cacheNames = "all_shops", key = "'all'")
    @GetMapping("/all")
    public ResponseEntity<?> getAllShops(){
        try {
            // Fetch all shops for client-side filtering
            var allShops = shops.findAll().stream()
                    .map(ShopDtos.ShopResponse::fromShop)
                    .toList();
            return ResponseEntity.ok(Map.of("content", allShops));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching shops: " + e.getMessage());
        }
    }

    @Cacheable(cacheNames = "categories", key = "'categories'")
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(){
        // This endpoint is kept for backward compatibility
        // New category system is available at /api/categories
        return ResponseEntity.ok(Map.of(
            "categories", java.util.Arrays.asList(
                "Food & Beverages",
                "Automotive & Transportation",
                "Electronics & Technology",
                "Fashion & Beauty",
                "Home & Garden",
                "Health & Wellness",
                "Services",
                "Entertainment & Recreation",
                "Business & Professional",
                "Specialty & Niche"
            )
        ));
    }

    @PatchMapping("/{slug}")
    @Caching(evict = {
            @CacheEvict(cacheNames = "shops_by_id", allEntries = true),
            @CacheEvict(cacheNames = "shops_list", allEntries = true),
            @CacheEvict(cacheNames = "all_shops", allEntries = true)
    })
    public ResponseEntity<?> update(@PathVariable("slug") String slug,
                                    @RequestBody ShopDtos.UpdateShopRequest req){
        try {
            User actor = authorizationService.getCurrentUserOrThrow();

            // Try to parse as Long first (for backward compatibility with direct IDs)
            Optional<Shop> shopOpt;
            try {
                Long shopId = Long.parseLong(slug);
                shopOpt = shops.findById(shopId);
            } catch (NumberFormatException e) {
                // Handle slug format: "shop-name-123"
                String[] parts = slug.split("-");
                if (parts.length >= 2) {
                    try {
                        // Extract ID from the last part
                        Long shopId = Long.parseLong(parts[parts.length - 1]);
                        shopOpt = shops.findById(shopId);
                    } catch (NumberFormatException ex) {
                        // If last part is not a number, fall back to old behavior
                        String shopName = slug.replace("-", " ");
                        shopOpt = shops.findByNameIgnoreCase(shopName);
                    }
                } else {
                    // Fall back to old behavior for simple names
                    String shopName = slug.replace("-", " ");
                    shopOpt = shops.findByNameIgnoreCase(shopName);
                }
            }
            
            return shopOpt.<ResponseEntity<?>>map(shop -> {
                boolean isOwner = shop.getOwner() != null && shop.getOwner().getId().equals(actor.getId());
                boolean isAdmin = actor.getRole() == User.Role.ADMIN;
                if(!(isOwner || isAdmin)){
                    return ResponseEntity.status(403).body("Forbidden");
                }
                if(req.name() != null) shop.setName(req.name());
                if(req.description() != null) shop.setDescription(req.description());
                if(req.category() != null) shop.setCategory(req.category());
                if(req.addressLine() != null) shop.setAddressLine(req.addressLine());
                if(req.lat() != null) shop.setLat(req.lat());
                if(req.lng() != null) shop.setLng(req.lng());
                if(req.logoPath() != null) shop.setLogoPath(req.logoPath());
                if(req.coverPath() != null) shop.setCoverPath(req.coverPath());
                if(req.phone() != null) shop.setPhone(req.phone());
                if(req.website() != null) shop.setWebsite(req.website());
                if(req.email() != null) shop.setEmail(req.email());
                if(req.facebook() != null) shop.setFacebook(req.facebook());
                if(req.instagram() != null) shop.setInstagram(req.instagram());
                if(req.twitter() != null) shop.setTwitter(req.twitter());
                if(req.adsImagePathsJson() != null) shop.setAdsImagePathsJson(req.adsImagePathsJson());
                if(req.adsEnabled() != null) shop.setAdsEnabled(req.adsEnabled());
                if(req.businessHoursJson() != null) shop.setBusinessHoursJson(req.businessHoursJson());
                shops.save(shop);
                
                // Log the action
                auditService.logUserAction(AuditService.AuditEventType.SHOP_UPDATE, 
                        actor.getId().toString(), "UPDATE", "shop:" + shop.getId());

                return ResponseEntity.ok(shop.getId());
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (SecurityException e) {
            auditService.logPermissionDenied("unknown", "/api/shops/" + slug, "UPDATE");
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @DeleteMapping("/{slug}")
    @Caching(evict = {
            @CacheEvict(cacheNames = "shops_by_id", allEntries = true),
            @CacheEvict(cacheNames = "shops_list", allEntries = true),
            @CacheEvict(cacheNames = "all_shops", allEntries = true)
    })
    public ResponseEntity<?> delete(@PathVariable("slug") String slug){
        try {
            User actor = authorizationService.getCurrentUserOrThrow();

            // Try to parse as Long first (for backward compatibility with direct IDs)
            Optional<Shop> shopOpt;
            try {
                Long shopId = Long.parseLong(slug);
                shopOpt = shops.findById(shopId);
            } catch (NumberFormatException e) {
                // Handle slug format: "shop-name-123"
                String[] parts = slug.split("-");
                if (parts.length >= 2) {
                    try {
                        // Extract ID from the last part
                        Long shopId = Long.parseLong(parts[parts.length - 1]);
                        shopOpt = shops.findById(shopId);
                    } catch (NumberFormatException ex) {
                        // If last part is not a number, fall back to old behavior
                        String shopName = slug.replace("-", " ");
                        shopOpt = shops.findByNameIgnoreCase(shopName);
                    }
                } else {
                    // Fall back to old behavior for simple names
                    String shopName = slug.replace("-", " ");
                    shopOpt = shops.findByNameIgnoreCase(shopName);
                }
            }
            
            return shopOpt.<ResponseEntity<?>>map(shop -> {
                boolean isOwner = shop.getOwner() != null && shop.getOwner().getId().equals(actor.getId());
                boolean isAdmin = actor.getRole() == User.Role.ADMIN;
                if(!(isOwner || isAdmin)){
                    return ResponseEntity.status(403).body("Forbidden");
                }
                shops.delete(shop);
                
                // Log the action
                auditService.logUserAction(AuditService.AuditEventType.SHOP_DELETE, 
                        actor.getId().toString(), "DELETE", "shop:" + shop.getId());

                return ResponseEntity.ok(Map.of("message", "Shop deleted successfully"));
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (SecurityException e) {
            auditService.logPermissionDenied("unknown", "/api/shops/" + slug, "DELETE");
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
}
