/**
 * FIRAS BELARBI - PORTFOLIO ENGINE (FINAL VERSION)
 * Vanilla JavaScript (Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
   * 1. CURSEUR PERSONNALISÉ ULTRA VISIBLE ET LUMINEUX
   * ========================================================================== */
  (function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (!cursorDot || !cursorOutline || window.innerWidth < 992) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      // Animation d'inertie fluide (Lerp)
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Interaction au survol des éléments cliquables
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .spotlight-card, .filter-btn, .copy-trigger, .nav-link');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
  })();

  /* ==========================================================================
   * 2. INTRO ANIMATION FULLSCREEN CONTROLLER
   * ========================================================================== */
  (function initIntroAnimation() {
    const introScreen = document.getElementById('intro-screen');
    const introTextContainer = document.getElementById('intro-text');
    const lineFill = document.getElementById('intro-line-fill');
    const introCanvas = document.getElementById('intro-canvas');

    if (!introScreen || !introTextContainer) return;

    document.body.classList.add('intro-active');

    const sentence = "Êtes-vous prêt à vivre une expérience que vous vivrez pour la première fois de votre vie ?";
    const highlightWords = ["expérience", "première", "vie"];
    const words = sentence.split(" ");

    let timeouts = [];
    let isFinished = false;

    introTextContainer.innerHTML = words.map(word => {
      const cleanWord = word.replace(/[^\wàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]/g, '').toLowerCase();
      const isHighlight = highlightWords.includes(cleanWord);
      return `<span class="intro-word ${isHighlight ? 'highlight' : ''}">${word}</span>`;
    }).join(" ");

    const wordElements = introTextContainer.querySelectorAll('.intro-word');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = null;
    if (introCanvas) {
      const ctx = introCanvas.getContext('2d');
      let particles = [];

      function resizeIntroCanvas() {
        introCanvas.width = window.innerWidth;
        introCanvas.height = window.innerHeight;
      }
      resizeIntroCanvas();
      window.addEventListener('resize', resizeIntroCanvas);

      const particleCount = window.innerWidth < 768 ? 20 : 45;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * introCanvas.width,
          y: Math.random() * introCanvas.height,
          radius: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4
        });
      }

      function renderParticles() {
        if (isFinished) return;
        ctx.clearRect(0, 0, introCanvas.width, introCanvas.height);

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = introCanvas.width;
          if (p.x > introCanvas.width) p.x = 0;
          if (p.y < 0) p.y = introCanvas.height;
          if (p.y > introCanvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(108, 99, 255, ${p.alpha})`;
          ctx.fill();
        });
        animationFrameId = requestAnimationFrame(renderParticles);
      }
      renderParticles();
    }

    function finishIntro() {
      if (isFinished) return;
      isFinished = true;

      timeouts.forEach(clearTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      introScreen.classList.add('intro-outro');
      document.body.classList.add('intro-complete');
      document.body.classList.remove('intro-active');

      setTimeout(() => {
        introScreen.style.display = 'none';
        handleBackToTopVisibility();
      }, 900);
    }

    if (prefersReducedMotion) {
      wordElements.forEach(el => el.classList.add('active'));
      setTimeout(finishIntro, 300);
      return;
    }

    const wordDelay = 110;
    words.forEach((_, index) => {
      const t = setTimeout(() => {
        if (!isFinished && wordElements[index]) {
          wordElements[index].classList.add('active');
          if (lineFill) {
            lineFill.style.width = `${((index + 1) / words.length) * 100}%`;
          }
        }
      }, index * wordDelay);
      timeouts.push(t);
    });

    const totalTime = words.length * wordDelay;

    const tGlow = setTimeout(() => {
      if (!isFinished) {
        introTextContainer.classList.add('final-pulse');
      }
    }, totalTime + 400);
    timeouts.push(tGlow);

    const tOutro = setTimeout(() => {
      finishIntro();
    }, totalTime + 1100);
    timeouts.push(tOutro);

  })();

  /* ==========================================================================
   * 3. BOUTON RETOUR EN HAUT
   * ========================================================================== */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTopVisibility() {
    const isIntroActive = document.body.classList.contains('intro-active');
    if (!isIntroActive && window.scrollY > window.innerHeight * 0.85) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTopVisibility);

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================================
   * 4. SKILLS PROGRESS BARS & REVEAL ANIMATION
   * ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        const progressFills = entry.target.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
          if (!fill.classList.contains('animated')) {
            fill.classList.add('animated');
            const targetWidth = fill.getAttribute('data-width') || '0%';
            fill.style.width = '0%';
            setTimeout(() => {
              fill.style.width = targetWidth;
            }, 100);
          }
        });

        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  function animateCounter(counter) {
    if (counter.classList.contains('counted')) return;
    counter.classList.add('counted');
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const update = () => {
      count++;
      counter.innerText = count;
      if (count < target) setTimeout(update, 50);
      else counter.innerText = target;
    };
    update();
  }

  /* ==========================================================================
   * 5. NAVBAR SCROLL & ACTIVE LINK SPY
   * ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
   * 6. PROJECT FILTERING
   * ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  /* ==========================================================================
   * 7. MOBILE HAMBURGER MENU
   * ========================================================================== */
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerToggle && navMenu) {
    hamburgerToggle.addEventListener('click', () => {
      hamburgerToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  /* ==========================================================================
   * 8. SPOTLIGHT & TYPEWRITER EFFECTS
   * ========================================================================== */
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  const typewriterElement = document.getElementById('typewriter');
  const words = ['Full-Stack Developer', 'Web Architect', 'AI Integrator', 'Problem Solver'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    if (!typewriterElement) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }
  type();

  /* ==========================================================================
   * 9. CANVAS PARTICULÉS DE FOND
   * ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = 'rgba(108, 99, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* Toast notification */
  document.querySelectorAll('.copy-trigger').forEach(item => {
    item.addEventListener('click', () => {
      const textToCopy = item.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const toast = document.getElementById('toast');
          const toastMsg = document.getElementById('toast-message');
          if (toast && toastMsg) {
            toastMsg.innerText = `Copié : ${textToCopy}`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
          }
        });
      }
    });
  });

  /* ==========================================================================
   * 10. GESTION DES MODALES / POP-UPS DE PROJETS
   * ========================================================================== */
  const modalOverlay = document.getElementById('modal-overlay');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(targetModalId);

      if (modalOverlay && targetModal) {
        document.querySelectorAll('.project-modal-card').forEach(m => m.classList.remove('active'));
        targetModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.querySelectorAll('.project-modal-card').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = 'auto';
    }
  }

  closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

});

/* ==========================================================================
   11. ENVOI DE FORMULAIRE VIA EMAILJS
   ========================================================================== */
async function handleFormSubmit() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');

  // Remplacez ces 2 constantes par vos identifiants depuis le tableau de bord EmailJS
  const SERVICE_ID = 'VOTRE_SERVICE_ID';
  const TEMPLATE_ID = 'VOTRE_TEMPLATE_ID';

  if (statusDiv) {
    statusDiv.className = 'form-status';
    statusDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
  }

  try {
    await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

    statusDiv.className = 'form-status success';
    statusDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> Votre message a bien été envoyé !';
    form.reset();
  } catch (error) {
    console.error('Erreur EmailJS:', error);
    statusDiv.className = 'form-status error';
    statusDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Échec de l\'envoi. Vérifiez votre Service ID et Template ID.';
  }

  setTimeout(() => {
    if (statusDiv) statusDiv.innerHTML = '';
  }, 5000);
}