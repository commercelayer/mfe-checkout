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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
