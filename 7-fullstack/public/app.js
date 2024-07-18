/**
 * This file adds PayPal Buttons to your checkout page
 */

import * as api from "./api.js";

paypal
  .Buttons({
    style: {
      layout: "vertical",
    },
    // Sets up the transaction when a payment button is clicked
    async createOrder(data, actions) {
      const { paymentSource } = data;
      const order = await api.createOrder({ paymentSource })
      console.log("Created Order with ID: " + order.id);
      console.log(order);
      return order.id;
    },
    // Finalize the transaction after payer approval
    async onApprove(data, actions) {
      const orderData = await api.captureOrder(data.orderID);
      // Successful capture! For dev/demo purposes:
      console.log(
        "Capture result",
        orderData,
        JSON.stringify(orderData, null, 2)
      );
      var transaction = orderData.purchase_units[0].payments.captures[0];
      alert(`Transaction ${transaction.status}: ${transaction.id}
 
         See console for all available details
       `);
    },
    onCancel(data, actions) {
      console.log(`Order Canceled - ID: ${data.orderID}`);
    },
    onError(err) {
      console.error("Error", err.message, "\nCheckout network for more details");
    },
    // Logs shipping options change in paypal modal to client-side
    onShippingOptionsChange(data, actions) {
      // data.selectedShippingOption contains the selected shipping option
      console.log("SELECTED_OPTION", data.selectedShippingOption);
      console.log("Logging actions", actions);
    },
    onShippingAddressChange(data, actions) {
      // Data sent with onShippingAddressChange callback
      console.log("Data: ", JSON.stringify(data));
      // If customer's address is in the U.S., tell paypal to show below error in paypal modal
      if (data.shippingAddress.countryCode !== "US") {
        return actions.reject(data.errors.COUNTRY_ERROR);
    }
      // data.shippingAddress contains the selected shipping address
      console.log("SHIPPING_ADDRESS", data);
      console.log("Logging actions", actions);
    },
  })
  .render("#paypal-button-container");