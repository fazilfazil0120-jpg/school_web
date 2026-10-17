/**
 * ABC Matriculation Higher Secondary School
 * Main JavaScript File - script.js
 */

// ============================================================
// NAVBAR: Scroll effect, hamburger menu, active link
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');

  // Scroll effect on navbar
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar && navbar.classList.add('navbar--scrolled');
    } else {
      navbar && navbar.classList.remove('navbar--scrolled');
    }
    updateBackToTop();
  });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // HERO: Animate background zoom on load
  // ============================================================
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('animate'), 100);
  }

  // ============================================================
  // ANIMATED COUNTER
  // ============================================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const stepTime = 40;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + (el.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  }

  // Observe counters
  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ============================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  const backToTopBtn = document.getElementById('backToTop');

  function updateBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // ACADEMICS: Tab switching
  // ============================================================
  const levelTabs = document.querySelectorAll('.level-tab');
  const levelContents = document.querySelectorAll('.level-content');

  levelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      levelTabs.forEach(t => t.classList.remove('active'));
      levelContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('open');
        const a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        question.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // ============================================================
  // TEACHER SEARCH & FILTER
  // ============================================================
  const teacherSearch = document.getElementById('teacherSearch');
  const teacherFilter = document.getElementById('teacherFilter');
  const teacherCards = document.querySelectorAll('.teacher-card[data-subject]');
  const noResults = document.querySelector('.no-results');

  function filterTeachers() {
    const searchTerm = teacherSearch ? teacherSearch.value.toLowerCase() : '';
    const filterVal = teacherFilter ? teacherFilter.value.toLowerCase() : '';
    let visible = 0;

    teacherCards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const subject = (card.dataset.subject || '').toLowerCase();
      const matchSearch = name.includes(searchTerm) || subject.includes(searchTerm);
      const matchFilter = !filterVal || subject.includes(filterVal);

      if (matchSearch && matchFilter) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.classList.toggle('show', visible === 0);
    }
  }

  if (teacherSearch) teacherSearch.addEventListener('input', filterTeachers);
  if (teacherFilter) teacherFilter.addEventListener('change', filterTeachers);

  // ============================================================
  // GALLERY: Filter & Lightbox
  // ============================================================
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxContent = document.querySelector('.lightbox__content');
  const lightboxCaption = document.querySelector('.lightbox__caption');
  const lightboxClose = document.querySelector('.lightbox__close');
  let currentGalleryIndex = 0;
  let visibleItems = [];

  // Filter gallery
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      updateVisibleItems();
    });
  });

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
  }
  updateVisibleItems();

  // Open lightbox
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = visibleItems.indexOf(item);
      showLightbox(item);
    });
  });

  function showLightbox(item) {
    if (!lightbox) return;
    const emoji = item.querySelector('.gallery-item__bg')?.textContent?.trim() || '🖼️';
    const label = item.querySelector('.gallery-item__label')?.textContent || '';
    if (lightboxContent) lightboxContent.firstElementChild && (lightboxContent.firstElementChild.textContent = emoji);
    if (lightboxCaption) lightboxCaption.textContent = label;
    // Set emoji inside lightbox__content
    if (lightboxContent) {
      lightboxContent.innerHTML = `<span style="font-size:6rem">${emoji}</span><div class="lightbox__caption">${label}</div>`;
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Lightbox prev/next
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + visibleItems.length) % visibleItems.length;
      showLightbox(visibleItems[currentGalleryIndex]);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % visibleItems.length;
      showLightbox(visibleItems[currentGalleryIndex]);
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });

  // ============================================================
  // FORM VALIDATION: Admission Form
  // ============================================================
  const admissionForm = document.getElementById('admissionForm');
  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(admissionForm)) {
        showSuccessMessage(admissionForm);
        admissionForm.reset();
      }
    });
  }

  // ============================================================
  // FORM VALIDATION: Contact Form
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(contactForm)) {
        showSuccessMessage(contactForm);
        contactForm.reset();
      }
    });
  }

  // Generic form validator
  function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
      const group = field.closest('.form-group');
      const errorMsg = group ? group.querySelector('.error-msg') : null;
      field.classList.remove('error');
      if (errorMsg) errorMsg.classList.remove('show');

      let fieldValid = true;

      if (!field.value.trim()) {
        fieldValid = false;
        if (errorMsg) errorMsg.textContent = 'This field is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        fieldValid = false;
        if (errorMsg) errorMsg.textContent = 'Please enter a valid email address.';
      } else if (field.type === 'tel' && field.value.trim().length < 10) {
        fieldValid = false;
        if (errorMsg) errorMsg.textContent = 'Please enter a valid phone number.';
      }

      if (!fieldValid) {
        field.classList.add('error');
        if (errorMsg) errorMsg.classList.add('show');
        isValid = false;
      }
    });

    return isValid;
  }

  // Show success message after form submission
  function showSuccessMessage(form) {
    let successMsg = form.querySelector('.success-msg');
    if (!successMsg) {
      successMsg = document.createElement('div');
      successMsg.className = 'success-msg';
      successMsg.innerHTML = '✅ Thank you! Your submission has been received. We will get back to you soon.';
      form.appendChild(successMsg);
    }
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 6000);
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 76;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  console.log('✅ ABC Matriculation Higher Secondary School website loaded.');
});
