import type {
  VideoFactoryAspectRatio,
  VideoFactoryCapability,
  VideoFactoryPlan,
  VideoFactoryRequest,
  VideoFactoryResolvedRequest,
  VideoFactorySourceMode,
  VideoFactoryStagePlan,
} from './video-factory.types'
import { BadRequestException, Injectable } from '@nestjs/common'
import { VideoFactoryProviderRouter } from './video-factory-provider-router.service'

interface StageDefinition {
  id: string
  label: string
  capability?: VideoFactoryCapability
}

const SOURCE_MODES: readonly VideoFactorySourceMode[] = ['original', 'owned', 'licensed', 'public-domain']
const ASPECT_RATIOS: readonly VideoFactoryAspectRatio[] = ['9:16', '16:9', '1:1']

const PIPELINE: readonly StageDefinition[] = [
  { id: 'research', label: 'Research', capability: 'research' },
  { id: 'script', label: 'Script', capability: 'script' },
  { id: 'scene-plan', label: 'Scene plan', capability: 'script' },
  { id: 'assets', label: 'Assets', capability: 'assets' },
  { id: 'voice', label: 'Voice', capability: 'voice' },
  { id: 'video-generation', label: 'Video generation', capability: 'video-generation' },
  { id: 'compose', label: 'Compose', capability: 'compose' },
  { id: 'qa', label: 'QA', capability: 'qa' },
  { id: 'export', label: 'Export', capability: 'export' },
]

@Injectable()
export class VideoFactoryService {
  constructor(private readonly providerRouter: VideoFactoryProviderRouter) {}

  createPlan(input: VideoFactoryRequest): VideoFactoryPlan {
    const request = this.normalizeRequest(input)
    const warnings = new Set<string>()
    const providerStatuses = this.providerRouter.listProviders()
    const providerById = new Map(providerStatuses.map(provider => [provider.id, provider]))

    const stages: VideoFactoryStagePlan[] = PIPELINE.map((stage) => {
      if (!stage.capability) {
        return { id: stage.id, label: stage.label, status: 'ready' }
      }

      const provider = this.providerRouter.resolve(stage.capability, request.allowPaidProviders)
      if (!provider) {
        warnings.add(`No configured ${request.allowPaidProviders ? '' : 'zero-cost '}provider is available for ${stage.capability}.`)
        return {
          id: stage.id,
          label: stage.label,
          capability: stage.capability,
          status: 'manual',
        }
      }

      return {
        id: stage.id,
        label: stage.label,
        capability: stage.capability,
        providerId: provider.id,
        status: 'ready',
      }
    })

    if (request.approvalGate) {
      stages.splice(stages.length - 1, 0, {
        id: 'approval',
        label: 'Human approval',
        status: 'approval',
      })
    }

    warnings.add('Reference material may guide pacing or style, but scripts and media must remain original, owned, licensed, or public-domain.')

    const paidProviders = new Set(
      stages
        .map(stage => stage.providerId)
        .filter((providerId): providerId is string => Boolean(providerId))
        .filter(providerId => providerById.get(providerId)?.costTier === 'paid'),
    )

    return {
      version: 1,
      policy: 'zero-cost-first',
      request,
      stages,
      estimatedPaidProviderCount: paidProviders.size,
      warnings: [...warnings],
    }
  }

  private normalizeRequest(input: VideoFactoryRequest): VideoFactoryResolvedRequest {
    const topic = input.topic?.trim()
    if (!topic) {
      throw new BadRequestException('topic is required')
    }

    const sourceMode = input.sourceMode ?? 'original'
    if (!SOURCE_MODES.includes(sourceMode)) {
      throw new BadRequestException('sourceMode must be original, owned, licensed, or public-domain')
    }

    const aspectRatio = input.aspectRatio ?? '9:16'
    if (!ASPECT_RATIOS.includes(aspectRatio)) {
      throw new BadRequestException('aspectRatio must be 9:16, 16:9, or 1:1')
    }

    const durationSeconds = input.durationSeconds ?? 60
    if (!Number.isFinite(durationSeconds) || durationSeconds < 5 || durationSeconds > 3600) {
      throw new BadRequestException('durationSeconds must be between 5 and 3600')
    }

    return {
      topic,
      sourceMode,
      aspectRatio,
      durationSeconds,
      allowPaidProviders: input.allowPaidProviders ?? false,
      approvalGate: input.approvalGate ?? true,
    }
  }
}
