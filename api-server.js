// api-server.js - Backend API Server
const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
  secret: 'galaxy-link-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize database
db.initializeDatabase();

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.adminUser) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// ==================== PUBLIC API ROUTES ====================

// Get all products
app.get('/api/products', (req, res) => {
  db.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Parse specifications JSON for each product
    const parsedProducts = products.map(p => ({
      ...p,
      specifications: p.specifications ? JSON.parse(p.specifications) : []
    }));
    
    res.json(parsedProducts);
  });
});

// Get products by category
app.get('/api/products/category/:slug', (req, res) => {
  db.getProductsByCategory(req.params.slug, (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const parsedProducts = products.map(p => ({
      ...p,
      specifications: p.specifications ? JSON.parse(p.specifications) : []
    }));
    
    res.json(parsedProducts);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.getProductById(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.specifications = product.specifications ? JSON.parse(product.specifications) : [];
    res.json(product);
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.getAllCategories((err, categories) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(categories);
  });
});

// Submit contact inquiry
app.post('/api/inquiries', (req, res) => {
  db.addInquiry(req.body, (err, id) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id });
  });
});

// ==================== ADMIN AUTH ROUTES ====================

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  db.db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Set session
      req.session.adminUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      // Update last login
      db.db.run('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
      
      res.json({ success: true, user: req.session.adminUser });
    });
  });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check auth status
app.get('/api/admin/me', requireAuth, (req, res) => {
  res.json(req.session.adminUser);
});

// ==================== ADMIN PRODUCT ROUTES ====================

// Add product (protected)
app.post('/api/admin/products', requireAuth, (req, res) => {
  const product = {
    ...req.body,
    specifications: JSON.stringify(req.body.specifications || [])
  };
  
  db.addProduct(product, (err, id) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id });
  });
});

// Update product (protected)
app.put('/api/admin/products/:id', requireAuth, (req, res) => {
  const product = {
    ...req.body,
    specifications: JSON.stringify(req.body.specifications || [])
  };
  
  db.updateProduct(req.params.id, product, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// Delete product (protected)
app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  db.deleteProduct(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// ==================== ADMIN INQUIRY ROUTES ====================

// Get all inquiries (protected)
app.get('/api/admin/inquiries', requireAuth, (req, res) => {
  db.getAllInquiries((err, inquiries) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(inquiries);
  });
});

// Update inquiry status (protected)
app.put('/api/admin/inquiries/:id', requireAuth, (req, res) => {
  db.updateInquiryStatus(req.params.id, req.body.status, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// ==================== UTILITY ROUTE ====================

// Create first admin user (remove after creating admin)
app.post('/api/setup/create-admin', async (req, res) => {
  const { username, password, email, full_name } = req.body;
  
  // Check if any admin exists
  db.db.get('SELECT COUNT(*) as count FROM admin_users', async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (result.count > 0) {
      return res.status(403).json({ error: 'Admin already exists. Use the admin panel to create more users.' });
    }
    
    try {
      const password_hash = await bcrypt.hash(password, 10);
      
      db.db.run(
        'INSERT INTO admin_users (username, password_hash, email, full_name) VALUES (?, ?, ?, ?)',
        [username, password_hash, email, full_name],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, message: 'Admin user created successfully' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Galaxy Link Computers Server running at http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📝 API: http://localhost:${PORT}/api/products`);
});
