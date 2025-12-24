import './style.css'

// YouTube RSS Feed Integration
async function initAutoYouTube() {
  const GRID_ID = 'reading-grid';
  const PLAYER_ID = 'main-video-player';
  const CHANNEL_ID = 'UChq1gUUAkOuwhG-qxbbrBfg'; // Your Channel ID
  const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID);

  const grid = document.getElementById(GRID_ID);
  const mainPlayer = document.getElementById(PLAYER_ID) as HTMLIFrameElement;
  const mainVideoTitle = document.getElementById("main-video-title");

  if (!grid) return;

  try {
    const response = await fetch(RSS_URL);
    const data = await response.json();
    
    if (data.status !== 'ok') throw new Error('RSS fetch failed');

    let items = data.items || [];

    // Robust Date Parsing Helper
    const parseDate = (dateStr: string) => {
        // rss2json returns "YYYY-MM-DD HH:mm:ss", replace space with T for standard ISO parsing
        return new Date(dateStr.replace(' ', 'T'));
    };

    // Sort by pubDate desc (Newest first)
    items.sort((a: any, b: any) => {
        return parseDate(b.pubDate).getTime() - parseDate(a.pubDate).getTime();
    });

    // 1. Set Main Player (Always use the latest video)
    let mainVideoId = null;

    if (items.length > 0 && mainPlayer) {
        // Extracts video ID from link or guid
        const getVideoId = (item: any) => {
            if (item.guid) return item.guid.split(':').pop();
            if (item.link) {
                const match = item.link.match(/v=([^&]+)/);
                return match ? match[1] : null;
            }
            return null;
        };

        const latestItem = items[0];
        mainVideoId = getVideoId(latestItem);

        if (mainVideoId) {
            mainPlayer.src = `https://www.youtube.com/embed/${mainVideoId}`;
            if (mainVideoTitle) {
                mainVideoTitle.textContent = latestItem.title;
            }
        }
    }

    // 2. Set Grid (Randomized from top 15, EXCLUDING the main video)
    const gridPool = items.filter((item: any) => {
        if (!item.guid) return false;
        const vid = item.guid.split(':').pop();
        return vid !== mainVideoId;
    }).slice(0, 15);

    const shuffled = gridPool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    grid.innerHTML = ''; // Clear skeleton/loading state

    selected.forEach((item: any) => {
      const title = item.title || '';
      let videoId = '';
      if (item.guid) {
        videoId = item.guid.split(':').pop();
      }
      
      const published = parseDate(item.pubDate).toLocaleDateString('ja-JP');

      if (!videoId) return;

      const card = document.createElement('a');
      card.href = 'https://www.youtube.com/watch?v=' + videoId;
      card.className = 'reading-card reveal';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      card.innerHTML = `
        <div class="reading-thumb">
          <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${title}" loading="lazy">
        </div>
        <div class="reading-info">
          <h4 class="reading-title">${title}</h4>
          <span class="reading-date">${published}</span>
        </div>
      `;
      
      grid.appendChild(card);
      
      // Observe the new element for scroll reveal effect
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.1 });
      observer.observe(card);
    });

  } catch (error) {
    console.warn('Failed to load YouTube feed, using fallback content:', error);
    
    // Fallback: Show curated list of videos
    const fallbackItems = [
        {
            title: '「手放す」ことについて',
            videoId: '-Jrh8xTBXbQ',
            date: '2025/12/19'
        },
        {
            title: '心に残る「ありがとう」：思い出の中に見つける安らぎ',
            videoId: 'miHVFmngHPo',
            date: '2025/12/20'
        },
        {
            title: '私たちの心って、どこかで繋がってる？',
            videoId: 'sjznv6sMcKY',
            date: '2025/12/07'
        }
    ];

    grid.innerHTML = ''; // Clear corrupted error message if any

    fallbackItems.forEach(item => {
        const card = document.createElement('a');
        card.href = 'https://www.youtube.com/watch?v=' + item.videoId;
        card.className = 'reading-card reveal';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        card.innerHTML = `
        <div class="reading-thumb">
          <img src="https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg" alt="${item.title}" loading="lazy">
        </div>
        <div class="reading-info">
          <h4 class="reading-title">${item.title}</h4>
          <span class="reading-date">${item.date}</span>
        </div>
      `;
      grid.appendChild(card);
      
      // Add simple reveal
       setTimeout(() => card.classList.add('active'), 100);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAutoYouTube(); // Initialize YouTube feed

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