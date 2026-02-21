// Galaxy Link Computers - JavaScript Functionality

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

// HERO CAROUSEL
let heroIndex = 0;
const totalHeroSlides = 3;
let heroAutoplayInterval;

function updateHeroCarousel() {
  const container = document.querySelector('.hero-carousel-container');
  const dots = document.querySelectorAll('.hero-dot');
  
  if (!container) return; // Exit if carousel doesn't exist on this page
  
  container.style.transform = `translateX(-${heroIndex * 100}%)`;
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === heroIndex);
  });
}

function moveHeroSlide(direction) {
  heroIndex = (heroIndex + direction + totalHeroSlides) % totalHeroSlides;
  updateHeroCarousel();
  resetHeroAutoplay();
}

function goToHeroSlide(index) {
  heroIndex = index;
  updateHeroCarousel();
  resetHeroAutoplay();
}

function heroAutoplay() {
  heroIndex = (heroIndex + 1) % totalHeroSlides;
  updateHeroCarousel();
}

function startHeroAutoplay() {
  heroAutoplayInterval = setInterval(heroAutoplay, 5000);
}

function resetHeroAutoplay() {
  clearInterval(heroAutoplayInterval);
  startHeroAutoplay();
}

// Initialize carousel if it exists on the page
const heroCarousel = document.querySelector('.hero-carousel');
if (heroCarousel) {
  startHeroAutoplay();
  
  // Pause on hover
  heroCarousel.addEventListener('mouseenter', () => clearInterval(heroAutoplayInterval));
  heroCarousel.addEventListener('mouseleave', startHeroAutoplay);
}

// Make functions globally accessible for onclick attributes
window.moveHeroSlide = moveHeroSlide;
window.goToHeroSlide = goToHeroSlide;

// SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// PRODUCT QUOTE BUTTONS
document.querySelectorAll('.btn-product').forEach(button => {
  button.addEventListener('click', function() {
    const productCard = this.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    
    const contactSection = document.querySelector('#contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const textarea = document.querySelector('.contact-form textarea');
      if (textarea && !textarea.value) {
        textarea.value = `I'm interested in: ${productName}\n\n`;
        textarea.focus();
      }
    }, 800);
  });
});

// CATEGORY CARDS
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', function() {
    const productsSection = document.querySelector('.featured-products');
    productsSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// CONTACT FORM SUBMISSION
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    submitBtn.textContent = '✓ Inquiry Sent!';
    submitBtn.style.background = '#10b981';

    this.reset();

    // Success notification
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      font-weight: 600;
    `;
    successMessage.textContent = 'Thank you! We\'ll contact you shortly.';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.remove();
    }, 5000);

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  }, 1500);
});

// HEADER SCROLL EFFECT
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }
  
  lastScroll = currentScroll;
});

// BACK TO TOP BUTTON
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 999;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: none;
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    backToTopBtn.style.display = 'block';
    setTimeout(() => {
      backToTopBtn.style.opacity = '1';
    }, 10);
  } else {
    backToTopBtn.style.opacity = '0';
    setTimeout(() => {
      backToTopBtn.style.display = 'none';
    }, 300);
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

console.log('%cGalaxy Link Computers', 'color: #1E90FF; font-size: 20px; font-weight: bold;');
console.log('%cWebsite loaded successfully!', 'color: #10b981; font-size: 14px;');

}); // End of DOMContentLoaded