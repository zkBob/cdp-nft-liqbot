// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace CdpTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type DebtBurnedEntity = {
  id: Scalars['String'];
  vault: Vault;
  debtDecrease: Scalars['BigInt'];
};

export type DebtBurnedEntity_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault?: InputMaybe<Scalars['String']>;
  vault_not?: InputMaybe<Scalars['String']>;
  vault_gt?: InputMaybe<Scalars['String']>;
  vault_lt?: InputMaybe<Scalars['String']>;
  vault_gte?: InputMaybe<Scalars['String']>;
  vault_lte?: InputMaybe<Scalars['String']>;
  vault_in?: InputMaybe<Array<Scalars['String']>>;
  vault_not_in?: InputMaybe<Array<Scalars['String']>>;
  vault_contains?: InputMaybe<Scalars['String']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_not_contains?: InputMaybe<Scalars['String']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_starts_with?: InputMaybe<Scalars['String']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_starts_with?: InputMaybe<Scalars['String']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_ends_with?: InputMaybe<Scalars['String']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_?: InputMaybe<Vault_filter>;
  debtDecrease?: InputMaybe<Scalars['BigInt']>;
  debtDecrease_not?: InputMaybe<Scalars['BigInt']>;
  debtDecrease_gt?: InputMaybe<Scalars['BigInt']>;
  debtDecrease_lt?: InputMaybe<Scalars['BigInt']>;
  debtDecrease_gte?: InputMaybe<Scalars['BigInt']>;
  debtDecrease_lte?: InputMaybe<Scalars['BigInt']>;
  debtDecrease_in?: InputMaybe<Array<Scalars['BigInt']>>;
  debtDecrease_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DebtBurnedEntity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DebtBurnedEntity_filter>>>;
};

export type DebtBurnedEntity_orderBy =
  | 'id'
  | 'vault'
  | 'vault__id'
  | 'vault__vaultNormalizedDebt'
  | 'debtDecrease';

export type DebtMintedEntity = {
  id: Scalars['String'];
  vault: Vault;
  debtIncrease: Scalars['BigInt'];
};

export type DebtMintedEntity_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault?: InputMaybe<Scalars['String']>;
  vault_not?: InputMaybe<Scalars['String']>;
  vault_gt?: InputMaybe<Scalars['String']>;
  vault_lt?: InputMaybe<Scalars['String']>;
  vault_gte?: InputMaybe<Scalars['String']>;
  vault_lte?: InputMaybe<Scalars['String']>;
  vault_in?: InputMaybe<Array<Scalars['String']>>;
  vault_not_in?: InputMaybe<Array<Scalars['String']>>;
  vault_contains?: InputMaybe<Scalars['String']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_not_contains?: InputMaybe<Scalars['String']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_starts_with?: InputMaybe<Scalars['String']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_starts_with?: InputMaybe<Scalars['String']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_ends_with?: InputMaybe<Scalars['String']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_?: InputMaybe<Vault_filter>;
  debtIncrease?: InputMaybe<Scalars['BigInt']>;
  debtIncrease_not?: InputMaybe<Scalars['BigInt']>;
  debtIncrease_gt?: InputMaybe<Scalars['BigInt']>;
  debtIncrease_lt?: InputMaybe<Scalars['BigInt']>;
  debtIncrease_gte?: InputMaybe<Scalars['BigInt']>;
  debtIncrease_lte?: InputMaybe<Scalars['BigInt']>;
  debtIncrease_in?: InputMaybe<Array<Scalars['BigInt']>>;
  debtIncrease_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DebtMintedEntity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DebtMintedEntity_filter>>>;
};

export type DebtMintedEntity_orderBy =
  | 'id'
  | 'vault'
  | 'vault__id'
  | 'vault__vaultNormalizedDebt'
  | 'debtIncrease';

export type Deposit = {
  id: Scalars['String'];
  vault: Vault;
  uniV3Position: Scalars['BigInt'];
};

