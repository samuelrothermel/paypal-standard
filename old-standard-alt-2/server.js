import express from "express";
import * as paypal from "./paypal-api.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use(express.static("public"));

app.post("/api/orders", async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
});

app.post("/api/orders/:orderId/capture", async (req, res) => {
  const { orderId } = req.params;
  const captureData = await paypal.capturePayment(orderId);
  res.json(captureData);
});

const port = process.env.PORT || 5555;
app.listen(port, (e) => {
  if (e) throw e;
  console.log(`Server started at http://localhost:${port}`);
});
