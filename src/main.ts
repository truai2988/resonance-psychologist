import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Reveal elements on scroll
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // Stagger effect for service cards
  const serviceGrid = document.querySelector('.service-grid');
  if (serviceGrid) {
    const cards = serviceGrid.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.15}s`;
    });
  }

  // Hero content stagger load
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero-content .reveal');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * 300);
    });
  }, 500);
});

// Smooth scroll implementation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
