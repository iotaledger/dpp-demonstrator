/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: Learn to use Iota types to replace any */
import { IotaEvent, IotaTransactionBlockResponse, OwnedObjectRef, type PaginatedObjectsResponse } from "@iota/iota-sdk/client";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

/*
Service History Data Structure:
┌─────────────────────────────────────────────────────────────┐
│                  Service History Collection                 │
│ Paginated ProductEntry Objects for DPP Audit Trail          │
├─────────────────────────────────────────────────────────────┤
│ Service Entries Array:                                      │
│ ┌─ Entry 1 (0x8f07f169...)                                  │
│   ├─ Service: "Inspection" → "Test Service"                 │
│   ├─ Issuer: 0x5ddf340c... (Repairer)                       │
│   ├─ Timestamp: 1756128614445                               │
│   └─ Package: 0x1d0b1bdb... (DPP App)                       │
│ ├─ Entry 2 (0xeee8d514...)                                  │
│   ├─ Service: "Inspection" → "Second Test"                  │
│   ├─ Issuer: 0x1f9699f7... (Repairer)                       │
│   └─ Timestamp: 1756129169058                               │
│ └─ Entry N...                                               │
├─────────────────────────────────────────────────────────────┤
│ Indexing Maps:                                              │
│ ├─ By Entry ID → ServiceEntry                               │
│ ├─ By Issuer → [ServiceEntry, ...]                          │
│ ├─ By Service Type → [ServiceEntry, ...]                    │
│ └─ Chronological → [ServiceEntry, ...] (sorted)             │
├─────────────────────────────────────────────────────────────┤
│ Pagination Context:                                         │
│ ├─ Has Next Page: boolean                                   │
│ └─ Next Cursor: objectId for continuation                   │
└─────────────────────────────────────────────────────────────┘

Service History Hierarchy:
Product → Service Events → Provider Documentation → Audit Trail

Service Flow:
Product Lifecycle → Service Performed → Provider Documents → History Recorded → Audit Trail
*/

/**
 * Represents a single service entry in a product's lifecycle history
 */
interface ServiceEntry {
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
  healthScore: string | null,
  /** The feedback message from the technician */
  findings: string | null,
  /** The blockchain address of who performed the service */
  issuerAddress: string;
  /** The role of the service provider (e.g., "Repairer", "Manufacturer") */
  issuerRole: string;
  /** The timestamp when the service was performed (milliseconds) */
  timestamp: string;
  /** The app package ID where this service entry is defined */
  packageId: string | null;
  /** The status of transaction that determines effectiveness */
  status?: string;
}

/**
 * Complete service history data structure containing all product service records
 * 
 * Usage Example:
 * ```typescript
 * const history = extractServiceHistoryData(jsonResponse);
 * 
 * // Check history overview
 * console.log(`Total services: ${history.entries.length}`);
 * console.log(`Service types: ${history.serviceTypes.join(', ')}`);
 * 
 * // Get services by provider
 * const repairerServices = getEntriesByIssuer(history, '0x5ddf340c...');
 * console.log(`Repairer performed ${repairerServices.length} services`);
 * ```
 */
interface ServiceHistoryData {
  /** Array of all service entries */
  entries: ServiceEntry[];
  /** Map of entry ID to service entry for O(1) lookup */
  entriesById: Map<string, ServiceEntry>;
  /** Map of issuer address to their service entries */
  entriesByIssuer: Map<string, ServiceEntry[]>;
  /** Map of service type to entries of that type */
  entriesByServiceType: Map<string, ServiceEntry[]>;
  /** Service entries sorted chronologically (oldest first) */
  chronologicalEntries: ServiceEntry[];
  /** Unique service types found in the history */
  serviceTypes: string[];
  /** The app package ID common to all entries */
  packageId: string;
  /** Whether there are more service entries to fetch */
  hasNextPage: boolean;
  /** Cursor for fetching next page of results */
  nextCursor?: string | null;
}

