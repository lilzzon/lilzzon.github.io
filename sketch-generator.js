document.getElementById('generate-sketch-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Отменяем стандартное поведение формы

  const sketchDescription = document.getElementById('sketch-description');
  const resultContainer = document.getElementById('result-container');

  // Показываем состояние загрузки
  resultContainer.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Проверка доступности сервиса...</p></div>`;

  try {
    // Проверяем доступность сервиса
    const availabilityResponse = await fetch('https://artworkshop-proxy.onrender.com/proxy/check-availability');
    if (!availabilityResponse.ok) {
      throw new Error('Не удалось проверить доступность сервиса');
    }

    const availabilityData = await availabilityResponse.json();
    if (availabilityData.status !== 'AVAILABLE') {
      throw new Error('Сервис временно недоступен. Попробуйте позже.');
    }

    // Показываем состояние генерации
    resultContainer.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Генерация эскиза...</p></div>`;

    // Отправляем запрос на генерацию эскиза
    const generateResponse = await fetch('https://artworkshop-proxy.onrender.com/proxy/text2image/run', {
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

    if (!generateResponse.ok) {
      throw new Error('Ошибка при генерации эскиза');
    }

    const generateData = await generateResponse.json();
    const uuid = generateData.uuid; // Получаем UUID задачи

    // Проверяем статус задачи
    let imageUrl;
    let attempts = 0;
    const maxAttempts = 30; // Максимум 30 попыток (60 секунд)

    while (attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Ждем 2 секунды

      const statusResponse = await fetch(`https://artworkshop-proxy.onrender.com/proxy/text2image/status/${uuid}`, {
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
