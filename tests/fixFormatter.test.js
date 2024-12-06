const { formatFixMessage, explainFixMessage } = require('../fixFormatter');
const moment = require('moment');

describe('FIX Protocol Formatter', () => {
    test('should format a valid FIX message', () => {
        const stockData = {
            symbol: 'AAPL',
            price: 150.5,
            quantity: 10,
            clOrdId: 'ORD12345',
            ordStatus: '0' // New Order
        };

        const fixMessage = formatFixMessage(stockData);
        const expectedBeginString = '8=FIX.4.4|';
        const expectedMsgType = '35=D|';
        const expectedClOrdId = `11=${stockData.clOrdId}|`;
        const expectedSymbol = `55=${stockData.symbol}|`;

        expect(fixMessage).toContain(expectedBeginString);
        expect(fixMessage).toContain(expectedMsgType);
        expect(fixMessage).toContain(expectedClOrdId);
        expect(fixMessage).toContain(expectedSymbol);
    });

    test('should explain the FIX message fields', () => {
        const fixMessage = '8=FIX.4.4|35=D|11=ORD12345|55=AAPL|44=150.5|38=10|54=1|39=0|52=20241206-12:34:56.789|10=123';
        const explainedFields = explainFixMessage(fixMessage);

        expect(explainedFields).toEqual(
            expect.arrayContaining([
                { tag: '8', value: 'FIX.4.4', explanation: 'BeginString (FIX version)' },
                { tag: '35', value: 'D', explanation: 'MsgType (Message type, e.g., D for New Order - Single)' },
                { tag: '11', value: 'ORD12345', explanation: 'ClOrdID (Client Order ID, unique identifier for the order)' },
                { tag: '39', value: '0', explanation: 'OrdStatus (Order status: 0 = New, 1 = Partially Filled, 2 = Filled)' }
            ])
        );
    });
});
