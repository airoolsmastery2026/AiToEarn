# Social Distribution Skill

## Mission

Use AiToEarn as the execution provider for approved multi-platform publishing. Do not reimplement platform integrations that AiToEarn already exposes.

## Read first

1. `/AGENTS.md`
2. `/.ai/INTEGRATION.md`
3. `/.ai/SOCIAL_PROVIDER.md`
4. `/.ai/OPERATIONS.md`
5. `/.ai/social-provider.manifest.json`

## Inputs

Expected caller context:

- `project`: source project name
- `requestId`: durable caller-generated ID
- content: text and/or owned/licensed media references
- target accounts/platforms
- desired publish time or `now`
- campaign/business context when available
- approval mode: `auto_publish` or `human_review`

## Workflow

1. Discover platform metadata with `listChannelPlatforms`.
2. Validate each target platform/account and required option schema.
3. Validate content rights and project quality/brand checks before side effects.
4. Create one publish flow with `createChannelPublishFlow` and external context.
5. Persist returned identifiers with the caller's `requestId`.
6. If immediate publication is approved, invoke `publishChannelTaskNow` exactly once per task unless reconciliation proves a retry is safe.
7. If scheduled, keep provider scheduling authoritative and use `updateChannelPublishAt` for changes.
8. Observe publication with record lookups/listing instead of resubmission.
9. Collect analytics with `getChannelAccountAnalytics` and/or `getChannelWorkAnalytics`.
10. Return normalized results to the calling project's memory/optimizer.

## Cost policy

- Prefer local/open-source generation and durable official free tiers upstream of AiToEarn.
- Paid AI/provider usage is opt-in only.
- Never silently fall back to a paid provider.
- AiToEarn Relay may be used when deliberately configured; environment and API key must match.

## Side-effect safety

- Never blind-retry `createChannelPublishFlow`, `publishChannelTaskNow`, comments or engagement actions.
- On ambiguous results, query records first.
- Autonomous engagement defaults to off.
- Never place secrets in prompts, logs, commits or returned analytics payloads.

## Output

Return a compact execution result containing provider, requestId, platform/account, flow/task/record IDs when known, normalized state, URLs/analytics when available, and any manual action required.
