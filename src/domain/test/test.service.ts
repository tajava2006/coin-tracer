import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TotalTransfer } from 'entity/total-transfer.entity';
import { Repository } from 'typeorm';
import BlockchainFactory from 'blockchain-node-module';

@Injectable()
export class TestService implements OnModuleInit {
  constructor(
    @InjectRepository(TotalTransfer)
    private readonly totalTransferRepository: Repository<TotalTransfer>,
  ) {}

  async onModuleInit() {
    // const one = await this.totalTransferRepository.findOneBy({ id: 1 });
    // console.log(111, one);
    const coin = BlockchainFactory.getInstance('btc');
    // console.log(222, coin);
    const txid =
      '2ae0107536f31fc46513e11834e57d13aeb35848fedb0a397634adbceb47126c';
    const tx = await coin.explorer.GetTxByTxid!(txid);
    console.log(333, tx);
    const asdf = await this.totalTransferRepository.upsert(tx, [
      'symbol',
      'txid',
      'sequence',
    ]);
    console.log(44444, asdf);
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
