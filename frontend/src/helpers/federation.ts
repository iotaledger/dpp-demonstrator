import { Accreditation, FederationData, RootAuthority } from '@/types/identity';
import { REPAIRER_ROLE } from '@/utils/constants';
import type { IotaObjectData, IotaObjectResponse } from '@iota/iota-sdk/client';

import {
  IotaCallArg,
  IotaTransaction,
  IotaTransactionBlockResponse,
  MoveCallIotaTransaction,
} from '@iota/iota-sdk/client';

/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: Learn to use Iota types to replace any */

/*
Federation Data Structure:
┌─────────────────────────────────────────────────────────────┐
│                     Federation Object                       │
│ ID: 0x93f6e173eedf74064f7e0aa270c29667ded63c489f6cb6f91...  │
├─────────────────────────────────────────────────────────────┤
│ Root Authorities                                            │
│ ┌─ Authority 1 (account_id, id)                             │
│ └─ Authority N...                                           │
├─────────────────────────────────────────────────────────────┤
│ Revoked Root Authorities                                    │
│ ┌─ Revoked Authority 1 (account_id, id)                     │
│ └─ Revoked Authority N...                                   │
├─────────────────────────────────────────────────────────────┤
│ Allowed Roles: [manufacturer, repairer, ...]                │
├─────────────────────────────────────────────────────────────┤
│ Entity Accreditations Map:                                  │
│ ┌─ Entity ID → [Accreditation 1, Accreditation 2, ...]      │
│ ├─ Entity ID → [Accreditation 1, ...]                       │
│ └─ Entity ID → [...]                                        │
├─────────────────────────────────────────────────────────────┤
│ Roles by Entity Map:                                        │
│ ┌─ Entity ID → [role1, role2, ...]                          │
│ ├─ Entity ID → [role1, ...]                                 │
│ └─ Entity ID → [...]                                        │
└─────────────────────────────────────────────────────────────┘

Federation Hierarchy:
Federation (0x93f6e173...) → Root Authority → Entity Accreditations

Accreditation Flow:
Root Authority → Issues Accreditation → Entity gains Role → Can attest/validate
*/

/**
 * Extracts and transforms federation data from IOTA Rebase JSON-RPC response
 *
 * This function processes the complex nested structure from the blockchain
 * and creates a frontend-friendly data structure with Maps for efficient lookups.
 *
 * Process Flow:
 * ┌─ JSON Input ─┐    ┌─ Extract ─┐    ┌─ Transform ─┐    ┌─ Output ─┐
 * │ Nested Move  │ →  │ Fed Info  │ →  │ Create Maps │ →  │ Clean    │
 * │ Objects      │    │ Root Auth │    │ Group Data  │    │ Structure│
 * │              │    │ Accreds   │    │             │    │          │
 * └──────────────┘    └───────────┘    └─────────────┘    └──────────┘
 *
 * @param jsonData - The JSON-RPC response from iota_getObject call
 * @returns FederationData object with extracted and organized information
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.testnet.iota.cafe/', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     jsonrpc: "2.0",
 *     id: 1,
 *     method: "iota_getObject",
 *     params: ["0x93f6e173...", {"showContent": true}]
 *   })
 * });
 * const jsonResponse = await response.json();
 * const federationData = extractFederationData(jsonResponse.result);
 * console.log(`Loaded federation: ${federationData.federationId}`);
 * ```
 */
