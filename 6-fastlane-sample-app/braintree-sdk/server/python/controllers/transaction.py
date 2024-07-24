from flask import jsonify, make_response
from .gateway import braintree_gateway


def braintree_sdk_transaction(transactionData):
    try:
        deviceData = transactionData.get("deviceData")
        email = transactionData.get("email")
        name = transactionData.get("name")
        billingAddress = transactionData["paymentToken"]["paymentSource"]["card"][
            "billingAddress"
        ]
        shippingAddress = transactionData["shippingAddress"]

        # Convert information to snake_case for Braintree python gateway.
        saleRequest = {
            "amount": "10.00",
            "payment_method_nonce": transactionData["paymentToken"]["id"],
            "device_data": deviceData,
            "customer": {
                "email": email,
                **(
                    {
                        "first_name": name.get("firstName"),
                        "last_name": name.get("lastName"),
                    }
                    if name
                    else {}
                ),
            },
            "billing": {
                "street_address": billingAddress.get("streetAddress"),
                "extended_address": billingAddress.get("extendedAddress"),
                "locality": billingAddress.get("locality"),
                "region": billingAddress.get("region"),
                "postal_code": billingAddress.get("postalCode"),
                "country_code_alpha2": billingAddress.get("countryCodeAlpha2"),
            },
            "shipping": (
                {
                    "street_address": shippingAddress.get("streetAddress"),
                    "extended_address": shippingAddress.get("extendedAddress"),
                    "locality": shippingAddress.get("locality"),
                    "region": shippingAddress.get("region"),
                    "postal_code": shippingAddress.get("postalCode"),
                    "country_code_alpha2": shippingAddress.get("countryCodeAlpha2"),
                    "shipping_method": "ground",
                }
                if shippingAddress
                else None
            ),
            "options": {"submit_for_settlement": True},
        }

        result = braintree_gateway().transaction.sale(saleRequest)

        if not result.is_success:
            raise Exception(result.message)

        return jsonify(
            result={
                "success": True,
                "transaction": {
                    "id": result.transaction.id,
                    "status": result.transaction.status,
                    "type": result.transaction.type,
                },
            }
        )
    except Exception as error:
        print(error)
        return make_response(jsonify(error=str(error)), 500)