/**
 * Extracts and transforms service history data from IOTA Rebase JSON-RPC response
 * 
 * This function processes paginated ProductEntry objects and creates
 * a frontend-friendly data structure with multiple indexing strategies.
 * 
 * Process Flow:
 * ┌─ JSON Input ─┐    ┌─ Extract ─┐    ┌─ Transform ─┐    ┌─ Output ─┐
 * │ Paginated    │ →  │ Entries   │ →  │ Create Maps │ →  │ Indexed  │
 * │ Objects      │    │ Metadata  │    │ Sort Data   │    │ History  │
 * │              │    │ Pagination│    │             │    │          │
 * └──────────────┘    └───────────┘    └─────────────┘    └──────────┘
 * 
 * @param jsonData - The JSON-RPC response from iotax_getOwnedObjects call
 * @returns ServiceHistoryData object with extracted and organized information
 * 
 * @example
 * ```typescript
 * const response = await fetch('https://api.testnet.iota.cafe/', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     jsonrpc: "2.0",
 *     id: 1,
 *     method: "iotax_getOwnedObjects",
 *     params: ["0x04c545450fa0b988...", {
 *       filter: {"MatchNone": [{"StructType": "0x2::coin::Coin"}]},
 *       options: {"showContent": true}
 *     }, null, 20]
 *   })
 * });
 * const jsonData = await response.json();
 * const historyData = extractServiceHistoryData(jsonData);
 * console.log(`Loaded ${historyData.entries.length} service entries`);
 * ```
 */
function extractServiceHistoryData(jsonData: PaginatedObjectsResponse): ServiceHistoryData {
  const result = jsonData;
  // TODO: Better understand the Iota types and make use of it
  const dataArray = result.data || [];

  // Extract pagination info
  const hasNextPage = result.hasNextPage || false;
  const nextCursor = result.nextCursor;

  // Extract service entries
  const entries: ServiceEntry[] = [];
  const entriesById = new Map<string, ServiceEntry>();
  const entriesByIssuer = new Map<string, ServiceEntry[]>();
  const entriesByServiceType = new Map<string, ServiceEntry[]>();
  const serviceTypesSet = new Set<string>();
  let packageId = "";

  dataArray.forEach((item: any) => {
    const data = item.data;
    const content = data.content;
    const fields = content.fields;

    // Extract package ID from first entry
    if (!packageId) {
      const typeMatch = content.type.match(/^(0x[a-f0-9]{64})::/i);
      packageId = typeMatch ? typeMatch[1] : "";
    }

    // Extract entry data (key-value pairs)
    const entryDataContents = fields.entry_data.fields.contents || [];

    let serviceType = "";
    let serviceDescription = "";
    if (entryDataContents.length > 0) {
      const firstEntry = entryDataContents[0].fields;
      serviceType = firstEntry.key;
      serviceDescription = firstEntry.value;
    }

    let healthScore = null;
    let findings = null;
    if (entryDataContents.length > 0) {
      const healthScoreContent = entryDataContents?.find((each: any) => each.fields?.key === "HealthScore");
      if (healthScoreContent) {
        healthScore = healthScoreContent.fields.value;
      }
      const findingsContent = entryDataContents?.find((each: any) => each.fields?.key === "Findings");
      if (findingsContent) {
        findings = findingsContent.fields.value;
      }
    }

    // Extract issuer role
    const issuerRole = fields.issuer_role.variant || "Unknown";

    const serviceEntry: ServiceEntry = {
      entryId: data.objectId,
      version: data.version,
      digest: data.digest,
      txBlock: data.previousTransaction,
      serviceType,
      serviceDescription,
      healthScore,
      findings,
      issuerAddress: fields.issuer_addr,
      issuerRole,
      timestamp: fields.timestamp,
      packageId
    };

    entries.push(serviceEntry);
    entriesById.set(serviceEntry.entryId, serviceEntry);
    serviceTypesSet.add(serviceType);

    // Group by issuer
    if (!entriesByIssuer.has(serviceEntry.issuerAddress)) {
      entriesByIssuer.set(serviceEntry.issuerAddress, []);
    }
    entriesByIssuer.get(serviceEntry.issuerAddress)!.push(serviceEntry);

    // Group by service type
    if (!entriesByServiceType.has(serviceType)) {
      entriesByServiceType.set(serviceType, []);
    }
    entriesByServiceType.get(serviceType)!.push(serviceEntry);
  });

  // Sort entries chrnologically (newest first)
  const chronologicalEntries = [...entries].sort((a, b) => {
    return parseInt(b.timestamp) - parseInt(a.timestamp);
  }).slice(0, RESPONSE_LIMIT_DEFAULT);

  return {
    entries,
    entriesById,
    entriesByIssuer,
    entriesByServiceType,
    chronologicalEntries,
    serviceTypes: Array.from(serviceTypesSet),
    packageId,
    hasNextPage,
    nextCursor
  };
}

