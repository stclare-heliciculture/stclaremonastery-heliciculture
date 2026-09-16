/* =====================================================================
   ST. CLARE MONASTERY HELICICULTURE — MAIN SCRIPT
   File: script.js
   Purpose: Interactivity, animations, tracking, and dynamic content
===================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------------
     0. CONFIG — central place to change business info
  ------------------------------------------------------------------- */
  const CONFIG = {
    phonePrimary:   '2347043021005',      // WhatsApp number (no +)
    phoneSecondary: '2349150500267',      // second WhatsApp (no +)
    businessName:   'St. Clare Monastery Heliciculture',
    defaultMessage: 'Hello St. Clare Monastery Heliciculture, I would like to place an order.'
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
     2. SCROLL REVEAL — fade/slide elements into view as user scrolls
  ------------------------------------------------------------------- */
  function initScrollReveal() {
    // Elements we want to animate on scroll
    const targets = document.querySelectorAll(
      '.snail-card, .service-item, .contact-card, .address-block, .section-title, .section-subtitle'
    );

    if (!targets.length) return;

    // Prepare each target with initial hidden state
    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = `opacity 0.9s ease ${i * 0.08}s, transform 0.9s ease ${i * 0.08}s`;
      el.style.willChange = 'opacity, transform';
    });

    // IntersectionObserver: trigger animation when element enters viewport
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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------------------------
     3. GENERATE SPARKLES DYNAMICALLY AROUND THE LOGO
        Adds extra twinkling stars with random positions & delays
  ------------------------------------------------------------------- */
  function generateLogoSparkles() {
    const wrap = document.querySelector('.hero-logo-wrap');
    if (!wrap) return;

    // Only add if not already populated beyond the static ones
    const existing = wrap.querySelectorAll('.sparkle');
    const staticCount = existing.length;

    // Add 6 extra dynamic sparkles
    const extra = 6;

    for (let i = 0; i < extra; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';

      // Random position in a ring around the logo
      const angle = (Math.PI * 2 * i) / extra + Math.random() * 0.6;
      const radius = 45 + Math.random() * 20; // % from center
      const left = 50 + Math.cos(angle) * radius;
      const top  = 50 + Math.sin(angle) * radius;

      sparkle.style.left = left + '%';
      sparkle.style.top  = top + '%';
      sparkle.style.animationDelay = (Math.random() * 2.5).toFixed(2) + 's';
      sparkle.style.width = (4 + Math.random() * 5).toFixed(1) + 'px';
      sparkle.style.height = sparkle.style.width;

      wrap.appendChild(sparkle);
    }
  }

  /* -------------------------------------------------------------------
     4. WHATSAPP CLICK TRACKING + AUTO-MESSAGE
        Ensures every WhatsApp link opens the correct chat & logs the click
  ------------------------------------------------------------------- */
  function initWhatsAppLinks() {
    const links = document.querySelectorAll('a[href*="wa.me"]');

    links.forEach((link) => {
      // Ensure target & rel are set correctly
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');

      link.addEventListener('click', (e) => {
        // Log click for analytics (visible in console; can hook to GA later)
        const number = link.href.match(/wa\.me\/(\d+)/)?.[1] || 'unknown';
        console.log(`[WhatsApp] Opening chat with: ${number}`);

        // Optional: send event to analytics if gtag exists
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'whatsapp_click', {
            event_category: 'engagement',
            event_label: number
          });
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     5. SMOOTH SCROLL FOR ANCHOR LINKS (with header offset)
  ------------------------------------------------------------------- */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 20; // small breathing room
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Optionally update the URL hash
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     6. PARALLAX ON LOGO — subtle movement as user scrolls
  ------------------------------------------------------------------- */
  function initLogoParallax() {
    const wrap = document.querySelector('.hero-logo-wrap');
    if (!wrap) return;

    let ticking = false;

    function update() {
      const scrollY = window.pageYOffset;
      // Move logo slightly upward as we scroll (max 40px)
      const offset = Math.min(scrollY * 0.15, 40);
      wrap.style.transform = `translateY(-${offset}px)`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    });
  }

  /* -------------------------------------------------------------------
     7. FADE-IN HERO ON PAGE LOAD
  ------------------------------------------------------------------- */
  function initHeroIntro() {
    const heroChildren = document.querySelectorAll(
      '.hero h1, .hero .tagline, .hero .nav-buttons, .hero-logo-wrap, .hero-divider'
    );

    heroChildren.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 1s ease ${0.15 + i * 0.15}s, transform 1s ease ${0.15 + i * 0.15}s`;

      // Trigger after a frame so browser paints initial state first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* -------------------------------------------------------------------
     8. COPY EMAIL TO CLIPBOARD ON CLICK
  ------------------------------------------------------------------- */
  function initEmailCopy() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const email = link.getAttribute('href').replace('mailto:', '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(() => {
            console.log(`[Clipboard] Email copied: ${email}`);
          }).catch(() => {/* silent fail */});
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     9. LIVE CLOCK IN TOP BAR (optional — comment out if not wanted)
        Uncomment the <span id="live-clock"></span> in HTML to use.
  ------------------------------------------------------------------- */
  function initLiveClock() {
    const clock = document.getElementById('live-clock');
    if (!clock) return;

    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      clock.textContent = `${hh}:${mm}`;
    }

    tick();
    setInterval(tick, 30000); // update every 30s
  }

  /* -------------------------------------------------------------------
     10. BOOT — run everything on DOM ready
  ------------------------------------------------------------------- */
  function init() {
    updateYear();
    initHeroIntro();
    generateLogoSparkles();
    initScrollReveal();
    initWhatsAppLinks();
    initSmoothScroll();
    initLogoParallax();
    initEmailCopy();
    initLiveClock();

    console.log(`%c${CONFIG.businessName} — site ready ✓`,
      'color:#ffe9c4; background:#2b1c11; padding:4px 10px; border-radius:4px; font-weight:600;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
