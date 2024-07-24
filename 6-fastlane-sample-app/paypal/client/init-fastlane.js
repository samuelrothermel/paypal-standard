async function initFastlane() {
  try {
    if (!window.paypal.Fastlane) {
      throw new Error('PayPal script loaded but no Fastlane module');
    }

    const styles = {
      root: {
        backgroundColor: '#faf8f5',
        //   "errorColor": "",
        //   "fontFamily": "sans-serif",
        //   "textColorBase": "#222222",
        //   "fontSizeBase": "18px",
        //   "padding": "14px",
        //   "primaryColor": "#4bc970"
      },
      // "input": {
      //   "backgroundColor": "#e8f2f4",
      //   "borderRadius": "10px",
      //   "borderColor": "",
      //   "borderWidth": "3px",
      //   "textColorBase": "",
      //   "focusBorderColor": "#4bc970"
      // }
    };

    const {
      identity,
      profile,
      FastlanePaymentComponent,
      FastlaneWatermarkComponent,
    } = await window.paypal.Fastlane({
      // shippingAddressOptions: {
      //   allowedLocations: ['US:TX', 'US:CA', 'MX', 'CA:AB', 'CA:ON'],
      // },
      // cardOptions: {
      //   allowedBrands: ['VISA', 'MASTER_CARD'],
      // },
      styles,
    });

    // window.localStorage.setItem("fastlaneEnv", "sandbox");
    window.localStorage.setItem("axoEnv", "sandbox");

    const paymentComponent = await FastlanePaymentComponent();

    (
      await FastlaneWatermarkComponent({
        includeAdditionalInfo: true,
      })
    ).render('#watermark-container');

    const form = document.querySelector('form');
    const customerSection = document.getElementById('customer');
    const emailSubmitButton = document.getElementById('email-submit-button');
    const shippingSection = document.getElementById('shipping');
    const paymentSection = document.getElementById('payment');
    const checkoutButton = document.getElementById('checkout-button');

    let activeSection = customerSection;
    let memberAuthenticatedSuccessfully;
    let email;
    let shippingAddress;
    let paymentToken;

    const setActiveSection = (section) => {
      activeSection.classList.remove('active');
      section.classList.add('active', 'visited');
      activeSection = section;
    };
    const getAddressSummary = ({
      address: {
        addressLine1,
        addressLine2,
        adminArea2,
        adminArea1,
        postalCode,
        countryCode,
      } = {},
      name: { firstName, lastName, fullName } = {},
      phoneNumber: { countryCode: telCountryCode, nationalNumber } = {},
    }) => {
      const isNotEmpty = (field) => !!field;
      const summary = [
        fullName || [firstName, lastName].filter(isNotEmpty).join(' '),
        [addressLine1, addressLine2].filter(isNotEmpty).join(', '),
        [
          adminArea2,
          [adminArea1, postalCode].filter(isNotEmpty).join(' '),
          countryCode,
        ]
          .filter(isNotEmpty)
          .join(', '),
        [telCountryCode, nationalNumber].filter(isNotEmpty).join(''),
      ];
      return summary.filter(isNotEmpty).join('\n');
    };
    const setShippingSummary = (address) => {
      shippingSection.querySelector('.summary').innerText =
        getAddressSummary(address);
    };

    emailSubmitButton.addEventListener('click', async () => {
      emailSubmitButton.setAttribute('disabled', '');

      email = form.elements['email'].value;
      form.reset();
      document.getElementById('email-input').value = email;
      shippingSection.classList.remove('visited');
      setShippingSummary({});
      paymentSection.classList.remove('visited', 'pinned');
      paymentComponent.render('#payment-component');

      memberAuthenticatedSuccessfully = undefined;
      shippingAddress = undefined;
      paymentToken = undefined;

      try {
        const { customerContextId } =
          await identity.lookupCustomerByEmail(email);

        if (customerContextId) {
          const authResponse =
            await identity.triggerAuthenticationFlow(customerContextId);
          console.log('Auth response:', authResponse);

          if (authResponse?.authenticationState === 'succeeded') {
            memberAuthenticatedSuccessfully = true;
            shippingAddress = authResponse.profileData.shippingAddress;
            paymentToken = authResponse.profileData.card;
          }
        } else {
          console.log('No customerContextId');
        }

        customerSection.querySelector('.summary').innerText = email;
        if (shippingAddress) {
          setShippingSummary(shippingAddress);
        }
        if (memberAuthenticatedSuccessfully) {
          shippingSection.classList.add('visited');
          paymentSection.classList.add('pinned');
          setActiveSection(paymentSection);
        } else {
          setActiveSection(shippingSection);
        }
      } finally {
        emailSubmitButton.removeAttribute('disabled');
      }
    });

    emailSubmitButton.removeAttribute('disabled');

    document
      .getElementById('email-edit-button')
      .addEventListener('click', () => setActiveSection(customerSection));

    document
      .getElementById('shipping-submit-button')
      .addEventListener('click', () => {
        const firstName = form.elements['given-name'].value;
        const lastName = form.elements['family-name'].value;
        const addressLine1 = form.elements['address-line1'].value;
        const addressLine2 = form.elements['address-line2'].value;
        const adminArea2 = form.elements['address-level2'].value;
        const adminArea1 = form.elements['address-level1'].value;
        const postalCode = form.elements['postal-code'].value;
        const countryCode = form.elements['country'].value;
        const telCountryCode = form.elements['tel-country-code'].value;
        const telNational = form.elements['tel-national'].value;
        shippingAddress = {
          address: {
            addressLine1,
            addressLine2,
            adminArea2,
            adminArea1,
            postalCode,
            countryCode,
          },
          name: {
            firstName,
            lastName,
            fullName: [firstName, lastName]
              .filter((field) => !!field)
              .join(' '),
          },
          phoneNumber: {
            countryCode: telCountryCode,
            nationalNumber: telNational,
          },
        };

        setShippingSummary(shippingAddress);
        paymentComponent.setShippingAddress(shippingAddress);
        setActiveSection(paymentSection);
      });

    document
      .getElementById('shipping-edit-button')
      .addEventListener('click', async () => {
        if (memberAuthenticatedSuccessfully) {
          const { selectionChanged, selectedAddress } =
            await profile.showShippingAddressSelector();

          if (selectionChanged) {
            // selectedAddress contains the new address
            console.log('New address:', selectedAddress);

            shippingAddress = selectedAddress;
            setShippingSummary(shippingAddress);
            paymentComponent.setShippingAddress(shippingAddress);
          } else {
            // selection modal was dismissed without selection
          }
        } else {
          setActiveSection(shippingSection);
        }
      });

    document
      .getElementById('payment-edit-button')
      .addEventListener('click', () => setActiveSection(paymentSection));

    checkoutButton.addEventListener('click', async () => {
      checkoutButton.setAttribute('disabled', '');

      try {
        paymentToken = await paymentComponent.getPaymentToken();
        console.log('Payment token:', paymentToken);

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const isShippingRequired = form.elements['shipping-required'].checked;
        const body = JSON.stringify({
          ...(isShippingRequired && { shippingAddress }),
          paymentToken,
        });
        const response = await fetch('transaction', {
          method: 'POST',
          headers,
          body,
        });
        const { result, error } = await response.json();

        if (error) {
          console.error(error);
        } else {
          if (result.id) {
            const message = `Order ${result.id}: ${result.status}`;
            console.log(message);
            alert(message);
          } else {
            console.error(result);
          }
        }
      } finally {
        checkoutButton.removeAttribute('disabled');
      }
    });
  } catch (error) {
    console.error(error);
  }
}



initFastlane();
