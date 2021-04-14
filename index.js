import express from 'express';
import axios from 'axios';
import store from './store.js';

const app = express();

app.use(express.json());

app.post('/api/currency', async (req, res) => {
  try {
    const allowedCurrency = ['USD', 'EUR', 'BTC'];
    const currency = req.body.code.toUpperCase();

    if (!allowedCurrency.includes(currency)) {
      res.status(400).json({
        message: 'Currency not available'
      });

      return;
    }

    const value = await store.get(currency);

    if (value) {
      res.status(200).json(JSON.parse(value));
      return;
    }

    const { data } = await axios.get(`https://economia.awesomeapi.com.br/json/last/${currency}`);
    const { code, high, low } = data[`${currency}BRL`];
    let currencyData = {
      name: `${currency}BRL`,
      code,
      high,
      low
    };

    res.json(currencyData);

    store.setex(currency, 60, JSON.stringify(currencyData));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listenning on port ${port}`));
