document.addEventListener('DOMContentLoaded', function() {
  // Галерея и модальное окно
  const galleryImages = document.querySelectorAll('.gallery-image');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const closeButton = document.querySelector('.close');
  const prevButton = document.querySelector('.modal-button.prev');
  const nextButton = document.querySelector('.modal-button.next');
  let currentIndex = 0;

  // Генератор татуировок
  const generateBtn = document.getElementById('generate-btn');
  const promptInput = document.getElementById('prompt-input');
  const styleSelect = document.getElementById('style-select');
  const resultsGrid = document.getElementById('results-grid');
  const loadingIndicator = document.getElementById('loading');

  // Функции для галереи
  function openModal(index) {
    currentIndex = index;
    modal.style.display = 'flex';
    updateModalImage();
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function updateModalImage() {
    const imageSrc = galleryImages[currentIndex].getAttribute('src');
    modalImage.setAttribute('src', imageSrc);
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    updateModalImage();
  }

  // Функции для генератора
  async function generateTattoo(prompt) {
    // В реальном проекте замените на ваш API ключ
    const apiKey = '32698b79-aafd-4d13-b72d-c21e5b62c533';
    try {
      const response = await fetch('https://api.deepai.org/api/text2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          text: prompt,
          grid_size: '1',
          width: '512',
          height: '512'
        })
      });
      
      const data = await response.json();
      return data.output_url;
    } catch (error) {
      console.error('Ошибка при запросе к API:', error);
      throw error;
    }
  }

  function getStyleDescription(style) {
    const styles = {
      graphic: "графика, четкие линии, высокий контраст",
      minimal: "минимализм, простые линии, элегантность",
      geometric: "геометрические узоры, симметрия, точные линии"
    };
    return styles[style] || "";
  }

  // Обработчики событий для галереи
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
  });

  closeButton.addEventListener('click', closeModal);
  prevButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));

  // Обработчики событий для генератора
  generateBtn.addEventListener('click', async function() {
    const prompt = promptInput.value.trim();
    const style = styleSelect.value;
    
    if (!prompt) {
      alert('Пожалуйста, опишите вашу идею');
      return;
    }
    
    loadingIndicator.style.display = 'block';
    resultsGrid.innerHTML = '';
    
    try {
      const fullPrompt = `${prompt}, ${getStyleDescription(style)}, эскиз татуировки, черно-белое, высокая детализация`;
      const imageUrl = await generateTattoo(fullPrompt);
      
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.className = 'generated-image';
      imgElement.alt = 'Сгенерированная татуировка';
      resultsGrid.appendChild(imgElement);
      
      imgElement.addEventListener('click', function() {
        // Можно добавить функционал сохранения
        alert('Изображение сохранено в избранное!');
      });
    } catch (error) {
      alert('Произошла ошибка при генерации. Пожалуйста, попробуйте ещё раз.');
    } finally {
      loadingIndicator.style.display = 'none';
    }
  });

  // Закрытие модального окна при клике вне изображения
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
});
