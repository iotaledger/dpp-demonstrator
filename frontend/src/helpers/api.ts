import { ObjectRef, Transaction } from "@iota/iota-sdk/transactions";
import { createDppTx } from "./transaction";
import { AUDIT_TRAIL_DETAILS, FEDERATION_DETAILS, HAS_NFT_REWARD, PRODUCT_DETAILS, REWARD_POOL_STATUS } from '@/utils/constants';
import { UseMutateAsyncFunction } from "@tanstack/react-query";

// TODO: extract to constants
const PKG_ID = AUDIT_TRAIL_DETAILS.packageId;
const WHITELIST_ID = REWARD_POOL_STATUS.whitelistId;
const VAULT_ID = REWARD_POOL_STATUS.vaultId;

// TODO: Evaluate extraction to central place of types
interface ReserveGasResult {
  sponsor_address: string
  reservation_id: number
  gas_coins: ObjectRef[]
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number
}

export async function createAccreditation(federationAddress: string, accountAddress: string, role: string) {
  // TODO: validate inputs
  return fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_addr: accountAddress,
      user_role: role,
      federation_addr: federationAddress,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      return {
        isSuccess: false,
        isError: res.statusText,
        result: null,
      }
    }

    return {
      isSuccess: res.ok,
      isError: false,
      result: await res.json(),
    }
  }).catch((err) => {
    return {
      isSuccess: false,
      isError: err,
      result: null,
    }
  });
}

export async function getSponsorGas() {
  return fetch('/api/sponsor-request')
    .then(async (res) => {
      if (!res.ok) {
        return {
          isSuccess: false,
          isError: res.statusText,
          result: null,
        };
      }

      return {
        isSuccess: res.ok,
        isError: false,
        result: await res.json() as ReserveGasResultResponse,
      }
    }).catch((err) => {
      return {
        isSuccess: false,
        isError: new Error('Sponsor gas reservation failed', { cause: err }),
        result: null,
      };
    });
}

export interface CreateNotarizationEventTransactionArgs {
  accountAddress: string;
  gas: ReserveGasResultResponse;
  issuerRole: string;
  entryDataKeys: string[];
  entryDataValues: string[]
};

export function createNotarizationEventTransaction({ accountAddress, gas, issuerRole, entryDataKeys, entryDataValues }: CreateNotarizationEventTransactionArgs): Transaction {
  // TODO: validate inputs
  const tx = createDppTx(PKG_ID, {
    dppId: PRODUCT_DETAILS.dppId,
    federationAddr: FEDERATION_DETAILS.federationAddr,
    issuerRole,
    entryDataKeys,
    entryDataValues,
    whitelistId: WHITELIST_ID,
    vaultId: VAULT_ID,
  });

  tx.setSender(accountAddress);
  tx.setGasOwner(gas.sponsor_address);
  tx.setGasPayment(gas.gas_coins);
  tx.setGasBudget(Number(gas.gasBudget));

  return tx;
}

export async function sendTransaction(bytes: string, signature: string, gasReservationId: number) {
  // TODO: validate inputs
  return fetch('/api/send-tx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tx: bytes,
      signature,
      reservation_id: gasReservationId,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      const errText = await res.text()
      return {
        isSuccess: false,
        isError: new Error(`Transaction execution failed: ${errText}`),
        result: null,
      }
    }
    return {
      isSuccess: true,
      isError: false,
      result: await res.json(),
    };
  }).catch((err) => {
    return {
      isSuccess: false,
      isError: err,
      result: null,
    };
  });
}

