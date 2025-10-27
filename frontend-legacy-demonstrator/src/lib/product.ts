export function getSerialNumber(content: Dpp | null): string | undefined {
  return content?.fields.serial_number
}

export function getFederationAddress(content: Dpp | null): string | undefined {
  return content?.fields.federation_addr
}

function getBillOfMaterials(content: Dpp | null): Record<string, string> | undefined {
  const entries = content?.fields.bill_of_materials.fields.contents
  if (!entries) {
    return undefined
  }
  const result: Record<string, string> = {}

  for (const entry of entries) {
    result[entry.fields.key] = entry.fields.value
  }

  return result
}

export function getDppData(content: Dpp | null): DppData | undefined {
  if (!content) return undefined

  const billOfMaterial = getBillOfMaterials(content) ?? {}
  const { id, image_url, manufacturer, timestamp, serial_number, federation_addr, name } = content.fields

  return {
    billOfMaterial,
    federationAddr: federation_addr,
    name,
    objectId: id.id,
    imageUrl: image_url,
    manufacturer,
    serialNumber: serial_number,
    timestamp,
  }
}

export type DppData = {
  billOfMaterial: Record<string, string>
  federationAddr: string
  name: string
  objectId: string
  imageUrl: string
  manufacturer: string
  serialNumber: string
  timestamp: string
}

type VecMapEntry = {
  type: string
  fields: {
    key: string
    value: string
  }
}

type BillOfMaterials = {
  type: string
  fields: {
    contents: VecMapEntry[]
  }
}

type ProductFields = {
  bill_of_materials: BillOfMaterials
  federation_addr: string
  id: {
    id: string
  }
  name: string
  image_url: string
  manufacturer: string
  serial_number: string
  timestamp: string
}

export type Dpp = {
  dataType: 'moveObject'
  type: string
  fields: ProductFields
}
