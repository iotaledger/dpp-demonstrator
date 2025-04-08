import { bcs } from '@iota/bcs'
import { Transaction } from '@iota/iota-sdk/transactions'

const CLOCK = '0x6'

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

export function createNewProductTx(auditTrailPkg: string, federationId: string): Transaction {
  const serialNumber = 'abc-12345'
  const imageUrl =
    'https://assets.xboxservices.com/assets/fa/b8/fab86afd-63d6-45a9-862f-798e5e45cda2.jpg?n=111101_Gallery-0_4_1350x759.jpg'
  const bomKeys = ['Product', 'Manufacturer', 'Battery Pack', 'Plastic Shell', 'Screws and Fasteners', 'Main PCB']
  const bomValues = [
    'Xbox Wireless Controller',
    'Microsoft',
    'Rechargeable lithium-ion battery',
    'ABS injection-molded casing (top and bottom)',
    'Standard Torx screws and internal mounts',
    'Custom printed circuit board with integrated microcontroller',
  ]

  const tx = new Transaction()

  tx.moveCall({
    target: `${auditTrailPkg}::app::new_product`,
    arguments: [
      tx.object(federationId),
      tx.pure.string(serialNumber),
      tx.pure.string(imageUrl),
      tx.pure(bcs.vector(bcs.string()).serialize(bomKeys)),
      tx.pure(bcs.vector(bcs.string()).serialize(bomValues)),
      tx.object(CLOCK),
    ],
  })

  return tx
}