function extractFederationData(jsonResult: IotaObjectResponse): FederationData {
  const data = jsonResult.data as IotaObjectData;
  // @ts-expect-error - TODO: Better understand the Iota types and make use of it
  const federation = data.content?.fields;
  const governance = federation.governance.fields;

  // Extract Federation metadata
  const federationId = data.objectId;
  const version = data.version;
  const digest = data.digest;

  // Extract Root Authorities
  const rootAuthorities: RootAuthority[] = federation.root_authorities.map((auth: any) => ({
    accountId: auth.fields.account_id,
    id: auth.fields.id.id,
  }));

  // Extract Revoked Root Authorities
  const revokedRootAuthorities: RootAuthority[] = federation.revoked_root_authorities.map(
    (auth: any) => ({
      accountId: auth.fields.account_id,
      id: auth.fields.id.id,
    }),
  );

  // Extract Allowed Roles from Federation Properties
  const federationProperties = governance.properties.fields.data.fields.contents;
  const roleProperty = federationProperties.find((prop: any) =>
    prop.fields.key.fields.names.includes('role'),
  );

  const allowedRoles: string[] =
    roleProperty?.fields.value.fields.allowed_values.fields.contents.map(
      (value: any) => value.fields.pos0,
    ) || [];

  // Extract Accreditations
  const accreditations = new Map<string, Accreditation[]>();
  const rolesByEntity = new Map<string, string[]>();

  // Process accreditations_to_attest (who can validate)
  const attestAccreds = governance.accreditations_to_attest.fields.contents;

  attestAccreds.forEach((entry: any) => {
    const entityId = entry.fields.key;
    const accredList = entry.fields.value.fields.accreditations;

    const entityAccreditations: Accreditation[] = accredList.map((accred: any) => {
      const role =
        accred.fields.properties.fields.contents[0]?.fields.value.fields.allowed_values.fields
          .contents[0]?.fields.pos0 || 'unknown';

      return {
        id: accred.fields.id.id,
        accreditedBy: accred.fields.accredited_by,
        role,
        entityId,
      };
    });

    if (entityAccreditations.length > 0) {
      accreditations.set(entityId, entityAccreditations);

      // Build role mapping for easy lookup
      const roles = entityAccreditations.map((acc) => acc.role);
      rolesByEntity.set(entityId, [...new Set(roles)]);
    }
  });

  return {
    federationId,
    version,
    digest,
    rootAuthorities,
    revokedRootAuthorities,
    accreditations,
    rolesByEntity,
    allowedRoles,
  };
}

interface AccreditationTx {
  digest: string;
  sender: string;
  haveCallToAccreditationToAttest: boolean;
  receiver: string;
  role: string;
}

export function extractAccreditationTransactions(
  data: IotaTransactionBlockResponse[],
  accountAddress: string | null,
): AccreditationTx[] {
  function deduplicate(entities: AccreditationTx[]): AccreditationTx[] {
    const visited = new Set();
    return entities.filter((each) => !visited.has(each.receiver) && visited.add(each.receiver));
  }

  return deduplicate(
    data
      .map((tx): AccreditationTx => {
        const digest = tx.digest;
        const sender = tx.transaction!.data.sender;
        // @ts-expect-error -- Inference do not catch all possible types
        const txInputs = tx.transaction!.data.transaction.inputs as unknown as IotaCallArg[];
        const txTransactions = // @ts-expect-error -- Inference do not catch all possible types
          tx.transaction!.data.transaction.transactions as unknown as IotaTransaction[];
        const lastTransaction = txTransactions?.at(-1) as unknown as IotaTransaction;
        let haveCallToAccreditationToAttest = false;

        if (lastTransaction) {
          // @ts-expect-error -- Inference do not catch all possible types
          const moveCall = lastTransaction.MoveCall as unknown as MoveCallIotaTransaction;
          haveCallToAccreditationToAttest =
            moveCall?.module === 'main' && moveCall?.function === 'create_accreditation_to_attest';
        }

        if (lastTransaction == null || !haveCallToAccreditationToAttest) {
          // This element will be filtered out
          // @ts-expect-error -- It requires all properties, however this is just a flag
          return {
            haveCallToAccreditationToAttest,
          };
        }

        // @ts-expect-error -- Inference do not catch all possible types
        const receiver = txInputs!.at(3)!.value as unknown as string;
        // @ts-expect-error -- Inference do not catch all possible types
        const role = txInputs!.at(6)!.value as unknown as string;

        return {
          digest,
          sender,
          haveCallToAccreditationToAttest,
          receiver,
          role,
        };
      })
      .filter((acc) => acc.haveCallToAccreditationToAttest)
      .filter((acc) => acc.role === REPAIRER_ROLE)
      .filter((acc) => acc.receiver === accountAddress),
  );
}

/**
 * Retrieves all roles assigned to a specific entity
 *
 * Lookup Pattern:
 * Entity ID → Map → [role1, role2, ...]
 *
 * @param data - The federation data structure
 * @param entityId - The blockchain address/ID of the entity
 * @returns Array of role strings assigned to the entity, empty array if none
 *
 * @example
 * ```typescript
 * const roles = getRolesByEntity(federationData, '0xa77cc326...');
 * // Returns: ['manufacturer'] or ['repairer'] or []
 * ```
 */
function getRolesByEntity(data: FederationData, entityId: string): string[] {
  return data.rolesByEntity.get(entityId) || [];
}

