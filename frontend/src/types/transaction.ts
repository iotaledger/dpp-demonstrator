/**
 * Represents a single service entry in a product's lifecycle history
 */
export interface ServiceEntry {
  /** The unique product object ID which entry relates to */
  productId: string;
  /** The unique blockchain object ID of this service entry */
  entryId: string;
  /** The version number of this service entry */
  version: string;
  /** The cryptographic digest/hash of this entry */
  digest: string;
  /** The cryptographic hash of block transaction that triggered this event */
  txBlock: string;
  /** The type of service performed (e.g., "Inspection", "Repair", "Maintenance") */
  serviceType: string;
  /** The description or details of the service performed */
  serviceDescription: string;
  /** The health score set by the technician */
  healthScore: string | null;
  /** The feedback message from the technician */
  findings: string | null;
  /** The blockchain address of who performed the service */
  issuerAddress: string;
  /** The role of the service provider (e.g., "Repairer", "Manufacturer") */
  issuerRole: string;
  /** The timestamp when the service was performed (milliseconds) */
  timestamp: string;
  /** The app package ID where this service entry is defined */
  packageId: string | null;
  rewardBalance: string;
  /** The status of transaction that determines effectiveness */
  status?: string;
}
