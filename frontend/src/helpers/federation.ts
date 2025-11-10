import type { IotaObjectData, IotaObjectResponse } from '@iota/iota-sdk/client';

import {
  IotaCallArg,
  IotaTransaction,
  IotaTransactionBlockResponse,
  MoveCallIotaTransaction,
} from '@iota/iota-sdk/client';

import {
  Accreditation,
  AccreditationTx,
  FederationData,
  Roles,
  RootAuthority,
} from '@/types/identity';

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
  // @ts-expect-error -- turn off noise
  const federation = data.content?.fields;
  const governance = federation.governance.fields;

  // Extract Federation metadata
  const federationId = data.objectId;
  const version = data.version;
  const digest = data.digest;

  // Extract Root Authorities
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
  const rootAuthorities: RootAuthority[] = federation.root_authorities.map((auth: any) => ({
    accountId: auth.fields.account_id,
    id: auth.fields.id.id,
  }));

  // Extract Revoked Root Authorities
  const revokedRootAuthorities: RootAuthority[] = federation.revoked_root_authorities.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
    (auth: any) => ({
      accountId: auth.fields.account_id,
      id: auth.fields.id.id,
    }),
  );

  // Extract Allowed Roles from Federation Properties
  const federationProperties = governance.properties.fields.data.fields.contents;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
  const roleProperty = federationProperties.find((prop: any) =>
    prop.fields.key.fields.names.includes('role'),
  );

  const allowedRoles: string[] =
    roleProperty?.fields.value.fields.allowed_values.fields.contents.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
      (value: any) => value.fields.pos0,
    ) || [];

  // Extract Accreditations
  const accreditations = new Map<string, Accreditation[]>();
  const rolesByEntity = new Map<string, string[]>();

  // Process accreditations_to_attest (who can validate)
  const attestAccreds = governance.accreditations_to_attest.fields.contents;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
  attestAccreds.forEach((entry: any) => {
    const entityId = entry.fields.key;
    const accredList = entry.fields.value.fields.accreditations;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
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

function extractAccreditationTransactions(
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
      .filter((acc) => acc.role === Roles.Repairer.id)
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

// Export all interfaces and functions
export { extractFederationData, extractAccreditationTransactions, getRolesByEntity };
