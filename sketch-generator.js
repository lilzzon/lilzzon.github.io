document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('generate-sketch-form');
  const resultContainer = document.getElementById('result-container');
  const sketchDescription = document.getElementById('sketch-description');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Показываем состояние загрузки
    resultContainer.innerHTML = `
      <div class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Генерация эскиза...</p>
      </div>
    `;

    try {
      // 1. Запускаем генерацию
      const response = await fetch('https://api-key.fusionbrain.ai/key/api/v1/text2image/run', {
        method: 'POST',
        headers: {
          'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
          'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C',
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
        throw new Error(`Ошибка API: ${response.status}`);
      }

      const data = await response.json();
      const uuid = data.uuid;

      // 2. Проверяем статус генерации
      let imageUrl;
      let attempts = 0;
      const maxAttempts = 30; // Максимум 30 попыток (60 секунд)

      while (attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Ждем 2 секунды

        const statusResponse = await fetch(`https://api-key.fusionbrain.ai/key/api/v1/text2image/status/${uuid}`, {
          headers: {
            'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
            'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C'
          }
        });

        const statusData = await statusResponse.json();

        if (statusData.status === 'DONE') {
          imageUrl = statusData.images?.[0];
          break;
        } else if (statusData.status === 'FAIL') {
          throw new Error(statusData.error || 'Неизвестная ошибка генерации');
        }
      }

      if (!imageUrl) {
        throw new Error('Превышено время ожидания генерации');
      }

      // 3. Показываем результат
      resultContainer.innerHTML = `
        <div class="result-content">
          <div class="sketch-preview">
            <img src="data:image/png;base64,${imageUrl}" alt="Сгенерированный эскиз">
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
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = 'эскиз.png';
    link.click();
  };
});
