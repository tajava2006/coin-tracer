import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalTransfer } from 'entity/total-transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotalTransfer])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
