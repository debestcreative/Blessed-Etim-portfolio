document.addEventListener('DOMContentLoaded', () => {
  // Initialize Icons
  lucide.createIcons();

  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
  }

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
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-panel a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      link.classList.add('active');
    } else if (linkPath !== 'index.html' && currentPath.includes(linkPath)) {
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

  // Register GSAP ScrollTrigger and TextPlugin
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // --- Hero Typewriter Effect (Home Page Only) ---
  const typewriterElement = document.getElementById('typewriter');
  const heroTitle = document.getElementById('hero-title');
  
  if (typewriterElement && heroTitle) {
    const mainTimeline = gsap.timeline({ repeat: -1 });
    const typeSequence = (text, pause) => {
      const typeDur = text.length * 0.08;
      mainTimeline
        .to(typewriterElement, { duration: typeDur, text: text, ease: "none" })
        .to({}, { duration: pause })
        .to(typewriterElement, { duration: typeDur * 0.4, text: "", ease: "none" });
    };

    const switchTitle = (newText) => {
      mainTimeline.to(heroTitle, {
        opacity: 0, y: -15, duration: 0.4, ease: "power2.inOut",
        onComplete: () => { heroTitle.textContent = newText; }
      })
      .to(heroTitle, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    };

    mainTimeline.set(heroTitle, { textContent: "Hey there!" });
    typeSequence("I'm Blessed...", 2);
    switchTitle("A Nigerian");
    typeSequence("Law Student", 2);
    switchTitle("Specializing in:");
    ["Data Privacy", "Compliance", "Cybercrime", "Blockchain", "AI Governance"].forEach(n = > typeSequence(n, 1.5));
    switchTitle("Hey there!");
  }

  // Sync GSAP with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Card Animation Logic
  const stackGrids = document.querySelectorAll('.stack-grid');
  stackGrids.forEach((grid) => {
    const cards = grid.querySelectorAll('.stack-card');
    if (cards.length === 0) return;
    gsap.set(cards, {
      y: 150, scale: 0.85, opacity: 0, clipPath: "inset(0 0 100% 0)", zIndex: (i) => cards.length - i
    });
    gsap.timeline({
      scrollTrigger: { trigger: grid, start: "top 90%", end: "top 40%", scrub: 1.5 }
    }).to(cards, {
      y: 0, scale: 1, opacity: 1, clipPath: "inset(0 0 0% 0)", stagger: 0.15, ease: "power2.out"
    });
  });

  // AOS Init
  AOS.init({ duration: 1000, once: true, offset: 100, easing: 'ease-out-back' });
  ScrollTrigger.refresh();

  // Parallax
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    lenis.on('scroll', (e) => {
      if (window.innerWidth <= 768) return;
      heroSection.style.backgroundPosition = `70% calc(10% + ${e.scroll * 0.15}px)`;
    });
  }

  // --- Context-Aware Navbar Logic ---
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');

  const updateNavState = () => {
    if (!header) return;
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    const hero = document.querySelector('.hero-section');
    
    const setNavDark = (isDark) => {
      if (isDark) {
        header.classList.add('nav-dark-mode');
        if (mobileNavPanel) mobileNavPanel.classList.add('nav-dark-mode');
      } else {
        header.classList.remove('nav-dark-mode');
        if (mobileNavPanel) mobileNavPanel.classList.remove('nav-dark-mode');
      }
    };

    if (!hero) {
      setNavDark(isLightTheme);
      return;
    }

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isDarkSection = entry.target.classList.contains('hero-section') || entry.target.classList.contains('dark-section');
          setNavDark(!isDarkSection && isLightTheme);
        }
      });
    }, { rootMargin: '-10px 0px -90% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  };

  updateNavState();
  window.addEventListener('scroll', updateNavState);
  if (themeToggle) themeToggle.addEventListener('click', () => setTimeout(updateNavState, 10));

  // Mobile Menu Logic
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn && mobileNavPanel) {
    const toggleMenu = (open) => {
      const icon = mobileMenuBtn.querySelector('i');
      if (open) {
        mobileNavPanel.style.display = 'flex';
        mobileNavPanel.classList.add('mobile-active');
        gsap.fromTo(mobileNavPanel, { opacity: 0, scale: 0.9, y: -20, transformOrigin: 'top right' }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" });
        if (icon) { icon.setAttribute('data-lucide', 'x'); lucide.createIcons(); }
      } else {
        gsap.to(mobileNavPanel, { opacity: 0, scale: 0.9, y: -20, duration: 0.3, ease: "power2.in", onComplete: () => {
          mobileNavPanel.classList.remove('mobile-active');
          mobileNavPanel.style.display = 'none';
        }});
        if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
      }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(!mobileNavPanel.classList.contains('mobile-active'));
    });

    mobileNavPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('click', (e) => {
      if (mobileNavPanel.classList.contains('mobile-active') && !mobileNavPanel.contains(e.target) && !mobileMenuBtn.contains(e.target)) toggleMenu(false);
    });
  }
});
