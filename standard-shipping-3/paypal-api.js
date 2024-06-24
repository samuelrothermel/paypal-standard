import fetch from "node-fetch";
import "dotenv/config"; // loads env variables from .env file

const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// Create an order with shipping options
// using the REST API
export async function createOrder() {
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
            value: "18.00",
            currency_code: "USD",
            breakdown: {
              item_total: {
                value: "15.00",
                currency_code: "USD",
              },
              shipping: {
                value: "3.00",
                currency_code: "USD",
              },
            },
          },
          shipping: {
            options: [
              {
                id: "SHIP_123",
                label: "Standard Shipping (3-Day)",
                type: "SHIPPING",
                selected: true,
                amount: {
                  value: "3.00",
                  currency_code: "USD",
                },
              },
              {
                id: "FREE_99",
                label: "Free Shipping (7-Day)",
                type: "SHIPPING",
                selected: false,
                amount: {
                  value: "0.00",
                  currency_code: "USD",
                },
              },
            ],
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  console.log("attempting capture");
  console.log(url);
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function generateAccessToken() {
  const response = await fetch(base + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function viewOrder(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // TODO: needs some error handling
  // just return whatever the server provides
  return response.json();
}

export async function updateOrder(orderId, shippingOption) {
  // calculate the new price of the order
  const baseValue = "15.00";
  const valueWithShipping =
    parseFloat(baseValue) + parseFloat(shippingOption.amount.value);
  const value = { value: valueWithShipping.toFixed(2), currency_code: "USD" };

  // send the patch request to the orders api
  const url = `${base}/v2/checkout/orders/${orderId}`;
  const accessToken = await generateAccessToken();
  const response = await fetch(url, {
    method: "patch",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify([
      {
        op: "replace",
        path: "/purchase_units/@reference_id=='default'/amount",
        value,
      },
    ]),
  });

  // when the patch is successful you should receive a 204
  if (response.status === 204) {
    return { success: true };
  }

  // most errors show up with a status code 422
  // it can be helpful to parse the errors and return them
  if (response.status === 422) {
    const data = await response.json();
    return {
      error: response.statusText,
      status: response.status,
      details: data.details,
    };
  }

  // Debugging: log out any other status codes and messages
  // console.log({
  //   url,
  //   status: response.status,
  //   statusText: response.statusText,
  // });
}
