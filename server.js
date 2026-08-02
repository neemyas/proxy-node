const express = require('express');
const axios = require('axios');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URL ausente');

  try {
    const response = await axios({
      method: 'get',
      url: targetUrl,
      responseType: 'stream',
      httpsAgent: httpsAgent,
      headers: {
        'User-Agent': 'IPTVSmartersPlayer/1.0.0 (Linux; Android 10)'
      }
    });

    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }

    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Erro: ' + error.message);
  }
});

app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));
