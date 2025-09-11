package org.localslocalmarket.web.dto;

import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.Shop;

public class SuggestionDtos {
    public record SuggestionItem(
        Long id,
        String type, // "shop" or "service"
        String title,
        String subtitle,
        String imageUrl,
        String slug
    ){
        public static SuggestionItem fromShop(Shop shop){
            String slug = generateSlug(shop.getName(), shop.getId());
            return new SuggestionItem(
                shop.getId(),
                "shop",
                shop.getName(),
                shop.getCategory(),
                shop.getLogoPath(),
                slug
            );
        }
        public static SuggestionItem fromService(Service service){
            // No canonical slug for services yet; use ID-based slug
            String slug = String.valueOf(service.getId());
            return new SuggestionItem(
                service.getId(),
                "service",
                service.getTitle(),
                service.getMainCategory(),
                service.getImageUrl(),
                slug
            );
        }
        private static String generateSlug(String name, Long id){
            if(name == null){
                return String.valueOf(id);
            }
            String base = name.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-");
            base = base.replaceAll("^-+|-+$", "");
            return base + "-" + id;
        }
    }
}
