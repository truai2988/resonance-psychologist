
import './style.css'

// YouTube Random Picker (Internal Source)
function initRandomYouTube() {
  const GRID_ID = 'reading-grid';
  const grid = document.getElementById(GRID_ID);

  if (!grid) return;

  // VIDEO POOL: Full Archive (Updated: 2025-12-24)
  const videoPool = [
      {
          title: '世界って、どうやって始まったんだろう？',
          videoId: 'SeW26Pv-mnk',
          date: '2025/12/21'
      },
      {
          title: '心に残る「ありがとう」：思い出の中に見つける安らぎ',
          videoId: 'miHVFmngHPo',
          date: '2025/12/20'
      },
      {
          title: '「手放す」ことについて',
          videoId: '-Jrh8xTBXbQ',
          date: '2025/12/19'
      },
      {
          title: '過去の痛みが心をざわつかせる理由',
          videoId: 'RXyi09l415o',
          date: '2025/12/18' 
      },
      {
          title: 'あなたの「原始的な」感情を考え直す',
          videoId: '8NFlc4POAO0',
          date: '2025/12/16'
      },
      {
          title: '貧乏神と福の神って、本当に反対なの？',
          videoId: 'tgq8fhVGpSc',
          date: '2025/12/15'
      },
      {
          title: '私たちの心って、どこかで繋がってる？',
          videoId: 'sjznv6sMcKY',
          date: '2025/12/07'
      },
      {
          title: 'ルミノート (Luminote) | 心で綴り、響きあう日記の物語',
          videoId: 'INDFsjx4lHs',
          date: '2025/11/24'
      }
  ];

  // Randomly select 3 videos
  const selected = videoPool
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 3);                    // Take top 3

  grid.innerHTML = ''; 

  selected.forEach((item, index) => {
      const card = document.createElement('a');
      card.href = 'https://www.youtube.com/watch?v=' + item.videoId;
      card.className = 'reading-card reveal';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      // Stagger animation
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;

      card.innerHTML = `
      <div class="reading-thumb">
        <img src="https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg" alt="${item.title}" loading="lazy">
        <div class="play-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div class="reading-info">
        <h4 class="reading-title">${item.title}</h4>
        <span class="reading-date">${item.date}</span>
      </div>
    `;
    grid.appendChild(card);
    
    // Observer is handled by global reveal observer, 
    // but we add 'active' manually after short delay to ensure visibility
    setTimeout(() => card.classList.add('active'), 200 + (index * 100));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRandomYouTube();



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

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      const isExpanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded.toString());
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!hamburger.contains(target) && !navMenu.contains(target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

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
  anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
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