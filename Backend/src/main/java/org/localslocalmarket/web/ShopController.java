package org.localslocalmarket.web;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.repo.UserRepository;
import org.localslocalmarket.web.dto.ShopDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private final ShopRepository shops;
    private final UserRepository users;

    public ShopController(ShopRepository shops, UserRepository users){
        this.shops = shops;
        this.users = users;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Validated ShopDtos.CreateShopRequest req){
        // Use authenticated user from SecurityContext
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User owner = (User) auth.getPrincipal();
        Shop s = new Shop();
        s.setOwner(owner);
        s.setName(req.name());
        s.setDescription(req.description());
        s.setCategory(req.category());
        s.setAddressLine(req.addressLine());
        s.setLat(req.lat());
        s.setLng(req.lng());
        s.setLogoPath(req.logoPath());
        s.setCoverPath(req.coverPath());
        s.setPhone(req.phone());
        s.setWebsite(req.website());
        s.setEmail(req.email());
        s.setFacebook(req.facebook());
        s.setInstagram(req.instagram());
        s.setTwitter(req.twitter());
        shops.save(s);
        return ResponseEntity.ok(s.getId());
    }

    @GetMapping("/my-shops")
    public ResponseEntity<?> getMyShops(){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User owner = (User) auth.getPrincipal();
        return ResponseEntity.ok(shops.findByOwner(owner));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> get(@PathVariable("slug") String slug){
        // Try to parse as Long first (for backward compatibility with direct IDs)
        try {
            Long shopId = Long.parseLong(slug);
            return shops.findById(shopId)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {
            // Handle slug format: "shop-name-123"
            String[] parts = slug.split("-");
            if (parts.length >= 2) {
                try {
                    // Extract ID from the last part
                    Long shopId = Long.parseLong(parts[parts.length - 1]);
                    return shops.findById(shopId)
                            .<ResponseEntity<?>>map(ResponseEntity::ok)
                            .orElseGet(() -> ResponseEntity.notFound().build());
                } catch (NumberFormatException ex) {
                    // If last part is not a number, fall back to old behavior
                    String shopName = slug.replace("-", " ");
                    return shops.findByNameIgnoreCase(shopName)
                            .<ResponseEntity<?>>map(ResponseEntity::ok)
                            .orElseGet(() -> ResponseEntity.notFound().build());
                }
            } else {
                // Fall back to old behavior for simple names
                String shopName = slug.replace("-", " ");
                return shops.findByNameIgnoreCase(shopName)
                        .<ResponseEntity<?>>map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
            }
        }
    }

    @GetMapping
    public Page<Shop> list(@RequestParam("q") Optional<String> q,
                           @RequestParam("category") Optional<String> category,
                           @RequestParam(value = "page", defaultValue = "0") int page,
                           @RequestParam(value = "size", defaultValue = "20") int size){
        Specification<Shop> spec = Specification.where(null);
        if(q.isPresent()){
            String like = "%" + q.get().toLowerCase() + "%";
            spec = spec.and((root, cq, cb) -> cb.like(cb.lower(root.get("name")), like));
        }
        if(category.isPresent()){
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("category"), category.get()));
        }
        return shops.findAll(spec, PageRequest.of(page, size));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(){
        return ResponseEntity.ok(Map.of(
            "categories", java.util.Arrays.asList(
                "Vulkanizing",
                "Motorcycle Parts",
                "Beauty Products", 
                "Household Accessories",
                "Electronics",
                "Clothing & Fashion",
                "Food & Beverages",
                "Automotive Services",
                "Health & Wellness",
                "Home & Garden",
                "Sports & Recreation",
                "Books & Stationery",
                "Jewelry & Accessories",
                "Pet Supplies",
                "Construction & Hardware",
                "Other"
            )
        ));
    }

    @PatchMapping("/{slug}")
    public ResponseEntity<?> update(@PathVariable("slug") String slug,
                                    @RequestBody ShopDtos.UpdateShopRequest req){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User actor = (User) auth.getPrincipal();

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
            shops.save(shop);
            return ResponseEntity.ok(shop.getId());
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<?> delete(@PathVariable("slug") String slug){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User actor = (User) auth.getPrincipal();

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
            return ResponseEntity.ok(Map.of("message", "Shop deleted successfully"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
