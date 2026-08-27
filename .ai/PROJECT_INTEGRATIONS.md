# Project Integration Map

All projects integrate through the Social Provider contract in `SOCIAL_PROVIDER.md`. They must not depend on AiToEarn internal NestJS modules or database collections.

## 1. Contractor AI OS

Trigger sources:
- completed/project milestone
- estimate/quote knowledge approved for marketing
- before/after media
- FAQ/case study

Flow:
`Contractor knowledge -> Content Planner -> Content/Video Factory -> Quality Guard -> Social Provider -> AiToEarn -> Analytics -> CRM/Memory`

Required caller context: project/customer-safe campaign ID, content rights, service category, target geography, CTA/lead destination.

## 2. Dai Hai Phat Web / DHP AI OS

Trigger sources:
- product/material/project pages
- residential/interior project library
- approved price-range education
- AI Sales Engineer FAQ/case studies

Flow:
`DHP knowledge -> SEO/Content Agent -> media generation -> brand/accuracy check -> Social Provider -> AiToEarn -> social traffic -> DHP website/AI Sales -> CRM`

Do not expose private customer details, internal pricing rules or unapproved project media.

## 3. AI Shopify Store Factory

Trigger sources:
- new product/store launch
- approved product media
- merchandising campaign
- sale/collection update

Flow:
`Product data -> campaign planner -> creative factory -> Social Provider -> AiToEarn -> social traffic -> storefront -> conversion analytics`

Store/product truth remains in the commerce project; AiToEarn receives only the publish-ready payload.

## 4. Affiliate / Faceless Content Factory

Use AiToEarn only for distribution and analytics. The caller owns offer compliance, claims review, affiliate disclosure and content rights.

## 5. FormaVision / Estate Vision / Render projects

Treat rendered media as upstream assets. A content project generates captions/variants and passes approved media references to the Social Provider.

## 6. TubeMaster / Video Factory

The existing zero-cost-first Video Factory is an upstream creative producer. Its approved export becomes media input to the Social Provider. Video generation and social publishing remain separate stages so either can be replaced independently.

## Shared adapter requirements

Each caller stores:

- `requestId`
- originating project/job/campaign ID
- content fingerprint
- target platform/account IDs
- approval state
- `flowId`, `taskId`, `recordId` when returned
- normalized publish status
- analytics snapshot/reference

## Forbidden coupling

- importing AiToEarn MongoDB models into another project
- reading AiToEarn database directly
- hard-coding platform payloads without capability discovery
- storing social OAuth credentials in calling repos
- assuming paid Relay/AI services are always available

The MCP/provider contract is the boundary.
