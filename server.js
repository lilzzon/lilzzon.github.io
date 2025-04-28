const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors());

// Маршрут для генерации изображений
app.post('/proxy/text2image/run', async (req, res) => {
  try {
    const response = await fetch('https://api-key.fusionbrain.ai/key/api/v1/text2image/run', {
      method: 'POST',
      headers: {
        'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
        'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для проверки статуса задачи
app.get('/proxy/text2image/status/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const response = await fetch(`https://api-key.fusionbrain.ai/key/api/v1/text2image/status/${uuid}`, {
      headers: {
        'X-Key': 'Key EF17F2E249F2A0C1548DFA9F4A2EEEAA',
        'X-Secret': 'Secret F1105D8C2B3B07B586318A6880A9096C'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});