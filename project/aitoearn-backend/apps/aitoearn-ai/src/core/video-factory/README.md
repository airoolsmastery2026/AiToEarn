# AiToEarn Video Factory

This module adds an original, OpenMontage-inspired orchestration layer to AiToEarn without copying OpenMontage source code. It is designed around a zero-cost-first policy: local and free providers are selected before any paid provider, and paid video generation is disabled unless the caller explicitly opts in.

## Pipeline

`Research -> Script -> Scene plan -> Assets -> Voice -> Video generation -> Compose -> QA -> Human approval -> Export`

The approval stage is enabled by default and can be disabled per plan request.

## API

- `GET /ai/video-factory/providers` returns provider configuration/readiness.
- `POST /ai/video-factory/plans` resolves a production plan.

Example request:

```json
{
  "topic": "Explain a construction detail in 45 seconds",
  "sourceMode": "original",
  "aspectRatio": "9:16",
  "durationSeconds": 45,
  "allowPaidProviders": false,
  "approvalGate": true
}
```

The default is `allowPaidProviders: false`. If no configured zero-cost provider can satisfy a stage, that stage is returned as `manual`; the router never silently falls through to a paid provider.

## Local runtime variables

- `VIDEO_FACTORY_LOCAL_LLM_ENDPOINT` - Ollama/OpenAI-compatible local endpoint for script and QA stages.
- `VIDEO_FACTORY_LOCAL_VIDEO_ENDPOINT` - local WAN/LTX/Hunyuan/CogVideo-compatible adapter.
- `VIDEO_FACTORY_PIPER_PATH` - Piper executable path.
- `VIDEO_FACTORY_FFMPEG_PATH` - FFmpeg executable path.

These variables are intentionally explicit so a missing local component cannot accidentally trigger paid usage.

## Source-rights rule

`sourceMode` accepts only `original`, `owned`, `licensed`, or `public-domain`. Reference videos can be used to study structure, pacing, or style, but generated scripts and media should remain original or authorized.

## Existing AiToEarn integration

The existing AiToEarn video provider layer remains unchanged. It is represented by the `aitoearn-native-video` fallback and is eligible only when `allowPaidProviders` is explicitly `true`. The current module is the orchestration/policy layer; local provider executors can be attached behind the declared runtime endpoints without changing the planner contract.
