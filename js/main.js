/* ============================================================
   LYNCHPIN ADVISORY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Three.js hero particles with scroll-driven drift ---- */
  const initThreeHeroScroll = () => {
    const hero = document.getElementById('hero');
    const canvasHost = document.getElementById('heroThreeCanvas');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hero || !canvasHost || typeof THREE === 'undefined' || reducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    canvasHost.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1700;
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 18;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      scales[i] = Math.random();
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xf5edd8,
        size: 0.07,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    scene.add(particles);

    const glowGeometry = new THREE.BufferGeometry();
    const glowCount = 420;
    const glowPositions = new Float32Array(glowCount * 3);
    for (let i = 0; i < glowCount; i += 1) {
      const i3 = i * 3;
      glowPositions[i3] = (Math.random() - 0.5) * 22;
      glowPositions[i3 + 1] = (Math.random() - 0.5) * 14;
      glowPositions[i3 + 2] = (Math.random() - 0.5) * 16;
    }
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
    const glowParticles = new THREE.Points(
      glowGeometry,
      new THREE.PointsMaterial({
        color: 0xc8a46a,
        size: 0.11,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    scene.add(glowParticles);

    const rim = new THREE.PointLight(0xe5c97c, 18, 24);
    rim.position.set(5, 4, 5);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const pointer = { x: 0, y: 0 };
    let scrollProgress = 0;

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      const w = Math.max(bounds.width, 1);
      const h = Math.max(bounds.height, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const raw = 1 - Math.min(Math.max(rect.bottom / (rect.height + viewport), 0), 1);
      scrollProgress = raw;
    };

    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsed = clock.getElapsedTime();

      const pos = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i += 1) {
        const i3 = i * 3;
        pos[i3 + 1] += 0.004 + scales[i] * 0.002;
        pos[i3] += Math.sin(elapsed * 0.2 + i) * 0.00045;
        if (pos[i3 + 1] > 8.5) {
          pos[i3 + 1] = -8.5;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      particles.rotation.y = elapsed * 0.016 + scrollProgress * 0.24;
      particles.rotation.x = elapsed * 0.007 + scrollProgress * 0.14;
      glowParticles.rotation.y = -elapsed * 0.012;
      glowParticles.rotation.x = Math.sin(elapsed * 0.25) * 0.08;

      camera.position.z = 8.6 - scrollProgress * 1.1;
      camera.position.x = pointer.x * 0.35;
      camera.position.y = -pointer.y * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    resize();
    onScroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    tick();
  };

  initThreeHeroScroll();

  /* ---- Three.js CTA ambient particles ---- */
  const initCtaThreeFx = () => {
    const host = document.getElementById('ctaThreeFx');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!host || typeof THREE === 'undefined' || reducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    host.appendChild(renderer.domElement);

    const pointsGeo = new THREE.BufferGeometry();
    const count = 320;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      data[i3] = (Math.random() - 0.5) * 10;
      data[i3 + 1] = (Math.random() - 0.5) * 6;
      data[i3 + 2] = (Math.random() - 0.5) * 6;
    }
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(data, 3));

    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({
        color: 0xe5c97c,
        size: 0.06,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    scene.add(points);

    const resize = () => {
      const w = Math.max(host.clientWidth, 1);
      const h = Math.max(host.clientHeight, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.09;
      points.rotation.x = Math.sin(t * 0.35) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    tick();
  };

  initCtaThreeFx();

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
    '.team-member-card, .gallery-item, .portfolio-entry, .logo-chip, ' +
    '.partner-card, .trusted-header, .contact-tagline, .purpose-card, .purpose-intro'
  );

  fadeEls.forEach((el, idx) => {
    el.classList.add('fade-up');
    el.style.setProperty('--stagger-delay', `${Math.min(idx * 45, 360)}ms`);
  });

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


  /* ---- Interactive depth hover for cards ---- */
  const depthCards = document.querySelectorAll('.pathway-card, .region-card, .partner-card, .contact-booking-card');
  depthCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltY = (x - 0.5) * 8;
      const tiltX = (0.5 - y) * 6;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


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


  /* ---- Founder photo slider (Services page) ---- */
  const founderSliders = document.querySelectorAll('.founder-slider');

  founderSliders.forEach((slider) => {
    const slides = slider.querySelectorAll('.founder-slide');
    const dots = slider.querySelectorAll('.founder-dot');
    const prevBtn = slider.querySelector('.founder-slider-btn.prev');
    const nextBtn = slider.querySelector('.founder-slider-btn.next');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const autoplayEnabled = slider.dataset.autoplay === 'true';
    const interval = Number(slider.dataset.interval) || 4500;

    const setSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentIndex);
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      if (!autoplayEnabled || slides.length < 2) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => setSlide(currentIndex + 1), interval);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        setSlide(currentIndex - 1);
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        setSlide(currentIndex + 1);
        startAutoplay();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const nextIndex = Number(dot.dataset.slide);
        if (!Number.isNaN(nextIndex)) {
          setSlide(nextIndex);
          startAutoplay();
        }
      });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    setSlide(0);
    startAutoplay();
  });

//Case Studies
    // Hamburger menu
    document.addEventListener('DOMContentLoaded', function() {
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('navLinks');
      if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
          navLinks.classList.toggle('open');
          this.classList.toggle('active');
        });
      }
    });

    // Lightbox
    document.addEventListener('DOMContentLoaded', function() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightboxImg');
      const closeBtn = document.getElementById('lightboxClose');

      galleryItems.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          if (img) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
          }
        });
      });

      function closeLightbox() {
        lightbox.classList.remove('active');
      }

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (lightbox) lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
      });
    });

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

  /* ---- Dynamic copyright year ---- */
  const yearEls = document.querySelectorAll('.js-current-year');
  if (yearEls.length) {
    const year = String(new Date().getFullYear());
    yearEls.forEach((el) => {
      el.textContent = year;
    });
  }

});
