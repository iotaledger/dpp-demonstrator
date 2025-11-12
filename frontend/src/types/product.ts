/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A Move structure holding a key-value pair entry.
 */
export type VecMapEntryData = {
  type: string;
  fields: {
    key: string;
    value: string;
  };
};

/**
 * A Move structure holding a key-value pair collection.
 */
export type BillOfMaterialsData = {
  type: string;
  fields: {
    contents: VecMapEntryData[];
  };
};

/**
 * Known property names registered in the target product on Bill Of Materials.
 */
export const BillOfMaterialsDataProperties = {
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
export type ProductFieldsData = {
  bill_of_materials: BillOfMaterialsData;
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
export type DppData = {
  dataType: 'moveObject';
  type: string;
  fields: ProductFieldsData;
};

export class BillOfMaterials {
  _map: Map<string, string>;
  constructor(bomMap: Map<string, string>) {
    this._map = bomMap;
  }

  get manufacturerName() {
    return this._map.get(BillOfMaterialsDataProperties.ManufacturerName);
  }
  get version() {
    return this._map.get(BillOfMaterialsDataProperties.Version);
  }
  get housing() {
    return this._map.get(BillOfMaterialsDataProperties.Housing);
  }
  get cells() {
    return this._map.get(BillOfMaterialsDataProperties.Cells);
  }
  get batteryPack() {
    return this._map.get(BillOfMaterialsDataProperties.BatteryPack);
  }
  get expectedLifespan() {
    return this._map.get(BillOfMaterialsDataProperties.ExpectedLifespan);
  }
  get capacity() {
    return this._map.get(BillOfMaterialsDataProperties.Capacity);
  }
  get manufacturingDate() {
    return this._map.get(BillOfMaterialsDataProperties.ManufacturingDate);
  }
  get model() {
    return this._map.get(BillOfMaterialsDataProperties.Model);
  }
}

/**
 * DPP Model parsed from raw DPP data.
 */
export type DppModel = {
  billOfMaterials?: BillOfMaterials;
  federationAddr: string;
  name: string;
  objectId: string;
  imageUrl: string;
  manufacturer: string;
  serialNumber: string;
  timestamp: string;
};
