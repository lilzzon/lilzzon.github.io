// Основной JavaScript код
document.addEventListener('DOMContentLoaded', function() {
// ========== ГАЛЕРЕЯ ПОРТФОЛИО ==========
// ГАЛЕРЕЯ ПОРТФОЛИО
const portfolioItems = document.querySelectorAll('.portfolio-item');
const portfolioModal = document.getElementById('portfolio-modal');
const portfolioModalImage = document.getElementById('portfolio-modal-image');
const portfolioModalDescription = document.getElementById('portfolio-modal-description'); // Новый элемент
const portfolioCloseButton = portfolioModal.querySelector('.close');
const portfolioPrevButton = portfolioModal.querySelector('.modal-button.prev');
const portfolioNextButton = portfolioModal.querySelector('.modal-button.next');

let currentPortfolioIndex = 0;
const portfolioImages = Array.from(portfolioItems).map(item => ({
  src: item.querySelector('img').src,
  description: item.querySelector('img').getAttribute('data-description') // Добавляем описание
}));

// Функция открытия модального окна для портфолио
function openPortfolioModal(index) {
  currentPortfolioIndex = index;
  portfolioModalImage.src = portfolioImages[currentPortfolioIndex].src;
  portfolioModalDescription.textContent = portfolioImages[currentPortfolioIndex].description; // Устанавливаем описание
  portfolioModal.style.display = 'flex';
  setTimeout(() => {
    portfolioModal.classList.add('show');
  }, 10);
  document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
}

// Функция закрытия модального окна
function closePortfolioModal() {
  portfolioModal.classList.remove('show');
  setTimeout(() => {
    portfolioModal.style.display = 'none';
  }, 300);
  document.body.style.overflow = ''; // Восстанавливаем прокрутку
}

// Навигация по изображениям портфолио
function navigatePortfolio(direction) {
  currentPortfolioIndex = (currentPortfolioIndex + direction + portfolioImages.length) % portfolioImages.length;
  portfolioModalImage.src = portfolioImages[currentPortfolioIndex].src;
  portfolioModalDescription.textContent = portfolioImages[currentPortfolioIndex].description; // Обновляем описание
}

// Обработчики событий для портфолио
portfolioItems.forEach((item, index) => {
  item.addEventListener('click', () => openPortfolioModal(index));
});

portfolioCloseButton.addEventListener('click', closePortfolioModal);
portfolioPrevButton.addEventListener('click', () => navigatePortfolio(-1));
portfolioNextButton.addEventListener('click', () => navigatePortfolio(1));

portfolioModal.addEventListener('click', (e) => {
  if (e.target === portfolioModal) {
    closePortfolioModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (!portfolioModal.classList.contains('show')) return;
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
});

// ========== ГАЛЕРЕЯ ОТЗЫВОВ ==========
const reviewItems = document.querySelectorAll('.review-item');
const reviewsModal = document.getElementById('reviews-modal');
const reviewsModalImage = document.getElementById('reviews-modal-image');
const reviewsCloseButton = reviewsModal.querySelector('.close');
const reviewsPrevButton = reviewsModal.querySelector('.modal-button.prev');
const reviewsNextButton = reviewsModal.querySelector('.modal-button.next');

let currentReviewIndex = 0;
const reviewImages = Array.from(reviewItems).map(item => 
  item.querySelector('img').src
);

function openReviewsModal(index) {
  currentReviewIndex = index;
  reviewsModalImage.src = reviewImages[currentReviewIndex];
  reviewsModal.style.display = 'flex';
  setTimeout(() => {
    reviewsModal.classList.add('show');
  }, 10);
  document.body.style.overflow = 'hidden';
}

function closeReviewsModal() {
  reviewsModal.classList.remove('show');
  setTimeout(() => {
    reviewsModal.style.display = 'none';
  }, 300);
  document.body.style.overflow = '';
}

function navigateReviews(direction) {
  currentReviewIndex = (currentReviewIndex + direction + reviewImages.length) % reviewImages.length;
  reviewsModalImage.src = reviewImages[currentReviewIndex];
}

reviewItems.forEach((item, index) => {
  item.addEventListener('click', () => openReviewsModal(index));
});

reviewsCloseButton.addEventListener('click', closeReviewsModal);
reviewsPrevButton.addEventListener('click', () => navigateReviews(-1));
reviewsNextButton.addEventListener('click', () => navigateReviews(1));

reviewsModal.addEventListener('click', (e) => {
  if (e.target === reviewsModal) {
    closeReviewsModal();
  }
});

// Общая навигация с клавиатуры
document.addEventListener('keydown', (e) => {
  if (portfolioModal.classList.contains('show')) {
    switch(e.key) {
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
    switch(e.key) {
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
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  // ========== КНОПКА НАВЕРХ ==========
  const scrollTopBtn = document.getElementById('scrollTop');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ========== ПАРЯЩИЕ ЭЛЕМЕНТЫ ФОНА ==========
  function createFloatingElements(containerId, count = 10) {
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
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Случайные параметры для частиц
    const size = Math.random() * 5 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    // Применение стилей
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(particle);
  }
  
  // ========== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
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
  <img class="modal-content" id="certificate-modal-image" alt="Увеличенное изображение" />
`;
document.body.appendChild(certificateModal);

const certificateModalImage = certificateModal.querySelector('#certificate-modal-image');
const certificateCloseButton = certificateModal.querySelector('.close');

// Открытие модального окна с изображением
function openCertificateModal(imageSrc) {
  certificateModalImage.src = imageSrc;
  certificateModal.style.display = 'flex';
  setTimeout(() => {
    certificateModal.classList.add('show');
  }, 10);
  document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
}

// Закрытие модального окна
function closeCertificateModal() {
  certificateModal.classList.remove('show');
  setTimeout(() => {
    certificateModal.style.display = 'none';
  }, 300);
  document.body.style.overflow = ''; // Восстанавливаем прокрутку
}

// Обработчики событий для ссылок на сертификат и карту
document.querySelectorAll('.certificate-link, .map-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const imageSrc = link.getAttribute('data-image');
    openCertificateModal(imageSrc);
  });
});

// Закрытие по клику на крестик
certificateCloseButton.addEventListener('click', closeCertificateModal);

// Закрытие по клику вне изображения
certificateModal.addEventListener('click', (e) => {
  if (e.target === certificateModal) {
    closeCertificateModal();
  }
});
// Создание парящих элементов для этапов процедуры
createFloatingElements('procedure-steps-elements', 6);
// Создание парящих элементов для раздела "Отзывы"
createFloatingElements('reviews-elements', 6);

