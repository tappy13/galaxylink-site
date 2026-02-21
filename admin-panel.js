// admin-panel.js - Admin Panel Frontend Logic

let currentUser = null;
let allProducts = [];
let allCategories = [];
let allInquiries = [];

// Check if user is logged in
async function checkAuth() {
  try {
    const response = await fetch('/api/admin/me');
    if (response.ok) {
      currentUser = await response.json();
      showDashboard();
      loadData();
    } else {
      showLogin();
    }
  } catch (error) {
    showLogin();
  }
}

// Show/hide pages
function showLogin() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.username;
  }
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  };
  
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      currentUser = result.user;
      showDashboard();
      loadData();
    } else {
      const errorDiv = document.getElementById('loginError');
      errorDiv.textContent = result.error || 'Login failed';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    alert('Login error: ' + error.message);
  }
});

// Logout
async function logout() {
  await fetch('/api/admin/logout', { method: 'POST' });
  currentUser = null;
  showLogin();
}

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabName + 'Tab').classList.add('active');
}

// Load all data
async function loadData() {
  await loadCategories();
  await loadProducts();
  await loadInquiries();
}

// ==================== CATEGORIES ====================

async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    allCategories = await response.json();
    
    renderCategories();
    populateCategorySelect();
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

function renderCategories() {
  const container = document.getElementById('categoriesList');
  container.innerHTML = allCategories.map(cat => `
    <div class="card" style="margin-bottom: 1rem;">
      <h3>${cat.name}</h3>
      <p>${cat.description || 'No description'}</p>
      <p><strong>Slug:</strong> ${cat.slug}</p>
    </div>
  `).join('');
}

function populateCategorySelect() {
  const select = document.getElementById('categorySelect');
  select.innerHTML = allCategories.map(cat => 
    `<option value="${cat.id}">${cat.name}</option>`
  ).join('');
}

// ==================== PRODUCTS ====================

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    allProducts = await response.json();
    renderProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function renderProducts() {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = allProducts.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category_name}</td>
      <td>${product.price ? 'KES ' + product.price.toLocaleString() : 'N/A'}</td>
      <td>
        ${product.is_featured ? '<span class="badge badge-success">Featured</span>' : ''}
        ${product.is_popular ? '<span class="badge badge-warning">Popular</span>' : ''}
      </td>
      <td>
        <button class="btn btn-secondary btn-small" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Product Modal
function openProductModal(product = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  
  form.reset();
  document.getElementById('specList').innerHTML = '<div class="spec-item"><input type="text" placeholder="Specification" class="spec-input"><button type="button" class="btn btn-secondary btn-small" onclick="removeSpec(this)">Remove</button></div>';
  
  if (product) {
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    form.name.value = product.name;
    form.category_id.value = product.category_id;
    form.short_description.value = product.short_description || '';
    form.description.value = product.description || '';
    form.price.value = product.price || '';
    form.image_url.value = product.image_url || '';
    form.is_featured.checked = product.is_featured;
    form.is_popular.checked = product.is_popular;
    
    // Load specifications
    if (product.specifications && product.specifications.length > 0) {
      document.getElementById('specList').innerHTML = product.specifications.map(spec => 
        `<div class="spec-item"><input type="text" value="${spec}" class="spec-input"><button type="button" class="btn btn-secondary btn-small" onclick="removeSpec(this)">Remove</button></div>`
      ).join('');
    }
  } else {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productId').value = '';
  }
  
  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function addSpec() {
  const specList = document.getElementById('specList');
  const newSpec = document.createElement('div');
  newSpec.className = 'spec-item';
  newSpec.innerHTML = '<input type="text" placeholder="Specification" class="spec-input"><button type="button" class="btn btn-secondary btn-small" onclick="removeSpec(this)">Remove</button>';
  specList.appendChild(newSpec);
}

function removeSpec(button) {
  button.parentElement.remove();
}

async function editProduct(id) {
  const product = allProducts.find(p => p.id === id);
  openProductModal(product);
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('Product deleted successfully');
      loadProducts();
    } else {
      alert('Error deleting product');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Save product
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const productId = formData.get('id');
  
  // Collect specifications
  const specs = Array.from(document.querySelectorAll('.spec-input'))
    .map(input => input.value.trim())
    .filter(val => val !== '');
  
  const data = {
    name: formData.get('name'),
    category_id: parseInt(formData.get('category_id')),
    short_description: formData.get('short_description'),
    description: formData.get('description'),
    price: formData.get('price') ? parseFloat(formData.get('price')) : null,
    image_url: formData.get('image_url'),
    specifications: specs,
    is_featured: formData.get('is_featured') ? 1 : 0,
    is_popular: formData.get('is_popular') ? 1 : 0,
    stock_status: 'in_stock'
  };
  
  try {
    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
    const method = productId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert(productId ? 'Product updated successfully' : 'Product added successfully');
      closeProductModal();
      loadProducts();
    } else {
      const error = await response.json();
      alert('Error: ' + (error.error || 'Failed to save product'));
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// ==================== INQUIRIES ====================

async function loadInquiries() {
  try {
    const response = await fetch('/api/admin/inquiries');
    allInquiries = await response.json();
    renderInquiries();
  } catch (error) {
    console.error('Error loading inquiries:', error);
  }
}

function renderInquiries() {
  const tbody = document.querySelector('#inquiriesTable tbody');
  tbody.innerHTML = allInquiries.map(inquiry => `
    <tr>
      <td>${inquiry.id}</td>
      <td>${inquiry.name}</td>
      <td>${inquiry.email}</td>
      <td>${inquiry.message.substring(0, 50)}${inquiry.message.length > 50 ? '...' : ''}</td>
      <td>
        <span class="badge badge-${inquiry.status === 'new' ? 'warning' : inquiry.status === 'responded' ? 'success' : 'danger'}">
          ${inquiry.status}
        </span>
      </td>
      <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-secondary btn-small" onclick="viewInquiry(${inquiry.id})">View</button>
        ${inquiry.status === 'new' ? `<button class="btn btn-success btn-small" onclick="markResponded(${inquiry.id})">Mark Responded</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function viewInquiry(id) {
  const inquiry = allInquiries.find(i => i.id === id);
  alert(`From: ${inquiry.name} (${inquiry.email})\nPhone: ${inquiry.phone || 'N/A'}\nProduct: ${inquiry.product_interest || 'N/A'}\n\nMessage:\n${inquiry.message}`);
}

async function markResponded(id) {
  try {
    const response = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'responded' })
    });
    
    if (response.ok) {
      loadInquiries();
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Initialize
checkAuth();
