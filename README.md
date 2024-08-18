## Description

가상자산 추적 대회 utxo 계열 (현재까지는 btc 만 지원) 코인 자금 흐름 추적 프로그램

## Requirements
1. node.js
2. mysql
3. neo4j desktop
4. create table
```bash

-- auto-generated definition
create table total_transfer
(
    id                       bigint unsigned auto_increment comment '인조식별자'
        primary key,
    symbol                   varchar(128)                            not null comment '전송한 코인 심볼',
    symbol_decimal           tinyint                                 null comment 'Symbol의 Decimal',
    txid                     varchar(512)                            not null comment 'TX ID, not null',
    status                   tinyint                                  null comment '트랜잭션 성공/실패 여부',
    block_number             bigint   default 0                       null comment 'transaction가 포함된 block height',
    block_timestamp          timestamp                               null comment 'transaction가 포함된 block의 생성시점',
    from_address             varchar(512)                             null comment '송신 지갑 주소',
    from_address_wallet_type smallint                                null,
    prev_txid                varchar(512)                             null comment '이전 tx txid',
    prev_index               int                                      null comment '이전 tx index',
    to_address               varchar(512)                             null comment '수신 지갑 주소',
    to_address_wallet_type   smallint                                null,
    next_txid                varchar(512)                            null comment '다음 tx txid',
    next_index               int                                     null comment '다음 tx index',
    sequence                 int      default 0                      not null comment '하나의 트랜잭션 안에서 internal transaction 구분자',
    memo                     varchar(512) collate utf8mb4_unicode_ci null comment '메모, 기본값 null',
    amount                   varchar(128)                            null comment 'string형태의 원본 amount',
    dec_amount               decimal(34, 8)                          null comment 'decimal 적용한 소수점 표현 amount',
    fee                      varchar(128)                            null comment 'string형태의 원본 fee',
    dec_fee                  decimal(34, 8)                          null comment 'decimal 적용한 소수점 표현 fee',
    token_contract_address   varchar(512)                            null comment 'Token contract 주소 (CA) / Token이 아닌 경우 NOT_TOKEN_TRANSFER',
    fee_payer                varchar(512)                            null comment '수수료 대납 해주는 계정 (EOA)',
    source                   varchar(32)                             not null comment '데이터 수집 경로(Full_Node / Archive_Node / Web / Others)',
    extra_information        varchar(1024)                           null comment '메인넷 별 특수한 데이터',
    created_at               datetime default CURRENT_TIMESTAMP      null comment '트랜젝션 데이터 수집 시간',
    created_by               varchar(128)                            null comment '생성한 작업자',
    updated_at               datetime default CURRENT_TIMESTAMP      null on update CURRENT_TIMESTAMP comment '트랜젝션 데이터 재수집 시간',
    updated_by               varchar(128)                            null comment '수정한 작업자',
    constraint unique_index
        unique (symbol, txid, sequence)
)
    comment 'transaction 내부 복수 개의 internal transfer';

create index ix_total_transfer_block_number
    on total_transfer (block_number);

create index ix_total_transfer_block_timestamp
    on total_transfer (block_timestamp);

create index ix_total_transfer_from_address
    on total_transfer (from_address);

create index ix_total_transfer_to_address
    on total_transfer (to_address);

create index ix_total_transfer_txid
    on total_transfer (txid);
```

## Setup
```bash
$ cd config/environment
$ cp .env.template local.env
```
이후 디비 정보(host, user, password, database) 채워넣고 아래 running the app 참고해서 실행하면 됩니다.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# local
$ NODE_ENV=local yarn run start

