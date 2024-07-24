package com.fastlane.braintreesdksample.sample;

import com.braintreegateway.BraintreeGateway;
import com.braintreegateway.Environment;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

@Component
public class BraintreeGatewayComponent {

    private static BraintreeGatewayComponent instance;
    private final Dotenv dotenv;
    private final BraintreeGateway gateway;

    private BraintreeGatewayComponent() {
        this.dotenv = Dotenv.load();
        this.gateway = new BraintreeGateway(
            Environment.SANDBOX,
            dotenv.get("BRAINTREE_MERCHANT_ID"),
            dotenv.get("BRAINTREE_PUBLIC_KEY"),
            dotenv.get("BRAINTREE_PRIVATE_KEY")
        );
    }

    public static synchronized BraintreeGatewayComponent getInstance() {
        if (instance == null) {
            instance = new BraintreeGatewayComponent();
        }
        return instance;
    }

    public BraintreeGateway getGateway() {
        return gateway;
    }
}