/**
 * Retrieves all accreditations for a specific entity
 *
 * @param data - The federation data structure
 * @param entityId - The blockchain address/ID of the entity
 * @returns Array of Accreditation objects for the entity, empty array if none
 *
 * @example
 * ```typescript
 * const accreds = getAccreditationsByEntity(federationData, '0xa77cc326...');
 * // Returns: [{ id: '0x123...', accreditedBy: '0xac2d...', role: 'manufacturer', entityId: '0xa77...' }]
 * ```
 */
function getAccreditationsByEntity(data: FederationData, entityId: string): Accreditation[] {
  return data.accreditations.get(entityId) || [];
}

// TODO: write a documentation following the pattern in the file
function getAllAccreditationsFlat(data: FederationData): string[] {
  const allRepairers = getAllEntitiesByRole(data, REPAIRER_ROLE);
  return deduplicateAccreditationByAddress(allRepairers);
}

function deduplicateAccreditationByAddress(entities: string[]): string[] {
  const visited = new Set();
  return entities.filter((each) => !visited.has(each) && visited.add(each));
}

/**
 * Finds all entities that have been assigned a specific role
 *
 * Search Pattern:
 * ┌─ Input: "manufacturer" ─┐
 * │                         │
 * ├─ Scan all entities ─────┤
 * │ Entity 1: [repairer]    │
 * │ Entity 2: [manufacturer]│ ✓ Match
 * │ Entity 3: [repairer]    │
 * │                         │
 * └─ Output: [Entity 2] ────┘
 *
 * @param data - The federation data structure
 * @param role - The role to search for (e.g., "manufacturer", "repairer")
 * @returns Array of entity IDs that have the specified role
 *
 * @example
 * ```typescript
 * const manufacturers = getAllEntitiesByRole(federationData, 'manufacturer');
 * // Returns: ['0xa77cc326...']
 *
 * const repairers = getAllEntitiesByRole(federationData, 'repairer');
 * // Returns: ['0x5ddf340c...', '0x1f9699f7...']
 * ```
 */
function getAllEntitiesByRole(data: FederationData, role: string): string[] {
  const entities: string[] = [];
  data.rolesByEntity.forEach((roles, entityId) => {
    if (roles.includes(role)) {
      entities.push(entityId);
    }
  });
  return entities;
}

/**
 * Validates if a role is allowed by the federation's governance rules
 *
 * Validation Flow:
 * Input Role → Check against allowedRoles → Boolean Result
 *
 * @param data - The federation data structure
 * @param role - The role string to validate
 * @returns true if the role is allowed by federation governance, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = isRoleAllowed(federationData, 'manufacturer'); // true
 * const isInvalid = isRoleAllowed(federationData, 'distributor'); // false (not in allowed roles)
 *
 * // Use for form validation
 * if (!isRoleAllowed(federationData, userInputRole)) {
 *   throw new Error(`Role ${userInputRole} is not allowed in this federation`);
 * }
 * ```
 */
function isRoleAllowed(data: FederationData, role: string): boolean {
  return data.allowedRoles.includes(role);
}

/**
 * Checks if a root authority account ID has been revoked
 *
 * Revocation Check Pattern:
 * ┌─ Input: Account ID ─┐
 * │                     │
 * ├─ Check Revoked ────┤
 * │ Authority 1: revoked│ ✓ Match → true
 * │ Authority 2: active │
 * │                     │
 * └─ Output: Boolean ───┘
 *
 * @param data - The federation data structure
 * @param accountId - The account ID to check for revocation
 * @returns true if the account is in the revoked authorities list, false otherwise
 *
 * @example
 * ```typescript
 * const isRevoked = isRootAuthorityRevoked(federationData, '0xac2d89ae...');
 * if (isRevoked) {
 *   console.log('This authority can no longer issue accreditations');
 * }
 * ```
 */
function isRootAuthorityRevoked(data: FederationData, accountId: string): boolean {
  return data.revokedRootAuthorities.some((auth) => auth.accountId === accountId);
}

/**
 * Checks if an entity's accreditations are still valid (not issued by revoked authorities)
 *
 * Validation Flow:
 * Entity → Get Accreditations → Check Each Issuer → All Valid?
 *
 * @param data - The federation data structure
 * @param entityId - The entity ID to validate
 * @returns true if all accreditations are from valid (non-revoked) authorities
 *
 * @example
 * ```typescript
 * const hasValidAccreds = hasValidAccreditations(federationData, '0xa77cc326...');
 * if (!hasValidAccreds) {
 *   console.log('Entity has accreditations from revoked authorities');
 * }
 *
 * // Use in access control
 * if (hasValidAccreditations(federationData, entityId)) {
 *   // Allow access to protected resources
 * }
 * ```
 */
