import { Controller, Get, Query } from '@nestjs/common';
import { TraceService } from './trace.service';

@Controller('trace')
export class TraceController {
  constructor(private readonly traceService: TraceService) {}

  @Get()
  dfs(@Query() query: { txid: string; forward: string; limit: number }) {
    return this.traceService.bfs(
      query.txid,
      query.forward === 'true',
      query.limit,
    );
  }
}
