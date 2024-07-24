import { getGateway } from '../lib/gateway.js';

const { DOMAINS } = process.env;

export function getClientToken(_req, res) {
  try {
    getGateway().clientToken.generate(
      {
        domains: DOMAINS.split(','),
      },
      (error, response) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
          return;
        }
        res.json({ clientToken: response.clientToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
