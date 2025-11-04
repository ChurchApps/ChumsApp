<img align="right" width="150" src="https://raw.githubusercontent.com/ChurchApps/B1Admin/main/public/images/logo.png">

# B1Admin

> **B1Admin** is completely free, open-source church management software that allows you to manage key data on church members and visitors. It offers comprehensive features including member and guest information tracking, attendance management with a self check-in app, group coordination, donation tracking with detailed reports, and custom form creation. Visit <a href="https://b1.church/">https://b1.church/</a> to learn more.

<div style="display: flex;gap: 10px;">
    <img style="width: 49%;" src="https://github.com/ChurchApps/B1Admin/assets/1447203/ccb5dc7b-8c0d-4320-abac-a3128c42beff">
    <img style="width: 49%;" src="https://github.com/ChurchApps/B1Admin/assets/1447203/ac8593f1-0ae7-45aa-972e-82eaaf0dd639">
</div>
<div style="display: flex;gap: 10px;margin-top: 10px;">
    <img style="width: 49%;" src="https://github.com/ChurchApps/B1Admin/assets/1447203/20f41345-da7d-460a-a64f-224b612ad976">
    <img style="width: 49%;" src="https://github.com/ChurchApps/B1Admin/assets/1447203/ab7c109b-e4e4-4ac5-8b10-fa8cd633ccfd">
</div>

## Get Involved

### 🤝 Help Support Us

The only reason this program is free is because of the generous support from users. If you want to support us to keep this free, please head over to [ChurchApps](https://churchapps/partner) or [sponsor us on GitHub](https://github.com/sponsors/ChurchApps/). Thank you so much!

### 🏘️ Join the Community

We have a great community for end-users on [Facebook](https://www.facebook.com/churchapps.org). It's a good way to ask questions, get tips and follow new updates. Come join us!

### ⚠️ Report an Issue

If you discover an issue or have a feature request, simply submit it to our [issues log](https://github.com/ChurchApps/ChurchAppsSupport/issues). Don't be shy, that's how the program gets better.

### 💬 Join us on Slack

If you would like to contribute in any way, head over to our [Slack Channel](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg) and introduce yourself. We'd love to hear from you.

### 🏗️ Start Coding

If you'd like to set up the project locally, see our [development guide](https://churchapps.org/dev). The short version is:

1. Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls.
2. Install the dependencies with: `npm install`
3. Run `npm run postinstall` to get language files
4. run `npm start` to launch the project.

### ⚙️ Payment Gateway Setup

To accept online donations you must first register for developer credentials with Stripe and PayPal:

- **Stripe**: Visit https://dashboard.stripe.com/register (or sign in at https://dashboard.stripe.com/login), then navigate to **Developers → API keys** to copy your Publishable Key and Secret Key for both test and live modes.
- **PayPal**: Go to https://developer.paypal.com/, log in or create an account, then under **My Apps & Credentials** create a new application to obtain your Sandbox and Live Client ID and Secret.

After obtaining your tokens, open **Settings → Giving Settings** in B1Admin, select the provider (Stripe or PayPal), paste in your Public and Private keys, and toggle "Pay Fees" as desired. Finally, configure your fee parameters in **Fee Options**.

[![B1Admin Dev Setup](https://img.youtube.com/vi/5zsEJEp6yMw/0.jpg)](https://www.youtube.com/watch?v=5zsEJEp6yMw)
