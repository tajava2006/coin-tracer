import { Module } from '@nestjs/common';
import { TraceService } from './trace.service';
import { TraceController } from './trace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalTransfer } from 'entity/total-transfer.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([TotalTransfer]), HttpModule],
  controllers: [TraceController],
  providers: [TraceService],
})
export class TraceModule {}
