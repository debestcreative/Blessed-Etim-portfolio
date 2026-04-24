document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Safe Icon Initialization ---
  const initIcons = () => {
    try {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (e) {
      console.warn("Lucide icons delayed or failed:", e);
    }
  };
  initIcons();

  // --- 2. Theme Toggle Logic ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconSvg = document.getElementById('theme-icon-svg');

  const sunPath = "M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41";
  const moonPath = "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z";

  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (themeIconSvg) {
        themeIconSvg.innerHTML = theme === 'dark'
          ? `<path d="${sunPath}"/>`
          : `<path d="${moonPath}"/>`;
      }
      initIcons();
    };

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

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

  // --- 4. Desktop Dropdown Logic ---
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (e.target.closest('svg') || e.target.closest('i')) {
          e.preventDefault();
          e.stopPropagation();
          dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
          dropdown.classList.toggle('active');
        }
      });
    }
  });

  window.addEventListener('click', (e) => {
    dropdowns.forEach(d => { if (d.classList.contains('active') && !d.contains(e.target)) d.classList.remove('active'); });
  });

  // --- 5. Animation Initialization ---
  let lenis;
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({ duration: 1.0, lerp: 0.1 });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  } catch (e) { console.error("Lenis failed:", e); }

  if (typeof gsap !== 'undefined') {
    try {
      const plugins = [];
      if (typeof ScrollTrigger !== 'undefined') plugins.push(ScrollTrigger);
      if (typeof TextPlugin !== 'undefined') plugins.push(TextPlugin);
      gsap.registerPlugin(...plugins);

      // Hero Typewriter
      const typewriterElement = document.getElementById('typewriter');
      const heroTitle = document.getElementById('hero-title');
      if (typewriterElement && heroTitle && typeof TextPlugin !== 'undefined') {
        const mainTimeline = gsap.timeline({ repeat: -1 });
        const typeSequence = (text, pause) => {
          const typeDur = text.length * 0.08;
          mainTimeline.to(typewriterElement, { duration: typeDur, text: text, ease: "none" })
            .to({}, { duration: pause })
            .to(typewriterElement, { duration: typeDur * 0.4, text: "", ease: "none" });
        };
        const switchTitle = (newText) => {
          mainTimeline.to(heroTitle, { opacity: 0, y: -15, duration: 0.4, ease: "power2.inOut", onComplete: () => { heroTitle.textContent = newText; } })
            .to(heroTitle, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        };
        mainTimeline.set(heroTitle, { textContent: "Hey there!" });
        typeSequence("I'm Blessed...", 2);
        switchTitle("A Nigerian");
        typeSequence("Law Student", 2);
        switchTitle("Specializing in:");
        ["Data Privacy", "Compliance", "Cybercrime", "Blockchain", "AI Governance"].forEach(n => typeSequence(n, 1.5));
        switchTitle("Hey there!");
      }

      // Stack Grid Animation - ONLY HIDDEN IF SCROLLTRIGGER IS READY
      const stackGrids = document.querySelectorAll('.stack-grid');
      if (stackGrids.length > 0 && typeof ScrollTrigger !== 'undefined') {
        stackGrids.forEach((grid) => {
          const cards = grid.querySelectorAll('.stack-card');
          // Important: Only set initial state if we are sure we can animate the reveal
          gsap.set(cards, {
            y: 80, x: (i) => (i - (cards.length - 1) / 2) * -15,
            rotationX: -10, rotationZ: (i) => (i - (cards.length - 1) / 2) * 2,
            scale: 0.95, opacity: 0, clipPath: "inset(0 0 100% 0)",
            zIndex: (i) => cards.length - i
          });

          gsap.timeline({
            scrollTrigger: { trigger: grid, start: "top 90%", end: "top 40%", scrub: 1 }
          }).to(cards, {
            y: 0, x: 0, rotationX: 0, rotationZ: 0, scale: 1, opacity: 1,
            clipPath: "inset(0 0 0% 0)", stagger: 0.1, ease: "power2.out"
          });
        });
      }
    } catch (e) { console.error("GSAP Animations error:", e); }
  }

  // --- 6. Context-Aware Navbar ---
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section');
  const mobilePanel = document.getElementById('mobile-nav-panel');

  const updateNavState = () => {
    if (!header) return;
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    const hero = document.querySelector('.hero-section');
    if (!hero) {
      header.classList.toggle('nav-dark-mode', isLightTheme);
      if (mobilePanel) mobilePanel.classList.toggle('nav-light-bg', isLightTheme);
      return;
    }
    if (sections.length > 0 && typeof IntersectionObserver !== 'undefined') {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const isDark = entry.target.classList.contains('hero-section') || entry.target.classList.contains('dark-section');
            header.classList.toggle('nav-dark-mode', !isDark && isLightTheme);
            if (mobilePanel) mobilePanel.classList.toggle('nav-light-bg', !isDark && isLightTheme);
          }
        });
      }, { rootMargin: '-10px 0px -90% 0px', threshold: 0 });
      sections.forEach(s => navObserver.observe(s));
    }
  };
  updateNavState();
  window.addEventListener('scroll', updateNavState);

  // --- 7. Mobile Menu ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn && mobilePanel) {
    const toggleMenu = (open) => {
      if (open) {
        mobilePanel.style.display = 'flex';
        mobilePanel.classList.add('mobile-active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(mobilePanel, { opacity: 0, scale: 0.95, y: -10, transformOrigin: 'top right' }, { opacity: 1, scale: 1, y: 0, duration: 0.4 });
        } else { mobilePanel.style.opacity = '1'; }
      } else {
        if (typeof gsap !== 'undefined') {
          gsap.to(mobilePanel, { opacity: 0, scale: 0.95, y: -10, duration: 0.3, onComplete: () => { mobilePanel.classList.remove('mobile-active'); mobilePanel.style.display = 'none'; } });
        } else { mobilePanel.classList.remove('mobile-active'); mobilePanel.style.display = 'none'; }
      }
    };
    mobileMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(!mobilePanel.classList.contains('mobile-active')); });
    mobilePanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('click', (e) => { if (mobilePanel.classList.contains('mobile-active') && !mobilePanel.contains(e.target) && !mobileMenuBtn.contains(e.target)) toggleMenu(false); });
  }

  // --- 8. Back to Top ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => { backToTopBtn.classList.toggle('visible', window.scrollY > 500); });
    backToTopBtn.addEventListener('click', () => { if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  if (typeof AOS !== 'undefined') { AOS.init({ duration: 1000, once: true, offset: 100 }); }
});
