const express = require('express');
const axios = require('axios');
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

console.log("Public Key:", paystackPublicKey);
console.log("Secret Key:", paystackSecretKey);


app.use(express.json());

app.post('/initialize-transaction', async (req, res) => {
  try {
    const { email, amount } = req.body;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      { email, amount },
      {
        headers: {
          Authorization: `Bearer sk_test_4cbe44cfd13e5271e4f9ca692f60f4aba227af3e
`, // Replace with your secret key
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
