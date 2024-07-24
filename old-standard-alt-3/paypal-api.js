// javascript interface for performing asynchronous HTTP requests.
import fetch from "node-fetch";

// setting some important variables
const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// call the create order method
export async function createOrder({ paymentSource }) {
  const purchaseAmount = "9.99"; // hardcoding product price
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
// this function retrieves an access token to authenticate API
// requests to PayPal.
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
// this function generates a secure client token and passes it back 
// to the client-side for securely initiating a transaction on client-side.
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