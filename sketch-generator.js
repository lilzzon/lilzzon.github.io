document.getElementById('generate-sketch-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Отменяем стандартное поведение формы

  const sketchDescription = document.getElementById('sketch-description'); // Поле ввода текстового описания
  const resultContainer = document.getElementById('result-container'); // Контейнер для результата

  // Показываем состояние загрузки
  resultContainer.innerHTML = `
    <div class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Генерация эскиза...</p>
    </div>
  `;

  try {
    // Отправляем запрос через прокси
    const response = await fetch('https://lilzzon-github-io-1.onrender.com/proxy/text2image/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: "GENERATE",
        style: "DEFAULT",
        width: 512,
        height: 512,
        numImages: 1,
        generateParams: {
          query: sketchDescription.value
        }
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка при генерации эскиза');
    }

    const data = await response.json();
    const uuid = data.uuid; // Получаем UUID задачи

    // Проверяем статус задачи
    let imageUrl;
    let attempts = 0;
    const maxAttempts = 30; // Максимум 30 попыток (60 секунд)

    while (attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Ждем 2 секунды

      const statusResponse = await fetch(`https://lilzzon-github-io-1.onrender.com/proxy/text2image/status/${uuid}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const statusData = await statusResponse.json();

      if (statusData.status === 'DONE') {
        if (!statusData.images || statusData.images.length === 0) {
          throw new Error('Не удалось получить изображение');
        }
        imageUrl = statusData.images[0];
        break;
      } else if (statusData.status === 'FAIL') {
        throw new Error(statusData.error || 'Неизвестная ошибка генерации');
      }
    }

    if (!imageUrl) {
      throw new Error('Превышено время ожидания генерации');
    }

    // Показываем результат
    resultContainer.innerHTML = `
      <div class="result-content">
        <div class="sketch-preview">
          <img src="${imageUrl}" alt="Сгенерированный эскиз">
          <div class="sketch-actions">
            <button class="action-btn download-btn" onclick="downloadImage('${imageUrl}')">
              <i class="fas fa-download"></i> Скачать
            </button>
            <button class="action-btn regenerate-btn" onclick="location.reload()">
              <i class="fas fa-sync-alt"></i> Перегенерировать
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Ошибка:', error);
    resultContainer.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Ошибка: ${error.message}</p>
        <button onclick="location.reload()">Попробовать снова</button>
      </div>
    `;
  }
});

// Функция для скачивания изображения
window.downloadImage = function(base64Image) {
  const link = document.createElement('a');
  link.href = base64Image.startsWith('data:image') ? base64Image : `data:image/png;base64,${base64Image}`;
  link.download = 'эскиз.png';
  link.click();
};