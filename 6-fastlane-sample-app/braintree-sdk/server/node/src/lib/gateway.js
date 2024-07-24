import braintree from 'braintree';

const { BRAINTREE_MERCHANT_ID, BRAINTREE_PRIVATE_KEY, BRAINTREE_PUBLIC_KEY } =
  process.env;

let gateway;

export function getGateway() {
  if (!gateway) {
    gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox, // use braintree.Environment.Production for production environment
      merchantId: BRAINTREE_MERCHANT_ID,
      privateKey: BRAINTREE_PRIVATE_KEY,
      publicKey: BRAINTREE_PUBLIC_KEY,
    });
  }
  return gateway;
}
