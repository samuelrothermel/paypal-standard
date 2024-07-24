const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} = process.env;

export async function getClientToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('Missing API credentials');
    }

    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

    const headers = new Headers();
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString('base64');
    headers.append('Authorization', `Basic ${auth}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const searchParams = new URLSearchParams();
    searchParams.append('grant_type', 'client_credentials');
    searchParams.append('response_type', 'client_token');
    searchParams.append('intent', 'sdk_init');
    // searchParams.append('domains[]', DOMAINS);

    // console.log(searchParams);

    const options = {
      method: 'POST',
      headers,
      body: searchParams,
    };

    const response = await fetch(url, options);
    console.log("response", response);
    const data = await response.json();
    // console.log(data.access_token);

    return data.access_token;
  } catch (error) {
    console.error(error);

    return '';
  }
}
