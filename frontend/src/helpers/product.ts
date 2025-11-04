import { type DppModel, type DppData, BillOfMaterials } from "@/types/product";

export function getSerialNumber(content: DppData | null): string | undefined {
  return content?.fields.serial_number;
}

export function getFederationAddress(content: DppData | null): string | undefined {
  return content?.fields.federation_addr;
}

function getBillOfMaterials(content: DppData | null): BillOfMaterials | undefined {
  const billOfMaterials = content?.fields.bill_of_materials;
  if (billOfMaterials == null) {
    return;
  }

  const entries = billOfMaterials.fields.contents;
  if (!entries) {
    return;
  }

  // Changed from a simple plain object to Map
  const result: Map<string, string> = new Map();
  for (const entry of entries) {
    result.set(entry.fields.key, entry.fields.value);
  }

  // Changes the return type
  return new BillOfMaterials(result);
}

export function getDpp(content: DppData | null): DppModel | undefined {
  if (!content) return undefined;

  const billOfMaterials = getBillOfMaterials(content);
  const { id, image_url, manufacturer, timestamp, serial_number, federation_addr, name } =
    content.fields;

  return {
    billOfMaterials,
    federationAddr: federation_addr,
    name,
    objectId: id.id,
    imageUrl: image_url,
    manufacturer,
    serialNumber: serial_number,
    timestamp,
  };
}