export type Deposit_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault?: InputMaybe<Scalars['String']>;
  vault_not?: InputMaybe<Scalars['String']>;
  vault_gt?: InputMaybe<Scalars['String']>;
  vault_lt?: InputMaybe<Scalars['String']>;
  vault_gte?: InputMaybe<Scalars['String']>;
  vault_lte?: InputMaybe<Scalars['String']>;
  vault_in?: InputMaybe<Array<Scalars['String']>>;
  vault_not_in?: InputMaybe<Array<Scalars['String']>>;
  vault_contains?: InputMaybe<Scalars['String']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_not_contains?: InputMaybe<Scalars['String']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_starts_with?: InputMaybe<Scalars['String']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_starts_with?: InputMaybe<Scalars['String']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_ends_with?: InputMaybe<Scalars['String']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_?: InputMaybe<Vault_filter>;
  uniV3Position?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_not?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_gt?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_lt?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_gte?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_lte?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_in?: InputMaybe<Array<Scalars['BigInt']>>;
  uniV3Position_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Deposit_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_filter>>>;
};

export type Deposit_orderBy =
  | 'id'
  | 'vault'
  | 'vault__id'
  | 'vault__vaultNormalizedDebt'
  | 'uniV3Position';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type PoolInfo = {
  id: Scalars['String'];
  liquidationThreshold: Scalars['BigInt'];
  borrowThreshold: Scalars['BigInt'];
  minWidth: Scalars['Int'];
};

export type PoolInfo_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidationThreshold?: InputMaybe<Scalars['BigInt']>;
  liquidationThreshold_not?: InputMaybe<Scalars['BigInt']>;
  liquidationThreshold_gt?: InputMaybe<Scalars['BigInt']>;
  liquidationThreshold_lt?: InputMaybe<Scalars['BigInt']>;
  liquidationThreshold_gte?: InputMaybe<Scalars['BigInt']>;
  liquidationThreshold_lte?: InputMaybe<Scalars['BigInt']>;
  liquidationThreshold_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidationThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  borrowThreshold?: InputMaybe<Scalars['BigInt']>;
  borrowThreshold_not?: InputMaybe<Scalars['BigInt']>;
  borrowThreshold_gt?: InputMaybe<Scalars['BigInt']>;
  borrowThreshold_lt?: InputMaybe<Scalars['BigInt']>;
  borrowThreshold_gte?: InputMaybe<Scalars['BigInt']>;
  borrowThreshold_lte?: InputMaybe<Scalars['BigInt']>;
  borrowThreshold_in?: InputMaybe<Array<Scalars['BigInt']>>;
  borrowThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minWidth?: InputMaybe<Scalars['Int']>;
  minWidth_not?: InputMaybe<Scalars['Int']>;
  minWidth_gt?: InputMaybe<Scalars['Int']>;
  minWidth_lt?: InputMaybe<Scalars['Int']>;
  minWidth_gte?: InputMaybe<Scalars['Int']>;
  minWidth_lte?: InputMaybe<Scalars['Int']>;
  minWidth_in?: InputMaybe<Array<Scalars['Int']>>;
  minWidth_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolInfo_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PoolInfo_filter>>>;
};

export type PoolInfo_orderBy =
  | 'id'
  | 'liquidationThreshold'
  | 'borrowThreshold'
  | 'minWidth';

