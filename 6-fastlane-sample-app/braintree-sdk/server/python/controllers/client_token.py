import os
from flask import jsonify, make_response
from .gateway import braintree_gateway

DOMAINS = os.getenv("DOMAINS", "").split(",")


def braintree_sdk_token():
    try:
        client_token = braintree_gateway().client_token.generate({"domains": DOMAINS})
        return jsonify(clientToken=client_token)
    except Exception as error:
        print(error)
        return make_response(jsonify(error=str(error)), 500)
