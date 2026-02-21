-- setup-database.sql
-- Run this in cPanel phpMyAdmin to create all necessary tables

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2),
    image_url VARCHAR(500),
    specifications TEXT,
    is_featured TINYINT(1) DEFAULT 0,
    is_popular TINYINT(1) DEFAULT 0,
    stock_status VARCHAR(50) DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    product_interest VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default categories
INSERT INTO categories (slug, name, description) VALUES
('laptops-desktops', 'Laptops & Desktops', 'Business and personal computers'),
('servers-storage', 'Servers & Storage', 'Enterprise servers and storage solutions'),
('printers-copiers', 'Printers & Copiers', 'Office printing solutions'),
('networking', 'Networking Equipment', 'Network infrastructure'),
('cctv-security', 'CCTV & Security', 'Surveillance and security systems'),
('accessories', 'Accessories & Parts', 'Computer peripherals and components')
ON DUPLICATE KEY UPDATE name=name;

-- Create first admin user (username: admin, password: admin123)
-- Password hash for 'admin123' - CHANGE THIS IMMEDIATELY!
INSERT INTO admin_users (username, password_hash, email, full_name) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@galaxylink.co.ke', 'Administrator')
ON DUPLICATE KEY UPDATE username=username;
