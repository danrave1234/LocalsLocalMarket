package org.localslocalmarket.repo;

import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    List<Shop> findByOwner(User owner);
    Optional<Shop> findByNameIgnoreCase(String name);
}
