document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuIconOpen.classList.toggle('hidden');
      menuIconClose.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      });
    });
  }

  // --- Scroll Spy & Scroll Progress ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scroll-progress');
  const heroPortrait = document.getElementById('hero-portrait');

  // Throttled Scroll Handler using requestAnimationFrame for progress bar and portrait grayscale
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // 1. Scroll Progress Bar
        const winScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        if (scrollProgress) {
          scrollProgress.style.width = scrolled + '%';
        }

        // 2. Dynamic Grayscale for Hero Portrait (Color by default, gray when scrolled away)
        if (heroPortrait) {
          if (winScroll > 150) {
            heroPortrait.classList.add('grayscale');
          } else {
            heroPortrait.classList.remove('grayscale');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true }); // passive: true improves scroll performance on mobile browsers

  // 3. Native IntersectionObserver Scroll Spy (Prevents layout thrashing/reflow reads on scroll)
  const spyOptions = {
    root: null,
    rootMargin: '-25% 0px -55% 0px', // Trigger when section occupies focus area
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach(section => spyObserver.observe(section));

  // --- Metric Counters Animation ---
  const counters = document.querySelectorAll('.stat-counter');
  
  const animateCounter = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
    const duration = 2000; // 2 seconds
    let startTime = null;

    if (counter.dataset.animating === 'true') {
      return; // Prevent stacking animations
    }
    counter.dataset.animating = 'true';

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = progress * target;
      
      counter.innerText = prefix + currentValue.toFixed(decimals) + suffix;

      if (progress < 1 && counter.dataset.animating === 'true') {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = prefix + target.toFixed(decimals) + suffix;
        counter.dataset.animating = 'false';
      }
    };

    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      } else {
        // Cancel animating state and reset to zero
        entry.target.dataset.animating = 'false';
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        entry.target.innerText = prefix + '0' + suffix;
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // --- Project Gallery Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-50', 'text-emerald-600', 'border-emerald-500/30');
        b.classList.add('text-slate-500', 'border-slate-200', 'hover:border-slate-300', 'hover:bg-slate-100/50');
      });
      btn.classList.remove('text-slate-500', 'border-slate-200', 'hover:border-slate-300', 'hover:bg-slate-100/50');
      btn.classList.add('bg-emerald-50', 'text-emerald-600', 'border-emerald-500/30');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          // Force browser reflow to register display: block before starting transition
          card.offsetHeight;
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
          setTimeout(() => {
            if (card.classList.contains('hidden-card')) {
              card.style.display = 'none';
            }
          }, 350); // Match transition duration
        }
      });
    });
  });

  // Trigger initial filter for 'web' on load
  const defaultFilter = 'web';
  projectCards.forEach(card => {
    const categories = (card.getAttribute('data-category') || '').split(' ');
    if (categories.includes(defaultFilter)) {
      card.classList.remove('hidden-card');
      card.style.display = 'block';
    } else {
      card.classList.add('hidden-card');
      card.style.display = 'none';
    }
  });

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (name && email && message) {
        // Show success state
        formSuccess.classList.remove('hidden');
        formSuccess.classList.add('flex');
        contactForm.reset();

        // Auto hide success notice after 5 seconds
        setTimeout(() => {
          formSuccess.classList.remove('flex');
          formSuccess.classList.add('hidden');
        }, 5000);
      }
    });
  }
});
