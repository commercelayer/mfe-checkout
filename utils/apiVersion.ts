/**
 * The Core API version every client in this app is initialised with.
 *
 * SDK 8 makes `apiVersion` required and emits it as a path segment, so requests
 * move from `/api/...` to `/api/2026-05/...`. `react-components` initialises its
 * own client with the same version, and a checkout that talked to two versions
 * at once would read an order through one schema and write it through another.
 *
 * The other accepted value is `2017-08`. Permissions are identical on both; what
 * changes is how a denied read is reported — the legacy version answers 200 with
 * an `UNAUTHORIZED` body, which the SDK parses as an empty collection, while
 * `2026-05` returns a real 401.
 */
export const apiVersion = "2026-05" as const
