# Galaxy Link Computers - cPanel Deployment Guide

## ✅ Good News!

Your site **IS compatible** with cPanel! I've created a **PHP + MySQL version** that works perfectly with standard cPanel hosting.

---

## 📦 What You Get

### Two Deployment Options:

**Option 1: Node.js Version** (For cPanel with Node.js support)
- Uses the Express.js server
- SQLite database
- Modern JavaScript approach
- Requires Node.js app setup in cPanel

**Option 2: PHP Version** (Standard cPanel - RECOMMENDED ✅)
- Pure PHP backend
- MySQL database (included with most cPanel)
- Works on ANY cPanel hosting
- No special requirements

---

## 🎯 Recommended: PHP + MySQL Version

### Step 1: Create MySQL Database in cPanel

1. Login to your cPanel
2. Navigate to **"MySQL® Databases"**
3. Create a new database:
   - Database name: `galaxylink` (cPanel will prefix this with your username)
   - Click **"Create Database"**

4. Create a database user:
   - Username: `galaxylink_user`
   - Password: Generate a strong password
   - Click **"Create User"**

5. Add user to database:
   - Select the database
   - Select the user
   - Grant **"ALL PRIVILEGES"**
   - Click **"Make Changes"**

6. **Note down these details:**
   ```
   Database Name: cpanel_user_galaxylink
   Database User: cpanel_user_galaxylink_user
   Password: [your generated password]
   Host: localhost
   ```

### Step 2: Upload Files via cPanel File Manager

1. In cPanel, open **"File Manager"**
2. Navigate to `public_html` folder
3. Upload ALL your files:
   - ✅ index.html
   - ✅ admin-panel.html
   - ✅ All product pages (.html files)
   - ✅ styles.css
   - ✅ script.js
   - ✅ admin-panel.js

4. Create an `api` folder in `public_html`:
   - Upload PHP API files to `public_html/api/`:
     - products.php
     - auth.php
     - categories.php
     - inquiries.php

5. Upload to `public_html/` root:
   - config.php
   - .htaccess

### Step 3: Configure Database Connection

1. In cPanel File Manager, right-click `config.php`
2. Click **"Edit"**
3. Update these lines with YOUR database details:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpanel_user_galaxylink');      // Your actual DB name
define('DB_USER', 'cpanel_user_galaxylink_user'); // Your actual DB user
define('DB_PASS', 'your_password_here');          // Your actual password
```

4. Save the file

### Step 4: Set Up Database Tables

1. In cPanel, open **"phpMyAdmin"**
2. Select your `galaxylink` database from the left sidebar
3. Click the **"SQL"** tab
4. Copy and paste the entire contents of `setup-database.sql`
5. Click **"Go"**
6. You should see: "6 queries executed successfully"

This creates:
- ✅ categories table (with 6 default categories)
- ✅ products table
- ✅ admin_users table (with default admin)
- ✅ inquiries table

### Step 5: Test Your Site

Visit your website:
- **Frontend**: `https://yourdomain.com`
- **Admin Panel**: `https://yourdomain.com/admin-panel.html`

**Default admin credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the admin password immediately!

---

## 🔐 Change Admin Password

### Via phpMyAdmin:

1. Open phpMyAdmin in cPanel
2. Select your database
3. Click on `admin_users` table
4. Click **"Edit"** on the admin user row
5. In `password_hash` field, delete the old hash
6. Use this PHP code to generate a new hash:

```php
<?php
echo password_hash('YourNewPassword', PASSWORD_DEFAULT);
?>
```

7. Save this as `hash.php`, upload it, visit it in browser
8. Copy the generated hash
9. Paste it into phpMyAdmin `password_hash` field
10. Click **"Go"**
11. Delete `hash.php` for security

---

## 📁 Final cPanel File Structure

```
public_html/
├── index.html
├── admin-panel.html
├── admin-panel.js
├── styles.css
├── script.js
├── config.php                    ← Database config
├── .htaccess                     ← URL routing
├── laptops-desktops.html
├── servers-storage.html
├── printers-copiers.html
├── networking.html
├── cctv-security.html
├── accessories.html
├── access-control.html
├── backup-cloud.html
├── internet-management.html
├── pos-pms.html
└── api/                          ← API folder
    ├── products.php
    ├── auth.php
    ├── categories.php
    └── inquiries.php
```

