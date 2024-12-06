const express = require('express');
const bodyParser = require('body-parser');
const { formatFixMessage, explainFixMessage } = require('./fixFormatter');

const app = express();
const port = 3000;

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Endpoint to convert stock data to FIX protocol and show what each means
app.post('/convert-to-fix-deparsed', (req, res) => {
    const stockData = req.body;

    // Validate the incoming data
    if (!stockData.symbol || !stockData.price || !stockData.quantity || !stockData.clOrdId) {
        return res.status(400).json({ error: 'Missing required stock data: symbol, price, quantity, or clOrdId' });
    }

    // Convert to FIX format
    const fixMessage = formatFixMessage(stockData);

    // Annotate the FIX message with explanations
    const explainedFix = explainFixMessage(fixMessage);

    // Return FIX message and explanation as the response
    res.json({
        fixMessage,
        explainedFix
    });
});


app.post('/fix', (req, res) => {
    const stockData = req.body;

    // Validate the incoming data
    if (!stockData.symbol || !stockData.price || !stockData.quantity || !stockData.clOrdId) {
        return res.status(400).json({ error: 'Missing required stock data: symbol, price, quantity, or clOrdId' });
    }

    // Convert to FIX format
    const fixMessage = formatFixMessage(stockData);


    // Return FIX message and explanation as the response
    res.json({
        fixMessage,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