export function extractServiceTransactionData(jsonData: IotaTransactionBlockResponse[]): ServiceEntry[] {
  const transactionEntries = jsonData.map((tx) => {
    // @ts-expect-error -- Inference do not catch all possible types
    const _transactionsCall = tx.transaction!.data.transaction.transactions as unknown as IotaTransaction[];
    // @ts-expect-error -- Inference do not catch all possible types
    const _lastTransactionCall = _transactionsCall?.at(-1) as unknown as IotaTransaction;
    let isCallingLogEntry = false;

    // Determines if is calling `log_entry_data` function at `app` module
    if (_lastTransactionCall) {
      // @ts-expect-error -- Inference do not catch all possible types
      const moveCall = _lastTransactionCall.MoveCall as unknown as MoveCallIotaTransaction;
      isCallingLogEntry = (
        moveCall?.module === 'app'
        && moveCall?.function === 'log_entry_data'
      );
    }

    if (_lastTransactionCall == null || !isCallingLogEntry) {
      // This element will be filtered out
      return {
        isCallingLogEntry,
      }
    }

    const _productEntryLoggedEvent = tx.events?.find((item) => item.type.endsWith('ProductEntryLogged')) as unknown as IotaEvent;
    // @ts-expect-error -- Inference do not catch all possible types
    const entryId = _productEntryLoggedEvent.parsedJson?.entry_addr;

    const _objectCreated = tx.effects?.created?.find((item) => item.reference.objectId === entryId) as unknown as OwnedObjectRef;
    const version = _objectCreated.reference.version;
    const digest = _objectCreated.reference.digest;

    const txBlock = tx.digest;
    // @ts-expect-error -- Inference do not catch all possible types
    const _callInputs = tx.transaction?.data.transaction.inputs as unknown as IotaCallArg[];
    const serviceType = _callInputs.at(3).value.at(0);
    const serviceDescription = _callInputs.at(4).value.at(0);
    const healthScore = _callInputs.at(4).value.at(0);
    const findings = _callInputs.at(4).value.at(1);
    const issuerAddress = _productEntryLoggedEvent.sender;
    // @ts-expect-error -- Inference do not catch all possible types
    const issuerRole = _productEntryLoggedEvent.parsedJson?.issuer_role.variant.toLowerCase();
    const timestamp = tx.timestampMs;
    const packageId = _productEntryLoggedEvent.packageId;
    const status = tx.effects?.status.status;

    return {
      entryId,
      version,
      digest,
      txBlock,
      serviceType,
      serviceDescription,
      healthScore,
      findings,
      issuerAddress,
      issuerRole,
      timestamp,
      packageId,
      status,
      isCallingLogEntry,
    } as ServiceEntry & { isCallingLogEntry: boolean };
  });

  // filter out transactions not calling `log_entry_data` and with no `success` effects
  // @ts-expect-error -- Inference is considering isCallingLogEntry, we can solve this by using Omit<> 
  return transactionEntries.filter((entry) => entry.isCallingLogEntry && entry.status === 'success');
}

