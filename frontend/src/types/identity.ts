/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Result<T> {
  isSuccess?: boolean;
  isError?: boolean;
  errorMsg?: string;
  data?: T;
}

export interface DomainLinkageStatusCheck {
  isDidValid: boolean;
  isDomainValid: boolean;
  didConfigUrl: string | null;
}

export interface DomainLinkageResource {
  '@context': 'https://identity.foundation/.well-known/did-configuration/v1';
  linked_dids: string[];
}

export interface VerifyDomainLinkageResponse {
  fromDidCheck?: boolean;
  fromDomainCheck?: boolean;
  error?: string;
}

export interface VerifyDomainLinkageRequest {
  did: string;
}

/**
 * Represents a root authority in the federation system
 * Root authorities are the top-level entities that can issue accreditations
 */
export interface RootAuthority {
  /** The blockchain account identifier of the root authority */
  accountId: string;
  /** The unique object identifier for this root authority instance */
  id: string;
}

/**
 * Represents an accreditation issued to an entity within the federation
 *
 * Structure:
 * ┌─ Accreditation ─┐
 * │ id: unique ID   │
 * │ accreditedBy    │ ──→ Points to Root Authority
 * │ role: assigned  │
 * │ entityId: owner │
 * └─────────────────┘
 */
export interface Accreditation {
  /** Unique identifier for this specific accreditation */
  id: string;
  /** Account ID of the authority that issued this accreditation */
  accreditedBy: string;
  /** The role granted by this accreditation (e.g., "manufacturer", "repairer") */
  role: string;
  /** The entity ID that owns this accreditation */
  entityId: string;
}

/**
 * Complete federation data structure containing all governance information
 *
 * Usage Example:
 * ```typescript
 * const data = extractFederationData(jsonResponse);
 *
 * // Check federation identity
 * console.log(`Federation ID: ${data.federationId}`);
 * console.log(`Version: ${data.version}`);
 *
 * // Check what roles are allowed
 * console.log(data.allowedRoles); // ["manufacturer", "repairer"]
 * ```
 */
export interface FederationData {
  /** The unique blockchain object ID of this federation */
  federationId: string;
  /** The version number of this federation object */
  version: string;
  /** The cryptographic digest/hash of this federation state */
  digest: string;
  /** Array of root authorities that can issue accreditations */
  rootAuthorities: RootAuthority[];
  /** Array of revoked root authorities (no longer valid) */
  revokedRootAuthorities: RootAuthority[];
  /** Map of entity ID to their accreditations for O(1) lookup */
  accreditations: Map<string, Accreditation[]>;
  /** Map of entity ID to their assigned roles for quick role checking */
  rolesByEntity: Map<string, string[]>;
  /** Array of roles that this federation allows (defined in governance) */
  allowedRoles: string[];
}

export interface AccreditationTx {
  digest: string;
  sender: string;
  haveCallToAccreditationToAttest: boolean;
  receiver: string;
  role: string;
}

export interface RoleEntry {
  id: string;
  value: string;
  label: string;
}

export const Roles: Record<string, RoleEntry> = {
  Manufacturer: {
    id: 'manufacturer',
    value: 'Manufacturer',
    label: 'Manufacturer',
  },
  Repairer: {
    id: 'repairer',
    value: 'Repairer',
    label: 'Service Technician',
  },
};
