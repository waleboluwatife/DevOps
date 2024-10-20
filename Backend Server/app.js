const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests

const app = express();
const port = process.env.PORT || 4041;

// Allow your app to accept JSON input
app.use(express.json());

// Basic route to confirm the server is running
app.get('/', (req, res) => {
    res.send('BudPay Shopify Backend is Running!');
});

// Endpoint to handle payments
app.post('/process-payment', async (req, res) => {
    const { amount, currency, customer_email } = req.body;

    try {
        // Set up your BudPay API key and endpoint
        const apiKey = 'sk_test_lkowqtejidzytubleji1kjpdnmo2d1c0vmaszcc'; // Replace with your real API key
        const budpayUrl = 'https://budpay.ng/api/v1/transaction/initialize'; // BudPay API endpoint

        // Send a request to BudPay to process payment
        const response = await axios.post(budpayUrl, {
            email: customer_email,
            amount: amount,
            currency: currency,
            callback: 'your-callback-url' // Replace with your actual callback URL
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        // Check response and return it to the client
        if (response.data.status === 'success') {
            res.json({ message: 'Payment initialized successfully', data: response.data });
        } else {
            res.status(400).json({ message: 'Payment initialization failed', error: response.data });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the payment', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

