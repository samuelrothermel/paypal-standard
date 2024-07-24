package com.fastlane.braintreesdksample.sample;

import com.braintreegateway.BraintreeGateway;
import com.braintreegateway.ClientTokenRequest;
import com.braintreegateway.Result;
import com.braintreegateway.Transaction;
import com.braintreegateway.TransactionAddressRequest.ShippingMethod;
import com.braintreegateway.TransactionRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fastlane.braintreesdksample.sample.models.ClientTokenResponse;
import com.fastlane.braintreesdksample.sample.models.CreateTransactionRequest;
import io.github.cdimascio.dotenv.Dotenv;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class SampleController {

    private final String title = "Fastlane - Braintree SDK Integration";
    private final String prerequisiteScripts =
        """
        <script src=\"https://js.braintreegateway.com/web/3.103.0-fastlane-beta.7.3/js/client.min.js\" defer></script>
        <script src=\"https://js.braintreegateway.com/web/3.103.0-fastlane-beta.7.3/js/data-collector.min.js\" defer ></script>
        <script src=\"https://js.braintreegateway.com/web/3.103.0-fastlane-beta.7.3/js/fastlane.min.js\" defer ></script>
        """;
    private final String initScriptPath = "init-fastlane%s.js";
    private final String stylesheetPath = "../../styles.css";

    private final Dotenv dotenv;
    private final BraintreeGateway gateway;
    private final ArrayList<String> domains;

    public SampleController() {
        this.dotenv = Dotenv.load();
        this.gateway = BraintreeGatewayComponent.getInstance().getGateway();
        this.domains = new ArrayList<>(Arrays.asList(dotenv.get("DOMAINS").split(",")));
    }

    @GetMapping("/")
    public ModelAndView getCheckout(@RequestParam(name = "flexible", required = false) String isFlexible, Model model) {
        model.addAttribute("title", isFlexible != null ? title + " (Flexible)" : title);
        model.addAttribute("prerequisiteScripts", prerequisiteScripts);
        model.addAttribute(
            "initScriptPath",
            isFlexible != null ? String.format(initScriptPath, "-flexible") : String.format(initScriptPath, "")
        );
        model.addAttribute("stylesheetPath", stylesheetPath);

        String page = isFlexible != null ? "checkout-flexible" : "checkout";

        return new ModelAndView(page, model.asMap());
    }

    @GetMapping("/client-token")
    public ResponseEntity<?> getClientToken() {
        try {
            ClientTokenRequest clientTokenRequest = new ClientTokenRequest().domains(domains);

            String clientToken = gateway.clientToken().generate(clientTokenRequest);

            return new ResponseEntity<>(new ClientTokenResponse(clientToken), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/transaction")
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequest body) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.valueToTree(body);
            JsonNode nameNode = rootNode.at("/name");
            JsonNode billingAdressNode = rootNode.at("/paymentToken/paymentSource/card/billingAddress");
            JsonNode shippingAdressNode = rootNode.at("/shippingAddress");

            TransactionRequest request = new TransactionRequest()
                .amount(new BigDecimal(10))
                .paymentMethodNonce(body.getPaymentToken().getId())
                .deviceData(body.getDeviceData())
                .customer()
                .email(rootNode.path("email").textValue())
                .firstName(nameNode.path("firstName").textValue())
                .lastName(nameNode.path("lastName").textValue())
                .done()
                .billingAddress()
                .streetAddress(billingAdressNode.path("streetAddress").textValue())
                .extendedAddress(billingAdressNode.path("extendedAddress").textValue())
                .locality(billingAdressNode.path("locality").textValue())
                .region(billingAdressNode.path("region").textValue())
                .postalCode(billingAdressNode.path("postalCode").textValue())
                .countryCodeAlpha2(billingAdressNode.path("countryCodeAlpha2").textValue())
                .done()
                .shippingAddress()
                .streetAddress(shippingAdressNode.path("streetAddress").textValue())
                .extendedAddress(shippingAdressNode.path("extendedAddress").textValue())
                .locality(shippingAdressNode.path("locality").textValue())
                .region(shippingAdressNode.path("region").textValue())
                .postalCode(shippingAdressNode.path("postalCode").textValue())
                .countryCodeAlpha2(shippingAdressNode.path("countryCodeAlpha2").textValue())
                .shippingMethod(ShippingMethod.GROUND)
                .done()
                .options()
                .submitForSettlement(true)
                .done();

            Result<Transaction> result = gateway.transaction().sale(request);

            if (!result.isSuccess()) {
                return new ResponseEntity<>(result.getMessage(), HttpStatus.BAD_REQUEST);
            }

            Map<String, Object> response = new HashMap<>();
            Map<String, Object> resultResponse = new HashMap<>();
            resultResponse.put("success", true);
            resultResponse.put("transaction", result.getTarget());
            response.put("result", resultResponse);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
