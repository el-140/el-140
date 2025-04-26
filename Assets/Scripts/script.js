const products = [
  { id: '1', name: 'Sejed TRABELSSI', price: '25DT', reference: 'ST-985', status: 'Available', description: 'TEST', image: 'mox51h.jpg' },
  { id: '2', name: 'Sample Product 2', price: '$29.99', reference: 'REF002', status: 'Not Available', description: 'Description for product 2', image: '31.jpg' },
  { id: '3', name: 'Sample Product 3', price: '$39.99', reference: 'REF003', status: 'Available', description: 'Description for product 3', image: '' },
  { id: '4',  name: 'Sample Product 4', price: '$49.99', reference: 'REF004', status: 'Available', description: 'Description for product 4', image: 'IMG_9965.png' }
];

function getAssetPath(path) {
  // Check if we're on the product detail page or marketplace page
  if (window.location.pathname.includes('/Marketplace/Products Pages/')) {
    return `../../Assets/Media/${path}`; // Path from product detail page
  }
  return `Assets/Media/${path}`; // Path from marketplace or home page
}

function renderTopProducts() {
  const container = document.getElementById('top-products-list');
  if (!container) return;
  container.innerHTML = '';
  products.slice(0,1).forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-item glass';
    div.innerHTML = `
      <img src="${getAssetPath(p.image)}" alt="${p.name}" onerror="this.src='Assets/Media/no.jpg'">
      <h3>${p.name}</h3>
      <p class="price">${p.price}</p>
      <p class="ref">Ref: ${p.reference}</p>
      <p class="status">Status: <span class="badge ${p.status==='Available'?'badge-success':'badge-danger'}">${p.status}</span></p>
      <a href="Marketplace/Products Pages/product.html?id=${p.id}" class="btn btn-primary">See More</a>
    `;
    container.appendChild(div);
  });
}

function renderMarketplace(filter = '') {
  const container = document.getElementById('marketplace-list');
  if (!container) return;
  container.innerHTML = '';
  const list = filter
    ? products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : products;
  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card glass';
    div.innerHTML = `
      <div class="product-image">
        <img src="${getAssetPath(p.image)}" alt="${p.name}" onerror="this.src='Assets/Media/no.jpg'">
      </div>
      <div class="product-details">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p class="ref">Ref: ${p.reference}</p>
        <p class="status">Status: <span class="badge ${p.status==='Available'?'badge-success':'badge-danger'}">${p.status}</span></p>
        <a href="Marketplace/Products Pages/product.html?id=${p.id}" class="btn btn-primary">See More</a>
      </div>
    `;
    container.appendChild(div);
  });
  
  // Debug log
  console.log("Marketplace rendered with " + list.length + " products");
}

function renderProductDetail() {
  const productDetailContainer = document.getElementById('product-detail');
  if (!productDetailContainer) return;
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = products.find(item => item.id === id);
  
  if (!p) {
    productDetailContainer.innerHTML = `<div class="error-message">Product not found</div>`;
    return;
  }
  
  // Update the product detail elements
  const detailImage = document.getElementById('detail-image');
  const detailName = document.getElementById('detail-name');
  const detailDescription = document.getElementById('detail-description');
  const detailPrice = document.getElementById('detail-price');
  const detailReference = document.getElementById('detail-reference');
  const detailStatus = document.getElementById('detail-status');
  
  if (detailImage) {
    // Set image path based on product data
    detailImage.src = `../../Assets/Media/${p.image}`;
    detailImage.alt = p.name;
    
    // Add error handling
    detailImage.onerror = function() {
      console.error('Failed to load image:', this.src);
      // Only use fallback if needed
      if (p.image !== 'no.jpg') {
        this.src = "../../Assets/Media/no.jpg";
      }
    };
  }
  
  if (detailName) detailName.innerText = p.name;
  if (detailDescription) detailDescription.innerText = p.description;
  if (detailPrice) detailPrice.innerText = p.price;
  if (detailReference) detailReference.innerText = `Ref: ${p.reference}`;
  
  if (detailStatus) {
    detailStatus.innerText = p.status;
    detailStatus.className = 'badge ' + (p.status === 'Available' ? 'badge-success' : 'badge-danger');
  }
  
  // Set up the Buy Now button
  setupBuyNowButton(p);
  
  // Log for debugging
  console.log('Product detail rendered:', p);
  console.log('Image path set to:', `../../Assets/Media/${p.image}`);
}

function setupBuyNowButton(product) {
  const buyNowBtn = document.getElementById('buy-now-btn');
  const modal = document.getElementById('purchase-modal');
  const closeModal = document.querySelector('.close-modal');
  const formProductRef = document.getElementById('form-product-ref');
  const formProductLink = document.getElementById('form-product-link');
  
  if (!buyNowBtn || !modal) return;
  
  // Disable the button if product is not available
  if (product.status !== 'Available') {
    buyNowBtn.disabled = true;
    buyNowBtn.classList.add('btn-disabled');
    buyNowBtn.innerText = 'Not Available';
    return;
  }
  
  // Set up the form hidden fields
  if (formProductRef) formProductRef.value = product.reference;
  if (formProductLink) formProductLink.value = window.location.href;
  
  // Open modal when Buy Now is clicked
  buyNowBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  // Close modal when X is clicked
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Search functionality for marketplace
function setupMarketplaceSearch() {
  const input = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  
  if (!input) return;
  
  input.addEventListener('input', e => {
    renderMarketplace(e.target.value);
  });
  
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      renderMarketplace(input.value);
    });
  }
}

// Mobile menu functionality
function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuBtn || !navLinks) return;
  
  // Add menu icon
  if (!menuBtn.innerHTML) {
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  }
  
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    
    // Change icon based on menu state
    if (navLinks.classList.contains('active')) {
      menuBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  
  // Add animation delay to each nav item
  const navItems = navLinks.querySelectorAll('li');
  navItems.forEach((item, index) => {
    item.style.setProperty('--i', index);
  });
  
  // Close menu when clicking a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// Mobile Menu Toggle
// Removing duplicate code since we already have setupMobileMenu function

// Disable right-click on the entire website
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Disable keyboard shortcuts that could be used to copy content
document.addEventListener('keydown', function(e) {
  // Disable Ctrl+C, Ctrl+U (view source), Ctrl+S (save), F12 (dev tools)
  if (
    (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 85 || e.keyCode === 83)) || 
    e.keyCode === 123
  ) {
    e.preventDefault();
    return false;
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  renderTopProducts();
  renderMarketplace();
  setupMarketplaceSearch();
  renderProductDetail();
  setupMobileMenu();
});
