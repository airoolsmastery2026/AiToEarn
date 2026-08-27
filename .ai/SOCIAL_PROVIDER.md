# Social Provider Contract

## Goal

Give every higher-level AI project one stable vocabulary while AiToEarn remains free to evolve internally.

## Canonical operations

| Canonical operation | AiToEarn MCP tool | Side effect |
|---|---|---|
| `capabilities.list` | `listChannelPlatforms` | no |
| `capabilities.get` | `getChannelPlatform` | no |
| `publish.create` | `createChannelPublishFlow` | yes |
| `publish.now` | `publishChannelTaskNow` | yes |
| `publish.cancel` | `cancelChannelPublishTask` | yes |
| `publish.reschedule` | `updateChannelPublishAt` | yes |
| `publish.update` | `requestChannelPublishUpdate` | yes |
| `publish.records.list` | `listChannelPublishRecords` | no |
| `publish.record.byTask` | `getChannelPublishRecordByTaskId` | no |
| `publish.record.byFlow` | `getChannelPublishRecordByFlowId` | no |
| `publish.record.byId` | `getChannelPublishRecordByRecordId` | no |
| `works.list` | `listChannelWorks` | no |
| `works.get` | `getChannelWorkDetail` | no |
| `analytics.account` | `getChannelAccountAnalytics` | no |
| `analytics.work` | `getChannelWorkAnalytics` | no |
| `engagement.comments.list` | `listChannelEngagementComments` | no |
| `engagement.comment.create` | `submitChannelEngagementComment` | yes |
| `engagement.action` | `callChannelEngagementFunction` | yes |

## Required agent sequence

1. Call `capabilities.list` before preparing a platform-specific payload.
2. Validate the target account/platform and platform options.
3. Build one publish flow with explicit external context when available.
4. Persist returned `flowId`/`taskId` in the calling project's job record.
5. For immediate publishing, call `publish.now` once per task.
6. Poll/read records rather than resubmitting after an uncertain response.
7. Collect work/account analytics after publication and return normalized metrics to the caller.

## Stable normalized envelope

Higher-level projects SHOULD normalize provider responses into:

```json
{
  "provider": "aitoearn",
  "operation": "publish.create",
  "requestId": "caller-generated-id",
  "flowId": "optional",
  "taskId": "optional",
  "recordId": "optional",
  "status": "accepted|scheduled|publishing|published|failed|cancelled|unknown",
  "providerPayload": {}
}
```

Do not require AiToEarn itself to emit this envelope. The calling adapter owns normalization.

## Idempotency contract

Every caller MUST create and persist a deterministic `requestId` before a side-effecting operation. If a network/client failure makes the result uncertain, query publish records by the known flow/task identifiers before attempting another create/publish call. Automatic blind replay of content creation or publish-now is forbidden.

## Engagement contract

Engagement is disabled by default for autonomous agents. A project may enable it only with a runtime policy that names allowed actions, platforms and accounts. Destructive or reputation-sensitive actions must remain human-reviewed unless an explicit project policy says otherwise.
