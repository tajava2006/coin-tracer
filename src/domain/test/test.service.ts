import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TotalTransfer } from 'entity/total-transfer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestService implements OnModuleInit {
  constructor(
    @InjectRepository(TotalTransfer)
    private readonly totalTransferRepository: Repository<TotalTransfer>,
  ) {}

  async onModuleInit() {
    const one = await this.totalTransferRepository.findOneBy({ id: 1 });
    console.log(111, one);
  }
  findAll() {
    return `This action returns all test`;
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
