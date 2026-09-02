# mfe-checkout

## Testing a local react-components build

`CL_RC_LOCAL_PATH` in `.env.local` points at a local
`commercelayer-react-components` checkout. When set, `next.config.js` aliases
`@commercelayer/{core-components,react-hooks-components,react-components}` to
that checkout's `dist/`, and forces `react`, `react-dom`, `@commercelayer/sdk`
and `@commercelayer/organization-config` to resolve from this app's
`node_modules` so no dependency ends up loaded twice.

`package.json` is deliberately left pointing at `pkg.pr.new`; deploys are
unaffected. Use `pnpm rc:bump [sha]` to move it to a published commit.

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

### Fixtures

`scripts/new-payments.mjs` mints what a run needs, against the organization configured
under `NP_*` in `.env.local` (**not** the `E2E_*` block — those are Playwright's, and
point at a different organization with no `payment_sessions` setup):

```sh
pnpm np:order              # -> /<orderId>?accessToken=<jwt>
pnpm np:gift-card 25       # -> a purchased, activated code
```

`np:order` creates the address, the order, one line item, and assigns the first
available shipping method — that last step is not optional, a shipment without one
leaves the checkout stuck on Delivery. It prints only the path and query, so prefix it
with whatever origin the dev server is on.

Each run needs its **own** order: **placing one is not repeatable**, and a placed order
renders the thank-you page instead of the payment step. Never reuse an order from
earlier in the conversation for a run that will end in a place.

Gift cards are spent the same way — a code used on a previous order comes back as
`422 doesn't match any active gift card`, which is a fine way to exercise the error path
but is not a bug. Mint a new one. `np:gift-card` does `create` then `_purchase` then
`_activate`: the first call alone produces a code that exists and is refused.

To capture the output, call node directly — `pnpm run` writes its own progress lines to
stdout even under `-s`:

```sh
URL=$(node scripts/new-payments.mjs order)
CODE=$(node scripts/new-payments.mjs gift-card 25)
```

### The e2e suite

`pnpm test:np` runs the regression net for this payment model — the `@payment-sessions`
tag, in `specs/e2e/payment-sessions-place.spec.ts` (the three ways an order can be paid
for, each placed) and `payment-sessions-gift-card.spec.ts` (what stays true while the
shopper changes their mind). It exists so that adding the next payment setting cannot
quietly break the ones already working, and it is the reason to reach for the browser
tools only when something is genuinely new.

Its own harness, `specs/fixtures/newPaymentsPage.ts`, is separate from
`tokenizedPage.ts` for the reason above: different organization, and none of the
`payment_source` moves apply. It **runs `scripts/new-payments.mjs` as a child process**
rather than re-implementing the order sequence — the script already prints one line to
stdout for exactly this, and one copy of "a shipment needs a shipping method or the
checkout never reaches Payment" is enough.

Four things about it are not obvious:

- **The assertion that matters is the API read-back**, `expectPaymentToCoverTheOrder`.
  Every one of these tests ends on a thank-you page that looks correct whatever was
  charged, so only the sessions summing to `total_amount_with_taxes_cents` says the
  shopper paid what they agreed to. A new setting gets its session sized by the same
  rules, so this is what will catch it.
- **The suite mints an order per test and a gift card for most of them, and the API
  rate-limits per organization.** Run it a few times in a row, or alongside a browser
  session doing the same, and fixtures start failing with `Too Many Requests`. That is
  the environment talking, not the checkout: the harness backs off and retries, and the
  failure message says so. Space the runs out rather than chasing it.
- **`data-testid` is a contract of this repository, not the library** — the library ships
  none, this app passes them in. So a rename breaks the tests in the same commit rather
  than silently.
- **The fixture fails the test when the page raises an uncaught error.** Under
  `next dev` the error overlay covers the page and absorbs every click, so without that
  check the symptom is a click timing out on an element Playwright can see perfectly
  well. It cost an afternoon once. Note the overlay also opens for a bare
  `console.error`, which is why the library reports a recovered failure with `warn`.

### What is not yours to do

**The dev server belongs to the human.** It runs in a terminal you do not own, and it is
normally already up. Never start, restart or kill it, and never claim a port. When a
change needs a restart — anything in `next.config.js` or `.env.local`, or a
`pnpm install` — say so and let them do it.

The Playwright harness (`specs/fixtures/tokenizedPage.ts`) also creates orders, but
against the `E2E_*` organization and as part of a full suite run — ask before going near
it. The `NP_*` scripts above are the cheap path and do not touch it.

### The loop

1. Change the library in the `commercelayer-react-components` checkout.
2. Rebuild it there: `pnpm build`, or leave `pnpm rc:watch` running here. The alias
   reads `dist/`, so an unbuilt change is invisible — and looks exactly like a change
   that did not work.
3. `pnpm np:order`, plus `pnpm np:gift-card <amount>` if the run needs one.
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
