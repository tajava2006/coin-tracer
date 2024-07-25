import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('total_transfer')
@Unique('unique_index', ['symbol', 'txid', 'sequence'])
export class TotalTransfer {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
    comment: '인조식별자',
  })
  id?: number;

  @Column('varchar', { length: 128, comment: '전송한 코인 심볼' })
  symbol?: string;

  @Column('tinyint', { name: 'symbol_decimal', comment: 'Symbol의 Decimal' })
  symbolDecimal?: number;

  @Column('varchar', { length: 512, comment: 'TX ID, not null' })
  txid?: string;

  @Column('tinyint', { comment: '트랜잭션 성공/실패 여부' })
  status?: number;

  @Column('bigint', {
    name: 'block_number',
    comment: 'transaction가 포함된 block height',
  })
  blockNumber?: number;

  @Column('timestamp', {
    name: 'block_timestamp',
    comment: 'transaction가 포함된 block의 생성시점',
  })
  blockTimestamp?: Date;

  @Column('varchar', {
    length: 512,
    name: 'from_address',
    comment: '송신 지갑 주소',
  })
  fromAddress?: string;

  @Column('smallint', { name: 'from_address_wallet_type' })
  fromAddressWalletType?: number;

  @Column('varchar', {
    length: 512,
    name: 'prev_txid',
    comment: '이전 tx txid',
  })
  prevTxid?: string;

  @Column('int', { name: 'prev_index', comment: '이전 tx index' })
  prevIndex?: number;

  @Column('varchar', {
    length: 512,
    name: 'to_address',
    comment: '수신 지갑 주소',
  })
  toAddress?: string;

  @Column('smallint', { name: 'to_address_wallet_type' })
  toAddressWalletType?: number;

  @Column('varchar', {
    length: 512,
    name: 'next_txid',
    comment: '다음 tx txid',
  })
  nextTxid?: string;

  @Column('int', { name: 'next_index', comment: '다음 tx index' })
  nextIndex?: number;

  @Column('int', {
    name: 'sequence',
    comment: '하나의 트랜잭션 안에서 internal transaction 구분자',
  })
  sequence?: number;

  @Column('varchar', {
    length: 512,
    comment: '메모, 기본값 null',
  })
  memo?: string;

  @Column('varchar', { length: 128, comment: 'string형태의 원본 amount' })
  amount?: string | number;

  @Column('decimal', {
    precision: 34,
    scale: 8,
    name: 'dec_amount',
    comment: 'decimal 적용한 소수점 표현 amount',
  })
  decAmount?: string | number;

  @Column('varchar', { length: 128, comment: 'string형태의 원본 fee' })
  fee?: string | number;

  @Column('decimal', {
    precision: 34,
    scale: 8,
    name: 'dec_fee',
    comment: 'decimal 적용한 소수점 표현 fee',
  })
  decFee?: string | number;

  @Column('varchar', {
    length: 512,
    name: 'token_contract_address',
    comment: 'Token contract 주소 (CA) / Token이 아닌 경우 NOT_TOKEN_TRANSFER',
  })
  tokenContractAddress?: string;

  @Column('varchar', {
    length: 512,
    name: 'fee_payer',
    comment: '수수료 대납 해주는 계정 (EOA)',
  })
  feePayer?: string;

  @Column('varchar', {
    length: 32,
    comment: '데이터 수집 경로(Full_Node / Archive_Node / Web / Others)',
  })
  source?: string;

  @Column('varchar', {
    length: 1024,
    name: 'extra_information',
    comment: '메인넷 별 특수한 데이터',
  })
  extraInformation?: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
    comment: '트랜젝션 데이터 수집 시간',
  })
  createdAt?: Date;

  @Column('varchar', {
    length: 128,
    name: 'created_by',
    comment: '생성한 작업자',
  })
  createdBy?: string;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
    comment: '트랜젝션 데이터 재수집 시간',
  })
  updatedAt?: Date;

  @Column('varchar', {
    length: 128,
    name: 'updated_by',
    comment: '수정한 작업자',
  })
  updatedBy?: string;
}
