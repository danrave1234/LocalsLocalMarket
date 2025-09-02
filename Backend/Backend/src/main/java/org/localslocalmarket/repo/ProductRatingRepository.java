package org.localslocalmarket.repo;

import org.localslocalmarket.model.ProductRating;
import org.localslocalmarket.model.Product;
import org.localslocalmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {
    Optional<ProductRating> findByUserAndProduct(User user, Product product);
    Optional<ProductRating> findByUser_IdAndProduct_Id(Long userId, Long productId);
    long countByProduct_Id(Long productId);

    @Query("SELECT AVG(r.stars) FROM ProductRating r WHERE r.product.id = :productId")
    Double averageStarsByProduct(@Param("productId") Long productId);
}
