# Commerce Layer React Checkout

The Commerce Layer checkout application (React) provides you with a PCI-compliant, PSD2-compliant, and production-ready checkout flow powered by Commerce Layer APIs.

![Commerce Layer checkout demo](./public/demo.gif)

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a headless commerce platform and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, or IoT device, with ease. Perfect fit for the best-of-breed CMSs, static site generators, and any other tools you already master and love, our blazing-fast and secure API will help you make your content shoppable on a global scale.

## Table of contents

- [Perequisites](#prerequisites)
- [Getting started](#getting-started)
- [Future updates](#future-updates)
- [Contributors guide](#contributors-guide)
- [Help and support](#need-help)
- [License](#license)

---

## Prerequisites

All you need to configure this checkout application is a sales channel application access token. Generally, this token is what you use to validate your interaction with all Commerce Layer APIs from your sales channel. You should generate this in real-time in your sales channel application and use it as required in the checkout application. For example, you can use our JavaScript [authentication library](https://github.com/commercelayer/commercelayer-js-auth) to generate an access token like so:

```js
import { getSalesChannelToken } from "@commercelayer/js-auth";

const CLIENT_ID = "<your-client-id>";
const ENDPOINT = "<your-organization-slug>.commercelayer.io";
const SCOPE = "<your-market-scope>";

async function getToken() {
  const token = await getSalesChannelToken({
    endpoint: ENDPOINT,
    clientId: CLIENT_ID,
    scope: SCOPE
  });
  console.log(token.accessToken);
}

getToken();
```

## Getting started

To set up and configure the checkout application for your digital store, here are a couple of steps to follow:

1. Head to [https://core.commercelayer.io/users/sign_up](https://core.commercelayer.io/users/sign_up) to create a developer account.

2. Create a new [organization](https://commercelayer.io/docs/data-model/users-and-organizations/) for your business.

3. You will be prompted to seed your organization with some test data. You can decide to seed with the option provided or with the [Commerce Layer CLI](https://github.com/commercelayer/commercelayer-cli).

4. If you skip the seeding, you will be prompted to complete a checklist of items because your organization requires a market and something to sell before you get the first order. So, when you are ready to start selling, you should add the desired resources for your business (SKUs, inventory model, shipping methods, payment gateways, etc.).

5. Build your sales channel with your favorite technologies and frameworks by leveraging our [developer resources](https://commercelayer.io/developers/) and [API reference](https://docs.commercelayer.io/api/).

6. Fork [this repository](https://github.com/commercelayer/commercelayer-cli) (you can learn how to do this [here](https://help.github.com/articles/fork-a-repo)).

7. Deploy the forked repository to your preferred cloud service or host it yourself. You can deploy the checkout application with one click by clicking the buttons below for your preferred cloud services.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/commercelayer/commercelayer-react-checkout) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/commercelayer/commercelayer-react-checkout) [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/commercelayer/commercelayer-react-checkout) [![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/commercelayer/commercelayer-react-checkout) [![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/commercelayer/commercelayer-react-checkout)

Once the application is successfully deployed, you can access the checkout application as an external application or a page in your sales channel using the URL format: `<your-deployed-checkout-url>/:order_id?accessToken=<token>`. For example, `https://checkout.cl-shop.com/PrnYhoVeza? accessToken=eyJhbGciOiJIUzUxMiJ9` or `https://cl-shop.com/checkout/PrnYhoVeza?accessToken=eyJhbGciOiJIUzUxMiJ9`.

> NB: You do not need to add any environment variables with your credentials to the application. All required information about your organization is determined automatically by introspecting the access token you provide in the URL.

## Future updates

We will be supporting more payment gateways and launching a hosted checkout feature to the Commerce Layer dashboard soon. With the hosted checkout feature, you can install the checkout application to your organization, and it gets deployed and hosted automatically by Commerce Layer.

## Contributors guide

1. Fork [this repository](https://github.com/commercelayer/commercelayer-cli) (you can learn how to do this [here](https://help.github.com/articles/fork-a-repo)).

2. Clone the forked repository like so:

```bash
git clone https://github.com/<your username>/commercelayer-react-checkout.git && cd commercelayer-react-checkout
```

3. Make your changes and create a pull request ([learn how to do this](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)).

4. Someone will attend to your pull request and provide some feedback.

## Need help?

1. Request an invite to join [Commerce Layer's Slack community](https://commercelayer.io/developers).

2. Create an [issue](https://github.com/commercelayer/commercelayer-react-checkout/issues) in this repository.

3. Ping us [on Twitter](https://twitter.com/commercelayer).

## License

This repository is published under the [MIT](LICENSE) license.