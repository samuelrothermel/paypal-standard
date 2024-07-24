import os
import braintree

braintreeInstance = None


def braintree_gateway():
    global braintreeInstance
    if braintreeInstance is None:
        braintreeInstance = braintree.BraintreeGateway(
            braintree.Configuration(
                environment=braintree.Environment.Sandbox,  # use braintree.Environment.Production for production environment
                merchant_id=os.getenv("BRAINTREE_MERCHANT_ID"),
                public_key=os.getenv("BRAINTREE_PUBLIC_KEY"),
                private_key=os.getenv("BRAINTREE_PRIVATE_KEY"),
            )
        )

    return braintreeInstance