export type Query = {
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
  debtMintedEntity?: Maybe<DebtMintedEntity>;
  debtMintedEntities: Array<DebtMintedEntity>;
  debtBurnedEntity?: Maybe<DebtBurnedEntity>;
  debtBurnedEntities: Array<DebtBurnedEntity>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: Array<Withdrawal>;
  poolInfo?: Maybe<PoolInfo>;
  poolInfos: Array<PoolInfo>;
  uniV3Position?: Maybe<UniV3Position>;
  uniV3Positions: Array<UniV3Position>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryvaultArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvaultsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vault_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vault_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydebtMintedEntityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydebtMintedEntitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DebtMintedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DebtMintedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydebtBurnedEntityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydebtBurnedEntitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DebtBurnedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DebtBurnedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepositArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepositsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerywithdrawalArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerywithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdrawal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdrawal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypoolInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuniV3PositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuniV3PositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniV3Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UniV3Position_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
  debtMintedEntity?: Maybe<DebtMintedEntity>;
  debtMintedEntities: Array<DebtMintedEntity>;
  debtBurnedEntity?: Maybe<DebtBurnedEntity>;
  debtBurnedEntities: Array<DebtBurnedEntity>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: Array<Withdrawal>;
  poolInfo?: Maybe<PoolInfo>;
  poolInfos: Array<PoolInfo>;
  uniV3Position?: Maybe<UniV3Position>;
  uniV3Positions: Array<UniV3Position>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionvaultArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvaultsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vault_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vault_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondebtMintedEntityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondebtMintedEntitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DebtMintedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DebtMintedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondebtBurnedEntityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondebtBurnedEntitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DebtBurnedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DebtBurnedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepositArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepositsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionwithdrawalArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionwithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdrawal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Withdrawal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpoolInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PoolInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuniV3PositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuniV3PositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniV3Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UniV3Position_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type UniV3Position = {
  id: Scalars['String'];
  pool: PoolInfo;
  vault: Vault;
  liquidity: Scalars['BigInt'];
  token0: Scalars['Bytes'];
  token1: Scalars['Bytes'];
  amount0: Scalars['BigInt'];
  amount1: Scalars['BigInt'];
  tickLower: Scalars['Int'];
  tickUpper: Scalars['Int'];
};

export type UniV3Position_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool?: InputMaybe<Scalars['String']>;
  pool_not?: InputMaybe<Scalars['String']>;
  pool_gt?: InputMaybe<Scalars['String']>;
  pool_lt?: InputMaybe<Scalars['String']>;
  pool_gte?: InputMaybe<Scalars['String']>;
  pool_lte?: InputMaybe<Scalars['String']>;
  pool_in?: InputMaybe<Array<Scalars['String']>>;
  pool_not_in?: InputMaybe<Array<Scalars['String']>>;
  pool_contains?: InputMaybe<Scalars['String']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_not_contains?: InputMaybe<Scalars['String']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_starts_with?: InputMaybe<Scalars['String']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_starts_with?: InputMaybe<Scalars['String']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_ends_with?: InputMaybe<Scalars['String']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<PoolInfo_filter>;
  vault?: InputMaybe<Scalars['String']>;
  vault_not?: InputMaybe<Scalars['String']>;
  vault_gt?: InputMaybe<Scalars['String']>;
  vault_lt?: InputMaybe<Scalars['String']>;
  vault_gte?: InputMaybe<Scalars['String']>;
  vault_lte?: InputMaybe<Scalars['String']>;
  vault_in?: InputMaybe<Array<Scalars['String']>>;
  vault_not_in?: InputMaybe<Array<Scalars['String']>>;
  vault_contains?: InputMaybe<Scalars['String']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_not_contains?: InputMaybe<Scalars['String']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_starts_with?: InputMaybe<Scalars['String']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_starts_with?: InputMaybe<Scalars['String']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_ends_with?: InputMaybe<Scalars['String']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_?: InputMaybe<Vault_filter>;
  liquidity?: InputMaybe<Scalars['BigInt']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token0?: InputMaybe<Scalars['Bytes']>;
  token0_not?: InputMaybe<Scalars['Bytes']>;
  token0_gt?: InputMaybe<Scalars['Bytes']>;
  token0_lt?: InputMaybe<Scalars['Bytes']>;
  token0_gte?: InputMaybe<Scalars['Bytes']>;
  token0_lte?: InputMaybe<Scalars['Bytes']>;
  token0_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token0_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token0_contains?: InputMaybe<Scalars['Bytes']>;
  token0_not_contains?: InputMaybe<Scalars['Bytes']>;
  token1?: InputMaybe<Scalars['Bytes']>;
  token1_not?: InputMaybe<Scalars['Bytes']>;
  token1_gt?: InputMaybe<Scalars['Bytes']>;
  token1_lt?: InputMaybe<Scalars['Bytes']>;
  token1_gte?: InputMaybe<Scalars['Bytes']>;
  token1_lte?: InputMaybe<Scalars['Bytes']>;
  token1_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token1_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token1_contains?: InputMaybe<Scalars['Bytes']>;
  token1_not_contains?: InputMaybe<Scalars['Bytes']>;
  amount0?: InputMaybe<Scalars['BigInt']>;
  amount0_not?: InputMaybe<Scalars['BigInt']>;
  amount0_gt?: InputMaybe<Scalars['BigInt']>;
  amount0_lt?: InputMaybe<Scalars['BigInt']>;
  amount0_gte?: InputMaybe<Scalars['BigInt']>;
  amount0_lte?: InputMaybe<Scalars['BigInt']>;
  amount0_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount1?: InputMaybe<Scalars['BigInt']>;
  amount1_not?: InputMaybe<Scalars['BigInt']>;
  amount1_gt?: InputMaybe<Scalars['BigInt']>;
  amount1_lt?: InputMaybe<Scalars['BigInt']>;
  amount1_gte?: InputMaybe<Scalars['BigInt']>;
  amount1_lte?: InputMaybe<Scalars['BigInt']>;
  amount1_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tickLower?: InputMaybe<Scalars['Int']>;
  tickLower_not?: InputMaybe<Scalars['Int']>;
  tickLower_gt?: InputMaybe<Scalars['Int']>;
  tickLower_lt?: InputMaybe<Scalars['Int']>;
  tickLower_gte?: InputMaybe<Scalars['Int']>;
  tickLower_lte?: InputMaybe<Scalars['Int']>;
  tickLower_in?: InputMaybe<Array<Scalars['Int']>>;
  tickLower_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tickUpper?: InputMaybe<Scalars['Int']>;
  tickUpper_not?: InputMaybe<Scalars['Int']>;
  tickUpper_gt?: InputMaybe<Scalars['Int']>;
  tickUpper_lt?: InputMaybe<Scalars['Int']>;
  tickUpper_gte?: InputMaybe<Scalars['Int']>;
  tickUpper_lte?: InputMaybe<Scalars['Int']>;
  tickUpper_in?: InputMaybe<Array<Scalars['Int']>>;
  tickUpper_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UniV3Position_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UniV3Position_filter>>>;
};

