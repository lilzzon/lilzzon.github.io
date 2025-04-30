document.getElementById('generate-sketch-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Отменяем стандартное поведение формы

  const sketchDescription = document.getElementById('sketch-description').value;
  const resultContainer = document.getElementById('result-container');

  // Показываем состояние загрузки
  resultContainer.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Подготовка к генерации...</p></div>`;

  try {
    // 1. Получаем pipeline ID
    const pipelinesResponse = await fetch('https://artworkshop-proxy.onrender.com/proxy/get-pipelines');
    if (!pipelinesResponse.ok) {
      throw new Error('Не удалось получить список моделей');
    }
    
    const pipelinesData = await pipelinesResponse.json();
    if (!pipelinesData || pipelinesData.length === 0) {
      throw new Error('Нет доступных моделей для генерации');
    }
    
    const pipelineId = pipelinesData[0].id;

    // 2. Отправляем запрос на генерацию
    resultContainer.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Генерация эскиза...</p></div>`;

    const generateResponse = await fetch('https://artworkshop-proxy.onrender.com/proxy/text2image/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: "GENERATE",
        style: "DEFAULT",
        width: 1024,
        height: 1024,
        numImages: 1,
        generateParams: {
          query: sketchDescription
        }
      })
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      throw new Error(errorData.error || 'Ошибка при генерации эскиза');
    }

    const generateData = await generateResponse.json();
    const uuid = generateData.uuid;

    // 3. Проверяем статус задачи
    let resultData;
    let attempts = 0;
    const maxAttempts = 15; // 15 попыток (30 секунд с интервалом 2 секунды)
    const delay = 2000;

    while (attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, delay));

      const statusResponse = await fetch(`https://artworkshop-proxy.onrender.com/proxy/text2image/status/${uuid}`);
      
      if (!statusResponse.ok) {
        continue; // Пробуем снова при ошибке запроса
      }

      resultData = await statusResponse.json();

      if (resultData.status === 'DONE') {
        break;
      } else if (resultData.status === 'FAIL') {
        throw new Error(resultData.errorDescription || 'Ошибка генерации');
      }
    }

    if (!resultData || resultData.status !== 'DONE') {
      throw new Error('Превышено время ожидания генерации');
    }

    if (!resultData.result || !resultData.result.files || resultData.result.files.length === 0) {
      throw new Error('Не удалось получить изображение');
    }

    // 4. Отображаем результат
    const base64Image = resultData.result.files[0];
    resultContainer.innerHTML = `
      <div class="result-content">
        <div class="sketch-preview">
          <img src="data:image/png;base64,${base64Image}" alt="Сгенерированный эскиз">
          <div class="sketch-actions">
            <button class="action-btn download-btn" onclick="downloadImage('data:image/png;base64,${base64Image}')">
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
function downloadImage(base64Data) {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = 'generated-sketch.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
