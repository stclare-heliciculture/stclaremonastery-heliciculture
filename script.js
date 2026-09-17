/* =====================================================================
   ST. CLARE MONASTERY HELICICULTURE — SCRIPT.JS  (V5 · SLIDESHOW)
   File: script.js
   Includes:
     1. Auto-updating footer year
     2. Smooth scroll to sections
     3. WhatsApp click tracking
     4. Scroll reveal (fade-in on scroll)
     5. Email copy on click
     6. Nav click pulse (brown glow flash)
     7. Auto-active nav (glows the current page button)
     8. Sisters slideshow (auto-rotates every 5 seconds)
===================================================================== */

(function () {
  'use strict';

  const CONFIG = {
    businessName: 'St. Clare Monastery Heliciculture',
    phonePrimary: '2347043021005'
  };

  /* -------------------------------------------------------------------
     1. AUTO-UPDATING FOOTER YEAR
  ------------------------------------------------------------------- */
  function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* -------------------------------------------------------------------
     2. SMOOTH SCROLL — glides to anchor sections without jitter
  ------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 20,
          behavior: 'smooth'
        });
      });
    });
  }

  /* -------------------------------------------------------------------
     3. WHATSAPP LINK TRACKING — silent, no visual effect
  ------------------------------------------------------------------- */
  function initWhatsAppLinks() {
    document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');

      link.addEventListener('click', () => {
        const number = link.href.match(/wa\.me\/(\d+)/)?.[1] || 'unknown';
        console.log(`[WhatsApp] Opening chat with: ${number}`);
      });
    });
  }

  /* -------------------------------------------------------------------
     4. GENTLE SCROLL REVEAL — one-time only, no re-triggering
  ------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.snail-card, .service-item, .contact-card, .address-block, ' +
      '.value-card, .product-card, .about-closing, ' +
      '.nutrient-card, .blood-band, .why-choose, .order-band'
    );

    if (!targets.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.9s ease ${i * 0.05}s, transform 0.9s ease ${i * 0.05}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------------------------
     5. EMAIL COPY ON CLICK — silent clipboard copy
  ------------------------------------------------------------------- */
  function initEmailCopy() {
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.addEventListener('click', () => {
        const email = link.getAttribute('href').replace('mailto:', '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(() => {
            console.log(`[Clipboard] Email copied: ${email}`);
          }).catch(() => { /* silent */ });
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     6. NAV CLICK PULSE — brief brown glow when a nav button is tapped
  ------------------------------------------------------------------- */
  function initNavClickPulse() {
    document.querySelectorAll('.jesuit-nav .jesuit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.add('nav-pulse');
        setTimeout(() => btn.classList.remove('nav-pulse'), 700);
      });
    });
  }

  /* -------------------------------------------------------------------
     7. AUTO-ACTIVE NAV — glows the button matching the current page
  ------------------------------------------------------------------- */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.jesuit-nav .jesuit-btn').forEach((btn) => {
      const href = btn.getAttribute('href') || '';
      // Only auto-activate top-level page links (not anchors)
      if (href.endsWith('.html') && href === path) {
        btn.classList.add('jesuit-btn-active');
      }
    });
  }

  /* -------------------------------------------------------------------
     8. SISTERS SLIDESHOW — auto-rotates every 5 seconds
        - 3 images in the about.html slideshow
        - Smooth fade transitions
        - Dot indicators update live
        - Pauses on hover and when tab is hidden (saves CPU)
  ------------------------------------------------------------------- */
  function initSistersSlideshow() {
    const slideshow = document.getElementById('sistersSlideshow');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.slide-dots .dot');

    if (slides.length < 2) return;

    let current = 0;
    const INTERVAL = 5000; // 5 seconds per slide

    function goTo(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
      current = index;
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    // Start the rotation
    let timer = setInterval(next, INTERVAL);

    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
      clearInterval(timer);
    });

    slideshow.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(next, INTERVAL);
    });

    // Pause when the browser tab is hidden (saves battery)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        clearInterval(timer);
        timer = setInterval(next, INTERVAL);
      }
    });

    // Respect reduced-motion preference: don't auto-rotate
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearInterval(timer);
    }
  }

  /* -------------------------------------------------------------------
     9. BOOT — run everything on DOM ready
  ------------------------------------------------------------------- */
  function init() {
    updateYear();
    initSmoothScroll();
    initWhatsAppLinks();
    initScrollReveal();
    initEmailCopy();
    initNavClickPulse();
    initActiveNav();
    initSistersSlideshow();

    console.log(
      `%c${CONFIG.businessName} — site ready ✓`,
      'color:#ffe9c4; background:#2b1c11; padding:4px 10px; border-radius:4px; font-weight:600;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
