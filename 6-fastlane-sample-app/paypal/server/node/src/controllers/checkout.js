import { getClientToken } from '../lib/sdk-script-helpers.js';

export async function renderCheckout(req, res) {
  const isFlexibleIntegration = req.query.flexible !== undefined;

  const clientToken = await getClientToken();
  console.log('ClientToken', clientToken);
  console.log(clientToken);
  const locals = {
    title: 'Fastlane - PayPal Integration',
    prerequisiteScripts: `
      <script
        src="https://www.paypal.com/sdk/js?client-id=AYlz8MSzh943xmcPDQLoExs0uXKMcg-PJdr8IAOoXjEkL2iQgNgaYUlLiPk1G3HxIl4dziv3XVSI_9h_&components=buttons,fastlane"
        data-sdk-client-token="${clientToken}"
        data-client-metadata-id="111111">
      ></script>
    `,
    initScriptPath: 'init-fastlane.js',
    stylesheetPath: 'styles.css',
  };

  res.render('checkout', locals);
}
