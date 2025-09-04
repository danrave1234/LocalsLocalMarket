package org.localslocalmarket.repo;

import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.UnauthenticatedShopReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnauthenticatedShopReviewRepository extends JpaRepository<UnauthenticatedShopReview, Long> {
    Optional<UnauthenticatedShopReview> findByShopIdAndDeviceId(Long shopId, String deviceId);
    List<UnauthenticatedShopReview> findByShopIdOrderByCreatedAtDesc(Long shopId);
    long countByShopId(Long shopId);

    @Query("SELECT AVG(r.stars) FROM UnauthenticatedShopReview r WHERE r.shop.id = :shopId")
    Double averageStarsByShopId(@Param("shopId") Long shopId);
}
