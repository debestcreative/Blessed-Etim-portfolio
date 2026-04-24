document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Safe Icon Initialization ---
  const initIcons = () => {
    try {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (e) {
      console.error("Lucide icons failed to load:", e);
    }
  };
  initIcons();

  // --- 2. Theme Toggle Logic ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.setAttribute('data-lucide', 'sun');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.setAttribute('data-lucide', 'moon');
    }
    initIcons();

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
      initIcons();
    });
  }

  });

  // --- 3. Active Link State ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      link.classList.add('active');
    } else if (linkPath !== '/' && currentPath.includes(linkPath.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  // --- 4. Desktop Dropdown Logic (Split Click) ---
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        // If clicking the icon (chevron), toggle dropdown and prevent navigation
        if (e.target.closest('svg') || e.target.closest('[data-lucide="chevron-down"]')) {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
          
          dropdown.classList.toggle('active');
        }
        // If clicking the text itself, let the default navigation happen
      });
    }
  });

  // Global click to close dropdowns
  window.addEventListener('click', (e) => {
    dropdowns.forEach(d => {
      if (d.classList.contains('active') && !d.contains(e.target)) {
        d.classList.remove('active');
      }
    });
  });

  // --- 5. Animation Initialization (GSAP / Lenis / AOS) ---
  
  // Initialize Lenis Smooth Scroll safely
  let lenis;
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: 0.1
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } catch (e) {
    console.error("Lenis failed:", e);
  }

  // GSAP Logic
  if (typeof gsap !== 'undefined') {
    try {
      // Register plugins if they exist
      const plugins = [];
      if (typeof ScrollTrigger !== 'undefined') plugins.push(ScrollTrigger);
      if (typeof TextPlugin !== 'undefined') plugins.push(TextPlugin);
      gsap.registerPlugin(...plugins);

      if (lenis && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
      }

      // --- Hero Typewriter ---
      const typewriterElement = document.getElementById('typewriter');
      const heroTitle = document.getElementById('hero-title');
      
      if (typewriterElement && heroTitle && typeof TextPlugin !== 'undefined') {
        const mainTimeline = gsap.timeline({ repeat: -1 });

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

        const switchTitle = (newText) => {
          mainTimeline.to(heroTitle, {
            opacity: 0, y: -15, duration: 0.4, ease: "power2.inOut",
            onComplete: () => { heroTitle.textContent = newText; }
          }).to(heroTitle, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        };

        mainTimeline.set(heroTitle, { textContent: "Hey there!" });
        typeSequence("I'm Blessed...", 2);
        switchTitle("A Nigerian");
        typeSequence("Law Student", 2);
        switchTitle("Specializing in:");
        ["Data Privacy", "Compliance", "Cybercrime", "Blockchain", "AI Governance"].forEach(n => typeSequence(n, 1.5));
        switchTitle("Hey there!");
      }

      // --- Stack Grid Animation ---
      const stackGrids = document.querySelectorAll('.stack-grid');
      if (stackGrids.length > 0 && typeof ScrollTrigger !== 'undefined') {
        stackGrids.forEach((grid) => {
          const cards = grid.querySelectorAll('.stack-card');
          gsap.set(cards, {
            y: 100, x: (i) => (i - (cards.length - 1) / 2) * -20,
            rotationX: -10, rotationZ: (i) => (i - (cards.length - 1) / 2) * 3,
            scale: 0.9, opacity: 0, clipPath: "inset(0 0 100% 0)",
            zIndex: (i) => cards.length - i
          });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: grid, start: "top 90%", end: "top 40%", scrub: 1 }
          });
          tl.to(cards, {
            y: 0, x: 0, rotationX: 0, rotationZ: 0, scale: 1, opacity: 1,
            clipPath: "inset(0 0 0% 0)", stagger: 0.1, ease: "power2.out"
          });
        });
      }
    } catch (e) {
      console.error("GSAP Animations failed:", e);
    }
  }

  // --- 5. Context-Aware Navbar Logic ---
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section');
  const mobilePanel = document.getElementById('mobile-nav-panel');

  const updateNavState = () => {
    if (!header) return;
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    const hero = document.querySelector('.hero-section');
    
    if (!hero) {
      if (isLightTheme) {
        header.classList.add('nav-dark-mode');
        if (mobilePanel) mobilePanel.classList.add('nav-light-bg');
      } else {
        header.classList.remove('nav-dark-mode');
        if (mobilePanel) mobilePanel.classList.remove('nav-light-bg');
      }
      return; 
    }

    if (sections.length > 0 && typeof IntersectionObserver !== 'undefined') {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const isDarkSection = entry.target.classList.contains('hero-section') || entry.target.classList.contains('dark-section');
            if (!isDarkSection && isLightTheme) {
              header.classList.add('nav-dark-mode');
              if (mobilePanel) mobilePanel.classList.add('nav-light-bg');
            } else {
              header.classList.remove('nav-dark-mode');
              if (mobilePanel) mobilePanel.classList.remove('nav-light-bg');
            }
          }
        });
      }, { rootMargin: '-10px 0px -90% 0px', threshold: 0 });
      sections.forEach(s => navObserver.observe(s));
    }
  };
  updateNavState();
  window.addEventListener('scroll', updateNavState);

  // --- 6. Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn && mobilePanel) {
    const toggleMenu = (open) => {
      const icon = mobileMenuBtn.querySelector('i');
      if (open) {
        mobilePanel.style.display = 'flex';
        mobilePanel.classList.add('mobile-active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(mobilePanel, 
            { opacity: 0, scale: 0.95, y: -10, transformOrigin: 'top right' },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        } else {
          mobilePanel.style.opacity = '1';
        }
        if (icon) { icon.setAttribute('data-lucide', 'x'); initIcons(); }
      } else {
        if (typeof gsap !== 'undefined') {
          gsap.to(mobilePanel, {
            opacity: 0, scale: 0.95, y: -10, duration: 0.3, ease: "power2.in",
            onComplete: () => { mobilePanel.classList.remove('mobile-active'); mobilePanel.style.display = 'none'; }
          });
        } else {
          mobilePanel.classList.remove('mobile-active');
          mobilePanel.style.display = 'none';
        }
        if (icon) { icon.setAttribute('data-lucide', 'menu'); initIcons(); }
      }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(!mobilePanel.classList.contains('mobile-active'));
    });

    mobilePanel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (mobilePanel.classList.contains('mobile-active') && !mobilePanel.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // --- 7. Back to Top ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initialize AOS safely
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }
});
