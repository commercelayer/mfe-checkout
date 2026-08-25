# mfe-checkout

## Running e2e tests

Run specs one file (or one test) at a time, and keep `--repeat-each` small. Many specs
together hit the Commerce Layer API rate limit, and the resulting failures look like
code problems. If a failure looks like a 429 or a generic API error, suspect the rate
limit first.

## Deprecated containers

All nine containers react-components v5 deprecated are gone. State that crosses
steps (address, payment method, place order) goes through the library's shared state
store, not a parent provider, so don't reintroduce a wrapper to make a sibling see it.
`AddressesContainer`, `PaymentMethodsContainer` and `PlaceOrderContainer` emit no
deprecation warning, so `specs/e2e/deprecated-containers.spec.ts` can't catch them
coming back; grep the imports.

## Testing a local react-components build

`CL_RC_LOCAL_PATH` in `.env.local` points at a local
`commercelayer-react-components` checkout. When set, `next.config.js` aliases
`@commercelayer/{core-components,react-hooks-components,react-components}` to
that checkout's `dist/`, and forces `react`, `react-dom`, `@commercelayer/sdk`
and `@commercelayer/organization-config` to resolve from this app's
`node_modules` so no dependency ends up loaded twice.

`package.json` pins a published release, so the alias is the only thing that makes a
local build visible; deploys are unaffected either way.

The `paths` in `tsconfig.json` point at that same sibling checkout, and unlike the
alias they are not conditional on `CL_RC_LOCAL_PATH`: on a machine that has the
checkout, `tsc` type-checks against it whatever the manifest pins. So when the two
drift apart — the checkout on a newer SDK than the app — `pnpm check` and `pnpm build`
fail locally with `Order` not assignable to `Order`, while CI, which has no sibling
directory, passes. Keep the app's SDK on the version the pinned release depends on.

`pnpm rc:bump [sha]` only rewrites `pkg.pr.new` preview URLs; it does nothing while
the manifest pins an npm version.

**This is the only supported way to point the app at a local library.** Do not add
`link:` (or `file:`) entries for these packages to `pnpm-workspace.yaml`. That does
work, but `pnpm-workspace.yaml` is versioned, so a developer-local setup ends up
committed and has to be remembered out again before merging — whereas `.env.local` is
gitignored and cannot be. A symlink pointing out of the project also forces a
`turbopack.root` widening that has nothing to do with the app. Both were tried and
removed.

Playwright runs the same dev server, so `pnpm test` exercises the local checkout too.
That is deliberate, and it is easy to miss: `next dev` under Playwright runs with
`NODE_ENV=test`, and Next skips `.env.local` entirely in that mode, so `next.config.js`
reads the file itself rather than trusting `process.env`. A run that says nothing about
LOCAL is testing the published package, not your changes.

If a change to the library does not show up:

1. `pnpm rc:watch` must be running — the alias points at `dist/`, not `src/`.
   A one-off `pnpm build` in the library checkout does just as well.
2. It only works with webpack. `pnpm dev` passes `--webpack`; plain
   `next dev` throws, because Turbopack ignores `resolveAlias` for these
   packages and would serve the published copy without saying so.
3. `pnpm build` throws while the variable is set. That is intentional.

The dev server prints `▲ @commercelayer/react-components: LOCAL -> <path>` at startup
when local mode is on. No banner means it is off, whatever `.env.local` says.

## Working on the payment_sessions payment components

The components for the `payment_sessions` payments model are built in the library
checkout and validated here — there is no meaningful unit test for "the shopper can pay
with a gift card and the rest by wire transfer". The loop is: change the library,
rebuild it, drive the real checkout in a browser, then read the order back from the API.

### What is not yours to do

**The dev server belongs to the human.** It runs in a terminal you do not own, and it is
normally already up. Never start, restart or kill it, and never claim a port. When a
change needs a restart — anything in `next.config.js` or `.env.local`, or a
`pnpm install` — say so and let them do it.

**Orders and gift cards come from the human.** A checkout URL is
`http://<host>/<orderId>?accessToken=<jwt>`, and both halves are created against a real
test-mode Commerce Layer organization. Do not invent one, do not go looking for
credentials to mint one, and do not silently reuse an order from earlier in the
conversation: **placing an order is not repeatable**, and a placed order renders the
thank-you page instead of the payment step. Ask for a fresh URL for every run that will
end in a placed order.

Gift cards are spent the same way. A card used on a previous order comes back as
`422 doesn't match any active gift card` — a fine way to exercise the error path, but
not a bug and not a reason to start debugging the library. Ask for a new code.

Automating order creation is an open item. `specs/fixtures/tokenizedPage.ts` (the
Playwright harness) does create orders, but with the credentials in `.env.local` against
the real organization — ask before running anything that goes near it.

### The loop

1. Change the library in the `commercelayer-react-components` checkout.
2. Rebuild it there: `pnpm build`, or leave `pnpm rc:watch` running here. The alias
   reads `dist/`, so an unbuilt change is invisible — and looks exactly like a change
   that did not work.
3. Ask for a checkout URL, plus a gift card code if the run needs one.
4. Open it with the browser tools and drive the flow. Allow several seconds after
   navigating: the first load after a library rebuild recompiles, and the page renders
   blank or as a skeleton until the order arrives.
5. **Read the order back from the API.** The UI is not the source of truth for what was
   charged — a checkout that looks entirely correct can still have taken the wrong
   amount:

   ```sh
   curl -s "https://<slug>.<domain>/api/2026-05/orders/<orderId>?include=payment_sessions" \
     -H "Authorization: Bearer <accessToken>"
   ```

   Check `status`, `payment_status`, and that the `payment_sessions` amounts **sum to
   `total_amount_with_taxes_cents`** — no more and no less. The token from the checkout
   URL is a sales-channel token and works here as-is.

### Where the behaviour is decided

Most of what this app shows for these components is decided in the library, not here.
Three things are decided here, and are worth ruling out before blaming the library:

- `components/data/AppProvider/utils.ts` derives `isComplete` from `order.status` **and**
  `order.payment_status`. An order can be `placed` and still not reach the thank-you
  page, because its payment status is not one this app accepts.
- `CheckoutPaymentSessions.tsx` and `StepComplete/index.tsx` mount both payment models at
  once. Each library tree renders nothing when the order is not on its own model, so
  there is no conditional to keep in sync — but it does mean an empty recap is usually a
  component nobody added to one of those two, rather than one that failed.
- Errors raised while *selecting* a payment setting or applying a gift card never touch
  the order, so `<Errors resource="orders">` cannot see them. They have their own
  outlets; a control that silently does nothing is normally a missing outlet.

For what the API itself does — how a session is sized, in what order authorizations run,
how `payment_status` is derived — the Rails monolith is the authority. The SDK types and
the public docs have each been found wrong on this.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
