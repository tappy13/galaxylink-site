<?php
// config.php - Database Configuration for cPanel
// Edit these values with your cPanel database credentials

define('DB_HOST', 'localhost');  // Usually 'localhost' on cPanel
define('DB_NAME', 'your_cpanel_username_galaxylink');  // Your database name
define('DB_USER', 'your_cpanel_username_dbuser');      // Your database user
define('DB_PASS', 'your_secure_password');              // Your database password

// Create database connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Admin session configuration
session_start();

// Helper function to check if user is logged in
function isAdminLoggedIn() {
    return isset($_SESSION['admin_user']);
}

// Helper function to require admin login
function requireAdmin() {
    if (!isAdminLoggedIn()) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// Helper function to sanitize input
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}
?>
