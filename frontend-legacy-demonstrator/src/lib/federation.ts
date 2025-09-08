export function getRole(content: Federation, address: string): string | null {
  // Check accreditations_to_accredit
  const accreditations = content.fields.governance.fields.accreditations_to_accredit.fields.contents
  const roleFromAccreditations = findRoleInAccreditations(accreditations, address)
  if (roleFromAccreditations) return roleFromAccreditations

  // Check accreditations_to_attest
  const attestations = content.fields.governance.fields.accreditations_to_attest.fields.contents
  const roleFromAttestations = findRoleInAccreditations(attestations, address)
  if (roleFromAttestations) return roleFromAttestations

  return null
}

function findRoleInAccreditations(entries: AccreditationEntry[], address: string): string | null {
  for (const entry of entries) {
    if (entry.fields.key.toLowerCase() === address.toLowerCase()) {
      const accreditations = entry.fields.value.fields.accreditations
      for (const accreditation of accreditations) {
        const properties = accreditation.fields.properties.fields.contents
        for (const property of properties) {
          const key = property.fields.key.fields.names[0]
          if (key === 'role') {
            const allowedValues = property.fields.value.fields.allowed_values.fields.contents
            if (allowedValues.length > 0) {
              const roleValue = allowedValues[0].fields.pos0
              if (roleValue) return roleValue
            }
          }
        }
      }
    }
  }

  return null
}

export interface Federation {
  dataType: string
  type: string
  fields: FederationFields
}

export interface FederationFields {
  governance: Governance
  revoked_root_authorities: unknown
  root_authorities: unknown
  id: IdObject
}

export interface Governance {
  fields: GovernanceFields
  type: string
}
export interface GovernanceFields {
  accreditations_to_accredit: AccreditationMap
  accreditations_to_attest: AccreditationMap
  id: IdObject
  properties: FederationPropertiesContainer
}

export interface AccreditationMap {
  type: string
  fields: {
    contents: AccreditationEntry[]
  }
}

export interface AccreditationEntry {
  type: string
  fields: {
    key: string
    value: Accreditations
  }
}

export interface Accreditations {
  type: string
  fields: {
    accreditations: Accreditation[]
  }
}

export interface Accreditation {
  type: string
  fields: {
    accredited_by: string
    id: IdObject
    properties: PropertyMap
  }
}

export interface PropertyMap {
  type: string
  fields: {
    contents: PropertyEntry[]
  }
}

export interface PropertyEntry {
  type: string
  fields: {
    key: PropertyName
    value: FederationProperty
  }
}

export interface PropertyName {
  type: string
  fields: {
    names: string[]
  }
}

export interface FederationProperty {
  type: string
  fields: {
    allow_any: boolean
    allowed_values: PropertyValueSet
    name: PropertyName
    shape: unknown | null
    timespan: Timespan
  }
}

export interface PropertyValueSet {
  type: string
  fields: {
    contents: PropertyValue[]
  }
}

export interface PropertyValue {
  type: string
  variant: string
  fields: {
    pos0: string
  }
}

export interface Timespan {
  type: string
  fields: {
    valid_from_ms: number | null
    valid_until_ms: number | null
  }
}

export interface FederationPropertiesContainer {
  type: string
  fields: {
    data: PropertyMap
  }
}

export interface IdObject {
  id: string
}
