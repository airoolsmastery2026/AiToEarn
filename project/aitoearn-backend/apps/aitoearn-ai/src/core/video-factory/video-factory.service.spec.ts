import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { VideoFactoryProviderRouter } from './video-factory-provider-router.service'
import { VideoFactoryService } from './video-factory.service'

const LOCAL_VIDEO_ENV = 'VIDEO_FACTORY_LOCAL_VIDEO_ENDPOINT'

let originalLocalVideoEndpoint: string | undefined

beforeEach(() => {
  originalLocalVideoEndpoint = process.env[LOCAL_VIDEO_ENV]
  delete process.env[LOCAL_VIDEO_ENV]
})

afterEach(() => {
  if (originalLocalVideoEndpoint === undefined) {
    delete process.env[LOCAL_VIDEO_ENV]
  }
  else {
    process.env[LOCAL_VIDEO_ENV] = originalLocalVideoEndpoint
  }
})

describe('VideoFactoryService', () => {
  const createService = () => new VideoFactoryService(new VideoFactoryProviderRouter())

  it('keeps paid providers disabled by default', () => {
    const plan = createService().createPlan({ topic: 'A short construction explainer' })
    const videoStage = plan.stages.find(stage => stage.id === 'video-generation')

    expect(plan.policy).toBe('zero-cost-first')
    expect(plan.estimatedPaidProviderCount).toBe(0)
    expect(videoStage?.status).toBe('manual')
    expect(videoStage?.providerId).toBeUndefined()
  })

  it('uses the existing cloud video layer only after explicit paid opt-in', () => {
    const plan = createService().createPlan({
      topic: 'A short construction explainer',
      allowPaidProviders: true,
    })
    const videoStage = plan.stages.find(stage => stage.id === 'video-generation')

    expect(videoStage?.providerId).toBe('aitoearn-native-video')
    expect(plan.estimatedPaidProviderCount).toBe(1)
  })

  it('prefers a configured local video adapter over paid providers', () => {
    process.env[LOCAL_VIDEO_ENV] = 'http://127.0.0.1:9000'

    const plan = createService().createPlan({
      topic: 'A short construction explainer',
      allowPaidProviders: true,
    })
    const videoStage = plan.stages.find(stage => stage.id === 'video-generation')

    expect(videoStage?.providerId).toBe('local-video-model')
    expect(plan.estimatedPaidProviderCount).toBe(0)
  })
})
