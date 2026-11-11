# Let's Tag website

Exercise API pricing at `/` and a Paddle payment-link landing page at `/checkout`.

## Development

Use Node.js 22.15 or newer (the old Node 16 toolchain is no longer supported).

```sh
nvm use
yarn install --frozen-lockfile
cp .env.example .env.local
# Set your public Paddle client-side token and environment in .env.local.
yarn start
```

The development server runs at http://localhost:3000. `yarn svr` remains an alias.

## Paddle

`.env.local` is ignored by Git. The webpack build reads these values, which can also be supplied as environment variables:

- `PADDLE_CLIENT_TOKEN`: a public `test_…` sandbox or `live_…` production client-side token. Never use a Paddle server-side API key.
- `PADDLE_ENVIRONMENT`: `sandbox` or `production` (default). It must match the token.

These are build-time settings; rebuild when changing them. The provided development token is configured locally in sandbox mode. Set the live token and production environment in the deployment environment before building a live release. Never overwrite an existing `.env.local` just to run the setup example again.

The official `@paddle/paddle-js` loader loads `https://cdn.paddle.com/paddle/v2/paddle.js` on checkout only and initializes overlay mode. The app preserves the complete URL and lets Paddle process payment and payment-method-update tokens automatically; it does not call `Checkout.open()` or create a transaction. Set `https://letstag.app/checkout` as the default payment link in the matching Paddle environment. Production requires the domain to be approved by Paddle. See [Paddle's default payment link guide](https://developer.paddle.com/build/transactions/default-payment-link/).

A public client token configures the SDK; a valid transaction or Paddle email link is still needed to complete an end-to-end payment update. Set the `PADDLE_PRICE_*` variables shown in `.env.example` to the matching Paddle price IDs for each plan and billing period. The card buttons remain unavailable until their price IDs are configured. The provided product IDs are recorded in `src/data/pricing.ts`; Paddle checkout requires price IDs. The Free card also needs a price ID to use Paddle checkout. This repository does not provide account creation or entitlement provisioning.

## Components and styling

Atomic design lives in `src/components`:

- **Atoms:** text, badge, brand, link, price, feature value.
- **Molecules:** billing toggle, plan card, feature row.
- **Organisms:** pricing, header, footer.
- **Templates:** site layout.
- **Pages:** `src/page/main.tsx` and `src/page/checkout.tsx`.

Each component imports its own CSS Module and owns its appearance. Parents arrange components through layout containers; they do not target child components or pass styling classes. The application renders inside a Shadow DOM boundary so outside styles cannot override component internals. Both webpack development styles and extracted production styles are inserted into that boundary. Paddle's own overlay renders outside it.

`src/data/pricing.ts` contains the supplied pricing matrix. Annual prices use the exact supplied dollar amounts rather than recalculating the advertised 20% discount. Videos remain explicitly marked upcoming. The feature table scrolls horizontally on narrow screens; plan cards stack.

## Validation and production

```sh
yarn build             # TypeScript check, then webpack production build
yarn verify:assets     # Check every source image and legacy image URL by SHA-256
yarn playwright install chromium
yarn test              # Browser tests against the production build
# Or use installed Chrome: PLAYWRIGHT_CHANNEL=chrome yarn test
yarn deploy            # Build, verify images, publish build/ with gh-pages
```

TypeScript 7 performs type checking; SWC transpiles TSX for webpack because the previous ts-loader relies on the removed TypeScript compiler API. Dependencies are pinned to current stable releases in `package.json` and `yarn.lock`.

Webpack cleans the output before each build. It emits the main page, `checkout/index.html`, a real 404 fallback, and the existing email-domain verification file. Removed marketing and translated pages are no longer generated or listed in the sitemap. Static hosting must serve directory indexes so `/checkout` (with any query string) resolves to `/checkout/index.html`; GitHub Pages does this automatically.

All source images remain untouched. Assets are copied at source-relative `/img/…` paths as well as existing flattened exercise, emotion, watch, body-size, and `/icon/…` URLs. Original image editing files in `assets/` are retained. Existing audio files are also preserved.

Google sign-in uses the public `GOOGLE_CLIENT_ID` and `AUTH_API_BASE_URL` build settings in `.env.local`. Development defaults to `http://localhost:8000`; set `AUTH_API_BASE_URL` to override it. Production defaults to `https://api.letstag.app`; set `AUTH_API_BASE_URL` to override it. The API must serve HTTPS and allow the frontend origin via CORS. Add the site's origin to the Google OAuth client's authorized JavaScript origins. The browser sends the Google ID credential to `/auth/google` and stores the returned session token in browser local storage.
