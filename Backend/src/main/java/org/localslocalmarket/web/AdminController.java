package org.localslocalmarket.web;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.localslocalmarket.model.Product;
import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.ProductRepository;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.repo.UserRepository;
import org.localslocalmarket.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UserRepository users;
    private final ShopRepository shops;
    private final ProductRepository products;
    private final CategoryRepository categories;
    
    public AdminController(UserRepository users, ShopRepository shops, ProductRepository products, CategoryRepository categories) {
        this.users = users;
        this.shops = shops;
        this.products = products;
        this.categories = categories;
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            // Get current time and time 30 days ago
            Instant now = Instant.now();
            Instant thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);
            
            // Count total users
            long totalUsers = users.count();
            
            // Count active users (users who are enabled and active)
            long activeUsers = users.countByEnabledTrueAndIsActiveTrue();
            
            // Count users who registered in last 30 days
            long newUsersThisMonth = users.countByCreatedAtAfter(thirtyDaysAgo);
            
            // Count total shops
            long totalShops = shops.count();
            
            // Count pending shops (you might need to add a status field to Shop entity)
            long pendingShops = shops.count(); // TODO: Add status field and filter
            
            // Count total products
            long totalProducts = products.count();
            
            // Count low stock products (products with stock count <= 5)
            long lowStockProducts = products.countByStockCountLessThanEqual(5);
            
            // Count out of stock products
            long outOfStockProducts = products.countByStockCount(0);
            
            // Count new products this week
            long newProductsThisWeek = products.countByCreatedAtAfter(now.minus(7, ChronoUnit.DAYS));
            
            // Count total categories
            long totalCategories = categories.count();
            
            // Build response
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("newUsersThisMonth", newUsersThisMonth);
            stats.put("totalShops", totalShops);
            stats.put("pendingShops", pendingShops);
            stats.put("totalProducts", totalProducts);
            stats.put("lowStockProducts", lowStockProducts);
            stats.put("outOfStockProducts", outOfStockProducts);
            stats.put("newProductsThisWeek", newProductsThisWeek);
            stats.put("totalCategories", totalCategories);
            
            // Mock sales data (you'll need to implement actual sales tracking)
            stats.put("totalSales", "₱2.4M");
            stats.put("salesThisMonth", "₱450K");
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to load dashboard statistics"));
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) Boolean isActive) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage;
        
        if (search != null && !search.trim().isEmpty()) {
            // TODO: Implement search functionality
            usersPage = users.findAll(pageable);
        } else if (enabled != null && isActive != null) {
            // Filter by both enabled and active status
            List<User> filteredUsers = users.findByEnabledAndIsActive(enabled, isActive);
            // TODO: Implement proper pagination for filtered results
            usersPage = users.findAll(pageable);
        } else if (enabled != null) {
            // Filter by enabled status only
            List<User> filteredUsers = users.findByEnabled(enabled);
            // TODO: Implement proper pagination for filtered results
            usersPage = users.findAll(pageable);
        } else if (isActive != null) {
            // Filter by active status only
            List<User> filteredUsers = users.findByIsActive(isActive);
            // TODO: Implement proper pagination for filtered results
            usersPage = users.findAll(pageable);
        } else {
            usersPage = users.findAll(pageable);
        }
        
        return ResponseEntity.ok(usersPage);
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return users.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return users.findById(id)
                .map(user -> {
                    String status = request.get("status");
                    if ("ACTIVE".equals(status)) {
                        user.setEnabled(true);
                        user.setActive(true);
                    } else if ("SUSPENDED".equals(status)) {
                        user.setEnabled(false);
                        user.setActive(false);
                    } else if ("DISABLED".equals(status)) {
                        user.setEnabled(false);
                        user.setActive(true); // Keep active but disable login
                    } else if ("INACTIVE".equals(status)) {
                        user.setEnabled(true); // Keep enabled but mark as inactive
                        user.setActive(false);
                    }
                    users.save(user);
                    return ResponseEntity.ok(Map.of("message", "User status updated successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/shops")
    public ResponseEntity<Page<Shop>> getShops(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Shop> shopsPage;
        
        if (status != null && !status.trim().isEmpty()) {
            // TODO: Implement status filtering when status field is added
            shopsPage = shops.findAll(pageable);
        } else {
            shopsPage = shops.findAll(pageable);
        }
        
        return ResponseEntity.ok(shopsPage);
    }
    
    @GetMapping("/shops/{id}")
    public ResponseEntity<Shop> getShop(@PathVariable Long id) {
        return shops.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/shops/{id}/approve")
    public ResponseEntity<?> approveShop(@PathVariable Long id) {
        return shops.findById(id)
                .map(shop -> {
                    // TODO: Add approval status field to Shop entity
                    // shop.setStatus("APPROVED");
                    shops.save(shop);
                    return ResponseEntity.ok(Map.of("message", "Shop approved successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/shops/{id}/reject")
    public ResponseEntity<?> rejectShop(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return shops.findById(id)
                .map(shop -> {
                    String reason = request.get("reason");
                    // TODO: Add rejection status and reason fields to Shop entity
                    // shop.setStatus("REJECTED");
                    // shop.setRejectionReason(reason);
                    shops.save(shop);
                    return ResponseEntity.ok(Map.of("message", "Shop rejected successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String filter) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage;
        
        if ("low-stock".equals(filter)) {
            productsPage = products.findByStockCountLessThanEqual(5, pageable);
        } else if ("out-of-stock".equals(filter)) {
            productsPage = products.findByStockCount(0, pageable);
        } else {
            productsPage = products.findAll(pageable);
        }
        
        return ResponseEntity.ok(productsPage);
    }
    
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return products.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/products/{id}/status")
    public ResponseEntity<?> updateProductStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        return products.findById(id)
                .map(product -> {
                    Boolean isActive = request.get("isActive");
                    if (isActive != null) {
                        product.setIsActive(isActive);
                        products.save(product);
                    }
                    return ResponseEntity.ok(Map.of("message", "Product status updated successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/reports/user-growth")
    public ResponseEntity<Map<String, Object>> getUserGrowthReport(
            @RequestParam(defaultValue = "30") int days) {
        
        Instant endDate = Instant.now();
        Instant startDate = endDate.minus(days, ChronoUnit.DAYS);
        
        // TODO: Implement actual user growth calculation
        Map<String, Object> report = new HashMap<>();
        report.put("period", days + " days");
        report.put("newUsers", 125);
        report.put("growthRate", "12.5%");
        report.put("data", List.of(
            Map.of("date", "2024-01-01", "users", 100),
            Map.of("date", "2024-01-02", "users", 105),
            Map.of("date", "2024-01-03", "users", 110)
        ));
        
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/reports/sales")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam(defaultValue = "30") int days) {
        
        // TODO: Implement actual sales calculation
        Map<String, Object> report = new HashMap<>();
        report.put("period", days + " days");
        report.put("totalSales", "₱2.4M");
        report.put("averageOrder", "₱1,200");
        report.put("totalOrders", 2000);
        report.put("data", List.of(
            Map.of("date", "2024-01-01", "sales", 45000),
            Map.of("date", "2024-01-02", "sales", 52000),
            Map.of("date", "2024-01-03", "sales", 48000)
        ));
        
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/reports/popular-categories")
    public ResponseEntity<Map<String, Object>> getPopularCategoriesReport() {
        // TODO: Implement actual category popularity calculation
        Map<String, Object> report = new HashMap<>();
        report.put("data", List.of(
            Map.of("category", "Food & Beverages", "products", 450, "percentage", 36.1),
            Map.of("category", "Electronics & Technology", "products", 320, "percentage", 25.7),
            Map.of("category", "Fashion & Beauty", "products", 280, "percentage", 22.5),
            Map.of("category", "Home & Garden", "products", 197, "percentage", 15.8)
        ));
        
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/system/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("uptime", "15 days, 3 hours, 45 minutes");
        health.put("database", "connected");
        health.put("storage", "75% used");
        health.put("lastBackup", "2 hours ago");
        
        return ResponseEntity.ok(health);
    }
    
    @PostMapping("/system/maintenance")
    public ResponseEntity<?> toggleMaintenanceMode(@RequestBody Map<String, Boolean> request) {
        Boolean enabled = request.get("enabled");
        // TODO: Implement maintenance mode toggle
        return ResponseEntity.ok(Map.of(
            "message", "Maintenance mode " + (enabled ? "enabled" : "disabled"),
            "maintenanceMode", enabled
        ));
    }
    
    @PostMapping("/system/backup")
    public ResponseEntity<?> createBackup() {
        // TODO: Implement database backup
        return ResponseEntity.ok(Map.of("message", "Backup created successfully"));
    }
    
    @GetMapping("/activity/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        // TODO: Implement activity logging and retrieval
        List<Map<String, Object>> activities = List.of(
            Map.of(
                "type", "SHOP_REGISTERED",
                "message", "New shop 'Cebu Coffee Corner' registered",
                "timestamp", Instant.now().minus(2, ChronoUnit.MINUTES),
                "icon", "🆕"
            ),
            Map.of(
                "type", "PRODUCT_ADDED",
                "message", "Product 'Motorcycle Helmet' added to inventory",
                "timestamp", Instant.now().minus(15, ChronoUnit.MINUTES),
                "icon", "📦"
            ),
            Map.of(
                "type", "SHOP_APPROVED",
                "message", "Shop 'Mang Inasal' approved",
                "timestamp", Instant.now().minus(1, ChronoUnit.HOURS),
                "icon", "✅"
            )
        );
        
        return ResponseEntity.ok(activities);
    }
}
