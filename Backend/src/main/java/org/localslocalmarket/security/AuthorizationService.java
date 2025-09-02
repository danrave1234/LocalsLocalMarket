package org.localslocalmarket.security;

import java.util.Optional;

import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;

    public AuthorizationService(UserRepository userRepository, ShopRepository shopRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
    }

    /**
     * Get the currently authenticated user from SecurityContext
     * @return Optional containing the user if authenticated, empty otherwise
     */
    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            return Optional.empty();
        }
        return Optional.of((User) auth.getPrincipal());
    }

    /**
     * Get the current user or throw an exception if not authenticated
     * @return The authenticated user
     * @throws SecurityException if user is not authenticated
     */
    public User getCurrentUserOrThrow() {
        return getCurrentUser()
                .orElseThrow(() -> new SecurityException("User not authenticated"));
    }

    /**
     * Check if the current user has admin role
     * @return true if user is admin, false otherwise
     */
    public boolean isAdmin() {
        return getCurrentUser()
                .map(user -> User.Role.ADMIN.equals(user.getRole()))
                .orElse(false);
    }

    /**
     * Check if the current user has seller role
     * @return true if user is seller, false otherwise
     */
    public boolean isSeller() {
        return getCurrentUser()
                .map(user -> User.Role.SELLER.equals(user.getRole()))
                .orElse(false);
    }

    /**
     * Check if the current user is the owner of a shop
     * @param shopId The shop ID to check ownership
     * @return true if user owns the shop, false otherwise
     */
    public boolean isShopOwner(Long shopId) {
        return getCurrentUser()
                .flatMap(user -> shopRepository.findById(shopId)
                        .map(shop -> shop.getOwner() != null && shop.getOwner().getId().equals(user.getId())))
                .orElse(false);
    }

    /**
     * Check if the current user can manage a shop (owner or admin)
     * @param shopId The shop ID to check permissions
     * @return true if user can manage the shop, false otherwise
     */
    public boolean canManageShop(Long shopId) {
        return getCurrentUser()
                .map(user -> {
                    if (User.Role.ADMIN.equals(user.getRole())) {
                        return true;
                    }
                    return shopRepository.findById(shopId)
                            .map(shop -> shop.getOwner() != null && shop.getOwner().getId().equals(user.getId()))
                            .orElse(false);
                })
                .orElse(false);
    }

    /**
     * Check if the current user can manage a shop by slug
     * @param slug The shop slug to check permissions
     * @return true if user can manage the shop, false otherwise
     */
    public boolean canManageShopBySlug(String slug) {
        return getCurrentUser()
                .map(user -> {
                    if (User.Role.ADMIN.equals(user.getRole())) {
                        return true;
                    }
                    
                    // Try to parse as Long first (for backward compatibility)
                    try {
                        Long shopId = Long.parseLong(slug);
                        return shopRepository.findById(shopId)
                                .map(shop -> shop.getOwner() != null && shop.getOwner().getId().equals(user.getId()))
                                .orElse(false);
                    } catch (NumberFormatException e) {
                        // Handle slug format: "shop-name-123"
                        String[] parts = slug.split("-");
                        if (parts.length >= 2) {
                            try {
                                Long shopId = Long.parseLong(parts[parts.length - 1]);
                                return shopRepository.findById(shopId)
                                        .map(shop -> shop.getOwner() != null && shop.getOwner().getId().equals(user.getId()))
                                        .orElse(false);
                            } catch (NumberFormatException ex) {
                                // Fall back to name-based lookup
                                String shopName = slug.replace("-", " ");
                                return shopRepository.findByNameIgnoreCase(shopName)
                                        .map(shop -> shop.getOwner() != null && shop.getOwner().getId().equals(user.getId()))
                                        .orElse(false);
                            }
                        } else {
                            // Fall back to name-based lookup
                            String shopName = slug.replace("-", " ");
                            return shopRepository.findByNameIgnoreCase(shopName)
                                    .map(shop -> shop.getOwner() != null && shop.getOwner().getId().equals(user.getId()))
                                    .orElse(false);
                        }
                    }
                })
                .orElse(false);
    }

    /**
     * Verify that the current user can manage a shop, throw exception if not
     * @param shopId The shop ID to verify permissions
     * @throws SecurityException if user cannot manage the shop
     */
    public void verifyCanManageShop(Long shopId) {
        if (!canManageShop(shopId)) {
            throw new SecurityException("Insufficient permissions to manage this shop");
        }
    }

    /**
     * Verify that the current user can manage a shop by slug, throw exception if not
     * @param slug The shop slug to verify permissions
     * @throws SecurityException if user cannot manage the shop
     */
    public void verifyCanManageShopBySlug(String slug) {
        if (!canManageShopBySlug(slug)) {
            throw new SecurityException("Insufficient permissions to manage this shop");
        }
    }

    /**
     * Verify that the current user is authenticated, throw exception if not
     * @throws SecurityException if user is not authenticated
     */
    public void verifyAuthenticated() {
        if (!getCurrentUser().isPresent()) {
            throw new SecurityException("Authentication required");
        }
    }

    /**
     * Verify that the current user has admin role, throw exception if not
     * @throws SecurityException if user is not admin
     */
    public void verifyAdmin() {
        if (!isAdmin()) {
            throw new SecurityException("Admin privileges required");
        }
    }

    /**
     * Check if a user can access a specific resource
     * @param resourceOwnerId The ID of the resource owner
     * @return true if user can access the resource, false otherwise
     */
    public boolean canAccessResource(Long resourceOwnerId) {
        return getCurrentUser()
                .map(user -> {
                    if (User.Role.ADMIN.equals(user.getRole())) {
                        return true;
                    }
                    return user.getId().equals(resourceOwnerId);
                })
                .orElse(false);
    }

    /**
     * Verify that the current user can access a specific resource, throw exception if not
     * @param resourceOwnerId The ID of the resource owner
     * @throws SecurityException if user cannot access the resource
     */
    public void verifyCanAccessResource(Long resourceOwnerId) {
        if (!canAccessResource(resourceOwnerId)) {
            throw new SecurityException("Insufficient permissions to access this resource");
        }
    }
}
