-- Services table migration
-- Run this SQL script to create the services table

CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shop_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    main_category VARCHAR(100),
    subcategory VARCHAR(100),
    custom_category VARCHAR(100),
    status ENUM('AVAILABLE', 'NOT_AVAILABLE') DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Indexes for performance
CREATE INDEX idx_services_shop_id ON services(shop_id);
CREATE INDEX idx_services_category ON services(main_category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_active ON services(is_active);
