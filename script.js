/* =====================================================================
   ST. CLARE MONASTERY HELICICULTURE — SCRIPT.JS  (V4 · FULL)
   File: script.js
   Includes: year, smooth scroll, WhatsApp tracking, scroll reveal,
             email copy, nav click pulse, active nav highlight
===================================================================== */

(function () {
  'use strict';

  const CONFIG = {
    businessName: 'St. Clare Monastery Heliciculture',
    phonePrimary: '2347043021005'
  };

  /* -------------------------------------------------------------------
     1. AUTO YEAR
  ------------------------------------------------------------------- */
  function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------
     2. SMOOTH SCROLL
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
     3. WHATSAPP TRACKING
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
     4. SCROLL REVEAL
  ------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.snail-card, .service-item, .contact-card, .address-block, .value-card, .product-card, .about-closing'
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
     5. EMAIL COPY
  ------------------------------------------------------------------- */
  function initEmailCopy() {
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.addEventListener('click', () => {
        const email = link.getAttribute('href').replace('mailto:', '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(() => {
            console.log(`[Clipboard] Email copied: ${email}`);
          }).catch(() => {});
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
      if (href.endsWith('.html') && href === path) {
        btn.classList.add('jesuit-btn-active');
      }
    });
  }

  /* -------------------------------------------------------------------
     8. BOOT
  ------------------------------------------------------------------- */
  function init() {
    updateYear();
    initSmoothScroll();
    initWhatsAppLinks();
    initScrollReveal();
    initEmailCopy();
    initNavClickPulse();
    initActiveNav();

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
