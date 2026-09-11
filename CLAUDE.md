# mfe-checkout

## The three deprecated containers that are staying

react-components v5 deprecated nine container components. Six are migrated;
`AddressesContainer`, `PlaceOrderContainer` and `PaymentMethodsContainer` are not,
and should not be "finished off" without reading this.

All three fail the same way. Each is the only provider of a context that a *sibling*
subtree consumes, and the standalone replacements provide their context to their own
children only. No provider is exported from the package, so an app cannot supply the
context itself.

- `AddressesContainer` → `SaveAddressesButton` is a sibling of the two forms and takes
  `saveAddresses` from `AddressContext`. The forms define standalone mode as
  `parentAddressContext.saveAddresses == null`, so removing the wrapper guarantees the
  button receives nothing — and it fails silently, with no click handler branch taken.
- `PlaceOrderContainer` → `PlaceOrderButton` has a standalone fallback but exposes no
  provider, while `PaymentMethod`, `PaymentMethodRadioButton`, `PaymentGateway`,
  `AdyenPayment`, `StripePayment` and `CheckoutComPayment` all read `PlaceOrderContext`.
- `PaymentMethodsContainer` → `PlaceOrderButton` reads `PaymentMethodContext` with no
  fallback, and here `StepPlaceOrder` is a sibling of `StepPayment`, not a descendant.

Note these three are also the only deprecated containers that emit no console warning,
so `specs/e2e/deprecated-containers.spec.ts` says nothing about them by design. Exporting
the providers from the library unblocks all three at once.

## Testing a local react-components build

`CL_RC_LOCAL_PATH` in `.env.local` points at a local
`commercelayer-react-components` checkout. When set, `next.config.js` aliases
`@commercelayer/{core-components,react-hooks-components,react-components}` to
that checkout's `dist/`, and forces `react`, `react-dom`, `@commercelayer/sdk`
and `@commercelayer/organization-config` to resolve from this app's
`node_modules` so no dependency ends up loaded twice.

`package.json` pins a published release (currently `@commercelayer/react-components`
5.0.2), so the alias is the only thing that makes a local build visible; deploys are
unaffected either way.

`pnpm rc:bump [sha]` only rewrites `pkg.pr.new` URLs in `package.json`, so it does
nothing while the manifest pins a plain npm version. It becomes useful again only if
someone points the manifest back at a preview build.

Playwright runs the same dev server, so `pnpm test` exercises the local checkout too.
That is deliberate, and it is easy to miss: `next dev` under Playwright runs with
`NODE_ENV=test`, and Next skips `.env.local` entirely in that mode, so `next.config.js`
reads the file itself rather than trusting `process.env`. A run that says nothing about
LOCAL is testing the published package, not your changes.

If a change to the library does not show up:

1. `pnpm rc:watch` must be running — the alias points at `dist/`, not `src/`.
2. It only works with webpack. `pnpm dev` passes `--webpack`; plain
   `next dev` throws, because Turbopack ignores `resolveAlias` for these
   packages and would serve the published copy without saying so.
3. `pnpm build` throws while the variable is set. That is intentional.
