// =============================================================================
// GalaxyLink Computers - Enhanced Interactions
// JavaScript for carousel, forms, animations, and scroll effects
// =============================================================================

// =============================================================================
// TESTIMONIAL CAROUSEL
// Auto-rotating carousel with manual navigation via dots
// =============================================================================

const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;           // Currently displayed slide (0-2)
const slideCount = 3;           // Total number of testimonial slides
let autoplayInterval;           // Stores the interval ID for autoplay

/**
 * Updates the carousel to show a specific slide
 * @param {number} index - Index of slide to display (0-2)
 */
function updateCarousel(index) {
  currentIndex = index;
  
  // Move the track horizontally to show selected slide
  // Each slide is 100% wide, so multiply by 100 to get percentage offset
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  
  // Update navigation dots to show which slide is active
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

/**
 * Advances to the next slide (wraps around to first after last)
 */
function nextSlide() {
  const nextIndex = (currentIndex + 1) % slideCount;  // Modulo for wrapping
  updateCarousel(nextIndex);
}

/**
 * Starts automatic slide rotation
 * Advances every 5 seconds
 */
function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 5000);
}

/**
 * Stops automatic slide rotation
 * Used when user interacts with carousel
 */
function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Add click handlers to navigation dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    stopAutoplay();              // Pause autoplay when user clicks
    updateCarousel(index);       // Jump to selected slide
    startAutoplay();             // Resume autoplay after manual navigation
  });
});

// Start the carousel autoplay on page load
startAutoplay();

// Pause carousel when mouse hovers over it (improves UX)
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', stopAutoplay);
carousel.addEventListener('mouseleave', startAutoplay);

// =============================================================================
// SMOOTH SCROLL ENHANCEMENT
// Improves anchor link navigation with offset for sticky header
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();  // Prevent default jump behavior
    
    // Get the target section
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;  // Account for sticky header height
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Smooth scroll to calculated position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// =============================================================================
// CONTACT FORM SUBMISSION
// Handles form submission with visual feedback
// Note: This is a client-side demo - integrate with backend for real submission
// =============================================================================

const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();  // Prevent default form submission
  
  // Get the submit button
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual API call)
  // In production, this would be: fetch('/api/contact', {...})
  setTimeout(() => {
    // Show success state
    submitBtn.textContent = 'Message Sent!';
    submitBtn.style.background = '#10b981';  // Green success color
    
    // Clear form fields
    this.reset();
    
    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';  // Return to original color
    }, 3000);
  }, 1500);  // 1.5 second simulated delay
});

// =============================================================================
// HEADER SCROLL EFFECT
// Enhances header shadow based on scroll position
// =============================================================================

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add stronger shadow when scrolled down
  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }
  
  lastScroll = currentScroll;
});

// =============================================================================
// INTERSECTION OBSERVER - FADE-IN ANIMATIONS
// Animates elements as they scroll into view
// =============================================================================

const observerOptions = {
  threshold: 0.1,                        // Trigger when 10% of element is visible
  rootMargin: '0px 0px -50px 0px'       // Trigger slightly before element enters viewport
};

/**
 * Callback function for Intersection Observer
 * Fades in elements when they become visible
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is now visible - fade it in
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to service cards and feature items
document.querySelectorAll('.service-card, .feature-item').forEach(el => {
  // Set initial state (invisible and slightly below)
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  
  // Start observing this element
  observer.observe(el);
});

// =============================================================================
// END OF SCRIPT
// All interactive functionality initialized
// =============================================================================