function hasValidAccreditations(data: FederationData, entityId: string): boolean {
  const accreditations = data.accreditations.get(entityId) || [];

  // If no accreditations, considered invalid
  if (accreditations.length === 0) {
    return false;
  }

  // Check if any accreditation was issued by a revoked authority
  return !accreditations.some((accred) => isRootAuthorityRevoked(data, accred.accreditedBy));
}

/**
 * Gets all entities whose accreditations are invalid due to revoked issuers
 *
 * Search Pattern:
 * ┌─ Scan all entities ─────────────────────────┐
 * │ Entity 1: issued by active authority        │
 * │ Entity 2: issued by revoked authority       │ ✓ Invalid
 * │ Entity 3: issued by active authority        │
 * └─ Output: [Entity 2] ───────────────────────┘
 *
 * @param data - The federation data structure
 * @returns Array of entity IDs with invalid accreditations
 *
 * @example
 * ```typescript
 * const invalidEntities = getEntitiesWithInvalidAccreditations(federationData);
 * invalidEntities.forEach(entityId => {
 *   console.log(`Entity ${entityId} needs re-accreditation`);
 * });
 * ```
 */
function getEntitiesWithInvalidAccreditations(data: FederationData): string[] {
  const invalidEntities: string[] = [];

  data.accreditations.forEach((accreds, entityId) => {
    if (!hasValidAccreditations(data, entityId)) {
      invalidEntities.push(entityId);
    }
  });

  return invalidEntities;
}

// Export all interfaces and functions
export {
  type RootAuthority,
  type Accreditation,
  type FederationData,
  extractFederationData,
  getRolesByEntity,
  getAccreditationsByEntity,
  getAllAccreditationsFlat,
  getAllEntitiesByRole,
  isRoleAllowed,
  isRootAuthorityRevoked,
  hasValidAccreditations,
  getEntitiesWithInvalidAccreditations,
};

// Usage example with complete workflow:
/*
┌─────────────────────────────────────────────────────────────┐
│                    Usage Workflow                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Fetch JSON from blockchain                               │
│ 2. Extract federation data                                  │
│ 3. Query specific information                               │
│ 4. Display in UI components                                 │
└─────────────────────────────────────────────────────────────┘

const federationData = extractFederationData(jsonResponse);

// Dashboard: Show federation overview
console.log(`Federation ID: ${federationData.federationId}`);
console.log(`Current version: ${federationData.version}`);
console.log(`Federation allows roles: ${federationData.allowedRoles.join(', ')}`);
console.log(`Active root authorities: ${federationData.rootAuthorities.length}`);
console.log(`Revoked root authorities: ${federationData.revokedRootAuthorities.length}`);

// Entity Profile: Show entity details
const entityRoles = getRolesByEntity(federationData, currentEntityId);
const entityAccreds = getAccreditationsByEntity(federationData, currentEntityId);
const entityHasValidAccreds = hasValidAccreditations(federationData, currentEntityId);

// Directory: List entities by role
const allManufacturers = getAllEntitiesByRole(federationData, 'manufacturer');
const allRepairers = getAllEntitiesByRole(federationData, 'repairer');

// Security: Check for compromised entities
const invalidEntities = getEntitiesWithInvalidAccreditations(federationData);
if (invalidEntities.length > 0) {
  console.warn(`Found ${invalidEntities.length} entities with invalid accreditations`);
}

// Authority Management: Check if an authority is revoked
const isAuthorityRevoked = isRootAuthorityRevoked(federationData, authorityId);
if (isAuthorityRevoked) {
  console.log('Authority has been revoked - accreditations no longer valid');
}

// Form Validation: Check role validity
const isValidRole = isRoleAllowed(federationData, formData.requestedRole);

// Use in UI for federation selection or verification
const federationSelector = {
  id: federationData.federationId,
  version: federationData.version,
  allowedRoles: federationData.allowedRoles,
  authoritiesCount: federationData.rootAuthorities.length,
  revokedAuthoritiesCount: federationData.revokedRootAuthorities.length
};
*/
