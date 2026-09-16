/* =====================================================================
   ST. CLARE MONASTERY HELICICULTURE — SCRIPT.JS  (V2 · STABLE)
   File: script.js
   Purpose: Smooth, stable interactivity without visual glitches
===================================================================== */

(function () {
  'use strict';

  const CONFIG = {
    businessName: 'St. Clare Monastery Heliciculture'
  };

  /* -------------------------------------------------------------------
     1. AUTO YEAR
  ------------------------------------------------------------------- */
  function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------
     2. SMOOTH SCROLL (no header offset jitter)
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
     3. WHATSAPP TRACKING (silent, no UI glitch)
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
     4. SCROLL REVEAL (gentle, one-time only — no re-triggering)
  ------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.snail-card, .service-item, .contact-card, .address-block'
    );

    if (!targets.length) return;

    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 1s ease ${i * 0.05}s, transform 1s ease ${i * 0.05}s`;
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
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------------------------
     5. BOOT
  ------------------------------------------------------------------- */
  function init() {
    updateYear();
    initSmoothScroll();
    initWhatsAppLinks();
    initScrollReveal();

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
