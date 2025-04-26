const products = [
  { id: '1', name: 'Sample Product 1', price: '$19.99', reference: 'REF001', status: 'Available', description: 'Description for product 1', image: 'Assets/Media/product1.jpg' },
  { id: '2', name: 'Sample Product 2', price: '$29.99', reference: 'REF002', status: 'Not Available', description: 'Description for product 2', image: 'Assets/Media/product2.jpg' },
  { id: '3', name: 'Sample Product 3', price: '$39.99', reference: 'REF003', status: 'Available', description: 'Description for product 3', image: 'Assets/Media/product3.jpg' },
  { id: '4', name: 'Sample Product 4', price: '$49.99', reference: 'REF004', status: 'Available', description: 'Description for product 4', image: 'Assets/Media/product4.jpg' }
];

function getAssetPath(path) {
  if (window.location.pathname.includes('/Marketplace/Products Pages/')) {
    return `../../${path}`;
  }
  return path;
}

function renderTopProducts() {
  const container = document.getElementById('top-products-list');
  if (!container) return;
  container.innerHTML = '';
  products.slice(0, 4).forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-item glass';
    div.innerHTML = `
      <img src="${getAssetPath(p.image)}" alt="${p.name}">
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
        <img src="${getAssetPath(p.image)}" alt="${p.name}">
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
  
  if (detailImage) detailImage.src = getAssetPath(p.image);
  if (detailImage) detailImage.alt = p.name;
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
  const navLinks = document.querySelector('.navbar .nav-links');
  
  if (!menuBtn || !navLinks) return;
  
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  
  // Close menu when clicking a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  renderTopProducts();
  renderMarketplace();
  setupMarketplaceSearch();
  renderProductDetail();
  setupMobileMenu();
});
