# AiToEarn AI OS Integration

## Purpose

This fork preserves `yikart/AiToEarn` as the upstream social execution product while adding a thin, provider-neutral integration layer for the owner's AI ecosystem.

## Branch policy

- `main`: keep close to upstream and production-safe.
- `integration/ai-os`: all AI OS integration work lands here first.
- Prefer additive contracts, skills and adapters over invasive upstream rewrites.
- Before significant work, compare `yikart/AiToEarn:main` with this fork.

## System role

AiToEarn is the **Social Media Execution Layer**, not the business brain.

`Research -> Content Planning -> Video/Text/Image Factory -> Quality Guard -> AiToEarn -> Social Platforms -> Analytics -> Memory/Optimizer`

Higher-level projects own strategy, project knowledge, CRM, persistent memory and revenue logic. AiToEarn owns supported account connectivity, publishing, scheduling, platform operations and analytics execution.

## Existing capability to reuse

The upstream channels MCP already exposes the core operations required by the AI OS, including publish-flow creation, immediate publish, cancellation, rescheduling, publish-record lookup, platform capability discovery, work analytics and engagement operations. The integration layer MUST wrap these capabilities instead of reimplementing them.

## Integration sequence

1. Stable Social Provider contract mapped to existing channels MCP tools.
2. Machine-readable capability manifest for external agents.
3. Zero-cost-first provider policy with explicit paid opt-in.
4. Idempotency, retry and observability operating rules.
5. Portable `social-distribution` agent skill.
6. Connect Contractor AI OS, Dai Hai Phat AI OS and AI Shopify Store Factory through the same contract.
7. Add further projects only through the same provider interface.

## Safety boundaries

- OAuth tokens, relay keys, AI-provider keys and account credentials are secrets and must never be committed.
- Autonomous engagement and bulk side effects require explicit runtime enablement.
- Agents must discover platform capabilities before publishing.
- Retry must not blindly duplicate a publish request.
- Platform policy and rate limits remain authoritative.

## Done definition

The integration foundation is complete when an external agent can read one stable manifest/skill, discover capabilities, create/schedule/publish content through existing MCP operations, query outcomes and analytics, and operate without an accidental paid-provider fallback.
