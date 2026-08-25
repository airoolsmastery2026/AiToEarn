import type { VideoFactoryPlan, VideoFactoryProviderStatus, VideoFactoryRequest } from './video-factory.types'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { VideoFactoryProviderRouter } from './video-factory-provider-router.service'
import { VideoFactoryService } from './video-factory.service'

@ApiTags('Me/Ai/VideoFactory')
@Controller('ai/video-factory')
export class VideoFactoryController {
  constructor(
    private readonly videoFactoryService: VideoFactoryService,
    private readonly providerRouter: VideoFactoryProviderRouter,
  ) {}

  @Get('/providers')
  getProviders(): VideoFactoryProviderStatus[] {
    return this.providerRouter.listProviders()
  }

  @Post('/plans')
  createPlan(@Body() body: VideoFactoryRequest): VideoFactoryPlan {
    return this.videoFactoryService.createPlan(body)
  }
}