/**
 * Retrieves all service entries performed by a specific issuer
 * 
 * Lookup Pattern:
 * Issuer Address → Map → [ServiceEntry, ServiceEntry, ...]
 * 
 * @param data - The service history data structure
 * @param issuerAddress - The blockchain address of the service provider
 * @returns Array of service entries performed by the issuer
 * 
 * @example
 * ```typescript
 * const repairerServices = getEntriesByIssuer(historyData, '0x5ddf340c...');
 * console.log(`Repairer performed ${repairerServices.length} services`);
 * repairerServices.forEach(entry => {
 *   console.log(`- ${entry.serviceType}: ${entry.serviceDescription}`);
 * });
 * ```
 */
function getEntriesByIssuer(data: ServiceHistoryData, issuerAddress: string): ServiceEntry[] {
  return data.entriesByIssuer.get(issuerAddress) || [];
}

/**
 * Retrieves all service entries of a specific type
 * 
 * Service Type Lookup:
 * ┌─ Input: "Inspection" ─┐
 * │                       │
 * ├─ Scan all entries ───┤
 * │ Entry 1: Inspection   │ ✓ Match
 * │ Entry 2: Repair       │
 * │ Entry 3: Inspection   │ ✓ Match
 * │                       │
 * └─ Output: [Entry1, 3] ─┘
 * 
 * @param data - The service history data structure
 * @param serviceType - The type of service to filter by
 * @returns Array of service entries of the specified type
 * 
 * @example
 * ```typescript
 * const inspections = getEntriesByServiceType(historyData, 'Inspection');
 * console.log(`Product has ${inspections.length} inspection records`);
 * 
 * const repairs = getEntriesByServiceType(historyData, 'Repair');
 * console.log(`Product has ${repairs.length} repair records`);
 * ```
 */
function getEntriesByServiceType(data: ServiceHistoryData, serviceType: string): ServiceEntry[] {
  return data.entriesByServiceType.get(serviceType) || [];
}

/**
 * Gets the chronological service timeline (oldest to newest)
 * 
 * @param data - The service history data structure
 * @returns Array of service entries sorted by timestamp
 * 
 * @example
 * ```typescript
 * const timeline = getChronologicalHistory(historyData);
 * console.log('Service Timeline:');
 * timeline.forEach((entry, index) => {
 *   const date = new Date(parseInt(entry.timestamp));
 *   console.log(`${index + 1}. ${date.toLocaleDateString()}: ${entry.serviceType}`);
 * });
 * ```
 */
function getChronologicalHistory(data: ServiceHistoryData): ServiceEntry[] {
  return data.chronologicalEntries;
}

/**
 * Gets the most recent service entry
 * 
 * Timeline Pattern:
 * [Entry1] → [Entry2] → [Entry3] → [Latest Entry] ← Return this
 * 
 * @param data - The service history data structure
 * @returns The most recent service entry, or undefined if no entries
 * 
 * @example
 * ```typescript
 * const latest = getLatestServiceEntry(historyData);
 * if (latest) {
 *   console.log(`Last service: ${latest.serviceType} on ${formatServiceDate(latest.timestamp)}`);
 *   console.log(`Performed by: ${latest.issuerRole} (${latest.issuerAddress})`);
 * }
 * ```
 */
function getLatestServiceEntry(data: ServiceHistoryData): ServiceEntry | undefined {
  if (data.chronologicalEntries.length === 0) {
    return undefined;
  }
  return data.chronologicalEntries[data.chronologicalEntries.length - 1];
}

/**
 * Filters service entries within a time range
 * 
 * Time Filtering Pattern:
 * ┌─ Start Time ─┐    ┌─ Filter ─┐    ┌─ End Time ──┐
 * │ 1756128000000│ ←  │ Entries  │ →  │1756130000000│
 * └──────────────┘    └──────────┘    └─────────────┘
 *                           ↓
 *                   [Matching Entries]
 * 
 * @param data - The service history data structure
 * @param startTimestamp - Start time in milliseconds (inclusive)
 * @param endTimestamp - End time in milliseconds (inclusive)
 * @returns Array of service entries within the time range
 * 
 * @example
 * ```typescript
 * const startTime = "1756128000000"; // January 15, 2025
 * const endTime = "1756130000000";   // January 16, 2025
 * const recentServices = getServicesByTimeRange(historyData, startTime, endTime);
 * console.log(`${recentServices.length} services in the last day`);
 * ```
 */
