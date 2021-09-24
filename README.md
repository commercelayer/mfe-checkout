# Commerce Layer React Checkout

The Commerce Layer checkout application (React) provides you with a PCI-compliant, PSD2-compliant, and production-ready checkout flow powered by Commerce Layer APIs. You can fork this repository and deploy it to any hosting service or use it as a reference application to build your own.

![Commerce Layer checkout demo](./public/demo.gif)

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a headless commerce platform and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, or IoT device, with ease. Perfect fit for the best-of-breed CMSs, static site generators, and any other tools you already master and love, our blazing-fast and secure API will help you make your content shoppable on a global scale.

## Table of contents

- [Getting started](#getting-started)
- [Future updates](#future-updates)
- [Contributors guide](#contributors-guide)
- [Help and support](#need-help)
- [License](#license)

---

## Getting started

1. Deploy the forked repository to your preferred hosting service or host it yourself. You can deploy with one click below:

[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height="35">](https://app.netlify.com/start/deploy?repository=https://github.com/commercelayer/commercelayer-react-checkout) [<img src="https://vercel.com/button" alt="Deploy to Vercel" height="35">](https://vercel.com/new/clone?repository-url=https://github.com/commercelayer/commercelayer-react-checkout) [<img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku" height="35">](https://heroku.com/deploy?template=https://github.com/commercelayer/commercelayer-react-checkout) [<img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to Digital Ocean" height="35">](https://cloud.digitalocean.com/apps/new?repo=https://github.com/commercelayer/commercelayer-react-checkout) [<img src="https://oneclick.amplifyapp.com/button.svg" alt="Deploy to Amplify" height="35">](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/commercelayer/commercelayer-react-checkout)

2. Create your organization and get your credentials by following this [getting started guide](https://docs.commercelayer.io/api/getting-started).

3. Customize your organization by adding a logo_url and primary_color which will automatically be used in your application. (draft)

4. Build your sales channel with your favorite technologies and frameworks by leveraging our [developer resources](https://commercelayer.io/developers/) and [API reference](https://docs.commercelayer.io/api/).

5. Get an [access token](https://docs.commercelayer.io/api/authentication) for your application. You should generate this in your sales channel or use our JavaScript [authentication library](https://github.com/commercelayer/commercelayer-js-auth).

6. Create an [order](https://docs.commercelayer.io/api/resources/orders) associated with some line items.

7. Access your checkout as an external application or a page in your sales channel using the URL format: `<your-deployed-checkout-url>/:order_id?accessToken=<token>`. For example, `https://checkout.cl-shop.com/PrnYhoVeza?accessToken=eyJhbGciOiJIUzUxMiJ9` or `https://cl-shop.com/checkout/PrnYhoVeza?accessToken=eyJhbGciOiJIUzUxMiJ9`.

## Future updates

We will be supporting more payment gateways and launching a hosted checkout feature to the Commerce Layer dashboard soon. With the hosted checkout feature, you can install the checkout application to your organization and customize your logo or primary colors. Then, the application gets deployed and hosted automatically by Commerce Layer.

## Contributors guide

1. Fork [this repository](https://github.com/commercelayer/commercelayer-react-checkout) (you can learn how to do this [here](https://help.github.com/articles/fork-a-repo)).

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