---

## 🔧 Update Admin Panel URLs

The admin panel JavaScript needs to know your API URLs. 

Edit `admin-panel.js` and update the API base URL at the top if needed:

```javascript
// If your site is at root domain
const API_BASE = '/api';

// If your site is in a subfolder
const API_BASE = '/subfolder/api';
```

---

## 🌐 API Endpoints (Your Live URLs)

Once deployed, your API will be at:

```
GET  https://yourdomain.com/api/products
GET  https://yourdomain.com/api/products/1
GET  https://yourdomain.com/api/products/category/laptops-desktops
GET  https://yourdomain.com/api/categories
POST https://yourdomain.com/api/inquiries

POST https://yourdomain.com/api/auth/login
POST https://yourdomain.com/api/auth/logout
GET  https://yourdomain.com/api/auth/me
```

---

## ✅ Testing Checklist

After deployment, test:

- [ ] Main website loads: `yourdomain.com`
- [ ] CSS styles working (Poppins font visible)
- [ ] Carousel auto-plays
- [ ] Dropdown menus work
- [ ] All product pages accessible
- [ ] Admin panel loads: `yourdomain.com/admin-panel.html`
- [ ] Can login with admin/admin123
- [ ] Can see categories in admin panel
- [ ] Can add a test product
- [ ] Test product appears in admin panel
- [ ] Can edit/delete product
- [ ] Contact form submits successfully

---

## 🚨 Common cPanel Issues & Solutions

### Issue: "Access Denied" Database Error
**Solution:** Double-check database credentials in `config.php`

### Issue: 500 Internal Server Error
**Solution:** Check file permissions. PHP files should be 644, folders 755

### Issue: API returns 404 errors
**Solution:** Make sure `.htaccess` file uploaded correctly (note the dot!)

### Issue: Can't login to admin
**Solution:** 
1. Check database has admin user
2. Clear browser cookies/cache
3. Try incognito/private browsing

### Issue: Styles not loading
**Solution:** Clear browser cache (Ctrl + F5)

---

## 🔒 Security Checklist (IMPORTANT!)

Before going live:

1. ✅ Change default admin password
2. ✅ Update database credentials in `config.php`
3. ✅ Set proper file permissions (644 for files, 755 for folders)
4. ✅ Enable HTTPS (SSL) in cPanel
5. ✅ Keep phpMyAdmin access secure
6. ✅ Regular database backups
7. ✅ Don't share `config.php` publicly

---

## 📊 Managing Your Site

### Add Products:
1. Login to admin panel
2. Click "Products" tab
3. Click "+ Add New Product"
4. Fill in details
5. Add specifications
6. Save

### View Customer Inquiries:
1. Login to admin panel
2. Click "Inquiries" tab
3. View all submissions
4. Mark as "responded" when done

### Database Backup:
1. cPanel → phpMyAdmin
2. Select your database
3. Click "Export"
4. Click "Go"
5. Save the .sql file

---

## 🎓 Optional: Node.js Version on cPanel

If your cPanel has **Node.js support**:

1. In cPanel, go to **"Setup Node.js App"**
2. Create new application:
   - Node.js version: 14.x or higher
   - Application root: `public_html`
   - Application URL: your domain
   - Application startup file: `api-server.js`
3. Click "Create"
4. Run `npm install` in SSH/Terminal
5. Start the application

But the **PHP version is simpler** for most cPanel users!

---

## 💰 Hosting Recommendations

Any cPanel hosting with:
- ✅ PHP 7.4+ (most have PHP 8.x)
- ✅ MySQL 5.7+
- ✅ 1GB+ disk space
- ✅ SSL certificate

Popular options:
- Namecheap
- Hostinger
- Truehost (Kenya)
- SiteGround
- Bluehost

---

## 📞 Need Help?

**Deployment Issues:**
1. Check cPanel error logs
2. Check PHP error logs
3. Test API endpoints directly in browser

**Database Issues:**
1. Verify connection in phpMyAdmin
2. Check user privileges
3. Ensure tables were created

---

## 🎉 You're All Set!

Your Galaxy Link Computers site is now:
- ✅ Professional logo (Poppins font)
- ✅ Working carousel & dropdowns
- ✅ Complete database backend
- ✅ Admin panel for product management
- ✅ **100% cPanel compatible!**

Deploy it and start managing your products! 🚀
