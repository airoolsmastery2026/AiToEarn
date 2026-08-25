import { Module } from '@nestjs/common'
import { VideoFactoryProviderRouter } from './video-factory-provider-router.service'
import { VideoFactoryController } from './video-factory.controller'
import { VideoFactoryService } from './video-factory.service'

@Module({
  controllers: [VideoFactoryController],
  providers: [VideoFactoryProviderRouter, VideoFactoryService],
  exports: [VideoFactoryProviderRouter, VideoFactoryService],
})
export class VideoFactoryModule {}
