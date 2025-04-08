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
  async function generateTattoo(prompt, style, colorOption) {
  const apiKey = '32698b79-aafd-4d13-b72d-c21e5b62c533';
  const fullPrompt = `${prompt}, стиль: ${style}, ${colorOption}`;

  try {
    console.log("Отправка запроса к API с prompt:", fullPrompt); // Логируем prompt
    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        text: fullPrompt,
        grid_size: '1',
        width: '512',
        height: '512'
      })
    });

    const data = await response.json();
    console.log("Ответ от API:", data); // Логируем ответ от API

    // Проверяем, есть ли в ответе корректный URL изображения
    if (data.output_url) {
      return data.output_url;
    } else {
      throw new Error("API не вернул ссылку на изображение");
    }
  } catch (error) {
    console.error('Ошибка при запросе к API:', error);
    throw error;
  }
}

generateBtn.addEventListener('click', async function() {
  const prompt = promptInput.value.trim();
  const style = styleSelect.value;
  const colorOption = document.getElementById('color-select').value;
  
  if (!prompt) {
    alert('Пожалуйста, опишите вашу идею');
    return;
  }

  console.log("Нажата кнопка 'Сгенерировать'");

  loadingIndicator.style.display = 'block';
  resultsGrid.innerHTML = '';
  
  try {
    const imageUrl = await generateTattoo(prompt, style, colorOption);
    console.log("Получен URL изображения:", imageUrl);

    if (imageUrl) {
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.className = 'generated-image';
      imgElement.alt = 'Сгенерированная татуировка';
      resultsGrid.appendChild(imgElement);

      // Кнопка для скачивания изображения
      const downloadButton = document.createElement('a');
      downloadButton.href = imageUrl;
      downloadButton.download = 'tattoo_image.png'; // Название файла
      downloadButton.textContent = 'Скачать изображение';
      resultsGrid.appendChild(downloadButton);

      // Клик по изображению (например, для избранного)
      imgElement.addEventListener('click', function() {
        alert('Изображение сохранено в избранное!');
      });
    } else {
      throw new Error("Не удалось загрузить изображение");
    }
  } catch (error) {
    alert('Произошла ошибка при генерации. Пожалуйста, попробуйте ещё раз.');
    console.error("Ошибка генерации:", error);
  } finally {
    loadingIndicator.style.display = 'none';
  }
});
