/* =====================================================================
   ST. CLARE MONASTERY HELICICULTURE — SCRIPT.JS  (V8 · LIGHTBOX)
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

  /* --- 4. Scroll reveal --- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.snail-card, .service-item, .contact-card, .address-block, ' +
      '.value-card, .product-card, .activity-card, .surroundings-card, ' +
      '.about-closing, .nutrient-card, .blood-band, .why-choose, ' +
      '.order-band, .choice-card, .portrait-card'
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
    const gallerySubPages = ['products.html', 'site.html', 'environs.html'];

    document.querySelectorAll('.jesuit-nav .jesuit-btn').forEach((btn) => {
      const href = btn.getAttribute('href') || '';

      if (href.endsWith('.html') && href === path) {
        btn.classList.add('jesuit-btn-active');
      }

      if (href === 'gallery.html' && gallerySubPages.includes(path)) {
        btn.classList.add('jesuit-btn-white-glow');
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

    function next() { goTo((current + 1) % slides.length); }

    let timer = setInterval(next, INTERVAL);
    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', () => { timer = setInterval(next, INTERVAL); });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        clearInterval(timer);
        timer = setInterval(next, INTERVAL);
      }
    });
  }

  /* -------------------------------------------------------------------
     9. LIGHTBOX — full-screen image viewer with prev/next navigation
  ------------------------------------------------------------------- */
  function initLightbox() {
    // Collect all gallery links that carry data-lightbox
    const galleryLinks = document.querySelectorAll('a[data-lightbox]');
    if (!galleryLinks.length) return;

    // Group links by their data-lightbox value (so each gallery cycles separately)
    const galleries = {};
    galleryLinks.forEach((link) => {
      const group = link.getAttribute('data-lightbox') || 'default';
      if (!galleries[group]) galleries[group] = [];
      galleries[group].push(link);
    });

    // Build the lightbox DOM once
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    lightbox.innerHTML = `
      <button class="lb-btn lb-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <button class="lb-close" aria-label="Close viewer"><i class="fas fa-times"></i></button>
      <div class="lb-image-wrap">
        <img src="" alt="" />
        <div class="lb-caption"></div>
      </div>
      <button class="lb-btn lb-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <div class="lb-counter"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lb-caption');
    const lbCounter = lightbox.querySelector('.lb-counter');
    const btnPrev = lightbox.querySelector('.lb-prev');
    const btnNext = lightbox.querySelector('.lb-next');
    const btnClose = lightbox.querySelector('.lb-close');

    let currentGroup = null;
    let currentIndex = 0;

    function open(group, index) {
      currentGroup = group;
      currentIndex = index;
      render();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      currentGroup = null;
    }

    function render() {
      const items = galleries[currentGroup];
      const link = items[currentIndex];
      const img = link.querySelector('img');
      const fig = link.closest('figure');
      const caption = fig ? fig.querySelector('figcaption') : null;

      lbImg.style.opacity = '0';
      setTimeout(() => {
        lbImg.src = link.getAttribute('href');
        lbImg.alt = img ? img.alt : '';
        lbCaption.textContent = caption ? caption.textContent.trim() : (img ? img.alt : '');
        lbCounter.textContent = `${currentIndex + 1} / ${items.length}`;
        lbImg.style.opacity = '1';
      }, 150);
    }

    function prev() {
      const items = galleries[currentGroup];
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      render();
    }

    function next() {
      const items = galleries[currentGroup];
      currentIndex = (currentIndex + 1) % items.length;
      render();
    }

    // Attach click handlers to every gallery link
    Object.keys(galleries).forEach((group) => {
      galleries[group].forEach((link, i) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          open(group, i);
        });
      });
    });

    // Controls
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
    btnClose.addEventListener('click', close);

    // Click backdrop closes
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // Swipe support on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) next(); else prev();
      }
    });
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
    initLightbox();

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
