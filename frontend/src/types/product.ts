
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

/**
 * DPP Model parsed from raw DPP data.
 */
export type DppData = {
  billOfMaterial?: Map<string, string>;
  federationAddr: string;
  name: string;
  objectId: string;
  imageUrl: string;
  manufacturer: string;
  serialNumber: string;
  timestamp: string;
};

