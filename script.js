document.addEventListener('DOMContentLoaded', () => {
  // Initialize Icons
  lucide.createIcons();

  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
  }

  // Re-initialize icons if changed
  lucide.createIcons();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.setAttribute('data-lucide', 'moon');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.setAttribute('data-lucide', 'sun');
      }
      lucide.createIcons();
    });
  }

  // Active Link State
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    // Basic check for active link based on href vs path
    const linkPath = link.getAttribute('href');
    if (linkPath === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      link.classList.add('active');
    } else if (linkPath !== '/' && currentPath.includes(linkPath.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    lerp: 0.1,
    infinite: false,
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Trackpad / High-frequency device detection
  window.addEventListener('wheel', (e) => {
    // Trackpads usually emit many small delta events. 
    // Increase lerp for immediate response on trackpads.
    if (Math.abs(e.deltaY) < 10) {
      lenis.options.lerp = 0.25;
    } else {
      lenis.options.lerp = 0.1;
    }
  }, { passive: true });

  // Register GSAP ScrollTrigger and TextPlugin
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // --- Hero Typewriter Effect (Context-Switch Logic) ---
  const typewriterElement = document.getElementById('typewriter');
  const heroTitle = document.getElementById('hero-title');
  
  if (typewriterElement && heroTitle) {
    const mainTimeline = gsap.timeline({ repeat: -1 });

    // Helper function for typing/pausing/deleting
    const typeSequence = (text, pause) => {
      const typeDur = text.length * 0.08;
      mainTimeline
        .to(typewriterElement, {
          duration: typeDur,
          text: text,
          ease: "none"
        })
        .to({}, { duration: pause })
        .to(typewriterElement, {
          duration: typeDur * 0.4,
          text: "",
          ease: "none"
        });
    };

    // Helper for title switch
    const switchTitle = (newText) => {
      mainTimeline.to(heroTitle, {
        opacity: 0,
        y: -15,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => { heroTitle.textContent = newText; }
      })
      .to(heroTitle, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    // Stage 1: The Intro
    mainTimeline.set(heroTitle, { textContent: "Hey there!" });
    typeSequence("I'm Blessed...", 2);

    // Stage 2: The Identity
    switchTitle("A Nigerian");
    typeSequence("Law Student", 2);

    // Stage 3: The Specialization
    switchTitle("Specializing in:");
    const niches = ["Data Privacy", "Compliance", "Cybercrime", "Blockchain", "AI Governance"];
    niches.forEach(niche => {
      typeSequence(niche, 1.5);
    });

    // The Reset
    switchTitle("Hey there!");
  }

  // Sync GSAP with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Stacked to Spread Animation (Scroll-Driven)
  const stackGrids = document.querySelectorAll('.stack-grid');

  stackGrids.forEach((grid) => {
    const cards = grid.querySelectorAll('.stack-card');

    // Initial Stacked State
    gsap.set(cards, {
      y: 150,
      x: (i) => (i - (cards.length - 1) / 2) * -30, // Clustered in center
      rotationX: -15,
      rotationZ: (i) => (i - (cards.length - 1) / 2) * 5, // Subtle fan
      scale: 0.85,
      opacity: 0,
      clipPath: "inset(0 0 100% 0)",
      zIndex: (i) => cards.length - i
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: "top 90%",
        end: "top 40%",
        scrub: 1.5, // High-end smoothing
      }
    });

    tl.to(cards, {
      y: 0,
      x: 0,
      rotationX: 0,
      rotationZ: 0,
      scale: 1,
      opacity: 1,
      clipPath: "inset(0 0 0% 0)",
      stagger: 0.15,
      ease: "power2.out"
    });
  });

  // 3D Tilt Effect (Mouse Interactive)
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation based on cursor distance from center
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto"
      });
    });
  });

  // Legal-Tech Evolution Timeline
  const timelineSection = document.getElementById('timeline-section');
  if (timelineSection) {
    const line = timelineSection.querySelector('.timeline-line-inner');
    const milestones = timelineSection.querySelectorAll('.milestone-card');

    if (line) {
      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timelineSection,
          start: "top 70%",
          end: "bottom 80%",
          scrub: true
        }
      });
    }

    milestones.forEach((milestone, i) => {
      gsap.from(milestone, {
        opacity: 0,
        x: i % 2 === 0 ? -50 : 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: milestone,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-back'
  });

  // Refresh ScrollTrigger to ensure all positions are correct
  ScrollTrigger.refresh();

  // Hero Parallax Effect
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    lenis.on('scroll', (e) => {
      const scrollY = e.scroll;
      // Subtle parallax: move background slower than scroll
      heroSection.style.backgroundPosition = `70% calc(10% + ${scrollY * 0.15}px)`;
    });
  }

  // --- Context-Aware Navbar Logic ---
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section');
  const wordmark = document.querySelector('.wordmark-anchored');
  const actions = document.querySelector('.navbar-actions-anchored');

  const updateNavState = () => {
    if (!header) return;
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    const hero = document.querySelector('.hero-section');
    
    // 1. Force state for sub-pages (About, Contact, etc.)
    if (!hero) {
      if (isLightTheme) {
        header.classList.add('nav-dark-mode');
      } else {
        header.classList.remove('nav-dark-mode');
      }
      return; // No need for observer on static sub-pages
    }

    // 2. Dynamic logic for Home Page (Hero + Sections)
    if (sections.length > 0) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const isDarkSection = entry.target.classList.contains('hero-section') || entry.target.classList.contains('dark-section');
            if (!isDarkSection && isLightTheme) {
              header.classList.add('nav-dark-mode');
            } else {
              header.classList.remove('nav-dark-mode');
            }
          }
        });
      }, {
        rootMargin: '-10px 0px -90% 0px',
        threshold: 0
      });

      sections.forEach(section => navObserver.observe(section));
    }
  };

  updateNavState();

  // Re-run logic when theme changes or on scroll for extra safety
  window.addEventListener('scroll', updateNavState);
  
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTimeout(updateNavState, 10);
    });
  }

  // Handle subtle interaction on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      if (wordmark) wordmark.style.opacity = '0.8';
      if (actions) actions.style.opacity = '0.8';
    } else {
      if (wordmark) wordmark.style.opacity = '1';
      if (actions) actions.style.opacity = '1';
    }
  });

  // --- Slim Click-to-Toggle Dropdowns ---
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link');
    const content = dropdown.querySelector('.dropdown-content');
    const links = content.querySelectorAll('a');

    if (trigger && content) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isActive = dropdown.classList.contains('active');

        // Close all other dropdowns
        dropdowns.forEach(d => {
          if (d !== dropdown && d.classList.contains('active')) {
            d.classList.remove('active');
            gsap.to(d.querySelector('.dropdown-content'), { 
              opacity: 0, 
              y: 10, 
              visibility: 'hidden', 
              duration: 0.3,
              ease: "power2.in"
            });
          }
        });

        if (!isActive) {
          dropdown.classList.add('active');
          gsap.killTweensOf([content, links]);
          gsap.fromTo(content, 
            { opacity: 0, y: 10, visibility: 'hidden' },
            { opacity: 1, y: 0, visibility: 'visible', duration: 0.3, ease: "power2.out" }
          );
          gsap.fromTo(links, 
            { opacity: 0, y: 5 },
            { opacity: 1, y: 0, duration: 0.2, stagger: 0.03, ease: "power1.out", delay: 0.1 }
          );
        } else {
          dropdown.classList.remove('active');
          gsap.to(content, { 
            opacity: 0, 
            y: 10, 
            visibility: 'hidden', 
            duration: 0.3, 
            ease: "power2.in" 
          });
        }
      });
    }
  });

  // Global click to close dropdowns
  window.addEventListener('click', () => {
    dropdowns.forEach(d => {
      if (d.classList.contains('active')) {
        d.classList.remove('active');
        gsap.to(d.querySelector('.dropdown-content'), { 
          opacity: 0, 
          y: 10, 
          visibility: 'hidden', 
          duration: 0.3,
          ease: "power2.in"
        });
      }
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navLinksContainer.classList.contains('mobile-active');
      if (isVisible) {
        gsap.to(navLinksContainer, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            navLinksContainer.classList.remove('mobile-active');
            navLinksContainer.style.display = 'none';
          }
        });
      } else {
        navLinksContainer.style.display = 'flex';
        navLinksContainer.classList.add('mobile-active');
        gsap.fromTo(navLinksContainer, 
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    });
  }
});
