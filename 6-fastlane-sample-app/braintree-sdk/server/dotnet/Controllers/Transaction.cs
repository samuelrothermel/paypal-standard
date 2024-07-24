using Braintree;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class TransactionSdkController : Controller
{
    private readonly BraintreeGateway _braintreeGateway;

    public TransactionSdkController(BraintreeGateway braintreeGateway)
    {
        _braintreeGateway = braintreeGateway;
    }

    [HttpPost("transaction")]
    public IActionResult Post([FromBody] TransactionRequestModel requestBody)
    {
        try
        {
            var transactionRequest = new TransactionRequest
            {
                Amount = 10.00M,
                PaymentMethodNonce = requestBody.PaymentToken.Id,
                DeviceData = requestBody.DeviceData,
                Customer = new CustomerRequest
                {
                    FirstName = requestBody.Name?.FirstName,
                    LastName = requestBody.Name?.LastName,
                    Email = requestBody.Email
                },
                BillingAddress = requestBody.PaymentToken.BillingAddress,
                ShippingAddress = requestBody.ShippingAddress != null ? requestBody.ShippingAddress : null,
                Options = new TransactionOptionsRequest
                {
                    SubmitForSettlement = true
                }
            };

            Result<Transaction> result = _braintreeGateway.Transaction.Sale(transactionRequest);

            if (!result.IsSuccess())
            {
                var firstError = result.Errors.DeepAll().FirstOrDefault();
                throw new Exception($"Code: {firstError.Code}, Message: {firstError.Message}");
            }

            var response = new
            {
                transaction = result.Target,
                success = result.IsSuccess()
            };

            return Ok(new { result = response });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return StatusCode(500, new { error = ex.Message });
        }
    }
    public class Name
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
    public class PaymentToken
    {
        public string? Id { get; set; }
        public AddressRequest? BillingAddress { get; set; }
    }
    public class TransactionRequestModel
    {
        public required string DeviceData { get; set; }
        public required string Email { get; set; }
        public Name? Name { get; set; }
        public required PaymentToken PaymentToken { get; set; }
        public AddressRequest? ShippingAddress { get; set; }
    }
}
