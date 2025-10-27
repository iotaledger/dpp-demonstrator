import { bcs } from '@iota/bcs'
import { Transaction } from '@iota/iota-sdk/transactions'

interface DppMoveCallParams {
  dppId: string
  federationAddr: string
  issuerRole: string
  entryDataKeys: string[]
  entryDataValues: string[]
  whitelistId: string
  vaultId: string
}

interface RewardAuthParams {
  adminCapId: string
  whitelistId: string
  recepient: string
}

export function createDppTx(
  movePkg: string,
  { dppId, federationAddr, issuerRole, entryDataKeys, entryDataValues, whitelistId, vaultId }: DppMoveCallParams
) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${movePkg}::app::log_entry_data`,
    arguments: [
      tx.object(dppId),
      tx.object(federationAddr),
      tx.pure.string(issuerRole),
      tx.pure(bcs.vector(bcs.string()).serialize(entryDataKeys)),
      tx.pure(bcs.vector(bcs.string()).serialize(entryDataValues)),
      tx.object('0x6'),
      tx.object(whitelistId),
      tx.object(vaultId),
    ],
  })

  return tx
}

export function createRewardAuthTx(movePkg: string, { recepient, adminCapId, whitelistId }: RewardAuthParams) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${movePkg}::rewards::authorize_address`,
    arguments: [tx.object(adminCapId), tx.object(whitelistId), tx.pure.address(recepient)],
  })

  return tx
}
