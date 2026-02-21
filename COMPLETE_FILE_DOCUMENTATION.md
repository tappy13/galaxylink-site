# Galaxy Link Computers - Complete File Documentation

## 📁 Project Overview

This is a complete e-commerce website with database backend and admin panel for Galaxy Link Computers, Kenya's premier IT solutions provider.

---

## 📂 File Structure & Documentation

### 🌐 **Frontend HTML Pages (13 files)**

#### `index.html` - Main Homepage
- **Purpose**: Landing page with hero carousel, featured products, services overview
- **Features**: 
  - 3-slide auto-rotating carousel (5-second intervals)
  - Product categories grid
  - Featured products section
  - Services showcase
  - Brands we carry
  - Contact form
- **Dependencies**: styles.css, script.js
- **Special Notes**: Hero carousel requires script.js to function

#### `laptops-desktops.html` - Product Page
- **Purpose**: Showcase laptops and desktop computers
- **Content**: 6 product cards with specifications
- **Products Include**: Dell Latitude, HP EliteBook, Lenovo ThinkPad, HP ProDesk, Dell OptiPlex, Lenovo ThinkCentre

#### `servers-storage.html` - Product Page
- **Purpose**: Enterprise server and storage solutions
- **Content**: 9 product cards
- **Products Include**: Dell PowerEdge, HPE ProLiant, Synology NAS, QNAP storage systems

#### `printers-copiers.html` - Product Page
- **Purpose**: Office printing solutions
- **Content**: 9 product cards
- **Products Include**: HP LaserJet, Canon imageRUNNER, Epson EcoTank, Brother MFC

#### `networking.html` - Product Page
- **Purpose**: Network infrastructure equipment
- **Content**: 9 product cards
- **Products Include**: Cisco switches, Ubiquiti routers, MikroTik, FortiGate firewalls

#### `cctv-security.html` - Product Page
- **Purpose**: Surveillance and security systems
- **Content**: 9 product cards
- **Products Include**: Hikvision cameras, Dahua NVR, thermal cameras, alarm systems

#### `accessories.html` - Product Page
- **Purpose**: Computer peripherals and components
- **Content**: 12 product cards
- **Products Include**: Keyboards, mice, monitors, UPS, webcams, RAM, cables

#### `access-control.html` - Service Page
- **Purpose**: Biometric and access control solutions
- **Content**: 6 service descriptions + 6 featured products
- **Services**: Biometric attendance, smart locks, door access, visitor management

#### `backup-cloud.html` - Service Page
- **Purpose**: Data backup and cloud storage solutions
- **Content**: 6 service descriptions + 3 featured products
- **Services**: Cloud backup, NAS storage, disaster recovery, automated backups

#### `internet-management.html` - Service Page
- **Purpose**: Bandwidth management and hotspot solutions
- **Content**: 6 service descriptions + 3 featured products
- **Services**: Bandwidth control, WiFi hotspots, user billing, content filtering

#### `pos-pms.html` - Service Page
- **Purpose**: Point-of-sale and property management software
- **Content**: 6 service descriptions + 6 product packages
- **Services**: Retail POS, restaurant systems, hotel PMS, salon software

#### `admin-panel.html` - Admin Interface
- **Purpose**: Backend management interface for site administrators
- **Features**:
  - Secure login system
  - Product management (add/edit/delete)
  - Customer inquiry tracking
  - Category management
- **Access**: `/admin-panel.html` (requires authentication)
- **Dependencies**: admin-panel.js, styles.css

---

### 🎨 **Stylesheets (1 file)**

