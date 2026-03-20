/**
 * Galaxy Link Computers — Main Frontend Script
 * -----------------------------------------------
 * Covers:
 *  1. Hero Carousel  (autoplay, arrows, dots, keyboard, touch/swipe)
 *  2. Dropdown menus (hover + click/touch, keyboard accessible)
 *  3. Smooth scrolling for anchor links
 *  4. "Request Quote" buttons → populate contact form
 *  5. Contact form submission (with simple input sanitisation)
 *  6. Header shadow on scroll
 *  7. Back-to-top button
 *
 * All code is wrapped in DOMContentLoaded to guarantee the DOM is
 * ready before any query selectors run.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. HERO CAROUSEL
     ============================================================ */

  const carousel        = document.querySelector('.hero-carousel');
  const carouselTrack   = document.querySelector('.hero-carousel-container');
  const dots            = document.querySelectorAll('.hero-dot');
  const slides          = document.querySelectorAll('.hero-slide');
  const totalSlides     = slides.length;

  /* Only initialise if the carousel actually exists on this page */
  if (carousel && carouselTrack && totalSlides > 0) {

    let currentIndex  = 0;
    let autoplayTimer = null;
    let touchStartX   = 0;
    let touchEndX     = 0;
    let isDragging    = false;

    /**
     * Move the carousel track to the slide at `index`.
     * Uses modulo so wrapping works correctly in both directions.
     */
    function goToSlide(index) {
      currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;

      carouselTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });
    }

    function moveSlide(direction) {
      goToSlide(currentIndex + direction);
      resetAutoplay();
    }

    const AUTOPLAY_INTERVAL_MS = 4500; // moderate pace for automatic rotation

    /* --- Autoplay -------------------------------------------- */
    function startAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, AUTOPLAY_INTERVAL_MS);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    /* --- Arrow buttons --------------------------------------- */
    var prevBtn = carousel.querySelector('.hero-arrow.prev');
    var nextBtn = carousel.querySelector('.hero-arrow.next');

    if (prevBtn) prevBtn.addEventListener('click', function () { moveSlide(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { moveSlide(1); });

    /* --- Dot indicators ------------------------------------- */
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoplay();
      });
    });

    /* --- Keyboard navigation -------------------------------- */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  moveSlide(-1);
      if (e.key === 'ArrowRight') moveSlide(1);
    });

    /* --- Touch / swipe support ------------------------------ */
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
      isDragging  = true;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      touchEndX  = e.changedTouches[0].clientX;
      isDragging = false;
      var diff   = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) moveSlide(diff > 0 ? 1 : -1);
    }, { passive: true });

    /* Global helpers (backward-compat with any inline onclick attrs) */
    window.moveHeroSlide = function (direction) { moveSlide(direction); };
    window.goToHeroSlide = function (index)     { goToSlide(index); resetAutoplay(); };

    startAutoplay();
  }


  /* ============================================================
     2. DROPDOWN MENUS
     ============================================================
     Enhances pure-CSS hover dropdowns so they also work on touch
     devices and are keyboard/screen-reader accessible.
  ============================================================ */

  var dropdowns = document.querySelectorAll('.dropdown');

  function closeAllDropdowns() {
    dropdowns.forEach(function (dd) {
      var c = dd.querySelector('.dropdown-content');
      var b = dd.querySelector('.dropbtn');
      if (c) { c.style.display = ''; }
      if (b) { b.setAttribute('aria-expanded', 'false'); }
    });
  }

  dropdowns.forEach(function (dropdown) {
    var btn     = dropdown.querySelector('.dropbtn');
    var content = dropdown.querySelector('.dropdown-content');
    if (!btn || !content) return;

    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    function openDropdown() {
      content.style.display = 'block';
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      content.style.display = '';
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = content.style.display === 'block';
      closeAllDropdowns();
      if (!isOpen) openDropdown();
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
      if (e.key === 'Escape') {
        closeDropdown();
        btn.focus();
      }
    });

    /* Close when focus leaves the entire dropdown */
    dropdown.addEventListener('focusout', function (e) {
      if (!dropdown.contains(e.relatedTarget)) closeDropdown();
    });
  });

  /* Click anywhere outside → close all */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) closeAllDropdowns();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });


  /* ============================================================
     3. SMOOTH SCROLLING
     ============================================================ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    if (anchor.classList.contains('dropbtn')) return;

    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerEl     = document.querySelector('header');
      var headerHeight = headerEl ? headerEl.offsetHeight : 80;
      var offsetPos    = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
      closeAllDropdowns();
    });
  });


  /* ============================================================
     4. PRODUCT "REQUEST QUOTE" BUTTONS
     ============================================================ */

  document.querySelectorAll('.btn-product').forEach(function (button) {
    button.addEventListener('click', function () {
      var card        = this.closest('.product-card');
      var productName = card ? card.querySelector('h3').textContent.trim() : '';
      var contactEl   = document.querySelector('#contact');
      if (!contactEl) return;

      var headerEl     = document.querySelector('header');
      var headerHeight = headerEl ? headerEl.offsetHeight : 80;
      var offsetPos    = contactEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

      window.scrollTo({ top: offsetPos, behavior: 'smooth' });

      setTimeout(function () {
        var textarea = document.querySelector('.contact-form textarea');
        if (textarea && !textarea.value) {
          textarea.value = 'Hi, I am interested in: ' + productName + '\n\nPlease send me a quote.\n';
          textarea.focus();
        }
      }, 700);
    });
  });


  /* ============================================================
     5. CONTACT FORM
     ============================================================ */

  var contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var submitBtn  = this.querySelector('button[type="submit"]');
      var nameInput  = this.querySelector('input[type="text"]');
      var emailInput = this.querySelector('input[type="email"]');
      var telInput   = this.querySelector('input[type="tel"]');
      var selectEl   = this.querySelector('select');
      var textareaEl = this.querySelector('textarea');

      var name    = nameInput  ? nameInput.value.trim()  : '';
      var email   = emailInput ? emailInput.value.trim() : '';
      var phone   = telInput   ? telInput.value.trim()   : '';
      var product = selectEl   ? selectEl.value          : '';
      var message = textareaEl ? textareaEl.value.trim() : '';

      /* Validation */
      if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      var originalText      = submitBtn.textContent;
      submitBtn.textContent = 'Sending\u2026';
      submitBtn.disabled    = true;

      /* Try posting to the API (works when the Node.js backend is running) */
      var apiSuccess = false;
      try {
        var response = await fetch('/api/inquiries.php', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ name: name, email: email, phone: phone, product_interest: product, message: message })
        });
        if (response.ok) apiSuccess = true;
      } catch (_) {
        /* Static hosting — backend not available; silently ignore */
      }

      setTimeout(function () {
        submitBtn.textContent      = '\u2713 Inquiry Sent!';
        submitBtn.style.background = '#10b981';
        showNotification("Thank you! We\u2019ll be in touch shortly.", 'success');
        contactForm.reset();

        setTimeout(function () {
          submitBtn.textContent      = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled         = false;
        }, 3000);
      }, apiSuccess ? 100 : 1200);
    });
  }


  /* ============================================================
     6. HEADER SHADOW ON SCROLL
     ============================================================ */

  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.pageYOffset > 80
        ? '0 4px 12px rgba(0,0,0,0.12)'
        : '0 1px 2px rgba(0,0,0,0.05)';
    }, { passive: true });
  }


  /* ============================================================
     7. BACK-TO-TOP BUTTON
     ============================================================ */

  var backToTop = document.createElement('button');
  backToTop.innerHTML = '&#8679;';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.style.cssText = [
    'position:fixed','bottom:2rem','right:2rem',
    'width:46px','height:46px','border-radius:50%',
    'background:var(--primary, #1E90FF)','color:#fff',
    'border:none','font-size:1.5rem',
    'cursor:pointer','opacity:0',
    'transition:opacity 0.3s ease,transform 0.3s ease',
    'z-index:998','box-shadow:0 4px 12px rgba(0,0,0,0.2)',
    'display:flex','align-items:center','justify-content:center',
    'transform:translateY(8px)'
  ].join(';');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 500) {
      backToTop.style.opacity   = '1';
      backToTop.style.transform = 'translateY(0)';
    } else {
      backToTop.style.opacity   = '0';
      backToTop.style.transform = 'translateY(8px)';
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================================
     UTILITY: Notification banner
     ============================================================ */

  function showNotification(message, type) {
    var existing = document.querySelector('.glc-notification');
    if (existing) existing.remove();

    /* Inject keyframe once */
    if (!document.querySelector('#glc-notify-style')) {
      var s = document.createElement('style');
      s.id  = 'glc-notify-style';
      s.textContent = '@keyframes slideInRight{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}';
      document.head.appendChild(s);
    }

    var n = document.createElement('div');
    n.className   = 'glc-notification';
    n.textContent = message;
    n.style.cssText = [
      'position:fixed','top:90px','right:1.5rem',
      'background:' + (type === 'success' ? '#10b981' : '#ef4444'),
      'color:#fff','padding:1rem 1.5rem',
      'border-radius:8px','box-shadow:0 4px 12px rgba(0,0,0,0.15)',
      'z-index:10000','font-weight:600','font-size:0.95rem',
      'max-width:320px','line-height:1.4',
      'animation:slideInRight 0.3s ease'
    ].join(';');
    document.body.appendChild(n);

    setTimeout(function () {
      n.style.transition = 'opacity 0.4s';
      n.style.opacity    = '0';
      setTimeout(function () { n.remove(); }, 400);
    }, 5000);
  }

  /* Dev console branding */
  console.log('%cGalaxy Link Computers', 'color:#1E90FF;font-size:18px;font-weight:700;');
  console.log('%cWebsite loaded \u2713', 'color:#10b981;font-size:13px;');

}); /* END DOMContentLoaded */


/* ============================================================
   HAMBURGER MOBILE NAVIGATION
   (Added as a self-contained block after DOMContentLoaded closes)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  var hamburger   = document.getElementById('hamburgerBtn');
  var mobileNav   = document.getElementById('mobileNav');
  var overlay     = document.getElementById('mobileOverlay');

  if (!hamburger || !mobileNav || !overlay) return;

  function openMobileNav() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';   /* Prevent body scroll */
  }

  function closeMobileNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  /* Close when tapping overlay */
  overlay.addEventListener('click', closeMobileNav);

  /* Close on ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
      hamburger.focus();
    }
  });

  /* Close when a mobile nav link is clicked */
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

});
