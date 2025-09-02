package org.localslocalmarket.web;

import org.localslocalmarket.model.Product;
import org.localslocalmarket.model.Shop;
import org.localslocalmarket.repo.ProductRepository;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.model.User;
import org.localslocalmarket.security.AuthorizationService;
import org.localslocalmarket.security.AuditService;
import org.localslocalmarket.security.InputValidationService;
import org.localslocalmarket.web.dto.ProductDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository products;
    private final ShopRepository shops;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;
    private final InputValidationService inputValidationService;

    public ProductController(ProductRepository products, ShopRepository shops,
                           AuthorizationService authorizationService,
                           AuditService auditService,
                           InputValidationService inputValidationService){
        this.products = products;
        this.shops = shops;
        this.authorizationService = authorizationService;
        this.auditService = auditService;
        this.inputValidationService = inputValidationService;
    }

    @PostMapping
    @Caching(evict = {
            @CacheEvict(cacheNames = "products_list", allEntries = true),
            @CacheEvict(cacheNames = "products_by_id", allEntries = true)
    })
    public ResponseEntity<?> create(@RequestBody @Validated ProductDtos.CreateProductRequest req){
        try {
            User actor = authorizationService.getCurrentUserOrThrow();
            
            // Verify shop exists and user has permission to manage it
            Shop shop = shops.findById(req.shopId()).orElseThrow();
            authorizationService.verifyCanManageShop(shop.getId());
            
            // Validate and sanitize input
            String validatedTitle = inputValidationService.validateName(req.title());
            String validatedDescription = inputValidationService.validateDescription(req.description());
            java.math.BigDecimal validatedPrice = inputValidationService.validatePrice(req.price());
            Integer validatedStockCount = inputValidationService.validateStockCount(req.stockCount());
            String validatedImagePathsJson = inputValidationService.validateJsonString(req.imagePathsJson());
            
            // Handle category fields - support both legacy and new hierarchical system
            String validatedCategory = req.category() != null ? inputValidationService.validateCategory(req.category()) : null;
            String validatedMainCategory = req.mainCategory() != null ? inputValidationService.validateCategory(req.mainCategory()) : null;
            String validatedSubcategory = req.subcategory() != null ? inputValidationService.validateCategory(req.subcategory()) : null;
            String validatedCustomCategory = req.customCategory() != null ? inputValidationService.validateCategory(req.customCategory()) : null;
            
            Product p = new Product();
            p.setShop(shop);
            p.setTitle(validatedTitle);
            p.setDescription(validatedDescription);
            p.setPrice(validatedPrice);
            if(validatedStockCount != null) p.setStockCount(validatedStockCount);
            p.setImagePathsJson(validatedImagePathsJson);
            
            // Set category fields
            if (validatedCategory != null) {
                p.setCategory(validatedCategory);
            }
            if (validatedMainCategory != null) {
                p.setMainCategory(validatedMainCategory);
            }
            if (validatedSubcategory != null) {
                p.setSubcategory(validatedSubcategory);
            }
            if (validatedCustomCategory != null) {
                p.setCustomCategory(validatedCustomCategory);
            }
            
            products.save(p);
            
            // Log the action
            auditService.logUserAction(AuditService.AuditEventType.PRODUCT_CREATE, 
                    actor.getId().toString(), "CREATE", "product:" + p.getId());
            
            return ResponseEntity.ok(ProductDtos.ProductResponse.fromProduct(p));
        } catch (SecurityException e) {
            auditService.logPermissionDenied("unknown", "/api/products", "CREATE");
            return ResponseEntity.status(401).body("Unauthorized");
        } catch (IllegalArgumentException e) {
            auditService.logSuspiciousActivity("unknown", "product_creation", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        }
    }

    @Cacheable(cacheNames = "products_list", key = "'q=' + #q.orElse('') + '&category=' + #category.orElse('') + '&mainCategory=' + #mainCategory.orElse('') + '&subcategory=' + #subcategory.orElse('') + '&minPrice=' + (#minPrice.isPresent() ? #minPrice.get() : '') + '&maxPrice=' + (#maxPrice.isPresent() ? #maxPrice.get() : '') + '&shopId=' + (#shopId.isPresent() ? #shopId.get() : '') + '&page=' + #page + '&size=' + #size")
    @GetMapping
    public Page<ProductDtos.ProductResponse> list(@RequestParam("q") Optional<String> q,
                                                  @RequestParam("category") Optional<String> category,
                                                  @RequestParam("mainCategory") Optional<String> mainCategory,
                                                  @RequestParam("subcategory") Optional<String> subcategory,
                                                  @RequestParam("minPrice") Optional<Double> minPrice,
                                                  @RequestParam("maxPrice") Optional<Double> maxPrice,
                                                  @RequestParam("shopId") Optional<Long> shopId,
                                                  @RequestParam(value = "page", defaultValue = "0") int page,
                                                  @RequestParam(value = "size", defaultValue = "20") int size){
        
        Page<Product> productPage;
        
        // If only shopId filter is applied, use the optimized query
        if (shopId.isPresent() && !q.isPresent() && !category.isPresent() && !mainCategory.isPresent() && !subcategory.isPresent() && !minPrice.isPresent() && !maxPrice.isPresent()) {
            productPage = products.findAllActiveByShopIdWithShop(shopId.get(), PageRequest.of(page, size));
        } else {
            // Use specification for complex queries
            Specification<Product> spec = Specification.where((root, cq, cb) -> cb.equal(root.get("isActive"), true));
            if(q.isPresent()){
                String like = "%" + q.get().toLowerCase() + "%";
                spec = spec.and((root, cq, cb) -> cb.like(cb.lower(root.get("title")), like));
            }
            if(category.isPresent()){
                spec = spec.and((root, cq, cb) -> cb.equal(root.get("category"), category.get()));
            }
            if(mainCategory.isPresent()){
                spec = spec.and((root, cq, cb) -> cb.equal(root.get("mainCategory"), mainCategory.get()));
            }
            if(subcategory.isPresent()){
                spec = spec.and((root, cq, cb) -> cb.equal(root.get("subcategory"), subcategory.get()));
            }
            if(minPrice.isPresent()){
                spec = spec.and((root, cq, cb) -> cb.ge(root.get("price"), minPrice.get()));
            }
            if(maxPrice.isPresent()){
                spec = spec.and((root, cq, cb) -> cb.le(root.get("price"), maxPrice.get()));
            }
            if(shopId.isPresent()){
                spec = spec.and((root, cq, cb) -> cb.equal(root.get("shop").get("id"), shopId.get()));
            }
            productPage = products.findAll(spec, PageRequest.of(page, size));
        }
        
        return productPage.map(ProductDtos.ProductResponse::fromProduct);
    }

    @PostMapping("/{id}/decrement-stock")
    @Caching(evict = {
            @CacheEvict(cacheNames = "products_by_id", key = "#id"),
            @CacheEvict(cacheNames = "products_list", allEntries = true)
    })
    public ResponseEntity<?> decrementStock(@PathVariable("id") Long id,
                                            @RequestParam(value = "amount", defaultValue = "1") int amount){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User actor = (User) auth.getPrincipal();
        if (amount <= 0) amount = 1;
        final int dec = amount;
        return products.findByIdWithShopAndOwner(id).<ResponseEntity<?>>map(p -> {
            boolean isOwner = p.getShop() != null && p.getShop().getOwner() != null && p.getShop().getOwner().getId().equals(actor.getId());
            boolean isAdmin = actor.getRole() == User.Role.ADMIN;
            if(!(isOwner || isAdmin)){
                return ResponseEntity.status(403).body("Forbidden");
            }
            int current = p.getStockCount() == null ? 0 : p.getStockCount();
            int next = Math.max(0, current - dec);
            p.setStockCount(next);
            products.save(p);
            return ResponseEntity.ok(java.util.Map.of("stockCount", next));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Caching(evict = {
            @CacheEvict(cacheNames = "products_by_id", key = "#id"),
            @CacheEvict(cacheNames = "products_list", allEntries = true)
    })
    public ResponseEntity<?> update(@PathVariable("id") Long id,
                                    @RequestBody ProductDtos.UpdateProductRequest req){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User actor = (User) auth.getPrincipal();

        return products.findByIdWithShopAndOwner(id).<ResponseEntity<?>>map(p -> {
            boolean isOwner = p.getShop() != null && p.getShop().getOwner() != null && p.getShop().getOwner().getId().equals(actor.getId());
            boolean isAdmin = actor.getRole() == User.Role.ADMIN;
            if(!(isOwner || isAdmin)){
                return ResponseEntity.status(403).body("Forbidden");
            }
            if(req.title() != null) p.setTitle(req.title());
            if(req.description() != null) p.setDescription(req.description());
            if(req.price() != null) {
                if(req.price().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                    return ResponseEntity.badRequest().body("Price must be greater than 0");
                }
                p.setPrice(req.price());
            }
            if(req.stockCount() != null) p.setStockCount(req.stockCount());
            if(req.imagePathsJson() != null) p.setImagePathsJson(req.imagePathsJson());
            
            // Handle category fields - support both legacy and new hierarchical system
            if(req.category() != null) p.setCategory(req.category());
            if(req.mainCategory() != null) p.setMainCategory(req.mainCategory());
            if(req.subcategory() != null) p.setSubcategory(req.subcategory());
            if(req.customCategory() != null) p.setCustomCategory(req.customCategory());
            
            if(req.isActive() != null) p.setIsActive(req.isActive());
            products.save(p);
            return ResponseEntity.ok(ProductDtos.ProductResponse.fromProduct(p));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Cacheable(cacheNames = "products_by_id", key = "#id")
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable("id") Long id){
        return products.findById(id)
                .<ResponseEntity<?>>map(product -> ResponseEntity.ok(ProductDtos.ProductResponse.fromProduct(product)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Caching(evict = {
            @CacheEvict(cacheNames = "products_by_id", key = "#id"),
            @CacheEvict(cacheNames = "products_list", allEntries = true)
    })
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User actor = (User) auth.getPrincipal();

        return products.findByIdWithShopAndOwner(id).<ResponseEntity<?>>map(p -> {
            boolean isOwner = p.getShop() != null && p.getShop().getOwner() != null && p.getShop().getOwner().getId().equals(actor.getId());
            boolean isAdmin = actor.getRole() == User.Role.ADMIN;
            if(!(isOwner || isAdmin)){
                return ResponseEntity.status(403).body("Forbidden");
            }
            products.delete(p);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // New category-based endpoints
    @GetMapping("/categories/main")
    public ResponseEntity<?> getMainCategories() {
        java.util.List<String> mainCategories = products.findAllDistinctMainCategories();
        return ResponseEntity.ok(mainCategories);
    }
    
    @GetMapping("/categories/subcategories")
    public ResponseEntity<?> getSubcategories(@RequestParam("mainCategory") String mainCategory) {
        java.util.List<String> subcategories = products.findAllDistinctSubcategoriesByMainCategory(mainCategory);
        return ResponseEntity.ok(subcategories);
    }
    
    @GetMapping("/by-category/{mainCategory}")
    public Page<ProductDtos.ProductResponse> getProductsByMainCategory(
            @PathVariable("mainCategory") String mainCategory,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Page<Product> productPage = products.findAllActiveByMainCategory(mainCategory, PageRequest.of(page, size));
        return productPage.map(ProductDtos.ProductResponse::fromProduct);
    }
    
    @GetMapping("/by-category/{mainCategory}/{subcategory}")
    public Page<ProductDtos.ProductResponse> getProductsByMainCategoryAndSubcategory(
            @PathVariable("mainCategory") String mainCategory,
            @PathVariable("subcategory") String subcategory,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Page<Product> productPage = products.findAllActiveByMainCategoryAndSubcategory(mainCategory, subcategory, PageRequest.of(page, size));
        return productPage.map(ProductDtos.ProductResponse::fromProduct);
    }
}
