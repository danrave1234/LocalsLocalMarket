package org.localslocalmarket.repo;

import org.localslocalmarket.model.ShopRating;
import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShopRatingRepository extends JpaRepository<ShopRating, Long> {
    Optional<ShopRating> findByUserAndShop(User user, Shop shop);
    Optional<ShopRating> findByUser_IdAndShop_Id(Long userId, Long shopId);
    long countByShop_Id(Long shopId);

    @Query("SELECT AVG(r.stars) FROM ShopRating r WHERE r.shop.id = :shopId")
    Double averageStarsByShop(@Param("shopId") Long shopId);
}