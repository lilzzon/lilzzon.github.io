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

  // Функции для генератора
  async function generateTattoo(prompt) {
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

      // Логирование ответа API
      const data = await response.json();
      console.log('Ответ от API:', data); // Логируем полный ответ

      // Проверяем, есть ли URL изображения
      if (data && data.output_url) {
        return data.output_url;
      } else {
        throw new Error('Не получен корректный URL изображения');
      }
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

  // Обработчик клика на кнопку "Генерировать"
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
      console.log('Генерация с запросом:', fullPrompt);

      const imageUrl = await generateTattoo(fullPrompt);

      // Проверяем, получен ли корректный URL изображения
      if (imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.className = 'generated-image';
        imgElement.alt = 'Сгенерированная татуировка';
        resultsGrid.appendChild(imgElement);

        imgElement.addEventListener('click', function() {
          alert('Изображение сохранено в избранное!');
        });
      } else {
        alert('Не удалось получить изображение');
      }
    } catch (error) {
      alert('Произошла ошибка при генерации. Пожалуйста, попробуйте ещё раз.');
      console.error("Ошибка генерации:", error);
    } finally {
      loadingIndicator.style.display = 'none';
    }
  });
});
