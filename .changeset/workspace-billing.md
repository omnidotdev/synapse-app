---
"@omnidotdev/synapse-app": minor
---

Bill and manage Synapse per workspace, and add a spending limit control

- Personal pages (dashboard, keys, usage, billing, profile, pricing) read the plan, usage, and key limit from the personal workspace, which Synapse checkout subscribes, instead of the user account that never holds a subscription. New personal keys belong to the personal workspace; team workspace keys belong to that team
- Workspace billing pages show the hard spending limit with this period's overage, and workspace admins can change it ($10 minimum); the change is enforced by synapse-api through Warden
- Workspace permission checks ask Warden about the identity provider user id and authenticate with `AUTHZ_SERVICE_KEY`; they previously sent the local session id unauthenticated, so every team workspace check failed. A user's own user entity and personal workspace no longer need a Warden round trip, and reading another user's billing entity is refused
