// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import AutoPaginationTransform from "@graphprotocol/client-auto-pagination";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { CdpTypes } from './sources/cdp/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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
  Int8: any;
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
  uniV3Positions?: InputMaybe<Array<Scalars['String']>>;
  uniV3Positions_not?: InputMaybe<Array<Scalars['String']>>;
  uniV3Positions_contains?: InputMaybe<Array<Scalars['String']>>;
  uniV3Positions_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  uniV3Positions_not_contains?: InputMaybe<Array<Scalars['String']>>;
  uniV3Positions_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  DebtBurnedEntity: ResolverTypeWrapper<DebtBurnedEntity>;
  DebtBurnedEntity_filter: DebtBurnedEntity_filter;
  DebtBurnedEntity_orderBy: DebtBurnedEntity_orderBy;
  DebtMintedEntity: ResolverTypeWrapper<DebtMintedEntity>;
  DebtMintedEntity_filter: DebtMintedEntity_filter;
  DebtMintedEntity_orderBy: DebtMintedEntity_orderBy;
  Deposit: ResolverTypeWrapper<Deposit>;
  Deposit_filter: Deposit_filter;
  Deposit_orderBy: Deposit_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']>;
  OrderDirection: OrderDirection;
  PoolInfo: ResolverTypeWrapper<PoolInfo>;
  PoolInfo_filter: PoolInfo_filter;
  PoolInfo_orderBy: PoolInfo_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  UniV3Position: ResolverTypeWrapper<UniV3Position>;
  UniV3Position_filter: UniV3Position_filter;
  UniV3Position_orderBy: UniV3Position_orderBy;
  Vault: ResolverTypeWrapper<Vault>;
  Vault_filter: Vault_filter;
  Vault_orderBy: Vault_orderBy;
  Withdrawal: ResolverTypeWrapper<Withdrawal>;
  Withdrawal_filter: Withdrawal_filter;
  Withdrawal_orderBy: Withdrawal_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  DebtBurnedEntity: DebtBurnedEntity;
  DebtBurnedEntity_filter: DebtBurnedEntity_filter;
  DebtMintedEntity: DebtMintedEntity;
  DebtMintedEntity_filter: DebtMintedEntity_filter;
  Deposit: Deposit;
  Deposit_filter: Deposit_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Int8: Scalars['Int8'];
  PoolInfo: PoolInfo;
  PoolInfo_filter: PoolInfo_filter;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  UniV3Position: UniV3Position;
  UniV3Position_filter: UniV3Position_filter;
  Vault: Vault;
  Vault_filter: Vault_filter;
  Withdrawal: Withdrawal;
  Withdrawal_filter: Withdrawal_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type DebtBurnedEntityResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DebtBurnedEntity'] = ResolversParentTypes['DebtBurnedEntity']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vault?: Resolver<ResolversTypes['Vault'], ParentType, ContextType>;
  debtDecrease?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DebtMintedEntityResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DebtMintedEntity'] = ResolversParentTypes['DebtMintedEntity']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vault?: Resolver<ResolversTypes['Vault'], ParentType, ContextType>;
  debtIncrease?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DepositResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Deposit'] = ResolversParentTypes['Deposit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vault?: Resolver<ResolversTypes['Vault'], ParentType, ContextType>;
  uniV3Position?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type PoolInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PoolInfo'] = ResolversParentTypes['PoolInfo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  liquidationThreshold?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  borrowThreshold?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  minWidth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  vault?: Resolver<Maybe<ResolversTypes['Vault']>, ParentType, ContextType, RequireFields<QueryvaultArgs, 'id' | 'subgraphError'>>;
  vaults?: Resolver<Array<ResolversTypes['Vault']>, ParentType, ContextType, RequireFields<QueryvaultsArgs, 'skip' | 'first' | 'subgraphError'>>;
  debtMintedEntity?: Resolver<Maybe<ResolversTypes['DebtMintedEntity']>, ParentType, ContextType, RequireFields<QuerydebtMintedEntityArgs, 'id' | 'subgraphError'>>;
  debtMintedEntities?: Resolver<Array<ResolversTypes['DebtMintedEntity']>, ParentType, ContextType, RequireFields<QuerydebtMintedEntitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  debtBurnedEntity?: Resolver<Maybe<ResolversTypes['DebtBurnedEntity']>, ParentType, ContextType, RequireFields<QuerydebtBurnedEntityArgs, 'id' | 'subgraphError'>>;
  debtBurnedEntities?: Resolver<Array<ResolversTypes['DebtBurnedEntity']>, ParentType, ContextType, RequireFields<QuerydebtBurnedEntitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  deposit?: Resolver<Maybe<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<QuerydepositArgs, 'id' | 'subgraphError'>>;
  deposits?: Resolver<Array<ResolversTypes['Deposit']>, ParentType, ContextType, RequireFields<QuerydepositsArgs, 'skip' | 'first' | 'subgraphError'>>;
  withdrawal?: Resolver<Maybe<ResolversTypes['Withdrawal']>, ParentType, ContextType, RequireFields<QuerywithdrawalArgs, 'id' | 'subgraphError'>>;
  withdrawals?: Resolver<Array<ResolversTypes['Withdrawal']>, ParentType, ContextType, RequireFields<QuerywithdrawalsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolInfo?: Resolver<Maybe<ResolversTypes['PoolInfo']>, ParentType, ContextType, RequireFields<QuerypoolInfoArgs, 'id' | 'subgraphError'>>;
  poolInfos?: Resolver<Array<ResolversTypes['PoolInfo']>, ParentType, ContextType, RequireFields<QuerypoolInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  uniV3Position?: Resolver<Maybe<ResolversTypes['UniV3Position']>, ParentType, ContextType, RequireFields<QueryuniV3PositionArgs, 'id' | 'subgraphError'>>;
  uniV3Positions?: Resolver<Array<ResolversTypes['UniV3Position']>, ParentType, ContextType, RequireFields<QueryuniV3PositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  vault?: SubscriptionResolver<Maybe<ResolversTypes['Vault']>, "vault", ParentType, ContextType, RequireFields<SubscriptionvaultArgs, 'id' | 'subgraphError'>>;
  vaults?: SubscriptionResolver<Array<ResolversTypes['Vault']>, "vaults", ParentType, ContextType, RequireFields<SubscriptionvaultsArgs, 'skip' | 'first' | 'subgraphError'>>;
  debtMintedEntity?: SubscriptionResolver<Maybe<ResolversTypes['DebtMintedEntity']>, "debtMintedEntity", ParentType, ContextType, RequireFields<SubscriptiondebtMintedEntityArgs, 'id' | 'subgraphError'>>;
  debtMintedEntities?: SubscriptionResolver<Array<ResolversTypes['DebtMintedEntity']>, "debtMintedEntities", ParentType, ContextType, RequireFields<SubscriptiondebtMintedEntitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  debtBurnedEntity?: SubscriptionResolver<Maybe<ResolversTypes['DebtBurnedEntity']>, "debtBurnedEntity", ParentType, ContextType, RequireFields<SubscriptiondebtBurnedEntityArgs, 'id' | 'subgraphError'>>;
  debtBurnedEntities?: SubscriptionResolver<Array<ResolversTypes['DebtBurnedEntity']>, "debtBurnedEntities", ParentType, ContextType, RequireFields<SubscriptiondebtBurnedEntitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  deposit?: SubscriptionResolver<Maybe<ResolversTypes['Deposit']>, "deposit", ParentType, ContextType, RequireFields<SubscriptiondepositArgs, 'id' | 'subgraphError'>>;
  deposits?: SubscriptionResolver<Array<ResolversTypes['Deposit']>, "deposits", ParentType, ContextType, RequireFields<SubscriptiondepositsArgs, 'skip' | 'first' | 'subgraphError'>>;
  withdrawal?: SubscriptionResolver<Maybe<ResolversTypes['Withdrawal']>, "withdrawal", ParentType, ContextType, RequireFields<SubscriptionwithdrawalArgs, 'id' | 'subgraphError'>>;
  withdrawals?: SubscriptionResolver<Array<ResolversTypes['Withdrawal']>, "withdrawals", ParentType, ContextType, RequireFields<SubscriptionwithdrawalsArgs, 'skip' | 'first' | 'subgraphError'>>;
  poolInfo?: SubscriptionResolver<Maybe<ResolversTypes['PoolInfo']>, "poolInfo", ParentType, ContextType, RequireFields<SubscriptionpoolInfoArgs, 'id' | 'subgraphError'>>;
  poolInfos?: SubscriptionResolver<Array<ResolversTypes['PoolInfo']>, "poolInfos", ParentType, ContextType, RequireFields<SubscriptionpoolInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  uniV3Position?: SubscriptionResolver<Maybe<ResolversTypes['UniV3Position']>, "uniV3Position", ParentType, ContextType, RequireFields<SubscriptionuniV3PositionArgs, 'id' | 'subgraphError'>>;
  uniV3Positions?: SubscriptionResolver<Array<ResolversTypes['UniV3Position']>, "uniV3Positions", ParentType, ContextType, RequireFields<SubscriptionuniV3PositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type UniV3PositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UniV3Position'] = ResolversParentTypes['UniV3Position']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pool?: Resolver<ResolversTypes['PoolInfo'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount0?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  amount1?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tickLower?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tickUpper?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VaultResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Vault'] = ResolversParentTypes['Vault']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vaultNormalizedDebt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  uniV3Positions?: Resolver<Array<ResolversTypes['UniV3Position']>, ParentType, ContextType, RequireFields<VaultuniV3PositionsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WithdrawalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Withdrawal'] = ResolversParentTypes['Withdrawal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vault?: Resolver<ResolversTypes['Vault'], ParentType, ContextType>;
  uniV3Position?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  DebtBurnedEntity?: DebtBurnedEntityResolvers<ContextType>;
  DebtMintedEntity?: DebtMintedEntityResolvers<ContextType>;
  Deposit?: DepositResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  PoolInfo?: PoolInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UniV3Position?: UniV3PositionResolvers<ContextType>;
  Vault?: VaultResolvers<ContextType>;
  Withdrawal?: WithdrawalResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = CdpTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/cdp/introspectionSchema":
      return import("./sources/cdp/introspectionSchema") as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const cdpTransforms = [];
