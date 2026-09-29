import { faker } from "@faker-js/faker"

/** Stamped once per process, so every address a run mints shares it. */
const RUN_ID = Date.now().toString(36)

/**
 * A customer email address that no earlier run can already own.
 *
 * `faker.internet.email()` draws from a pool of a few million addresses, and this
 * organization keeps every customer the suite has ever created — 146,905 of them
 * in September 2026. That is roughly a 2.5% chance per draw of naming a customer
 * that already exists, against about a hundred draws per full run: two or three
 * collisions every time the suite goes green to red for no reason anyone can see.
 *
 * Nothing reports it when it happens. `getCustomerUserToken` looks the address up,
 * finds a customer, and signs in as that one instead of creating anything, so the
 * spec inherits an account someone else filled — a saved-address picker where it
 * expected an empty form, an address in a market that no longer ships there, a
 * Delivery step that can never be completed. The failure lands wherever that
 * account's data first contradicts the spec, which is never where the cause is,
 * and re-running draws a different address and passes. That is what made these
 * specs look flaky for so long.
 *
 * The run-scoped suffix is the whole point of this helper. Keep it, and mint
 * customer addresses here rather than calling faker directly.
 */
export function uniqueCustomerEmail(): string {
  const [localPart, domain] = faker.internet.email().toLowerCase().split("@")
  return `${localPart}+${RUN_ID}${faker.string.alphanumeric(6).toLowerCase()}@${domain}`
}
