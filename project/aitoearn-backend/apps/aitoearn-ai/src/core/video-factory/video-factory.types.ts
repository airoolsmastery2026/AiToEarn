export type VideoFactoryCostTier = 'local' | 'free' | 'paid'

export type VideoFactoryCapability
  = | 'research'
    | 'script'
    | 'assets'
    | 'voice'
    | 'video-generation'
    | 'compose'
    | 'qa'
    | 'export'

export type VideoFactorySourceMode = 'original' | 'owned' | 'licensed' | 'public-domain'

export type VideoFactoryAspectRatio = '9:16' | '16:9' | '1:1'

export interface VideoFactoryProviderDefinition {
  id: string
  label: string
  capability: VideoFactoryCapability
  costTier: VideoFactoryCostTier
  priority: number
  enabledByDefault: boolean
  setupHint?: string
}

export interface VideoFactoryRequest {
  topic: string
  sourceMode?: VideoFactorySourceMode
  aspectRatio?: VideoFactoryAspectRatio
  durationSeconds?: number
  allowPaidProviders?: boolean
  approvalGate?: boolean
}

export interface VideoFactoryResolvedRequest {
  topic: string
  sourceMode: VideoFactorySourceMode
  aspectRatio: VideoFactoryAspectRatio
  durationSeconds: number
  allowPaidProviders: boolean
  approvalGate: boolean
}

export interface VideoFactoryStagePlan {
  id: string
  label: string
  capability?: VideoFactoryCapability
  providerId?: string
  status: 'ready' | 'manual' | 'approval'
}

export interface VideoFactoryPlan {
  version: 1
  policy: 'zero-cost-first'
  request: VideoFactoryResolvedRequest
  stages: VideoFactoryStagePlan[]
  estimatedPaidProviderCount: number
  warnings: string[]
}
