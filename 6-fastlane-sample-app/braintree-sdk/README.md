# Fastlane Sample Application

Simple example of how to integrate with Fastlane by PayPal.

## Introduction and Overview

Fastlane 🚀

This sample app demonstrates how to integrate with Fastlane using Braintree's server SDK.

## Before You Code

1. **Setup a Braintree Sandbox Account**

  To get started, you'll need a Braintree Sandbox Account.

  [Sign Up](https://www.braintreepayments.com/sandbox) or [Log In](https://sandbox.braintreegateway.com/login)

1. **Braintree Credentials**

  Once you've setup a Braintree Sandbox Account, you will need to take note of your Merchant ID, public key, and private key.

## How to Run Locally

1. Clone the repository.
2. Copy the `.env.example` file from the `server` folder.
3. Pick the server language you want and paste the file you copied into that folder.
4. Rename the file to `.env` and replace the placeholders with the appropriate values.
5. Follow the instructions in the server folder's README.

## Client Integrations

### Quick Start Integration

#### Overview
Fastlane quick start Integration allows you to use PayPal's pre-build UI for payment collection thereby allowing you to integrate quickly and easily. The ready-made payment UI component will automatically render the following :
1. Selected card for the Fastlane member.
2. "Change card" link and allows payers to change the selection.
3. Card fields (for Guest users or for Fastlane members that don't have a card in their profile)
4. Billing address fields

#### Key Features
- Quickest way to integrate Fastlane
- Pre-formatted payment form
- Collect information included on the payment form for Guest Users:
  - Credit card number
  - Cardholder name
  - Expiration date
  - CVV
- Billing Address included on payment form for Guest users :
  - Street Address
  - City
  - State
  - Zipcode
  - Data Security : Quick start Integration is PCI DSS compliant, ensuring that customer payment information is handled securely.

### Flexible Integration

#### Overview
Fastlane Flexible Integration allows you to customize and style the payment page as per the look and feel of your website. The merchant can own the experience and customize :
1. Rendering the shipping address fields and payment method fields for Guest users.
2. Rendering the shipping address and payment method from Fastlane profile.

#### Key Features
1. Customize the behavior and experience of your checkout.
2. Create your own payment form using your existing styles and layout.
3. Simple Integration with code snippets to help developers.
