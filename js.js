// =============================================================================
// GalaxyLink Computers - Enhanced Interactions
// JavaScript for carousels, forms, animations, and scroll effects
// =============================================================================

// =============================================================================
// IMAGE CAROUSEL FUNCTIONALITY
// Auto-rotating carousel with manual navigation via dots and arrows
// =============================================================================

let currentSlide = 0;          // Current slide index (0-5)
const totalSlides = 6;         // Total number of slides
let autoplayInterval;          // Stores interval ID for auto-play

/**
 * Updates carousel position and active dot indicator
 */
function updateCarousel() {
  const container = document.querySelector('.carousel-container');
  const dots = document.querySelectorAll('.carousel-dot');
  
  // Slide the container horizontally
  // Each slide is 100% wide, so multiply by 100 to get percentage offset
  container.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  // Update active dot
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

/**
 * Moves carousel by direction (-1 for previous, 1 for next)
 * @param {number} direction - Direction to move (-1 or 1)
 */
function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateCarousel();
  resetAutoplay();
}

/**
 * Jumps to specific slide
 * @param {number} index - Slide index to jump to (0-5)
 */
function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoplay();
}

/**
 * Auto-advances to next slide
 */
function autoplay() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

/**
 * Starts automatic carousel rotation
 * Rotates every 5 seconds
 */
function startAutoplay() {
  autoplayInterval = setInterval(autoplay, 5000);
}

/**
 * Resets autoplay timer
 * Called when user manually navigates
 */
function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Initialize carousel on page load
startAutoplay();

// Pause carousel when mouse hovers over it
const carousel = document.querySelector('.image-carousel');
carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
carousel.addEventListener('mouseleave', startAutoplay);

// =============================================================================
// TESTIMONIAL CAROUSEL
// Auto-rotating testimonial carousel with manual navigation via dots
// =============================================================================

const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let testimonialIndex = 0;
const testimonialCount = 3;
let testimonialAutoplayInterval;

/**
 * Updates testimonial carousel position and active dot
 */
function updateTestimonialCarousel() {
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
  
  // Update active dot
  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === testimonialIndex);
  });
}

/**
 * Advances to next testimonial
 */
function nextTestimonial() {
  testimonialIndex = (testimonialIndex + 1) % testimonialCount;
  updateTestimonialCarousel();
}

/**
 * Starts testimonial autoplay
 */
function startTestimonialAutoplay() {
  testimonialAutoplayInterval = setInterval(nextTestimonial, 5000);
}

/**
 * Resets testimonial autoplay
 */
function resetTestimonialAutoplay() {
  clearInterval(testimonialAutoplayInterval);
  startTestimonialAutoplay();
}

// Add click handlers to testimonial dots
testimonialDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    testimonialIndex = index;
    updateTestimonialCarousel();
    resetTestimonialAutoplay();
  });
});

// Start testimonial autoplay
startTestimonialAutoplay();

// Pause testimonial carousel on hover
const testimonialCarousel = document.querySelector('.testimonial-carousel');
testimonialCarousel.addEventListener('mouseenter', () => clearInterval(testimonialAutoplayInterval));
testimonialCarousel.addEventListener('mouseleave', startTestimonialAutoplay);

// =============================================================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// Improves navigation with offset for sticky header
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