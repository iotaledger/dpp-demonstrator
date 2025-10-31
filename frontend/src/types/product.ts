
/**
 * A Move structure holding a key-value pair entry.
 */
export type VecMapEntry = {
  type: string;
  fields: {
    key: string;
    value: string;
  };
};

/**
 * A Move structure holding a key-value pair collection.
 */
export type BillOfMaterials = {
  type: string;
  fields: {
    contents: VecMapEntry[];
  };
};

/**
 * Known property names registered in the target product on Bill Of Materials.
 */
export const BillOfMaterialProperties = {
  ManufacturerName: 'Manufacturer Name',
  Version: 'Version',
  Housing: 'Housing',
  Cells: 'Cells',
  BatteryPack: 'Battery Pack',
  ExpectedLifespan: 'Expected Lifespan',
  Capacity: 'Capacity',
  ManufacturingDate: 'Manufacturing Date',
  Model: 'Model',
};

/**
 * A Move structure with custom properties.
 */
export type ProductFields = {
  bill_of_materials: BillOfMaterials;
  federation_addr: string;
  id: {
    id: string;
  };
  name: string;
  image_url: string;
  manufacturer: string;
  serial_number: string;
  timestamp: string;
};

/**
 * Iota parsed data holding a Move object content.
 */
export type Dpp = {
  dataType: 'moveObject';
  type: string;
  fields: ProductFields;
};

export class BillOfMaterial {
  _map: Map<string, string>;
  constructor(bomMap: Map<string, string>) {
    this._map = bomMap;
  }

  get manufacturerName() { return BillOfMaterialProperties.ManufacturerName; }
  get version() { return BillOfMaterialProperties.Version; }
  get housing() { return BillOfMaterialProperties.Housing; }
  get cells() { return BillOfMaterialProperties.Cells; }
  get batteryPack() { return BillOfMaterialProperties.BatteryPack; }
  get expectedLifespan() { return BillOfMaterialProperties.ExpectedLifespan; }
  get capacity() { return BillOfMaterialProperties.Capacity; }
  get manufacturingDate() { return BillOfMaterialProperties.ManufacturingDate; }
  get model() { return BillOfMaterialProperties.Model; }
}

/**
 * DPP Model parsed from raw DPP data.
 */
export type DppModel = {
  billOfMaterial?: BillOfMaterial;
  federationAddr: string;
  name: string;
  objectId: string;
  imageUrl: string;
  manufacturer: string;
  serialNumber: string;
  timestamp: string;
};