function getServicesByTimeRange(data: ServiceHistoryData, startTimestamp: string, endTimestamp: string): ServiceEntry[] {
  const start = parseInt(startTimestamp);
  const end = parseInt(endTimestamp);

  return data.entries.filter(entry => {
    const entryTime = parseInt(entry.timestamp);
    return entryTime >= start && entryTime <= end;
  });
}

/**
 * Checks if a specific service type has been performed
 * 
 * @param data - The service history data structure
 * @param serviceType - The service type to check for
 * @returns true if the service type exists in history, false otherwise
 * 
 * @example
 * ```typescript
 * const hasInspection = hasServiceType(historyData, 'Inspection');
 * const hasRepair = hasServiceType(historyData, 'Repair');
 * 
 * if (hasInspection && !hasRepair) {
 *   console.log('Product has been inspected but never repaired');
 * }
 * ```
 */
function hasServiceType(data: ServiceHistoryData, serviceType: string): boolean {
  return data.serviceTypes.includes(serviceType);
}

/**
 * Gets service statistics for analytics
 * 
 * Statistics Flow:
 * All Entries → Group by Type/Issuer → Calculate Metrics → Insights
 * 
 * @param data - The service history data structure
 * @returns Statistics object with service metrics
 * 
 * @example
 * ```typescript
 * const stats = getServiceStatistics(historyData);
 * console.log(`Total services: ${stats.totalServices}`);
 * console.log(`Unique providers: ${stats.uniqueProviders}`);
 * console.log(`Most common service: ${stats.mostCommonServiceType}`);
 * ```
 */
function getServiceStatistics(data: ServiceHistoryData): {
  totalServices: number;
  uniqueProviders: number;
  serviceTypeBreakdown: Record<string, number>;
  mostCommonServiceType: string;
  timeSpan: { earliest: string; latest: string } | null;
} {
  const serviceTypeBreakdown: Record<string, number> = {};

  // Count services by type
  data.serviceTypes.forEach(type => {
    serviceTypeBreakdown[type] = data.entriesByServiceType.get(type)?.length || 0;
  });

  // Find most common service type
  const mostCommonServiceType = Object.entries(serviceTypeBreakdown)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "";

  // Calculate time span
  let timeSpan = null;
  if (data.chronologicalEntries.length > 0) {
    timeSpan = {
      earliest: data.chronologicalEntries[0].timestamp,
      latest: data.chronologicalEntries[data.chronologicalEntries.length - 1].timestamp
    };
  }

  return {
    totalServices: data.entries.length,
    uniqueProviders: data.entriesByIssuer.size,
    serviceTypeBreakdown,
    mostCommonServiceType,
    timeSpan
  };
}

/**
 * Formats service timestamp to human-readable date
 * 
 * @param timestamp - Timestamp in milliseconds as string
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * const entry = getLatestServiceEntry(historyData);
 * const dateStr = formatServiceDate(entry.timestamp);
 * console.log(`Last service: ${dateStr}`); // "Jan 15, 2025"
 * ```
 */