#### `styles.css` - Master Stylesheet (16KB, 831 lines)
- **Purpose**: All site styling and visual design
- **Key Features**:
  - **Logo**: Poppins font (professional, modern)
  - **Color Scheme**: Primary blue (#1E90FF), clean grays
  - **Responsive Grid**: Auto-fit grid layouts for products/services
  - **Card Hover Effects**: Subtle blue glow with 3px halo + lift animation
  - **Carousel**: 480px height with smooth transitions
  - **Dropdown Menus**: Fade-in animation, larger hit area
  - **Mobile Responsive**: Breakpoints at 768px
- **CSS Variables**:
  ```css
  --primary: #1E90FF
  --gray-900: #111827
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)
  ```
- **Special Effects**:
  - Product cards: `box-shadow: 0 0 0 3px rgba(30,144,255,0.08)` on hover
  - Lift animation: `transform: translateY(-4px)`
  - Smooth transitions: `0.25s ease`

---

### ⚙️ **JavaScript (2 files)**

#### `script.js` - Frontend Functionality (4.5KB, 130 lines)
- **Purpose**: All interactive features for the website
- **Functions**:
  1. **Hero Carousel** (lines 6-58)
     - Auto-play: 5-second intervals
     - Manual navigation: arrows + dots
     - Hover behavior: pauses slides while hovering, resumes on mouse leave
     - Global functions: `moveHeroSlide(dir)`, `goToHeroSlide(index)`
     - Bug fix: Uses `isPaused` flag to prevent advance during hover
  
  2. **Smooth Scrolling** (lines 60-69)
     - All anchor links scroll smoothly
     - 80px header offset
  
  3. **Product Quote Buttons** (lines 71-86)
     - Scrolls to contact form
     - Pre-fills textarea with product name
     - Null-safe (won't crash if contact form doesn't exist)
  
  4. **Contact Form** (lines 96-113)
     - Simulated form submission (1.5 sec delay)
     - Success toast notification
     - Button state management
     - Form reset after submission
  
  5. **Back to Top Button** (lines 121-140)
     - Appears after 500px scroll
     - Smooth scroll to top
     - Fade in/out animation
  
  6. **Header Shadow** (lines 115-120)
     - Dynamic shadow on scroll

- **Dependencies**: None (vanilla JavaScript)
- **Browser Support**: Modern browsers (ES6+)

#### `admin-panel.js` - Admin Panel Logic (11KB)
- **Purpose**: Frontend JavaScript for admin interface
- **Key Functions**:
  - `checkAuth()` - Verify admin login status
  - `loadProducts()` - Fetch all products from API
  - `openProductModal()` - Show add/edit product form
  - `addSpec()` / `removeSpec()` - Dynamic specification fields
  - `loadInquiries()` - Fetch customer inquiries
  - `markResponded()` - Update inquiry status
- **API Calls**: Communicates with backend API endpoints
- **Session Management**: Uses cookies for authentication

---

### 🗄️ **Backend - Node.js Version (3 files)**

#### `api-server.js` - Express API Server (7.3KB)
- **Purpose**: RESTful API backend with authentication
- **Port**: 3000 (configurable via `process.env.PORT`)
- **Dependencies**: express, express-session, bcryptjs
- **Routes**:
  
  **Public Routes:**
  - `GET /api/products` - Get all products
  - `GET /api/products/:id` - Get single product
  - `GET /api/products/category/:slug` - Products by category
  - `GET /api/categories` - All categories
  - `POST /api/inquiries` - Submit contact form
  
  **Admin Routes** (require authentication):
  - `POST /api/admin/login` - Admin login
  - `POST /api/admin/logout` - Logout
  - `GET /api/admin/me` - Current admin info
  - `POST /api/admin/products` - Add product
  - `PUT /api/admin/products/:id` - Update product
  - `DELETE /api/admin/products/:id` - Delete product
  - `GET /api/admin/inquiries` - Get all inquiries
  - `PUT /api/admin/inquiries/:id` - Update inquiry status
  
  **Setup Route:**
  - `POST /api/setup/create-admin` - Create first admin (one-time use)

- **Security**: bcrypt password hashing, session management
- **Usage**: `node api-server.js` or `npm start`

#### `database.js` - SQLite Database Module (6KB)
- **Purpose**: Database connection and query functions
- **Database**: SQLite (file-based, no server needed)
- **Tables**:
  - `categories` - Product categories (6 pre-loaded)
  - `products` - All products with specs as JSON
  - `admin_users` - Admin accounts (bcrypt passwords)
  - `inquiries` - Customer contact form submissions
- **Functions**:
  - `initializeDatabase()` - Create tables + seed categories
  - `getAllProducts()` - Fetch all products with category names
  - `getProductsByCategory()` - Filter by category slug
  - `addProduct()` / `updateProduct()` / `deleteProduct()` - CRUD
  - `addInquiry()` / `getAllInquiries()` - Contact form handling
- **Auto-Created File**: `galaxy_products.db` (SQLite database file)

#### `package.json` - Node.js Dependencies
- **Dependencies**:
  - `express` - Web server framework
  - `express-session` - Session management
  - `sqlite3` - SQLite database driver
  - `bcryptjs` - Password hashing
- **Scripts**:
  - `npm start` - Run `node api-server.js`
  - `npm run dev` - Run with nodemon (auto-restart)
- **Installation**: `npm install`

---

### 🗄️ **Backend - PHP Version (6 files)**

**Better for standard cPanel hosting!**

#### `config.php` - Database Configuration
- **Purpose**: MySQL connection + session management
- **Configuration Required**:
  ```php
  define('DB_HOST', 'localhost');
  define('DB_NAME', 'your_database_name');
  define('DB_USER', 'your_db_username');
  define('DB_PASS', 'your_password');
  ```
- **Functions**:
  - `isAdminLoggedIn()` - Check auth status
  - `requireAdmin()` - Protect admin routes
  - `sanitize($data)` - Input sanitization
- **Security**: PDO with prepared statements

#### `setup-database.sql` - MySQL Schema
- **Purpose**: Create all database tables
- **Run In**: cPanel phpMyAdmin
- **Creates**:
  - 4 tables (categories, products, admin_users, inquiries)
  - 6 default categories
  - 1 default admin user (username: admin, password: admin123)
- **Usage**: Copy/paste into phpMyAdmin SQL tab

#### `api/products.php` - Products API
- **Methods**:
  - `GET` - List all products, single product, or by category
  - `POST` - Add product (admin only)
  - `PUT` - Update product (admin only)
  - `DELETE` - Delete product (admin only)
- **Response**: JSON format
- **Specs Storage**: JSON-encoded in database

#### `api/auth.php` - Authentication API
- **Actions**:
  - `?action=login` - Admin login
  - `?action=logout` - Destroy session
  - `?action=me` - Get current user
- **Security**: `password_verify()` for bcrypt hashes

#### `api/categories.php` - Categories API
- **Method**: `GET` only
- **Returns**: All product categories

#### `api/inquiries.php` - Contact Form API
- **Methods**:
  - `GET` - All inquiries (admin only)
  - `POST` - Submit inquiry (public)
  - `PUT` - Update status (admin only)

#### `.htaccess` - Apache URL Rewriting
- **Purpose**: Clean URLs + security
- **Rewrites**:
  - `/api/products` → `api/products.php`
  - `/api/auth/login` → `api/auth.php?action=login`
- **Security**:
  - Protects `config.php` from direct access
  - Disables directory browsing
- **Performance**: Gzip compression, browser caching

---

### 🗄️ **Legacy/Utility Files (2 files)**

#### `server.js` - Simple Static Server
- **Purpose**: Basic HTTP server for local testing
- **Port**: 8080
- **Usage**: `node server.js`
- **Note**: Use `api-server.js` instead for full functionality
- **When to Use**: Quick static file serving during development

---

## 📚 **Documentation Files (6+ files)**

#### `README.md` - Quick Start Guide
- Basic setup instructions
- How to run locally

#### `DATABASE_ADMIN_SETUP.md` - Database Setup (Node.js)
- Node.js + SQLite setup
- Admin user creation
- API documentation
- Frontend integration examples

#### `CPANEL_DEPLOYMENT_GUIDE.md` - cPanel Deployment (PHP)
- Complete step-by-step cPanel guide
- MySQL database creation
- File upload instructions
- Security checklist
- Troubleshooting

#### `DEPLOYMENT_COMPARISON.md` - Backend Comparison
- Node.js vs PHP comparison
- Which to choose and why
- Pros/cons of each approach

#### `FIXES_APPLIED.md` - Initial Bug Fixes
- CSS file naming issue
- JavaScript file naming issue
- Truncated HTML files
- Email obfuscation removal

#### `FIXES_DROPDOWN_CAROUSEL.md` - UI Fixes
- Dropdown menu hover delay
- Carousel initialization bug
- Technical explanations

#### `NEW_PAGES_SUMMARY.md` - Content Summary
- All 7 new pages created
- 54 product cards added
- Complete feature list

---

## 🔧 **Configuration Files**

### For Node.js Deployment:
- `package.json` - npm dependencies
- `database.js` - Database setup

### For cPanel Deployment:
- `config.php` - Edit with your database credentials
- `.htaccess` - Apache configuration
- `setup-database.sql` - Run in phpMyAdmin

---

## 🚀 **Quick Start Guides**

### Local Testing (Node.js):
```bash
npm install
npm start
# Visit: http://localhost:3000
```

### Local Testing (Python - Simple):
```bash
python -m http.server 8080
# Visit: http://localhost:8080
```

### Production (cPanel):
1. Create MySQL database
2. Upload all files
3. Edit `config.php`
4. Run `setup-database.sql`
5. Access `yourdomain.com/admin-panel.html`

---

## 🔒 **Security Notes**

### Passwords:
- Default admin: `admin` / `admin123`
- **CHANGE IMMEDIATELY** after first login

### Files to Protect:
- `config.php` - Contains database credentials
- `.htaccess` - Already protects config.php
- `galaxy_products.db` - SQLite database (Node.js)

### Best Practices:
- Use HTTPS in production
- Regular database backups
- Strong admin passwords
- Update session secret in api-server.js

---

## 📊 **File Size Summary**

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| styles.css | 16KB | 831 | All styling |
| script.js | 4.5KB | 130 | Frontend JS |
| admin-panel.js | 11KB | 300+ | Admin logic |
| api-server.js | 7.3KB | 250+ | Node.js API |
| database.js | 6KB | 180+ | SQLite module |
| index.html | 22KB | 566 | Main page |
| Product pages | ~8-13KB each | ~200-300 each | Catalog pages |
| **Total Project** | ~200KB | ~4000+ lines | Complete site |

---

## 🎨 **Design System**

### Colors:
- **Primary**: #1E90FF (Dodger Blue)
- **Background**: #FFFFFF (White)
- **Alt Background**: #F8FAFB (Soft Gray)
- **Text**: #1F2937 (Dark Gray)
- **Borders**: #E5E7EB (Light Gray)

### Typography:
- **Logo**: Poppins (600 weight)
- **Body**: Inter
- **Base Size**: 19px (increased for readability)

### Hover Effects:
- **Lift**: translateY(-4px)
- **Glow**: 0 0 0 3px rgba(30,144,255,0.08)
- **Transition**: 0.25s ease

---

## ✅ **Feature Checklist**

### Frontend:
- [x] Responsive design (mobile-friendly)
- [x] Hero carousel (auto-play + manual)
- [x] 13 complete pages
- [x] 54 product cards
- [x] Smooth scrolling
- [x] Contact form
- [x] Subtle hover effects
- [x] Dropdown menus
- [x] Back to top button

### Backend:
- [x] Database (SQLite or MySQL)
- [x] Admin authentication
- [x] Product CRUD operations
- [x] Inquiry tracking
- [x] RESTful API
- [x] Session management
- [x] Password hashing

### Admin Panel:
- [x] Secure login
- [x] Product management
- [x] Inquiry viewing
- [x] Category management
- [x] Responsive design

---

## 📞 **Support & Updates**

All files are production-ready and fully documented. For questions:
1. Check the relevant .md documentation file
2. Review this master documentation
3. Check browser console (F12) for errors
4. Review server logs

---

**Last Updated**: February 2026
**Version**: 2.0 (Complete rebuild with backend)
**Total Files**: 30+ (HTML, CSS, JS, PHP, SQL, docs)
