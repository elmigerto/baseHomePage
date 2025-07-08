# baseHomePage

This repository contains the code for a personal homepage built with React and
Vite. The frontend lives in the `tobis-space/` folder and can be deployed to
GitHub Pages.

## Payments

The project uses [Stripe Checkout](https://stripe.com/docs/checkout) for
handling payments. To run the backend locally you need a Stripe secret key in an
`.env` file:

```
STRIPE_SECRET=sk_test_your_secret
```

Start the backend with `npm run server` from the `tobis-space` folder. The
frontend calls the `/create-checkout-session` endpoint to create a session and
redirects the user to Stripe's hosted payment page.

## Deploying to GitHub Pages

1. Ensure the `work` branch is pushed to GitHub.
2. Enable GitHub Pages from the repository settings and select **GitHub Actions**
   as the source.
3. The included workflow at `.github/workflows/deploy.yml` will build the site
   and publish it to the `gh-pages` branch. After it finishes, your page will be
   available at:

   `https://<username>.github.io/baseHomePage/`

