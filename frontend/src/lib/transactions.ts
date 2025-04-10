import { bcs } from '@iota/bcs'
import { Transaction } from '@iota/iota-sdk/transactions'

interface DppMoveCallParams {
  dppId: string
  federationAddr: string
  issuerRole: string
  entryDataKeys: string[]
  entryDataValues: string[]
}

export function createDppTx(
  movePkg: string,
  { dppId, federationAddr, issuerRole, entryDataKeys, entryDataValues }: DppMoveCallParams
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
    ],
  })

  return tx
}
