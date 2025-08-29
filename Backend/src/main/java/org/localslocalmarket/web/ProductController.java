package org.localslocalmarket.web;

import org.localslocalmarket.model.Product;
import org.localslocalmarket.model.Shop;
import org.localslocalmarket.repo.ProductRepository;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.model.User;
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

    public ProductController(ProductRepository products, ShopRepository shops){
        this.products = products;
        this.shops = shops;
    }

    @PostMapping
    @Caching(evict = {
            @CacheEvict(cacheNames = "products_list", allEntries = true),
            @CacheEvict(cacheNames = "products_by_id", allEntries = true)
    })
    public ResponseEntity<?> create(@RequestBody @Validated ProductDtos.CreateProductRequest req){
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User actor = (User) auth.getPrincipal();
        Shop shop = shops.findById(req.shopId()).orElseThrow();
        boolean isOwner = shop.getOwner() != null && shop.getOwner().getId().equals(actor.getId());
        boolean isAdmin = actor.getRole() == User.Role.ADMIN;
        if(!(isOwner || isAdmin)){
            return ResponseEntity.status(403).body("Forbidden");
        }
        Product p = new Product();
        p.setShop(shop);
        p.setTitle(req.title());
        p.setDescription(req.description());
        p.setPrice(req.price());
        if(req.stockCount() != null) p.setStockCount(req.stockCount());
        p.setImagePathsJson(req.imagePathsJson());
        p.setCategory(req.category());
        products.save(p);
        return ResponseEntity.ok(p.getId());
    }

    @Cacheable(cacheNames = "products_list", key = "'q=' + #q.orElse('') + '&category=' + #category.orElse('') + '&minPrice=' + (#minPrice.isPresent() ? #minPrice.get() : '') + '&maxPrice=' + (#maxPrice.isPresent() ? #maxPrice.get() : '') + '&shopId=' + (#shopId.isPresent() ? #shopId.get() : '') + '&page=' + #page + '&size=' + #size")
    @GetMapping
    public Page<Product> list(@RequestParam("q") Optional<String> q,
                              @RequestParam("category") Optional<String> category,
                              @RequestParam("minPrice") Optional<Double> minPrice,
                              @RequestParam("maxPrice") Optional<Double> maxPrice,
                              @RequestParam("shopId") Optional<Long> shopId,
                              @RequestParam(value = "page", defaultValue = "0") int page,
                              @RequestParam(value = "size", defaultValue = "20") int size){
        Specification<Product> spec = Specification.where((root, cq, cb) -> cb.equal(root.get("isActive"), true));
        if(q.isPresent()){
            String like = "%" + q.get().toLowerCase() + "%";
            spec = spec.and((root, cq, cb) -> cb.like(cb.lower(root.get("title")), like));
        }
        if(category.isPresent()){
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("category"), category.get()));
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
        return products.findAll(spec, PageRequest.of(page, size));
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
        return products.findById(id).<ResponseEntity<?>>map(p -> {
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

        return products.findById(id).<ResponseEntity<?>>map(p -> {
            boolean isOwner = p.getShop() != null && p.getShop().getOwner() != null && p.getShop().getOwner().getId().equals(actor.getId());
            boolean isAdmin = actor.getRole() == User.Role.ADMIN;
            if(!(isOwner || isAdmin)){
                return ResponseEntity.status(403).body("Forbidden");
            }
            if(req.title() != null) p.setTitle(req.title());
            if(req.description() != null) p.setDescription(req.description());
            if(req.price() != null) p.setPrice(req.price());
            if(req.stockCount() != null) p.setStockCount(req.stockCount());
            if(req.imagePathsJson() != null) p.setImagePathsJson(req.imagePathsJson());
            if(req.category() != null) p.setCategory(req.category());
            if(req.isActive() != null) p.setIsActive(req.isActive());
            products.save(p);
            return ResponseEntity.ok(p.getId());
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Cacheable(cacheNames = "products_by_id", key = "#id")
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable("id") Long id){
        return products.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
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

        return products.findById(id).<ResponseEntity<?>>map(p -> {
            boolean isOwner = p.getShop() != null && p.getShop().getOwner() != null && p.getShop().getOwner().getId().equals(actor.getId());
            boolean isAdmin = actor.getRole() == User.Role.ADMIN;
            if(!(isOwner || isAdmin)){
                return ResponseEntity.status(403).body("Forbidden");
            }
            products.delete(p);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