function formatServiceDate(timestamp: string): string {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Gets service entries by a specific role type
 * 
 * Role Filtering Pattern:
 * ┌─ Input: "Repairer" ─┐
 * │                     │
 * ├─ Filter entries ────┤
 * │ Entry1: Repairer    │ ✓ Match
 * │ Entry2: Manufacturer│
 * │ Entry3: Repairer    │ ✓ Match
 * │                     │
 * └─ Output: [1, 3] ────┘
 * 
 * @param data - The service history data structure
 * @param role - The role to filter by (e.g., "Repairer", "Manufacturer")
 * @returns Array of service entries performed by the specified role
 * 
 * @example
 * ```typescript
 * const repairServices = getEntriesByRole(historyData, 'Repairer');
 * const manufacturingServices = getEntriesByRole(historyData, 'Manufacturer');
 * 
 * console.log(`Repair services: ${repairServices.length}`);
 * console.log(`Manufacturing services: ${manufacturingServices.length}`);
 * ```
 */
function getEntriesByRole(data: ServiceHistoryData, role: string): ServiceEntry[] {
  return data.entries.filter(entry => entry.issuerRole === role);
}

/**
 * Gets the app package ID from the service history
 * 
 * @param data - The service history data structure
 * @returns The app package/contract address
 * 
 * @example
 * ```typescript
 * const appPackage = getServiceHistoryPackageId(historyData);
 * console.log(`DPP App Contract: ${appPackage}`);
 * // Output: "0x1d0b1bdb1b5ff25102e2e9d3858f898cd6c9f016b87b496c2e041f0ac060c5e7"
 * ```
 */
function getServiceHistoryPackageId(data: ServiceHistoryData): string {
  return data.packageId;
}

// Export all interfaces and functions
export {
  type ServiceEntry,
  type ServiceHistoryData,
  extractServiceHistoryData,
  getEntriesByIssuer,
  getEntriesByServiceType,
  getChronologicalHistory,
  getLatestServiceEntry,
  getServicesByTimeRange,
  hasServiceType,
  getServiceStatistics,
  formatServiceDate,
  getEntriesByRole,
  getServiceHistoryPackageId
};

// Usage example with complete workflow:
/*
┌─────────────────────────────────────────────────────────────┐
│                    Usage Workflow                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Fetch service history from blockchain                    │
│ 2. Extract and index service entries                        │
│ 3. Query specific service information                       │
│ 4. Display in product timeline UI                           │
└─────────────────────────────────────────────────────────────┘

const historyData = extractServiceHistoryData(jsonResponse);

// Product Dashboard: Show service overview
console.log(`App Package: ${getServiceHistoryPackageId(historyData)}`);
console.log(`Total services: ${historyData.entries.length}`);
console.log(`Service types: ${historyData.serviceTypes.join(', ')}`);

// Service Timeline: Display chronological history
const timeline = getChronologicalHistory(historyData);
console.log('Service Timeline:');
timeline.forEach((entry, index) => {
  console.log(`${index + 1}. ${formatServiceDate(entry.timestamp)}: ${entry.serviceType}`);
  console.log(`   ${entry.serviceDescription} by ${entry.issuerRole}`);
});

// Provider Analytics: Show services by provider
const repairerServices = getEntriesByRole(historyData, 'Repairer');
console.log(`Total repair services: ${repairerServices.length}`);

// Service Verification: Check specific services
const inspections = getEntriesByServiceType(historyData, 'Inspection');
console.log(`Inspection count: ${inspections.length}`);

// Latest Activity: Show most recent service
const latest = getLatestServiceEntry(historyData);
if (latest) {
  console.log(`Last service: ${latest.serviceType} on ${formatServiceDate(latest.timestamp)}`);
}

// Analytics: Service distribution insights
const stats = getServiceStatistics(historyData);
console.log(`Most common service: ${stats.mostCommonServiceType}`);
console.log(`Unique providers: ${stats.uniqueProviders}`);

// Pagination: Handle large histories
if (historyData.hasNextPage) {
  console.log(`More entries available. Next cursor: ${historyData.nextCursor}`);
  // Fetch next page using the cursor
}

// Provider Profile: Show specific provider's work
const providerAddress = '0x5ddf340c72378d35d18789c7d36e8cdfbd7ad59abe81dc88e6d9dcfd06e1a983';
const providerServices = getEntriesByIssuer(historyData, providerAddress);
console.log(`Provider ${providerAddress} services:`);
providerServices.forEach(service => {
  console.log(`- ${formatServiceDate(service.timestamp)}: ${service.serviceDescription}`);
});
*/
