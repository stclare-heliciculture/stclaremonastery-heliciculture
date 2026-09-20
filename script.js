/* =====================================================================
   ST. CLARE MONASTERY HELICICULTURE — SCRIPT.JS  (V6 · ACTIVITY GALLERY)
   File: script.js
===================================================================== */

(function () {
  'use strict';

  const CONFIG = {
    businessName: 'St. Clare Monastery Heliciculture',
    phonePrimary: '2347043021005'
  };

  /* --- 1. Auto year --- */
  function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* --- 2. Smooth scroll --- */
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

  /* --- 3. WhatsApp tracking --- */
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

  /* --- 4. Scroll reveal (now includes .activity-card) --- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.snail-card, .service-item, .contact-card, .address-block, ' +
      '.value-card, .product-card, .activity-card, .about-closing, ' +
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

  /* --- 5. Email copy --- */
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

  /* --- 6. Nav click pulse --- */
  function initNavClickPulse() {
    document.querySelectorAll('.jesuit-nav .jesuit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.add('nav-pulse');
        setTimeout(() => btn.classList.remove('nav-pulse'), 700);
      });
    });
  }

  /* --- 7. Auto-active nav --- */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.jesuit-nav .jesuit-btn').forEach((btn) => {
      const href = btn.getAttribute('href') || '';
      if (href.endsWith('.html') && href === path) {
        btn.classList.add('jesuit-btn-active');
      }
    });
  }

  /* --- 8. Sisters slideshow --- */
  function initSistersSlideshow() {
    const slideshow = document.getElementById('sistersSlideshow');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.slide-dots .dot');

    if (slides.length < 2) return;

    let current = 0;
    const INTERVAL = 5000;

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

    let timer = setInterval(next, INTERVAL);

    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', () => {
      timer = setInterval(next, INTERVAL);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        clearInterval(timer);
        timer = setInterval(next, INTERVAL);
      }
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearInterval(timer);
    }
  }

  /* --- Boot --- */
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
