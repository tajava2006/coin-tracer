export type OutPointResponse = OutPoint[][];

export interface OutPoint {
  spent: boolean;
  txid: string;
  vin: number;
  status: Status;
}

export interface Status {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}
