import { Controller, Get, Query } from '@nestjs/common';
import { AppService, TSnapshot, TTimeline } from './app.service';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTimeline(@Query() query): TTimeline {
    const {
      from
    } = query
    const currentTime = Date.now();
    const timeline = this.appService.getTimeline(from ? from : currentTime - (1 * day));
    return timeline;
  }

  @Get('/blacklist')
  getBlacklist(): string[] {
    const blacklist = this.appService.getBlacklist();
    return blacklist;
  }

  @Get('/snapshot')
  getSnapshot(): TSnapshot {
    return this.appService.getSnapshot();
  }
}
