/* ============================================================
   LYNCHPIN ADVISORY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll behavior ---- */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  /* ---- Smooth scroll for same-page anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash === '#' || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // If arriving with a hash (e.g. from another page), scroll to it after load
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 200);
    }
  }


  /* ---- Scroll-triggered fade-in animations ---- */
  const fadeEls = document.querySelectorAll(
    '.service-card, .about-card, .pillar, .impact-item, .feature, ' +
    '.insight-card, .team-card-main, .contact-item, .region-card, ' +
    '.pathway-card, .plan-card, .us-service-card, .strength-card, ' +
    '.team-member-card, .gallery-item, .portfolio-entry, .logo-chip'
  );

  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));


  /* ---- Section header fade-in ---- */
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(el => el.classList.add('fade-up'));

  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sectionHeaders.forEach(el => headerObserver.observe(el));


  /* ---- Animated counter for impact/hero stat numbers ---- */
  const counters = document.querySelectorAll('.impact-num, .stat-num');

  const parseValue = (str) => {
    const cleaned = str.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const formatValue = (original, current) => {
    if (original.includes('$')) return `$${Math.round(current)}M+`;
    if (original.includes('+')) return `${Math.round(current)}+`;
    return `${Math.round(current)}`;
  };

  const animateCounter = (el) => {
    const original = el.textContent.trim();
    const target = parseValue(original);
    if (!target) return;
    const duration = 2800;
    const start = performance.now();
    el.textContent = formatValue(original, 0);

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(original, eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = original;
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  /* ---- Contact form submission ---- */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const btnText   = submitBtn.querySelector('span');
      const original  = btnText.textContent;

      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';
      if (success) success.style.display = 'none';
      if (error) error.style.display = 'none';

      try {
        const data = {
          first_name:   form.firstName.value.trim(),
          last_name:    form.lastName.value.trim(),
          email:        form.email.value.trim(),
          organization: form.organization.value.trim(),
          interest:     form.interest.value,
          message:      form.message.value.trim(),
          website:      form.website ? form.website.value.trim() : '',
          submitted_at: new Date().toISOString()
        };

        const res = await fetch(form.action, {
          method: form.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!res.ok && res.status !== 201) {
          throw new Error('Submission failed');
        }

        form.reset();
        if (success) {
          success.style.display = 'flex';
          setTimeout(() => { success.style.display = 'none'; }, 6000);
        }
      } catch (err) {
        if (error) error.style.display = 'flex';
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = original;
      }
    });
  }

  /* ---- Active nav link highlighting (same-page sections only) ---- */
  const sections = document.querySelectorAll('section[id]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navAnchors = document.querySelectorAll('.nav-links a[href*="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      const href = a.getAttribute('href');
      if (href.includes(currentPath) || href.startsWith('#')) {
        a.classList.remove('active');
        if (href.endsWith(`#${current}`)) {
          a.classList.add('active');
        }
      }
    });
  };

  if (sections.length) {
    window.addEventListener('scroll', highlightNav, { passive: true });
  }

});
