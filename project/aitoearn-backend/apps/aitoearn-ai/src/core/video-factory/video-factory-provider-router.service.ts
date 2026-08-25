import type {
  VideoFactoryCapability,
  VideoFactoryProviderDefinition,
  VideoFactoryProviderStatus,
} from './video-factory.types'
import { Injectable } from '@nestjs/common'
import { VIDEO_FACTORY_PROVIDERS } from './video-factory.providers'

const COST_ORDER = {
  local: 0,
  free: 1,
  paid: 2,
} as const

@Injectable()
export class VideoFactoryProviderRouter {
  listProviders(): VideoFactoryProviderStatus[] {
    return VIDEO_FACTORY_PROVIDERS.map(provider => ({
      ...provider,
      configured: this.isConfigured(provider),
    }))
  }

  resolve(
    capability: VideoFactoryCapability,
    allowPaidProviders: boolean,
  ): VideoFactoryProviderStatus | undefined {
    return this.listProviders()
      .filter(provider => provider.enabledByDefault)
      .filter(provider => provider.capability === capability)
      .filter(provider => provider.configured)
      .filter(provider => allowPaidProviders || provider.costTier !== 'paid')
      .sort((left, right) => {
        const costDifference = COST_ORDER[left.costTier] - COST_ORDER[right.costTier]
        return costDifference === 0 ? left.priority - right.priority : costDifference
      })[0]
  }

  private isConfigured(provider: VideoFactoryProviderDefinition): boolean {
    if (!provider.requiredEnv) {
      return true
    }

    return Boolean(process.env[provider.requiredEnv]?.trim())
  }
}