const additionalTypeDefs = [] as any[];
const cdpHandler = new GraphqlHandler({
              name: "cdp",
              config: {"endpoint":"https://api.thegraph.com/subgraphs/name/zkbob/cdp-nft-polygon"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("cdp"),
              logger: logger.child("cdp"),
              importFn,
            });
cdpTransforms[0] = new AutoPaginationTransform({
                  apiName: "cdp",
                  config: {"validateSchema":true,"limitOfRecords":100},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
sources[0] = {
          name: 'cdp',
          handler: cdpHandler,
          transforms: cdpTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: VaultsDocument,
        get rawSDL() {
          return printWithCache(VaultsDocument);
        },
        location: 'VaultsDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler(): MeshHTTPHandler<MeshContext> {
  return createMeshHTTPHandler<MeshContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type VaultsQueryVariables = Exact<{ [key: string]: never; }>;


export type VaultsQuery = { vaults: Array<(
    Pick<Vault, 'id' | 'vaultNormalizedDebt'>
    & { uniV3Positions: Array<(
      Pick<UniV3Position, 'liquidity' | 'tickLower' | 'tickUpper' | 'token0' | 'token1' | 'amount0' | 'amount1'>
      & { pool: Pick<PoolInfo, 'liquidationThreshold'> }
    )> }
  )> };


export const VaultsDocument = gql`
    query Vaults {
  vaults(where: {vaultNormalizedDebt_gt: "0"}) {
    id
    vaultNormalizedDebt
    uniV3Positions {
      liquidity
      tickLower
      tickUpper
      token0
      token1
      amount0
      amount1
      pool {
        liquidationThreshold
      }
    }
  }
}
    ` as unknown as DocumentNode<VaultsQuery, VaultsQueryVariables>;


export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    Vaults(variables?: VaultsQueryVariables, options?: C): Promise<VaultsQuery> {
      return requester<VaultsQuery, VaultsQueryVariables>(VaultsDocument, variables, options) as Promise<VaultsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;