export type UniV3Position_orderBy =
  | 'id'
  | 'pool'
  | 'pool__id'
  | 'pool__liquidationThreshold'
  | 'pool__borrowThreshold'
  | 'pool__minWidth'
  | 'vault'
  | 'vault__id'
  | 'vault__vaultNormalizedDebt'
  | 'liquidity'
  | 'token0'
  | 'token1'
  | 'amount0'
  | 'amount1'
  | 'tickLower'
  | 'tickUpper';

export type Vault = {
  id: Scalars['String'];
  vaultNormalizedDebt: Scalars['BigInt'];
  uniV3Positions: Array<UniV3Position>;
};


export type VaultuniV3PositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniV3Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UniV3Position_filter>;
};

export type Vault_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vaultNormalizedDebt?: InputMaybe<Scalars['BigInt']>;
  vaultNormalizedDebt_not?: InputMaybe<Scalars['BigInt']>;
  vaultNormalizedDebt_gt?: InputMaybe<Scalars['BigInt']>;
  vaultNormalizedDebt_lt?: InputMaybe<Scalars['BigInt']>;
  vaultNormalizedDebt_gte?: InputMaybe<Scalars['BigInt']>;
  vaultNormalizedDebt_lte?: InputMaybe<Scalars['BigInt']>;
  vaultNormalizedDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  vaultNormalizedDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  uniV3Positions_?: InputMaybe<UniV3Position_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Vault_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Vault_filter>>>;
};

export type Vault_orderBy =
  | 'id'
  | 'vaultNormalizedDebt'
  | 'uniV3Positions';

export type Withdrawal = {
  id: Scalars['String'];
  vault: Vault;
  uniV3Position: Scalars['BigInt'];
};

export type Withdrawal_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault?: InputMaybe<Scalars['String']>;
  vault_not?: InputMaybe<Scalars['String']>;
  vault_gt?: InputMaybe<Scalars['String']>;
  vault_lt?: InputMaybe<Scalars['String']>;
  vault_gte?: InputMaybe<Scalars['String']>;
  vault_lte?: InputMaybe<Scalars['String']>;
  vault_in?: InputMaybe<Array<Scalars['String']>>;
  vault_not_in?: InputMaybe<Array<Scalars['String']>>;
  vault_contains?: InputMaybe<Scalars['String']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_not_contains?: InputMaybe<Scalars['String']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vault_starts_with?: InputMaybe<Scalars['String']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_starts_with?: InputMaybe<Scalars['String']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vault_ends_with?: InputMaybe<Scalars['String']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vault_?: InputMaybe<Vault_filter>;
  uniV3Position?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_not?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_gt?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_lt?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_gte?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_lte?: InputMaybe<Scalars['BigInt']>;
  uniV3Position_in?: InputMaybe<Array<Scalars['BigInt']>>;
  uniV3Position_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Withdrawal_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Withdrawal_filter>>>;
};

