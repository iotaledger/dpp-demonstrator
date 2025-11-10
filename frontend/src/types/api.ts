import { type TransactionEffects } from '@iota/iota-sdk/client';
import { type ObjectRef, type Transaction } from '@iota/iota-sdk/transactions';

export interface ReserveGasResult {
  sponsor_address: string;
  reservation_id: number;
  gas_coins: ObjectRef[];
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number;
}

export interface RouteRequestBody {
  user_addr: string;
  user_role: string;
  federation_addr: string;
}

export interface SponsorRequestReserveGasResult {
  sponsor_address: string;
  reservation_id: number;
  gas_coins: ObjectRef[];
}

export interface CreateNotarizationEventTransactionArgs {
  accountAddress: string;
  gas: ReserveGasResultResponse;
  issuerRole: string;
  entryDataKeys: string[];
  entryDataValues: string[];
}

export type { ObjectRef, Transaction, TransactionEffects };

export interface ReserveGasResult {
  sponsor_address: string;
  reservation_id: number;
  gas_coins: ObjectRef[];
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number;
}