```

## trace coin
```bash
$ curl -X GET "http://localhost:6789/trace?txid=415366ca40802cf7405d5262eb4569418532a75d773fd5044baeaa66b890490d&forward=false&limit=3"
```
추적시작 txid
방향 : 
forward = true 면 해당 토큰이 어디로 흘러가는지 추적
forward = false 면 해당 토큰이 어디에서 흘러왔는지 추적
해서 자동으로 total_transfer 테이블에 insert. limit = 몇 depth 까지 추적할 것인지

## import neo4j 

1. 수집한 tx csv 파일로 export
   ```bash
        select
            symbol
            ,txid
            ,sequence
            ,from_address
            ,prev_txid
            ,prev_index
            ,amount
            ,to_address
            ,next_txid
            ,next_index
            ,block_number
            ,block_timestamp
        from total_transfer
        where 1=1
        and to_address is not null;
   ```
2. neo4j 설치
3. database 생성
4. open 버튼 옆 점 3개 클릭 -> Open folder 클릭 -> Import 클릭
5. 4에서 열린 폴더에 해당 csv 파일 넣고
6. neo4j start -> open
7. 상단의 커맨드 창에 아래 커맨드 하나씩 실행 
   ```bash
        LOAD CSV WITH HEADERS FROM 'file:///total_transfer.csv' AS row
        // Process transactions
        WITH row
        // Create Transaction nodes
        MERGE (tx:Tx {txid: row.txid})
        SET tx.block_number = toInteger(row.block_number)
        
        
        LOAD CSV WITH HEADERS FROM 'file:///total_transfer.csv' AS row    
        // Handle inputs
        WITH row
        WHERE row.to_address = 'UTXO_TO'
        MERGE (address_from:Address {address: row.from_address})
        MERGE (tx:Tx {txid: row.txid})
        MERGE (address_from) -[flow_in:FLOW_IN {sequence: row.sequence, amount: toInteger(row.amount), txid: row.txid}] -> (tx)
        
        LOAD CSV WITH HEADERS FROM 'file:///total_transfer.csv' AS row
        // Handle outputs
        WITH row
        WHERE row.from_address = 'UTXO_FROM'
        MERGE (address_to:Address {address: row.to_address})
        MERGE (tx:Tx {txid: row.txid})
        MERGE (tx)-[flow_out:FLOW_OUT {sequence: toInteger(row.sequence), amount: toInteger(row.amount), txid: row.txid}]->(address_to)
        
        LOAD CSV WITH HEADERS FROM 'file:///total_transfer.csv' AS row
        // Create relationships based on previous transaction
        WITH row
        WHERE row.prev_txid IS NOT NULL
        MERGE (prev_tx:Tx {txid: row.prev_txid})
        MERGE (address_to:Address {address: row.from_address})
        with prev_tx, address_to, row
        optional MATCH (prev_tx)-[existing_rel:FLOW_OUT {sequence: toInteger(row.prev_index), txid:row.prev_txid}]->(address_to)
        delete existing_rel
        merge (prev_tx)-[prev_to_next:FLOW_OUT {sequence: toInteger(row.prev_index), amout: toInteger(row.amount), txid: row.prev_txid}]->(address_to)
        
        LOAD CSV WITH HEADERS FROM 'file:///total_transfer.csv' AS row
        // Create relationships based on next transaction
        WITH row
        WHERE row.next_txid IS NOT NULL
        MERGE (next_tx:Tx {txid: row.next_txid})
        MERGE (address_to:Address {address: row.to_address})
        with next_tx, address_to, row
        optional MATCH (address_to)-[existing_rel:FLOW_IN {sequence: toString((toInteger(row.next_index)+1) * -1), txid: row.next_txid}]->(next_tx)
        delete existing_rel
        merge (address_to)-[prev_to_next:FLOW_IN {sequence: toString((toInteger(row.next_index)+1) * -1), amount: toInteger(row.amount), txid: row.next_txid}]->(next_tx)

   ```
8. cypher, 혹은 gui 클릭을 통해 찾기(아래 예저 쿼리 참조)
   ```bash
   match (start:Address {address:"3MVyE86ef8nDmjCt3tEzgtKhtSSMNAYqJy"}), (end:Address {address:"bc1qne9zgv0n8fldjn934xvmff3cznjx426kgquvgf"})
   match path = (start)-[*..7]-(end)
   return path;
   ```
9. graph를 클릭하면 그래프 형태로 , table를 클릭하면 table 형태로 보여지고 해당 그래프에서 address나 tx 더블 클릭하면 관련된 노드들 전부 나오게 됨
   
   





















 