export type Withdrawal_orderBy =
  | 'id'
  | 'vault'
  | 'vault__id'
  | 'vault__vaultNormalizedDebt'
  | 'uniV3Position';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  vault: InContextSdkMethod<Query['vault'], QueryvaultArgs, MeshContext>,
  /** null **/
  vaults: InContextSdkMethod<Query['vaults'], QueryvaultsArgs, MeshContext>,
  /** null **/
  debtMintedEntity: InContextSdkMethod<Query['debtMintedEntity'], QuerydebtMintedEntityArgs, MeshContext>,
  /** null **/
  debtMintedEntities: InContextSdkMethod<Query['debtMintedEntities'], QuerydebtMintedEntitiesArgs, MeshContext>,
  /** null **/
  debtBurnedEntity: InContextSdkMethod<Query['debtBurnedEntity'], QuerydebtBurnedEntityArgs, MeshContext>,
  /** null **/
  debtBurnedEntities: InContextSdkMethod<Query['debtBurnedEntities'], QuerydebtBurnedEntitiesArgs, MeshContext>,
  /** null **/
  deposit: InContextSdkMethod<Query['deposit'], QuerydepositArgs, MeshContext>,
  /** null **/
  deposits: InContextSdkMethod<Query['deposits'], QuerydepositsArgs, MeshContext>,
  /** null **/
  withdrawal: InContextSdkMethod<Query['withdrawal'], QuerywithdrawalArgs, MeshContext>,
  /** null **/
  withdrawals: InContextSdkMethod<Query['withdrawals'], QuerywithdrawalsArgs, MeshContext>,
  /** null **/
  poolInfo: InContextSdkMethod<Query['poolInfo'], QuerypoolInfoArgs, MeshContext>,
  /** null **/
  poolInfos: InContextSdkMethod<Query['poolInfos'], QuerypoolInfosArgs, MeshContext>,
  /** null **/
  uniV3Position: InContextSdkMethod<Query['uniV3Position'], QueryuniV3PositionArgs, MeshContext>,
  /** null **/
  uniV3Positions: InContextSdkMethod<Query['uniV3Positions'], QueryuniV3PositionsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  vault: InContextSdkMethod<Subscription['vault'], SubscriptionvaultArgs, MeshContext>,
  /** null **/
  vaults: InContextSdkMethod<Subscription['vaults'], SubscriptionvaultsArgs, MeshContext>,
  /** null **/
  debtMintedEntity: InContextSdkMethod<Subscription['debtMintedEntity'], SubscriptiondebtMintedEntityArgs, MeshContext>,
  /** null **/
  debtMintedEntities: InContextSdkMethod<Subscription['debtMintedEntities'], SubscriptiondebtMintedEntitiesArgs, MeshContext>,
  /** null **/
  debtBurnedEntity: InContextSdkMethod<Subscription['debtBurnedEntity'], SubscriptiondebtBurnedEntityArgs, MeshContext>,
  /** null **/
  debtBurnedEntities: InContextSdkMethod<Subscription['debtBurnedEntities'], SubscriptiondebtBurnedEntitiesArgs, MeshContext>,
  /** null **/
  deposit: InContextSdkMethod<Subscription['deposit'], SubscriptiondepositArgs, MeshContext>,
  /** null **/
  deposits: InContextSdkMethod<Subscription['deposits'], SubscriptiondepositsArgs, MeshContext>,
  /** null **/
  withdrawal: InContextSdkMethod<Subscription['withdrawal'], SubscriptionwithdrawalArgs, MeshContext>,
  /** null **/
  withdrawals: InContextSdkMethod<Subscription['withdrawals'], SubscriptionwithdrawalsArgs, MeshContext>,
  /** null **/
  poolInfo: InContextSdkMethod<Subscription['poolInfo'], SubscriptionpoolInfoArgs, MeshContext>,
  /** null **/
  poolInfos: InContextSdkMethod<Subscription['poolInfos'], SubscriptionpoolInfosArgs, MeshContext>,
  /** null **/
  uniV3Position: InContextSdkMethod<Subscription['uniV3Position'], SubscriptionuniV3PositionArgs, MeshContext>,
  /** null **/
  uniV3Positions: InContextSdkMethod<Subscription['uniV3Positions'], SubscriptionuniV3PositionsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["cdp"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
