document.getElementById('generate-sketch-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Отменяем стандартное поведение формы

  const description = document.getElementById('sketch-description').value; // Получаем текстовое описание
  const resultContainer = document.getElementById('result-container'); // Контейнер для результата

  // Очищаем контейнер
  resultContainer.innerHTML = '<p>Генерация эскиза...</p>';

  try {
    // Формируем данные для отправки
    const formData = new FormData();
    formData.append('pipeline_id', 'a17740da-e8a0-4816-876a-74326c5c4cef'); // ID модели
    formData.append('params', JSON.stringify({
      type: "GENERATE",
      style: "DEFAULT", // Стиль "Свой стиль"
      width: 512,
      height: 512,
      numImages: 1,
      generateParams: {
        query: description
      }
    }));

    // Логирование данных
    console.log('Headers:', {
      'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
      'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C'
    });
    console.log('FormData:', formData);

    // Пример запроса к API FusionBrain
    const response = await fetch('https://api-key.fusionbrain.ai/key/api/v1/pipeline/run', {
      method: 'POST',
      headers: {
        'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
        'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C'
      },
      body: formData
    });

    if (!response.ok) {
      const errorDetails = await response.json(); // Получаем детали ошибки
      console.error('API Error Details:', errorDetails);
      throw new Error(`Ошибка при генерации эскиза: ${errorDetails.message || response.statusText}`);
    }

    const data = await response.json();
    const uuid = data.uuid; // Получаем UUID задачи

    // Проверяем статус задачи
    let imageUrl;
    while (true) {
      const statusResponse = await fetch(`https://api-key.fusionbrain.ai/key/api/v1/pipeline/status/${uuid}`, {
        method: 'GET',
        headers: {
          'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
          'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C'
        }
      });

      const statusData = await statusResponse.json();
      if (statusData.status === 'DONE') {
        imageUrl = statusData.result.files[0];
        break;
      } else if (statusData.status === 'FAIL') {
        console.error('Error Details:', statusData.errorDescription);
        throw new Error(`Ошибка при генерации изображения: ${statusData.errorDescription}`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Ждём 2 секунды перед повторной проверкой
    }

    // Показываем изображение и даём возможность скачать
    resultContainer.innerHTML = `
      <img src="${imageUrl}" alt="Сгенерированный эскиз" style="max-width: 100%; margin-top: 20px;" />
      <a href="${imageUrl}" download="sketch.png" style="display: block; margin-top: 10px;">
        <button>Скачать эскиз</button>
      </a>
    `;
  } catch (error) {
    resultContainer.innerHTML = `<p style="color: red;">Произошла ошибка: ${error.message}</p>`;
  }
});
