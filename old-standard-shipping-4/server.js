import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(express.static("public"));

// render checkout page with client id & unique client token
app.get("/checkout", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const clientToken = await paypal.generateClientToken();
  res.render("checkout", { clientId, clientToken });
});

// create order
app.post("/api/orders", async (req, res) => {
  const { paymentSource } = req.body;
  const order = await paypal.createOrder({ paymentSource});
  console.log("Created Order with ID: " + order.id);
  res.json(order);
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  res.json(captureData);
});

// NEW FOR SHIPPING
// get order
// app.get("/api/orders/:orderId", async (req, res) => {
//   const { orderId } = req.params;
//   const data = await paypal.viewOrder(orderId);
//   res.json(data);
// });

// // patch order
// app.post("/api/orders/:orderId", async (req, res) => {
//   const { orderId } = req.params;
//   const { shippingOption } = req.body;
//   const data = await paypal.updateOrder(orderId, shippingOption);
//   res.json(data);
// });

app.listen(3000, (e) => {
  console.log("Server listening at http://localhost:3000");
});