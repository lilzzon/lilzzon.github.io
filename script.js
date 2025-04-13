document.addEventListener('DOMContentLoaded', function() {
  // Галерея портфолио
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const closeButton = document.querySelector('.close');
  const prevButton = document.querySelector('.modal-button.prev');
  const nextButton = document.querySelector('.modal-button.next');
  const viewAllBtn = document.querySelector('.view-all-btn');
  
  let currentIndex = 0;
  const allImages = Array.from(portfolioItems).map(item => 
    item.querySelector('img').src
  );

  // Функция открытия модального окна
  function openModal(index) {
    currentIndex = index;
    modalImage.src = allImages[currentIndex];
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
  }

  // Функция закрытия модального окна
  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
  }

  // Функция навигации по изображениям
  function navigate(direction) {
    currentIndex = (currentIndex + direction + allImages.length) % allImages.length;
    modalImage.src = allImages[currentIndex];
  }

  // Обработчики событий для элементов портфолио
  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
  });



  // Обработчики для кнопок модального окна
  closeButton.addEventListener('click', closeModal);
  prevButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));

  // Закрытие по клику вне изображения
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Навигация с клавиатуры
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    
    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        navigate(-1);
        break;
      case 'ArrowRight':
        navigate(1);
        break;
    }
  });

  // Остальной код (анимации, кнопка наверх и т.д.)
  // Анимация появления при скролле
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

  // Кнопка наверх
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

  // Парящие элементы фона
  function createFloatingElements(containerId, count = 10) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.classList.add('floating-element');
      
      const size = Math.random() * 100 + 50;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      
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
  
  // Создаем элементы для каждого раздела
  createFloatingElements('sterilization-elements', 5);
  createFloatingElements('contraindications-elements', 5);
  createFloatingElements('care-elements', 8);
  createFloatingElements('recommendations-elements', 4);
  
  // Эффект частиц
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(particle);
  }
  
  // Плавный скролл для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Анимация заголовка при загрузке
  const title = document.querySelector('.text-wrapper');
  setTimeout(() => {
    title.classList.add('animate__animated', 'animate__pulse');
  }, 1000);
});

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sections = document.querySelectorAll('.section');

mobileMenuBtn.addEventListener('click', function() {
  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  
  sections.forEach(section => {
    const title = section.querySelector('.section-title').textContent;
    const menuItem = document.createElement('div');
    menuItem.className = 'mobile-menu-item';
    menuItem.textContent = title;
    
    menuItem.addEventListener('click', function() {
      section.scrollIntoView({ behavior: 'smooth' });
      document.body.removeChild(menu);
    });
    
    menu.appendChild(menuItem);
  });
  
  const closeBtn = document.createElement('div');
  closeBtn.className = 'mobile-menu-close';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(menu);
  });
  
  menu.appendChild(closeBtn);
  document.body.appendChild(menu);
});