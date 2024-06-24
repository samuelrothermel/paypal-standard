import fetch from "node-fetch";

// set some important variables
const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// call the create order method
export async function createOrder({ customerId, paymentSource }) {
  const purchaseAmount = "13.99"; // TODO: pull prices from a database
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: purchaseAmount,
          },
        },
      ],
      payment_source: {
        paypal: {
          attributes: {
            customer: {
              id: customerId,
            },
            vault: {
              store_in_vault: "ON_SUCCESS",
              usage_type: "MERCHANT",
              customer_type: "CONSUMER",
            },
          },
          "experience_context": {
            "return_url": "localhost:8888/returnUrl",
            "cancel_url": "localhost:888/returnUrl"
          }
        },
      },
    }),
  });
 
  const data = await response.json();
  console.log("Capture Request");
  console.log(data);
  return data;
}

// capture payment for an order
export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

// generate access token
export async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

// generate client token
export async function generateClientToken(body) {
  const accessToken = await generateAccessToken();
  const request = {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
  };
  if (body) request.body = JSON.stringify(body);
  const response = await fetch(`${base}/v1/identity/generate-token`, request);
  const data = await response.json();
  return data.client_token;
}