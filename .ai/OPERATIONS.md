# Social Execution Operations

## Reliability objective

Publishing is a side-effecting workflow. Reliability means avoiding silent loss and duplicate publication, not merely retrying until success.

## Idempotency

- Caller creates a durable `requestId` before `publish.create`.
- Persist `requestId`, target account(s), content fingerprint, `flowId`, `taskId`, scheduled time and provider state.
- If a create/publish call times out after transmission, query existing records before retrying.
- Never blindly replay `publish.create`, `publish.now`, comment creation or engagement actions.
- A duplicate detector SHOULD compare caller request ID, content fingerprint, account, platform and intended publish window.

## Retry policy

Read-only operations may retry with bounded exponential backoff.

Side-effecting operations may retry only when the caller can prove the operation was not accepted, or when the retry is explicitly idempotent. Otherwise switch the job to `unknown` and reconcile via publish-record lookups.

Recommended retry classes:

- network/connect failure before request transmission: retry
- HTTP/service 429: retry after server/platform backoff
- transient 5xx with known idempotency: retry bounded
- authentication/401/403: do not retry; require credential repair
- validation/4xx: do not retry; repair payload
- uncertain side effect: reconcile first, then decide

## Observability record

Every orchestration job SHOULD emit structured events containing:

- timestamp
- project
- requestId
- provider=`aitoearn`
- operation
- platform/accountId
- flowId/taskId/recordId when known
- attempt number
- state
- latencyMs
- error class/code without secret material

## Required states

`created -> accepted -> scheduled -> publishing -> published`

Terminal/error states: `failed`, `cancelled`, `unknown`, `manual_review`.

`unknown` is intentional: it prevents duplicate side effects after an ambiguous network outcome.

## Health gates

Before enabling autonomous publishing:

1. AiToEarn server and web are reachable.
2. MongoDB, Redis and object storage are healthy.
3. MCP endpoint is reachable for the selected environment.
4. Target account authorization is valid.
5. `listChannelPlatforms` confirms required capabilities.
6. At least one dry-run/test account workflow has completed.
7. Logging contains no tokens, cookies, OAuth secrets or API keys.

## Deployment baseline

Use the repository Docker Compose deployment as the supported self-host baseline. Do not introduce a second deployment architecture unless a concrete limitation requires it.

Runtime secrets belong in configuration/secret storage, never source control. China and international Relay/API keys must not be mixed across `aitoearn.cn` and `aitoearn.ai` environments.

## Human approval gates

Publishing may be autonomous when a project explicitly enables it. Engagement actions remain disabled by default. Bulk comments, follows, reposts, deletes/hides and similar account actions require a project-specific allowlist and review policy.
