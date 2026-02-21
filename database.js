// database.js - SQLite Database Setup
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'galaxy_products.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10, 2),
        image_url TEXT,
        specifications TEXT,
        is_featured BOOLEAN DEFAULT 0,
        is_popular BOOLEAN DEFAULT 0,
        stock_status TEXT DEFAULT 'in_stock',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Admin users table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Inquiries/Contact form submissions
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        product_interest TEXT,
        status TEXT DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        responded_at DATETIME
      )
    `);

    // Insert default categories
    const categories = [
      ['laptops-desktops', 'Laptops & Desktops', 'Business and personal computers'],
      ['servers-storage', 'Servers & Storage', 'Enterprise servers and storage solutions'],
      ['printers-copiers', 'Printers & Copiers', 'Office printing solutions'],
      ['networking', 'Networking Equipment', 'Network infrastructure'],
      ['cctv-security', 'CCTV & Security', 'Surveillance and security systems'],
      ['accessories', 'Accessories & Parts', 'Computer peripherals and components']
    ];

    const insertCategory = db.prepare(
      'INSERT OR IGNORE INTO categories (slug, name, description) VALUES (?, ?, ?)'
    );

    categories.forEach(cat => {
      insertCategory.run(cat);
    });

    insertCategory.finalize();

    console.log('✅ Database initialized successfully');
  });
}

// Get all products
function getAllProducts(callback) {
  db.all(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `, callback);
}

// Get products by category
function getProductsByCategory(categorySlug, callback) {
  db.all(`
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ?
    ORDER BY p.created_at DESC
  `, [categorySlug], callback);
}

// Get single product
function getProductById(id, callback) {
  db.get(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [id], callback);
}

// Add product
function addProduct(product, callback) {
  const { name, category_id, description, short_description, price, image_url, specifications, is_featured, is_popular } = product;
  
  db.run(`
    INSERT INTO products (name, category_id, description, short_description, price, image_url, specifications, is_featured, is_popular)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, category_id, description, short_description, price, image_url, specifications, is_featured || 0, is_popular || 0], function(err) {
    callback(err, this ? this.lastID : null);
  });
}

// Update product
function updateProduct(id, product, callback) {
  const { name, category_id, description, short_description, price, image_url, specifications, is_featured, is_popular, stock_status } = product;
  
  db.run(`
    UPDATE products 
    SET name = ?, category_id = ?, description = ?, short_description = ?, 
        price = ?, image_url = ?, specifications = ?, is_featured = ?, 
        is_popular = ?, stock_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [name, category_id, description, short_description, price, image_url, specifications, is_featured, is_popular, stock_status, id], callback);
}

// Delete product
function deleteProduct(id, callback) {
  db.run('DELETE FROM products WHERE id = ?', [id], callback);
}

// Get all categories
function getAllCategories(callback) {
  db.all('SELECT * FROM categories ORDER BY name', callback);
}

// Add inquiry
function addInquiry(inquiry, callback) {
  const { name, email, phone, message, product_interest } = inquiry;
  
  db.run(`
    INSERT INTO inquiries (name, email, phone, message, product_interest)
    VALUES (?, ?, ?, ?, ?)
  `, [name, email, phone, message, product_interest || null], function(err) {
    callback(err, this ? this.lastID : null);
  });
}

// Get all inquiries
function getAllInquiries(callback) {
  db.all('SELECT * FROM inquiries ORDER BY created_at DESC', callback);
}

// Update inquiry status
function updateInquiryStatus(id, status, callback) {
  db.run(`
    UPDATE inquiries 
    SET status = ?, responded_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [status, id], callback);
}

module.exports = {
  db,
  initializeDatabase,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  addInquiry,
  getAllInquiries,
  updateInquiryStatus
};
