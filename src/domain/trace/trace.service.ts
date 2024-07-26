import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TotalTransfer } from 'entity/total-transfer.entity';
import { Repository } from 'typeorm';
import BlockchainFactory from 'blockchain-node-module';
import { Queue } from './queue';

interface Transaction {
  txid: string;
  depth: number;
}

@Injectable()
export class TraceService {
  constructor(
    @InjectRepository(TotalTransfer)
    private readonly totalTransferRepository: Repository<TotalTransfer>,
  ) {}

  async bfs(txid: string, forward: boolean, limit: number) {
    console.log('bfs start :', txid, forward, limit);

    const q = new Queue<Transaction>();
    const coin = BlockchainFactory.getInstance('btc');
    // const visited = new Set<string>();

    q.enqueue({ txid, depth: 0 });
    while (!q.isEmpty()) {
      const nowNode = q.dequeue();
      const txid = nowNode.txid;
      const depth = nowNode.depth;
      console.log(111, q.size(), txid, depth);
      const tx = await coin.explorer.GetTxByTxid(txid);
      await this.totalTransferRepository.upsert(tx, [
        'symbol',
        'txid',
        'sequence',
      ]);
      // visited.add(txid);

      for (const row of tx) {
        // outgoing
        if (row.fromAddress === 'UTXO_FROM') {
          if (!forward) continue;
          if (!row.nextTxid) continue;
          // if (visited.has(row.nextTxid)) continue;
          // visit check
          const isAlreadyVisited = await this.totalTransferRepository.findOneBy(
            {
              txid: row.nextTxid,
            },
          );
          if (isAlreadyVisited) {
            console.log('visited node: ', row.nextTxid);
            continue;
          }
          q.enqueue({ txid: row.nextTxid, depth: depth + 1 });
        } else if (row.toAddress === 'UTXO_TO') {
          if (forward) continue;
          // if (visited.has(row.prevTxid)) continue;
          // visit check
          const isAlreadyVisited = await this.totalTransferRepository.findOneBy(
            {
              txid: row.prevTxid,
            },
          );
          if (isAlreadyVisited) {
            console.log('visited node: ', row.prevTxid);
            continue;
          }
          q.enqueue({ txid: row.prevTxid, depth: depth + 1 });
        }
      }

      if (depth > limit) {
        return;
      }
    }
  }
}
