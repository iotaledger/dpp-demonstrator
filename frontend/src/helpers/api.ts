
import {
  AUDIT_TRAIL_PKG_ID,
  DPP_ID,
  FEDERATION_ID,
  VAULT_ID,
  WHITELIST_ID,
} from '@/utils/constants';

import { createDppTx } from './transaction';
import type { CreateNotarizationEventTransactionArgs, ReserveGasResultResponse, Transaction } from '@/types/api';

export async function createAccreditation(
  federationAddress: string,
  accountAddress: string,
  role: string,
) {
  // TODO: validate inputs
  return fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_addr: accountAddress,
      user_role: role,
      federation_addr: federationAddress,
    }),
  })
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
        result: await res.json(),
      };
    })
    .catch((err) => {
      return {
        isSuccess: false,
        isError: err,
        result: null,
      };
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
        result: (await res.json()) as ReserveGasResultResponse,
      };
    })
    .catch((err) => {
      return {
        isSuccess: false,
        isError: new Error('Sponsor gas reservation failed', { cause: err }),
        result: null,
      };
    });
}

export function createNotarizationEventTransaction({
  accountAddress,
  gas,
  issuerRole,
  entryDataKeys,
  entryDataValues,
}: CreateNotarizationEventTransactionArgs): Transaction {
  // TODO: validate inputs
  const tx = createDppTx(AUDIT_TRAIL_PKG_ID!, {
    dppId: DPP_ID,
    federationAddr: FEDERATION_ID!,
    issuerRole,
    entryDataKeys,
    entryDataValues,
    whitelistId: WHITELIST_ID!,
    vaultId: VAULT_ID!,
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
  })
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text();
        return {
          isSuccess: false,
          isError: new Error(`Transaction execution failed: ${errText}`),
          result: null,
        };
      }

      const result = await res.json();
      if (result.effects.status.status === 'failure') {
        return {
          isSuccess: false,
          isError: new Error(`Transaction execution failed: ${result.effects.status.error}`),
          result: null,
        };
      }

      return {
        isSuccess: true,
        isError: false,
        result,
      };
    })
    .catch((err) => {
      return {
        isSuccess: false,
        isError: err,
        result: null,
      };
    });
}
