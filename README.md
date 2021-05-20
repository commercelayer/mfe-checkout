This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

You can set your environment with .env.local starting from .env.local.sample

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can use the following format to open the checkout:

http://localhost:3000/?accessToken=...&orderId=...

## Deploy on Heroku

```bash
git push [environment] [branch]:master
```

where `environment` is staging. Deploy on production will be made by promoting a staging deploy.

## Rollbar token

There are many access tokens on rollbar settings, we need to use one related to post client items.