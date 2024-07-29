import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TotalTransfer } from 'entity/total-transfer.entity';
import { Repository } from 'typeorm';
import { Queue } from './queue';
import { HttpService } from '@nestjs/axios';
import axiosClient from 'axios';
import { Tx } from './dto/mempool-transaction.dto';
import { OutPointResponse } from './dto/coin-trace-outpoint.dto';

interface Transaction {
  txid: string;
  depth: number;
}

@Injectable()
export class TraceService {
  constructor(
    @InjectRepository(TotalTransfer)
    private readonly totalTransferRepository: Repository<TotalTransfer>,
    private readonly httpService: HttpService,
  ) {}

  async bfs(txid: string, forward: boolean, limit: number) {
    console.log('bfs start :', txid, forward, limit);

    const q = new Queue<Transaction>();
    // const coin = BlockchainFactory.getInstance('btc');
    // const visited = new Set<string>();

    q.enqueue({ txid, depth: 0 });
    while (!q.isEmpty()) {
      const nowNode = q.dequeue();
      const txid = nowNode.txid;
      const depth = nowNode.depth;
      console.log(111, q.size(), txid, depth);
      const tx = await this.GetTxByTxid(txid);
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

  private async GetTxByTxid(txid: string) {
    const baseUrl = 'https://mempool.space/api/';
    const txUrl = `${baseUrl}tx/${txid}`;
    const txDataResponse = await axiosClient.get<Tx>(txUrl);
    const outPointUrl = `${baseUrl}txs/outspends?txids=${txid}`;
    const outPointResponse =
      await axiosClient.get<OutPointResponse>(outPointUrl);
    const tx = txDataResponse.data;
    const outPoints = outPointResponse.data[0];

    const ret = new Array<TotalTransfer>();
    for (const [index, txIn] of tx.vin.entries()) {
      const row: TotalTransfer = {
        // id: 0,
        symbol: 'BTC',
        symbolDecimal: 8,
        txid: tx.txid,
        status: 1,
        blockNumber: tx.status.block_height,
        blockTimestamp: new Date(tx.status.block_time * 1000),
        fromAddress: txIn.prevout.scriptpubkey_address,
        fromAddressWalletType: 1,
        prevTxid: txIn.txid,
        prevIndex: txIn.vout,
        toAddress: 'UTXO_TO',
        toAddressWalletType: 1,
        source: 'EXPLORER',
        nextTxid: null,
        nextIndex: null,
        sequence: (index + 1) * -1,
        amount: txIn.prevout.value,
        decAmount: txIn.prevout.value / 1e8,
        tokenContractAddress: 'NOT_TOKEN',
      };
      ret.push(row);
    }
    for (const [index, txOut] of tx.vout.entries()) {
      const row: TotalTransfer = {
        // id: 0,
        symbol: 'BTC',
        symbolDecimal: 8,
        txid: tx.txid,
        status: 1,
        blockNumber: tx.status.block_height,
        blockTimestamp: new Date(tx.status.block_time * 1000),
        fromAddress: 'UTXO_FROM',
        fromAddressWalletType: 1,
        prevTxid: null,
        prevIndex: null,
        toAddress: txOut.scriptpubkey_address,
        source: 'EXPLORER',
        toAddressWalletType: 1,
        nextTxid: outPoints[index].spent ? outPoints[index].txid : null,
        nextIndex: outPoints[index].spent ? outPoints[index].vin : null,
        sequence: index,
        amount: txOut.value,
        decAmount: txOut.value / 1e8,
        tokenContractAddress: 'NOT_TOKEN',
      };
      ret.push(row);
    }
    return ret;
  }
}
