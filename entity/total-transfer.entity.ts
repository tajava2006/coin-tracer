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
  id: number;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
    comment: '전송한 코인 심볼',
  })
  symbol: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    comment: 'Symbol의 Decimal',
    name: 'symbol_decimal',
  })
  symbolDecimal: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    comment: 'TX ID, not null',
  })
  txid: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    comment: '트랜잭션 성공/실패 여부',
  })
  status: number;

  @Column({
    type: 'bigint',
    default: 0,
    nullable: false,
    comment: 'transaction가 포함된 block height',
    name: 'block_number',
  })
  blockNumber: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'transaction가 포함된 block의 생성시점',
    name: 'block_timestamp',
  })
  blockTimestamp: Date;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    comment: '송신 지갑 주소',
    name: 'from_address',
  })
  fromAddress: string;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'from_address_wallet_type',
  })
  fromAddressWalletType: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    comment: '이전 tx txid',
    name: 'prev_txid',
  })
  prevTxid: string;

  @Column({
    type: 'int',
    nullable: false,
    comment: '이전 tx index',
    name: 'prev_index',
  })
  prevIndex: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    comment: '수신 지갑 주소',
    name: 'to_address',
  })
  toAddress: string;

  @Column({ type: 'smallint', nullable: true, name: 'to_address_wallet_type' })
  toAddressWalletType: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: '다음 tx txid',
    name: 'next_txid',
  })
  nextTxid: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: '다음 tx index',
    name: 'next_index',
  })
  nextIndex: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: '하나의 트랜잭션 안에서 internal transaction 구분자',
    name: 'sequence',
  })
  sequence: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    collation: 'utf8mb4_unicode_ci',
    comment: '메모, 기본값 null',
  })
  memo: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: 'string형태의 원본 amount',
  })
  amount: string;

  @Column({
    type: 'decimal',
    precision: 34,
    scale: 8,
    nullable: true,
    comment: 'decimal 적용한 소수점 표현 amount',
    name: 'dec_amount',
  })
  decAmount: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: 'string형태의 원본 fee',
  })
  fee: string;

  @Column({
    type: 'decimal',
    precision: 34,
    scale: 8,
    nullable: true,
    comment: 'decimal 적용한 소수점 표현 fee',
    name: 'dec_fee',
  })
  decFee: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'Token contract 주소 (CA) / Token이 아닌 경우 NOT_TOKEN_TRANSFER',
    name: 'token_contract_address',
  })
  tokenContractAddress: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: '수수료 대납 해주는 계정 (EOA)',
    name: 'fee_payer',
  })
  feePayer: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    comment: '데이터 수집 경로(Full_Node / Archive_Node / Web / Others)',
  })
  source: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    comment: '메인넷 별 특수한 데이터',
    name: 'extra_information',
  })
  extraInformation: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
    comment: '트랜젝션 데이터 수집 시간',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '생성한 작업자',
    name: 'created_by',
  })
  createdBy: string;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    comment: '트랜젝션 데이터 재수집 시간',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '수정한 작업자',
    name: 'updated_by',
  })
  updatedBy: string;
}
