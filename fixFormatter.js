const moment = require('moment');

/**
 * Converts stock data into FIX protocol format.
 * @param {Object} stockData - The stock data to convert.
 * @param {string} stockData.symbol - Stock symbol (e.g., AAPL).
 * @param {number} stockData.price - Stock price.
 * @param {number} stockData.quantity - Quantity of stocks.
 * @param {string} stockData.clOrdId - Client Order ID (unique identifier for the order).
 * @param {string} stockData.ordStatus - Order status (e.g., 0 = New, 1 = Partially Filled, 2 = Filled).
 * @returns {string} - FIX-formatted message.
 */
function formatFixMessage(stockData) {
    const { symbol, price, quantity, clOrdId, ordStatus } = stockData;
    const sendingTime = moment().utc().format('YYYYMMDD-HH:mm:ss.SSS'); // UTC time in FIX format

    // Standard FIX fields for a stock trade message
    const fixMessage = [
        `8=FIX.4.4`,                // BeginString
        `35=D`,                     // MsgType (New Order - Single)
        `11=${clOrdId}`,            // ClOrdID (Client Order ID)
        `55=${symbol}`,             // Symbol
        `44=${price}`,              // Price
        `38=${quantity}`,           // OrderQty
        `54=1`,                     // Side (1 = Buy)
        `39=${ordStatus}`,          // OrdStatus (Order status)
        `52=${sendingTime}`,        // SendingTime
        `10=${calculateChecksum(symbol, price, quantity, clOrdId, ordStatus, sendingTime)}` // Checksum
    ].join('|');

    return fixMessage;
}

/**
 * Explains the meaning of each FIX field in the message.
 * @param {string} fixMessage - FIX message to explain.
 * @returns {Object[]} - Array of objects with tag, value, and explanation.
 */
function explainFixMessage(fixMessage) {
    const fieldDefinitions = {
        '8': 'BeginString (FIX version)',
        '35': 'MsgType (Message type, e.g., D for New Order - Single)',
        '11': 'ClOrdID (Client Order ID, unique identifier for the order)',
        '55': 'Symbol (Stock symbol)',
        '44': 'Price (Stock price)',
        '38': 'OrderQty (Quantity of stocks)',
        '54': 'Side (1 = Buy, 2 = Sell)',
        '39': 'OrdStatus (Order status: 0 = New, 1 = Partially Filled, 2 = Filled)',
        '52': 'SendingTime (Time the message is sent in UTC)',
        '10': 'Checksum (Message integrity check)'
    };

    return fixMessage.split('|').map((field) => {
        const [tag, value] = field.split('=');
        return {
            tag,
            value,
            explanation: fieldDefinitions[tag] || 'Unknown field'
        };
    });
}

/**
 * Calculates a simple checksum for the FIX message.
 * (This is a simplified example, real FIX checksum is more complex.)
 * @param {string} symbol
 * @param {number} price
 * @param {number} quantity
 * @param {string} clOrdId
 * @param {string} ordStatus
 * @param {string} sendingTime
 * @returns {number} - Checksum value.
 */
function calculateChecksum(symbol, price, quantity, clOrdId, ordStatus, sendingTime) {
    const rawString = `${symbol}${price}${quantity}${clOrdId}${ordStatus}${sendingTime}`;
    return rawString.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 256;
}

module.exports = {
    formatFixMessage,
    explainFixMessage
};
