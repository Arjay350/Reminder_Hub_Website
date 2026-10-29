/**
 * Reminder Hub — Dynamic & Minimalist Companion Website Script
 * Modern Vanilla JavaScript (Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Audio FX Engine (Subtle Web Audio Synthesizer, 100% Offline)
  // =========================================================================
  const SoundFX = (() => {
    let audioCtx = null;
    let isMuted = localStorage.getItem('reminder_hub_sound_muted') === 'true';

    function getContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.12, volume = 0.08) {
      if (isMuted) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // AudioContext not allowed or unsupported
      }
    }

    return {
      toggle() {
        isMuted = !isMuted;
        localStorage.setItem('reminder_hub_sound_muted', isMuted);
        return !isMuted;
      },
      isMuted() {
        return isMuted;
      },
      pop() {
        playTone(587.33, 'triangle', 0.1, 0.09); // D5
        setTimeout(() => playTone(880, 'sine', 0.15, 0.08), 60); // A5
      },
      unpop() {
        playTone(440, 'triangle', 0.09, 0.06);
      },
      purr() {
        playTone(180, 'sine', 0.25, 0.08);
        setTimeout(() => playTone(220, 'triangle', 0.2, 0.07), 120);
        setTimeout(() => playTone(330, 'sine', 0.3, 0.07), 240);
      },
      tick() {
        playTone(660, 'sine', 0.04, 0.03);
      },
      chime() {
        playTone(523.25, 'sine', 0.12, 0.07);
        setTimeout(() => playTone(659.25, 'sine', 0.15, 0.07), 80);
        setTimeout(() => playTone(783.99, 'sine', 0.25, 0.06), 160);
      }
    };
  })();

  // Sound toggle button in header
  const soundToggleBtn = document.getElementById('sound-toggle');
  function updateSoundToggleUI() {
    if (!soundToggleBtn) return;
    const muted = SoundFX.isMuted();
    soundToggleBtn.setAttribute('aria-pressed', (!muted).toString());
    soundToggleBtn.classList.toggle('muted', muted);
    soundToggleBtn.setAttribute('title', muted ? 'Unmute sound effects' : 'Mute sound effects');
  }
  if (soundToggleBtn) {
    updateSoundToggleUI();
    soundToggleBtn.addEventListener('click', () => {
      SoundFX.toggle();
      updateSoundToggleUI();
      if (!SoundFX.isMuted()) SoundFX.chime();
    });
  }

  // =========================================================================
  // 2. Theme Toggle (Light / Dark Mode with Persistence)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('reminder_hub_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('reminder_hub_theme', next);
      SoundFX.tick();
    });
  }

  // =========================================================================
  // 3. Scroll Progress Indicator & Sticky Glass Header
  // =========================================================================
  const scrollProgressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const floatingQuickBar = document.getElementById('floating-quick-bar');
  const backToTopBtn = document.getElementById('btn-back-to-top');

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = scrollPercent + '%';
    }

    if (header) {
      if (scrollTop > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (floatingQuickBar) {
      if (scrollTop > 380) {
        floatingQuickBar.classList.add('visible');
        floatingQuickBar.removeAttribute('aria-hidden');
      } else {
        floatingQuickBar.classList.remove('visible');
        floatingQuickBar.setAttribute('aria-hidden', 'true');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      SoundFX.tick();
    });
  }

  // =========================================================================
  // 4. Active Nav Spy with Smooth Tracking
  // =========================================================================
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 180;
    let currentId = '';

    navSections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach((link) => {
      link.classList.remove('active-link');
      const href = link.getAttribute('href');
      if (href && href === '#' + currentId) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // =========================================================================
  // 5. Scroll Reveal Animations (Minimalist Staggered Fade-Up)
  // =========================================================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  }
  initScrollReveal();

  // =========================================================================
  // 6. Animated Number Counters (Eased Data Counters)
  // =========================================================================
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-count-to]');
    if (!counterElements.length) return;

    if (!('IntersectionObserver' in window)) {
      counterElements.forEach((el) => {
        el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-count-suffix') || '');
      });
      return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count-to'), 10);
          const suffix = el.getAttribute('data-count-suffix') || '';
          const duration = 1600;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          }

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }
  initCounters();

  // =========================================================================
  // 7. Interactive Cursor Spotlight & Subtle 3D Card Tilt
  // =========================================================================
  function initCursorSpotlight() {
    const cards = document.querySelectorAll(
      '.feature-card, .story-highlight-card, .about-dev-card, .download-card, .app-card-preview, .stats-card, .faq-item'
    );

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);

        // Subtle 3D tilt for the hero preview card
        if (card.classList.contains('app-card-preview')) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const tiltX = (e.clientY - centerY) / (rect.height / 2) * -4;
          const tiltY = (e.clientX - centerX) / (rect.width / 2) * 5;
          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        if (card.classList.contains('app-card-preview')) {
          card.style.transform = '';
        }
      });
    });
  }
  initCursorSpotlight();

  // =========================================================================
  // 8. Interactive Hero App Simulation (Tasks, Study Timer, Mochi, AI Resets)
  // =========================================================================
  function initInteractiveHero() {
    const navTabs = document.querySelectorAll('.hero-tab-pill');
    const panels = document.querySelectorAll('.hero-interactive-panel');
    if (!navTabs.length) return;

    navTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-hero-panel');
        navTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        panels.forEach((p) => {
          if (p.id === targetId) {
            p.classList.add('active');
            p.removeAttribute('hidden');
          } else {
            p.classList.remove('active');
            p.setAttribute('hidden', '');
          }
        });
        SoundFX.tick();
      });
    });

    // 8a. Interactive Tasks Checklist
    const taskItems = document.querySelectorAll('.interactive-task-item');
    const completedCounter = document.getElementById('hero-completed-count');

    function updateCompletedTasks() {
      if (!taskItems.length) return;
      const done = document.querySelectorAll('.interactive-task-item.is-completed').length;
      if (completedCounter) {
        completedCounter.textContent = `${done}/${taskItems.length} Done`;
      }
    }

    taskItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        // Prevent toggle if clicking links or details
        if (e.target.closest('a')) return;
        const isDone = item.classList.toggle('is-completed');
        const checkbox = item.querySelector('.task-checkbox-ring');
        if (checkbox) {
          checkbox.setAttribute('aria-checked', isDone.toString());
        }
        if (isDone) {
          SoundFX.pop();
          spawnSparkle(item);
        } else {
          SoundFX.unpop();
        }
        updateCompletedTasks();
      });
    });
    updateCompletedTasks();

    function spawnSparkle(parentEl) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle-pop-effect';
      sparkle.textContent = '✨ Done!';
      parentEl.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1100);
    }

    // 8b. Interactive Pomodoro Study Timer
    const timerDisplay = document.getElementById('hero-timer-display');
    const timerToggleBtn = document.getElementById('hero-timer-toggle');
    const timerResetBtn = document.getElementById('hero-timer-reset');
    const timerCircle = document.getElementById('hero-timer-progress-ring');
    let timerDuration = 25 * 60; // 25 mins
    let timerRemaining = timerDuration;
    let timerInterval = null;
    let isRunning = false;
    const ringCircumference = 2 * Math.PI * 42; // r=42 -> ~263.89

    if (timerCircle) {
      timerCircle.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
      timerCircle.style.strokeDashoffset = '0';
    }

    function formatTime(secs) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateTimerUI() {
      if (timerDisplay) {
        timerDisplay.textContent = formatTime(timerRemaining);
      }
      if (timerCircle) {
        const offset = ringCircumference - (timerRemaining / timerDuration) * ringCircumference;
        timerCircle.style.strokeDashoffset = offset.toString();
      }
      if (timerToggleBtn) {
        const iconPlay = timerToggleBtn.querySelector('.icon-play');
        const iconPause = timerToggleBtn.querySelector('.icon-pause');
        const label = timerToggleBtn.querySelector('.btn-label');
        if (isRunning) {
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'inline';
          if (label) label.textContent = 'Pause';
        } else {
          if (iconPlay) iconPlay.style.display = 'inline';
          if (iconPause) iconPause.style.display = 'none';
          if (label) label.textContent = timerRemaining < timerDuration ? 'Resume' : 'Start';
        }
      }
    }

    if (timerToggleBtn) {
      timerToggleBtn.addEventListener('click', () => {
        if (isRunning) {
          clearInterval(timerInterval);
          isRunning = false;
          SoundFX.tick();
        } else {
          isRunning = true;
          SoundFX.pop();
          timerInterval = setInterval(() => {
            if (timerRemaining > 0) {
              timerRemaining--;
              updateTimerUI();
            } else {
              clearInterval(timerInterval);
              isRunning = false;
              timerRemaining = timerDuration;
              updateTimerUI();
              SoundFX.chime();
            }
          }, 1000);
        }
        updateTimerUI();
      });
    }

    if (timerResetBtn) {
      timerResetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        timerRemaining = timerDuration;
        updateTimerUI();
        SoundFX.tick();
      });
    }

    // 8c. Interactive Mochi Pet Widget
    const mochiPetBtn = document.getElementById('btn-pet-mochi');
    const mochiAvatarWrap = document.getElementById('mochi-avatar-wrap');
    const mochiMoodLabel = document.getElementById('mochi-mood-label');
    const mochiAffinityBar = document.getElementById('mochi-affinity-fill');
    let mochiAffinity = 85;

    const moods = [
      { text: 'Purring happily! (=^･ω･^=)', tag: 'Purring' },
      { text: 'Wearing his school backpack 🎒', tag: 'School Mode' },
      { text: 'Reading your study notes 📖', tag: 'Focused' },
      { text: 'Curled up and resting zZz', tag: 'Cozy' }
    ];
    let moodIdx = 0;

    if (mochiPetBtn && mochiAvatarWrap) {
      mochiPetBtn.addEventListener('click', () => {
        SoundFX.purr();
        mochiAffinity = Math.min(mochiAffinity + 5, 100);
        if (mochiAffinityBar) mochiAffinityBar.style.width = mochiAffinity + '%';

        moodIdx = (moodIdx + 1) % moods.length;
        if (mochiMoodLabel) {
          mochiMoodLabel.textContent = moods[moodIdx].text;
        }

        // Float heart particles
        for (let i = 0; i < 4; i++) {
          setTimeout(() => spawnHeart(mochiAvatarWrap), i * 90);
        }

        mochiAvatarWrap.classList.add('is-purring');
        setTimeout(() => mochiAvatarWrap.classList.remove('is-purring'), 800);
      });
    }

    function spawnHeart(parentEl) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart-particle';
      heart.textContent = '♥';
      const randomX = Math.random() * 60 - 30;
      heart.style.left = `calc(50% + ${randomX}px)`;
      parentEl.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }

    // 8d. Interactive AI Resets Simulator
    const simulateResetBtn = document.getElementById('btn-simulate-reset');
    const aiClaudeBadge = document.getElementById('ai-status-claude');
    const aiClaudeCountdown = document.getElementById('ai-timer-claude');

    if (simulateResetBtn && aiClaudeBadge && aiClaudeCountdown) {
      simulateResetBtn.addEventListener('click', () => {
        SoundFX.chime();
        aiClaudeBadge.className = 'ai-badge active';
        aiClaudeBadge.textContent = 'Reset Ready';
        aiClaudeCountdown.textContent = 'Quota replenished • 100%';
        simulateResetBtn.disabled = true;
        simulateResetBtn.textContent = 'Reset Complete!';
        setTimeout(() => {
          simulateResetBtn.disabled = false;
          simulateResetBtn.textContent = 'Simulate Reset';
        }, 3000);
      });
    }
  }
  initInteractiveHero();

  // =========================================================================
  // 9. Screen Carousels (Category View & All Screens 3-Second Loop)
  // =========================================================================
  function initScreenCarousels() {
    // 10a. Tab Switching between Category View and All Screens Sequence
    const tabBtnCategories = document.getElementById('tab-btn-categories');
    const tabBtnAllScreens = document.getElementById('tab-btn-all-screens');
    const panelCategories = document.getElementById('panel-categories');
    const panelAllScreens = document.getElementById('panel-all-screens');

    if (tabBtnCategories && tabBtnAllScreens && panelCategories && panelAllScreens) {
      tabBtnCategories.addEventListener('click', () => {
        tabBtnCategories.classList.add('active');
        tabBtnCategories.setAttribute('aria-selected', 'true');
        tabBtnAllScreens.classList.remove('active');
        tabBtnAllScreens.setAttribute('aria-selected', 'false');

        panelCategories.removeAttribute('hidden');
        panelAllScreens.setAttribute('hidden', '');
        SoundFX.tick();
      });

      tabBtnAllScreens.addEventListener('click', () => {
        tabBtnAllScreens.classList.add('active');
        tabBtnAllScreens.setAttribute('aria-selected', 'true');
        tabBtnCategories.classList.remove('active');
        tabBtnCategories.setAttribute('aria-selected', 'false');

        panelAllScreens.removeAttribute('hidden');
        panelCategories.setAttribute('hidden', '');
        SoundFX.tick();
      });
    }

    // 10b. Initialize each Category carousel
    const categoryMockups = document.querySelectorAll('#panel-categories .phone-mockup[data-carousel]');

    categoryMockups.forEach((mockup) => {
      const images = mockup.querySelectorAll('.phone-screen-img');
      const dots = mockup.querySelectorAll('.phone-nav-dot');
      const counterEl = mockup.querySelector('.current-slide');
      const prevBtn = mockup.querySelector('.phone-nav-arrow.prev');
      const nextBtn = mockup.querySelector('.phone-nav-arrow.next');

      if (!images.length) return;
      let currentIndex = 0;
      let timer = null;
      const intervalMs = parseInt(mockup.getAttribute('data-interval') || '3000', 10);

      function showSlide(idx) {
        images.forEach((img, i) => img.classList.toggle('active', i === idx));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
        if (counterEl) counterEl.textContent = (idx + 1).toString();
        currentIndex = idx;
      }

      function nextSlide() {
        const next = (currentIndex + 1) % images.length;
        showSlide(next);
      }

      function prevSlide() {
        const prev = (currentIndex - 1 + images.length) % images.length;
        showSlide(prev);
      }

      function startAutoPlay() {
        stopAutoPlay();
        timer = setInterval(nextSlide, intervalMs);
      }

      function stopAutoPlay() {
        if (timer) clearInterval(timer);
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          nextSlide();
          startAutoPlay();
          SoundFX.tick();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          prevSlide();
          startAutoPlay();
          SoundFX.tick();
        });
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          showSlide(idx);
          startAutoPlay();
          SoundFX.tick();
        });
      });

      mockup.addEventListener('mouseenter', stopAutoPlay);
      mockup.addEventListener('mouseleave', startAutoPlay);
      startAutoPlay();
    });

    // 10c. All Screens Sequence Controller (All screens sequence loop)
    const allScreensMockup = document.getElementById('all-screens-mockup');
    if (allScreensMockup) {
      const allImages = allScreensMockup.querySelectorAll('.phone-screen-img');
      const counterBadge = allScreensMockup.querySelector('.current-slide');
      const stepLabel = document.getElementById('all-screens-step-label');
      const progressBar = document.getElementById('all-screens-progress-bar');
      const playBtn = document.getElementById('all-screens-play-btn');
      const pauseIcon = document.getElementById('all-screens-pause-icon');
      const playIcon = document.getElementById('all-screens-play-icon');
      const nextBtn = document.getElementById('all-screens-next-btn');
      const prevBtn = document.getElementById('all-screens-prev-btn');
      const arrowPrev = allScreensMockup.querySelector('.phone-nav-arrow.prev');
      const arrowNext = allScreensMockup.querySelector('.phone-nav-arrow.next');

      const total = allImages.length;
      let currentIndex = 0;
      let isPlaying = true;
      let loopTimer = null;

      function updateAllScreenSlide(idx) {
        allImages.forEach((img, i) => img.classList.toggle('active', i === idx));
        currentIndex = idx;

        if (counterBadge) counterBadge.textContent = (idx + 1).toString();
        if (stepLabel) stepLabel.textContent = `Screen ${idx + 1} of ${total}`;
        if (progressBar) {
          const pct = ((idx + 1) / total) * 100;
          progressBar.style.width = pct + '%';
        }
      }

      function advance() {
        const next = (currentIndex + 1) % total;
        updateAllScreenSlide(next);
      }

      function retreat() {
        const prev = (currentIndex - 1 + total) % total;
        updateAllScreenSlide(prev);
      }

      function startAllLoop() {
        stopAllLoop();
        loopTimer = setInterval(advance, 3000);
        isPlaying = true;
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
        if (playBtn) playBtn.setAttribute('title', 'Pause sequence');
      }

      function stopAllLoop() {
        if (loopTimer) clearInterval(loopTimer);
        isPlaying = false;
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
        if (playBtn) playBtn.setAttribute('title', 'Play sequence');
      }

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          if (isPlaying) {
            stopAllLoop();
          } else {
            advance();
            startAllLoop();
          }
          SoundFX.tick();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          advance();
          if (isPlaying) startAllLoop();
          SoundFX.tick();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          retreat();
          if (isPlaying) startAllLoop();
          SoundFX.tick();
        });
      }

      if (arrowNext) {
        arrowNext.addEventListener('click', (e) => {
          e.stopPropagation();
          advance();
          if (isPlaying) startAllLoop();
          SoundFX.tick();
        });
      }

      if (arrowPrev) {
        arrowPrev.addEventListener('click', (e) => {
          e.stopPropagation();
          retreat();
          if (isPlaying) startAllLoop();
          SoundFX.tick();
        });
      }

      allScreensMockup.addEventListener('mouseenter', () => {
        if (isPlaying) {
          if (loopTimer) clearInterval(loopTimer);
        }
      });

      allScreensMockup.addEventListener('mouseleave', () => {
        if (isPlaying) {
          startAllLoop();
        }
      });

      startAllLoop();
    }
  }
  initScreenCarousels();

  // =========================================================================
  // 11. Fullscreen Screenshot Lightbox Modal
  // =========================================================================
  function initScreenshotLightbox() {
    const lightboxModal = document.getElementById('screenshot-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!lightboxModal || !lightboxImg) return;

    // Collect unique screenshots strictly from category view mockups to prevent any duplication
    const categoryImgs = document.querySelectorAll('#panel-categories .phone-screen-img');
    const sourceImgs = categoryImgs.length ? categoryImgs : document.querySelectorAll('.phone-screen-img');

    // Deduplicate by src
    const uniqueScreens = [];
    const seen = new Set();
    sourceImgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !seen.has(src)) {
        seen.add(src);
        uniqueScreens.push({
          src: src,
          alt: img.getAttribute('alt') || 'Reminder Hub Screen'
        });
      }
    });

    let currentLightboxIdx = 0;

    function openLightbox(src) {
      const foundIdx = uniqueScreens.findIndex((s) => s.src === src);
      currentLightboxIdx = foundIdx !== -1 ? foundIdx : 0;
      updateLightboxContent();
      lightboxModal.removeAttribute('hidden');
      lightboxModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      SoundFX.tick();
    }

    function closeLightbox() {
      lightboxModal.classList.remove('is-open');
      setTimeout(() => {
        lightboxModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }, 200);
      SoundFX.tick();
    }

    function updateLightboxContent() {
      const item = uniqueScreens[currentLightboxIdx];
      if (!item) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      if (lightboxTitle) lightboxTitle.textContent = item.alt;
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${uniqueScreens.length}`;
      }
    }

    function lightboxStep(delta) {
      currentLightboxIdx = (currentLightboxIdx + delta + uniqueScreens.length) % uniqueScreens.length;
      updateLightboxContent();
      SoundFX.tick();
    }

    // Attach click listeners to all phone screen images
    document.querySelectorAll('.phone-screen-img').forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img.getAttribute('src'));
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => lightboxStep(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => lightboxStep(1));

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxStep(-1);
      if (e.key === 'ArrowRight') lightboxStep(1);
    });
  }
  initScreenshotLightbox();

  // =========================================================================
  // 11. Accessible Dynamic FAQ Accordion, Instant Search & Micro-Interactions
  // =========================================================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSearchInput = document.getElementById('faq-search');
    const faqSearchClear = document.getElementById('faq-search-clear');
    const faqNoResults = document.getElementById('faq-no-results');
    const topicChips = document.querySelectorAll('.faq-chip');
    const counterLabel = document.getElementById('faq-counter-label');
    const expandAllBtn = document.getElementById('faq-expand-all-btn');

    let allExpanded = false;
    let currentTopic = 'all';

    function updateItemState(item, expand) {
      const questionBtn = item.querySelector('.faq-question');
      const answerDiv = item.querySelector('.faq-answer');
      if (!questionBtn || !answerDiv) return;

      if (expand) {
        questionBtn.setAttribute('aria-expanded', 'true');
        answerDiv.removeAttribute('hidden');
        item.classList.add('is-active');
      } else {
        questionBtn.setAttribute('aria-expanded', 'false');
        answerDiv.setAttribute('hidden', '');
        item.classList.remove('is-active');
      }
    }

    faqItems.forEach((item) => {
      const questionBtn = item.querySelector('.faq-question');
      const answerDiv = item.querySelector('.faq-answer');
      if (!questionBtn || !answerDiv) return;

      questionBtn.addEventListener('click', () => {
        const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

        // Close others when opening
        if (!isExpanded) {
          faqItems.forEach((other) => {
            if (other !== item) updateItemState(other, false);
          });
          updateItemState(item, true);
          SoundFX.pop();
        } else {
          updateItemState(item, false);
          SoundFX.tick();
        }
      });
    });

    // Expand All / Collapse All Toggle
    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', () => {
        allExpanded = !allExpanded;
        faqItems.forEach((item) => {
          if (item.style.display !== 'none') {
            updateItemState(item, allExpanded);
          }
        });
        const iconSpan = expandAllBtn.querySelector('.action-icon');
        const textSpan = expandAllBtn.querySelector('.action-text');
        if (allExpanded) {
          if (iconSpan) iconSpan.textContent = '⤡';
          if (textSpan) textSpan.textContent = 'Collapse All';
        } else {
          if (iconSpan) iconSpan.textContent = '⤢';
          if (textSpan) textSpan.textContent = 'Expand All';
        }
        SoundFX.tick();
      });
    }

    // Filter Logic combining Search Query & Topic Chips
    function applyFilters() {
      const query = faqSearchInput ? faqSearchInput.value.trim().toLowerCase() : '';
      let matches = 0;

      if (faqSearchClear) {
        faqSearchClear.style.display = query ? 'inline-flex' : 'none';
      }

      faqItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const itemTopic = item.getAttribute('data-topic') || '';
        const matchesTopic = currentTopic === 'all' || itemTopic.includes(currentTopic);
        const matchesQuery = !query || text.includes(query);

        if (matchesTopic && matchesQuery) {
          item.style.display = '';
          matches++;
          if (query.length > 2) {
            updateItemState(item, true);
          }
        } else {
          item.style.display = 'none';
          updateItemState(item, false);
        }
      });

      if (counterLabel) {
        counterLabel.textContent = `Showing ${matches} question${matches === 1 ? '' : 's'}`;
      }

      if (faqNoResults) {
        faqNoResults.style.display = matches === 0 ? 'block' : 'none';
      }
    }

    // Topic Filter Chips
    topicChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        topicChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        currentTopic = chip.getAttribute('data-topic') || 'all';
        applyFilters();
        SoundFX.tick();
      });
    });

    // Instant FAQ Search Input
    if (faqSearchInput) {
      faqSearchInput.addEventListener('input', applyFilters);
    }

    if (faqSearchClear) {
      faqSearchClear.addEventListener('click', () => {
        if (faqSearchInput) {
          faqSearchInput.value = '';
          applyFilters();
          faqSearchInput.focus();
        }
        SoundFX.tick();
      });
    }

    // Interactive "Was this helpful?" Feedback Buttons
    const feedbackBtns = document.querySelectorAll('.btn-faq-feedback');
    feedbackBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentStrip = btn.closest('.faq-feedback-strip');
        if (!parentStrip) return;

        SoundFX.chime();
        parentStrip.innerHTML = '<span class="feedback-thanks-badge">✨ Thank you for your feedback!</span>';
      });
    });
  }
  initFAQ();

  // =========================================================================
  // 13. Mobile Navigation Drawer
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileNav) {
    function toggleMobileMenu(forceClose = false) {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const willExpand = forceClose ? false : !isExpanded;

      mobileMenuBtn.setAttribute('aria-expanded', willExpand.toString());
      if (willExpand) {
        mobileNav.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        mobileNav.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }
      SoundFX.tick();
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.hasAttribute('hidden') && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(true);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.hasAttribute('hidden')) {
        toggleMobileMenu(true);
      }
    });
  }

  // =========================================================================
  // 14. Placeholder Link Interceptor & Helpful Setup Modal
  // =========================================================================
  const placeholderLinks = document.querySelectorAll('a[data-placeholder]');
  const modal = document.getElementById('placeholder-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');
  const modalPlaceholderName = document.getElementById('modal-placeholder-name');
  const apkConfigNotice = document.getElementById('apk-config-notice');

  // Check if primary APK download links are placeholders
  let hasActivePlaceholder = false;
  placeholderLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('[') && href.endsWith(']')) {
      hasActivePlaceholder = true;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const placeholderName = link.getAttribute('data-placeholder') || href;
        if (modalPlaceholderName) modalPlaceholderName.textContent = placeholderName;
        if (modal) modal.removeAttribute('hidden');
        SoundFX.tick();
      });
    }
  });

  if (hasActivePlaceholder && apkConfigNotice) {
    apkConfigNotice.style.display = 'flex';
  }

  function closeModal() {
    if (modal) modal.setAttribute('hidden', '');
    SoundFX.tick();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // =========================================================================
  // 15. Dynamic Footer Year
  // =========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }
});
