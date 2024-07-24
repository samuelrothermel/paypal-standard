using Braintree;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class ClientTokenSdkController : Controller
{
    private readonly BraintreeGateway _braintreeGateway;

    public ClientTokenSdkController(BraintreeGateway braintreeGateway)
    {
        _braintreeGateway = braintreeGateway;
    }

    [HttpGet("client-token")]
    public IActionResult Get()
    {
        try
        {
            var clientToken = _braintreeGateway.ClientToken.Generate(new ClientTokenRequest());
            return Ok(new { clientToken });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
