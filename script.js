// Основной JavaScript код
document.addEventListener('DOMContentLoaded', function () {
  // ========== ГАЛЕРЕЯ ПОРТФОЛИО ==========
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioModal = document.getElementById('portfolio-modal');
  const portfolioModalImage = document.getElementById('portfolio-modal-image');
  const portfolioModalDescription = document.getElementById('portfolio-modal-description'); // Новый элемент
  const portfolioCloseButton = portfolioModal.querySelector('.close');

  let currentIndex = 0;

  // Функция для открытия модального окна портфолио
  function openPortfolioModal(index) {
    currentIndex = index;
    const currentItem = portfolioItems[currentIndex];
    const imgSrc = currentItem.querySelector('img').getAttribute('src');
    const description = currentItem.querySelector('img').getAttribute('data-description');
    portfolioModalImage.setAttribute('src', imgSrc);
    portfolioModalDescription.textContent = description;
    portfolioModal.classList.add('show');
  }

  // Функция для закрытия модального окна портфолио
  function closePortfolioModal() {
    portfolioModal.classList.remove('show');
  }

  // Обработчики событий для модального окна портфолио
  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => openPortfolioModal(index));
  });

  portfolioCloseButton.addEventListener('click', closePortfolioModal);

  portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
      closePortfolioModal();
    }
  });

  // Функция для навигации по портфолио
  function navigatePortfolio(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = portfolioItems.length - 1;
    if (currentIndex >= portfolioItems.length) currentIndex = 0;
    openPortfolioModal(currentIndex);
  }

  // ========== МОДАЛЬНОЕ ОКНО ДЛЯ ОТЗЫВОВ ==========
  const reviewsItems = document.querySelectorAll('.review-item');
  const reviewsModal = document.getElementById('reviews-modal');
  const reviewsModalImage = document.getElementById('reviews-modal-image');
  const reviewsCloseButton = reviewsModal.querySelector('.close');

  let currentReviewIndex = 0;

  // Функция для открытия модального окна отзывов
  function openReviewsModal(index) {
    currentReviewIndex = index;
    const currentReview = reviewsItems[currentReviewIndex];
    const imgSrc = currentReview.querySelector('img').getAttribute('src');
    reviewsModalImage.setAttribute('src', imgSrc);
    reviewsModal.classList.add('show');
  }

  // Функция для закрытия модального окна отзывов
  function closeReviewsModal() {
    reviewsModal.classList.remove('show');
  }

  // Обработчики событий для модального окна отзывов
  reviewsItems.forEach((item, index) => {
    item.addEventListener('click', () => openReviewsModal(index));
  });

  reviewsCloseButton.addEventListener('click', closeReviewsModal);

  reviewsModal.addEventListener('click', (e) => {
    if (e.target === reviewsModal) {
      closeReviewsModal();
    }
  });

  // Функция для навигации по отзывам
  function navigateReviews(direction) {
    currentReviewIndex += direction;
    if (currentReviewIndex < 0) currentReviewIndex = reviewsItems.length - 1;
    if (currentReviewIndex >= reviewsItems.length) currentReviewIndex = 0;
    openReviewsModal(currentReviewIndex);
  }

  // Обработка клавиш клавиатуры
  document.addEventListener('keydown', (e) => {
    if (portfolioModal.classList.contains('show')) {
      switch (e.key) {
        case 'Escape':
          closePortfolioModal();
          break;
        case 'ArrowLeft':
          navigatePortfolio(-1);
          break;
        case 'ArrowRight':
          navigatePortfolio(1);
          break;
      }
    }
    if (reviewsModal.classList.contains('show')) {
      switch (e.key) {
        case 'Escape':
          closeReviewsModal();
          break;
        case 'ArrowLeft':
          navigateReviews(-1);
          break;
        case 'ArrowRight':
          navigateReviews(1);
          break;
      }
    }
  });

  // ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ==========
  const sections = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
  );
  sections.forEach((section) => {
    observer.observe(section);
  });

  // ========== СОЗДАНИЕ ПАРЯЩИХ ЭЛЕМЕНТОВ ==========
  function createFloatingElements(containerId, count = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.classList.add('floating-element');

      // Случайные параметры для элементов
      const size = Math.random() * 100 + 50;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;

      // Применение стилей
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${posX}%`;
      element.style.top = `${posY}%`;
      element.style.animationDelay = `${delay}s`;
      element.style.animationDuration = `${duration}s`;
      element.style.opacity = Math.random() * 0.3 + 0.1;

      container.appendChild(element);
    }
  }

  // Создание элементов для разных разделов
  createFloatingElements('sterilization-elements', 5);
  createFloatingElements('contraindications-elements', 5);
  createFloatingElements('care-elements', 8);
  createFloatingElements('recommendations-elements', 4);

  // ========== ЭФФЕКТ ЧАСТИЦ ==========
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particlesContainer.appendChild(particle);
    }
  }

  // ========== ПЛАВНАЯ ПРОКРУТКА ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });

  // ========== АНИМАЦИЯ ЗАГОЛОВКА ==========
  const title = document.querySelector('.text-wrapper');
  setTimeout(() => {
    title.classList.add('animate__animated', 'animate__pulse');
  }, 1000);
});

// Модальное окно для изображений сертификата и карты
const certificateModal = document.createElement('div');
certificateModal.classList.add('modal');
certificateModal.innerHTML = `
  <span class="close">&times;</span>
  <img class="modal-content" id="certificate-modal-image" alt="Сертификат или карта">
  <button class="modal-button prev"><i class="fas fa-chevron-left"></i></button>
  <button class="modal-button next"><i class="fas fa-chevron-right"></i></button>
`;

document.body.appendChild(certificateModal);
const certificateModalImage = certificateModal.querySelector('#certificate-modal-image');
const certificateCloseButton = certificateModal.querySelector('.close');
let certificateImages = [];
let currentCertificateIndex = 0;

function openCertificateModal(images, index) {
  certificateImages = images;
  currentCertificateIndex = index;
  certificateModalImage.setAttribute('src', certificateImages[currentCertificateIndex]);
  certificateModal.classList.add('show');
}

function closeCertificateModal() {
  certificateModal.classList.remove('show');
}

certificateCloseButton.addEventListener('click', closeCertificateModal);

certificateModal.addEventListener('click', (e) => {
  if (e.target === certificateModal) {
    closeCertificateModal();
  }
});

// Создание парящих элементов для этапов процедуры
createFloatingElements('procedure-steps-elements', 6);

// Создание парящих элементов для раздела "Отзывы"
createFloatingElements('reviews-elements', 6);
