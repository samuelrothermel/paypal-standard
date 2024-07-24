import { getGateway } from '../lib/gateway.js';

export function createTransaction(req, res) {
  try {
    const { deviceData, email, name, paymentToken, shippingAddress } = req.body;

    getGateway().transaction.sale(
      {
        amount: '10.00',
        paymentMethodNonce: paymentToken.id,
        deviceData,
        customer: {
          ...name,
          email,
        },
        billing: {
          ...paymentToken.paymentSource.card.billingAddress,
        },
        ...(shippingAddress && {
          shipping: {
            ...shippingAddress,
            shippingMethod: 'ground',
          },
        }),
        options: {
          submitForSettlement: true
        },
      },
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
          return;
        }
        res.json({ result });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
