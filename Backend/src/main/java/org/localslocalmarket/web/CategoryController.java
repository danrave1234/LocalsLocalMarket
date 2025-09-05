package org.localslocalmarket.web;

import org.localslocalmarket.model.Category;
import org.localslocalmarket.model.User;
import org.localslocalmarket.repository.CategoryRepository;
import org.localslocalmarket.web.dto.CategoryDtos;
import org.localslocalmarket.service.CacheInvalidationService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private final CategoryRepository categories;
    private final ObjectMapper objectMapper;
    private final CacheInvalidationService cacheInvalidationService;
    
    public CategoryController(CategoryRepository categories, ObjectMapper objectMapper, CacheInvalidationService cacheInvalidationService) {
        this.categories = categories;
        this.objectMapper = objectMapper;
        this.cacheInvalidationService = cacheInvalidationService;
    }
    
    @Cacheable(cacheNames = "categories", key = "'all'")
    @GetMapping
    public ResponseEntity<CategoryDtos.CategoryListResponse> getAllCategories() {
        List<Category> allCategories = categories.findByIsActiveTrueOrderBySortOrderAsc();
        List<CategoryDtos.CategoryResponse> categoryResponses = allCategories.stream()
                .map(CategoryDtos.CategoryResponse::fromCategory)
                .collect(Collectors.toList());
        
        // Build category tree
        List<CategoryDtos.CategoryTreeResponse> categoryTree = buildCategoryTree(allCategories);
        
        return ResponseEntity.ok(new CategoryDtos.CategoryListResponse(categoryResponses, categoryTree));
    }
    
    @Cacheable(cacheNames = "categories", key = "'main'")
    @GetMapping("/main")
    public ResponseEntity<List<CategoryDtos.CategoryResponse>> getMainCategories() {
        List<Category> mainCategories = categories.findAllActiveMainCategories();
        List<CategoryDtos.CategoryResponse> responses = mainCategories.stream()
                .map(CategoryDtos.CategoryResponse::fromCategory)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @Cacheable(cacheNames = "categories", key = "'subcategories_' + #parentCategory")
    @GetMapping("/subcategories/{parentCategory}")
    public ResponseEntity<List<CategoryDtos.CategoryResponse>> getSubcategories(@PathVariable String parentCategory) {
        List<Category> subcategories = categories.findSubcategoriesByParent(parentCategory);
        List<CategoryDtos.CategoryResponse> responses = subcategories.stream()
                .map(CategoryDtos.CategoryResponse::fromCategory)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDtos.CategoryResponse> getCategory(@PathVariable Long id) {
        return categories.findById(id)
                .map(CategoryDtos.CategoryResponse::fromCategory)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CategoryDtos.CategoryResponse> createCategory(@RequestBody @Validated CategoryDtos.CreateCategoryRequest req) {
        // Check if category name already exists
        if (categories.existsByName(req.name())) {
            return ResponseEntity.badRequest().build();
        }
        
        Category category = new Category();
        category.setName(req.name());
        category.setDisplayName(req.displayName());
        category.setDescription(req.description());
        category.setIcon(req.icon());
        category.setType(req.type());
        category.setParentCategory(req.parentCategory());
        category.setSubcategoriesJson(req.subcategoriesJson());
        category.setSortOrder(req.sortOrder());
        category.setIsSystem(false);
        
        // Set created by (admin)
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            User admin = (User) auth.getPrincipal();
            category.setCreatedBy(admin.getEmail());
        }
        
        Category savedCategory = categories.save(category);
        
        // Smart cache invalidation
        cacheInvalidationService.onCategoryDataChanged();
        
        return ResponseEntity.ok(CategoryDtos.CategoryResponse.fromCategory(savedCategory));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDtos.CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody @Validated CategoryDtos.UpdateCategoryRequest req) {
        return categories.findById(id)
                .map(category -> {
                    if (req.displayName() != null) category.setDisplayName(req.displayName());
                    if (req.description() != null) category.setDescription(req.description());
                    if (req.icon() != null) category.setIcon(req.icon());
                    if (req.type() != null) category.setType(req.type());
                    if (req.parentCategory() != null) category.setParentCategory(req.parentCategory());
                    if (req.subcategoriesJson() != null) category.setSubcategoriesJson(req.subcategoriesJson());
                    if (req.sortOrder() != null) category.setSortOrder(req.sortOrder());
                    if (req.isActive() != null) category.setIsActive(req.isActive());
                    
                    Category savedCategory = categories.save(category);
                    
                    // Smart cache invalidation
                    cacheInvalidationService.onCategoryDataChanged();
                    
                    return ResponseEntity.ok(CategoryDtos.CategoryResponse.fromCategory(savedCategory));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categories.findById(id)
                .map(category -> {
                    // Don't allow deletion of system categories
                    if (category.getIsSystem()) {
                        return ResponseEntity.badRequest().body("Cannot delete system categories");
                    }
                    categories.delete(category);
                    
                    // Smart cache invalidation
                    cacheInvalidationService.onCategoryDataChanged();
                    
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/initialize")
    @Caching(evict = {
            @CacheEvict(cacheNames = "categories", allEntries = true)
    })
    public ResponseEntity<?> initializeCategories() {
        // Check if categories already exist
        if (!categories.findAll().isEmpty()) {
            return ResponseEntity.badRequest().body("Categories already initialized");
        }
        
        List<Category> initialCategories = createInitialCategories();
        categories.saveAll(initialCategories);
        
        return ResponseEntity.ok(Map.of("message", "Categories initialized successfully", "count", initialCategories.size()));
    }
    
    private List<Category> createInitialCategories() {
        List<Category> categories = new ArrayList<>();
        
        // Food & Dining Categories
        categories.add(createCategory("food-beverages", "Food & Beverages", "Restaurants, cafes, food delivery, and beverage shops", "🍽️", "MAIN", null, 
                "[\"Restaurants & Cafes\", \"Street Food & Snacks\", \"Bakery & Pastries\", \"Fresh Produce\", \"Meat & Seafood\", \"Dairy & Eggs\", \"Groceries & Pantry\", \"Beverages & Drinks\", \"Alcoholic Beverages\", \"Coffee & Tea\", \"Ice Cream & Desserts\", \"Catering Services\", \"Food Delivery\", \"Organic & Health Foods\"]", 1, true));
        
        // Automotive & Transportation
        categories.add(createCategory("automotive-transportation", "Automotive & Transportation", "Car and motorcycle parts, services, and accessories", "🚗", "MAIN", null,
                "[\"Motorcycle Parts\", \"Car Parts & Accessories\", \"Automotive Services\", \"Motorcycle Services\", \"Vehicle Maintenance\", \"Tires & Wheels\", \"Automotive Electronics\", \"Motorcycle Accessories\", \"Car Accessories\", \"Vehicle Detailing\"]", 2, true));
        
        // Electronics & Technology
        categories.add(createCategory("electronics-technology", "Electronics & Technology", "Mobile phones, computers, and electronic devices", "📱", "MAIN", null,
                "[\"Mobile Phones\", \"Computers & Laptops\", \"Electronics Accessories\", \"Home Electronics\", \"Gaming & Entertainment\", \"Audio & Video\", \"Computer Parts\", \"Smart Home Devices\", \"Cameras & Photography\", \"Office Electronics\", \"Repair Services\", \"Software & Apps\"]", 3, true));
        
        // Fashion & Beauty
        categories.add(createCategory("fashion-beauty", "Fashion & Beauty", "Clothing, accessories, beauty products, and fashion services", "👗", "MAIN", null,
                "[\"Clothing & Apparel\", \"Shoes & Footwear\", \"Jewelry & Accessories\", \"Beauty Products\", \"Cosmetics & Makeup\", \"Hair Care & Styling\", \"Skin Care\", \"Perfumes & Fragrances\", \"Watches & Timepieces\", \"Bags & Handbags\", \"Fashion Accessories\", \"Wedding & Formal Wear\", \"Sportswear\", \"Vintage & Thrift\", \"Fashion Services\"]", 4, true));
        
        // Home & Garden
        categories.add(createCategory("home-garden", "Home & Garden", "Furniture, home appliances, garden supplies, and home services", "🏠", "MAIN", null,
                "[\"Furniture & Decor\", \"Home Appliances\", \"Kitchen & Dining\", \"Bedding & Linens\", \"Garden & Outdoor\", \"Tools & Hardware\", \"Home Improvement\", \"Cleaning Supplies\", \"Lighting & Electrical\", \"Bathroom & Kitchen\", \"Pet Supplies\", \"Home Services\"]", 5, true));
        
        // Health & Wellness
        categories.add(createCategory("health-wellness", "Health & Wellness", "Medical supplies, fitness equipment, and wellness products", "💊", "MAIN", null,
                "[\"Health & Beauty\", \"Medical Supplies\", \"Fitness & Sports\", \"Vitamins & Supplements\", \"Personal Care\", \"Dental Care\", \"Medical Services\", \"Wellness Products\", \"Alternative Medicine\", \"Health Equipment\"]", 6, true));
        
        // Services
        categories.add(createCategory("services", "Services", "Professional services, home services, and business services", "🔧", "MAIN", null,
                "[\"Professional Services\", \"Home Services\", \"Beauty Services\", \"Automotive Services\", \"Educational Services\", \"Financial Services\", \"Legal Services\", \"Cleaning Services\", \"Repair Services\", \"Event Services\", \"Photography Services\", \"Printing Services\", \"Security Services\", \"Transportation Services\", \"Consulting Services\"]", 7, true));
        
        // Entertainment & Recreation
        categories.add(createCategory("entertainment-recreation", "Entertainment & Recreation", "Sports, books, toys, and entertainment services", "🎮", "MAIN", null,
                "[\"Sports & Recreation\", \"Books & Stationery\", \"Toys & Games\", \"Music & Instruments\", \"Movies & Entertainment\", \"Hobbies & Crafts\", \"Fitness & Gym\", \"Outdoor Activities\", \"Gaming & Arcade\", \"Entertainment Services\"]", 8, true));
        
        // Business & Professional
        categories.add(createCategory("business-professional", "Business & Professional", "Office supplies, business services, and professional tools", "💼", "MAIN", null,
                "[\"Office Supplies\", \"Business Services\", \"Industrial Equipment\", \"Construction Materials\", \"Professional Tools\", \"Business Technology\", \"Commercial Services\", \"Industrial Supplies\"]", 9, true));
        
        // Specialty & Niche
        categories.add(createCategory("specialty-niche", "Specialty & Niche", "Antiques, art, cultural products, and specialty items", "🎨", "MAIN", null,
                "[\"Antiques & Collectibles\", \"Art & Crafts\", \"Religious Items\", \"Cultural Products\", \"Specialty Foods\", \"Handmade Products\", \"Vintage Items\", \"Imported Goods\", \"Local Products\", \"Custom Services\"]", 10, true));
        
        return categories;
    }
    
    private Category createCategory(String name, String displayName, String description, String icon, String type, String parentCategory, String subcategoriesJson, Integer sortOrder, Boolean isSystem) {
        Category category = new Category();
        category.setName(name);
        category.setDisplayName(displayName);
        category.setDescription(description);
        category.setIcon(icon);
        category.setType(type);
        category.setParentCategory(parentCategory);
        category.setSubcategoriesJson(subcategoriesJson);
        category.setSortOrder(sortOrder);
        category.setIsSystem(isSystem);
        category.setCreatedBy("system");
        return category;
    }
    
    private List<CategoryDtos.CategoryTreeResponse> buildCategoryTree(List<Category> allCategories) {
        Map<String, List<String>> categoryMap = new HashMap<>();
        
        for (Category category : allCategories) {
            if ("MAIN".equals(category.getType()) && category.getSubcategoriesJson() != null) {
                try {
                    List<String> subcategories = objectMapper.readValue(category.getSubcategoriesJson(), new TypeReference<List<String>>() {});
                    categoryMap.put(category.getName(), subcategories);
                } catch (Exception e) {
                    // Handle JSON parsing error
                    categoryMap.put(category.getName(), new ArrayList<>());
                }
            }
        }
        
        return categoryMap.entrySet().stream()
                .map(entry -> {
                    Category mainCategory = allCategories.stream()
                            .filter(c -> c.getName().equals(entry.getKey()))
                            .findFirst()
                            .orElse(null);
                    
                    if (mainCategory != null) {
                        return new CategoryDtos.CategoryTreeResponse(
                                mainCategory.getName(),
                                mainCategory.getDisplayName(),
                                mainCategory.getIcon(),
                                mainCategory.getDescription(),
                                entry.getValue()
                        );
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
