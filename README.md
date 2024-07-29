<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# local
$ NODE_ENV=local yarn run start

```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
