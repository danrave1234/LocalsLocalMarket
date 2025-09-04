-- Create unauthenticated shop reviews table
CREATE TABLE unauthenticated_shop_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    review_text TEXT,
    reviewer_name VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent multiple reviews from same device
    UNIQUE KEY uk_shop_device (shop_id, device_id)
);

-- Create indexes for performance
CREATE INDEX idx_unauthenticated_shop_reviews_shop_id ON unauthenticated_shop_reviews(shop_id);
CREATE INDEX idx_unauthenticated_shop_reviews_created_at ON unauthenticated_shop_reviews(created_at);
CREATE INDEX idx_unauthenticated_shop_reviews_device_id ON unauthenticated_shop_reviews(device_id);
