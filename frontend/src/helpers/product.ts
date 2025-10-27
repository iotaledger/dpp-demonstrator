/**
 * NOTE: This file is a copy of the `frontend/src/lib/product.ts` from the dpp-demonstrator repository.
 * Therefore, it should be by ported when the time comes to move this project there.
 */

export function getSerialNumber(content: Dpp | null): string | undefined {
  return content?.fields.serial_number
}

export function getFederationAddress(content: Dpp | null): string | undefined {
  return content?.fields.federation_addr
}

/**
 * NOTE: this function has changed
 */
function getBillOfMaterials(content: Dpp | null): Map<string, string> | undefined {
  // TODO: Some dpp objects doens't have `bill_of_materials` property, which can make it to break,
  // therefore, implement some validation here to avoid silent break in the app
  const entries = content?.fields.bill_of_materials.fields.contents
  if (!entries) {
    // TODO: Check engineering principles related to return `undefined` primitive
    //  Wouln'd be better to return null? Returning null now conflicts with type
    //  check, triggering the error  [2322]
    return undefined;
  }
  // Changed from a simple plain object to Map
  const result: Map<string, string> = new Map();

  for (const entry of entries) {
    result.set(entry.fields.key, entry.fields.value);
  }

  // Changes the return type
  return result
}

export function getDppData(content: Dpp | null): DppData | undefined {
  if (!content) return undefined

  const billOfMaterial = getBillOfMaterials(content)
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
  billOfMaterial?: Map<string, string>
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
