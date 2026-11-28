# @omnidotdev/synapse-app

## 0.1.0

### Minor Changes

- [#101](https://github.com/omnidotdev/synapse-app/pull/101) [`1428db7`](https://github.com/omnidotdev/synapse-app/commit/1428db7f4205f6242c3f26274ea82c66adc115c2) Thanks [@coopbri](https://github.com/coopbri)! - Signing in or out of Omni in another app now carries over here

- [`60fdc4b`](https://github.com/omnidotdev/synapse-app/commit/60fdc4b881e61ce9925a21aa1c1dbc3990dfbd7e) Thanks [@coopbri](https://github.com/coopbri)! - Initial release of the Synapse dashboard: manage provider keys stored encrypted, see usage and spend by model and provider, and choose how requests are routed, in light or dark mode.

- [#100](https://github.com/omnidotdev/synapse-app/pull/100) [`708cc68`](https://github.com/omnidotdev/synapse-app/commit/708cc683546c22c37cb8a9b67a70496f711f3716) Thanks [@coopbri](https://github.com/coopbri)! - Links from Synapse to your Omni account (Manage account, workspaces, Upgrade, Manage subscription) now open it as the same account you use in Synapse, even when another account is signed in on the browser

- [#83](https://github.com/omnidotdev/synapse-app/pull/83) [`966a10d`](https://github.com/omnidotdev/synapse-app/commit/966a10d58c930c9e3a6f542e8a9d781ddaaa4eb1) Thanks [@coopbri](https://github.com/coopbri)! - Billing now works per workspace. Your personal pages show your personal workspace's plan, usage, and keys, team keys belong to their team, and workspace billing shows this period's overage with a spending limit admins can change ($10 minimum). Fixed team workspace pages that failed to load.

- [#99](https://github.com/omnidotdev/synapse-app/pull/99) [`1a4db44`](https://github.com/omnidotdev/synapse-app/commit/1a4db4441fef70abba82550147a65bc31455dfb6) Thanks [@coopbri](https://github.com/coopbri)! - Add a workspace switcher to the top of the workspace sidebar. Choosing another workspace keeps you on the same page there (API keys, usage, members, billing, settings). The menu also lists all workspaces and links to the account hub to create and manage them.

### Patch Changes

- [#90](https://github.com/omnidotdev/synapse-app/pull/90) [`8c3e97b`](https://github.com/omnidotdev/synapse-app/commit/8c3e97b2ba257a5f820d207847549d70e48eb1e3) Thanks [@coopbri](https://github.com/coopbri)! - Remove NVIDIA from the provider key vault: the managed gateway no longer routes to the NVIDIA hosted API, whose terms allow trial use only

- [#88](https://github.com/omnidotdev/synapse-app/pull/88) [`13eb77e`](https://github.com/omnidotdev/synapse-app/commit/13eb77e1dd8d479bf41d1f0ebfbe69a5f4c4d546) Thanks [@coopbri](https://github.com/coopbri)! - Cancel and renew a plan from Manage subscription on the Omni account hub. The subscription card's one-click cancel and renew buttons are removed, and Manage subscription is now a labeled button that opens plan management on the hub, where the plan can be changed, canceled, or renewed.

- [#92](https://github.com/omnidotdev/synapse-app/pull/92) [`9f924cb`](https://github.com/omnidotdev/synapse-app/commit/9f924cbebdd2480e92e6cc210279ffc7387626b1) Thanks [@coopbri](https://github.com/coopbri)! - Dropdowns now match the rest of the interface.

- [#87](https://github.com/omnidotdev/synapse-app/pull/87) [`9277cf4`](https://github.com/omnidotdev/synapse-app/commit/9277cf4b0140353f01aca9076ffb37865bf8bbbf) Thanks [@coopbri](https://github.com/coopbri)! - Buy and manage plans on the Omni account hub. A paid plan on the pricing page now opens the hub's confirm step for that plan and the workspace you pick, and managing a subscription opens plan management on the hub; both come back to Synapse. New workspaces are created on the hub's workspaces page. The in-app checkout and billing portal are removed.

- [#91](https://github.com/omnidotdev/synapse-app/pull/91) [`c4b7729`](https://github.com/omnidotdev/synapse-app/commit/c4b7729db575f4c1757c585e37da8f3c62aa0428) Thanks [@coopbri](https://github.com/coopbri)! - Stop writing users' email addresses to the logs: a failed sign-in token check logs only the error message, not the user's email and name, by moving to `@omnidotdev/providers` v0.2.0.

- [#96](https://github.com/omnidotdev/synapse-app/pull/96) [`eeed319`](https://github.com/omnidotdev/synapse-app/commit/eeed319a7364795c3286a844e4b8b1c3778463c5) Thanks [@coopbri](https://github.com/coopbri)! - Sign-in session data sent to the browser no longer includes the session token

- [#95](https://github.com/omnidotdev/synapse-app/pull/95) [`b616724`](https://github.com/omnidotdev/synapse-app/commit/b616724289d1f519ab8d1819641c931843d75597) Thanks [@coopbri](https://github.com/coopbri)! - Fonts are now served from our own site instead of Google Fonts, so loading the app no longer sends your IP address to Google.

- [#98](https://github.com/omnidotdev/synapse-app/pull/98) [`aff4a8b`](https://github.com/omnidotdev/synapse-app/commit/aff4a8bbb7b54f79f53789bcd515637ccb399ae9) Thanks [@coopbri](https://github.com/coopbri)! - Your sign-in token now stays out of reach of scripts running on the page, so the session read from the browser no longer carries it

- [#102](https://github.com/omnidotdev/synapse-app/pull/102) [`5558a2d`](https://github.com/omnidotdev/synapse-app/commit/5558a2d7fc18e13fb74518ceb5e7b4816b54cbc7) Thanks [@coopbri](https://github.com/coopbri)! - The billing page's spending limit uses the card every Omni product shares: overage this period against the cap with a progress bar and a paused notice at the cap. Owners and admins raise or lower the cap ($10 to $100,000) and now confirm before a cap at or below the overage so far pauses requests right away; members see the spend and the cap
