/**
 * NOTE: This file is a copy of the `frontend/src/lib/product.ts` from the dpp-demonstrator repository.
 * Therefore, it should be by ported when the time comes to move this project there.
 */

import { type DppModel, type Dpp } from "@/types/product";

export function getSerialNumber(content: Dpp | null): string | undefined {
  return content?.fields.serial_number;
}

export function getFederationAddress(content: Dpp | null): string | undefined {
  return content?.fields.federation_addr;
}

/**
 * NOTE: this function has changed
 */
function getBillOfMaterials(content: Dpp | null): Map<string, string> | undefined {
  // TODO: Some dpp objects doens't have `bill_of_materials` property, which can make it to break,
  // therefore, implement some validation here to avoid silent break in the app
  const entries = content?.fields.bill_of_materials.fields.contents;
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
  return result;
}

export function getDpp(content: Dpp | null): DppModel | undefined {
  if (!content) return undefined;

  const billOfMaterial = getBillOfMaterials(content);
  const { id, image_url, manufacturer, timestamp, serial_number, federation_addr, name } =
    content.fields;

  return {
    billOfMaterial,
    federationAddr: federation_addr,
    name,
    objectId: id.id,
    imageUrl: image_url,
    manufacturer,
    serialNumber: serial_number,
    timestamp,
  };
}
