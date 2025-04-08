export function getRole(content: Federation, address: string): string | null {
  const attesters = content.fields.governance.fields.attesters.fields.contents
  const roleFromAttesters = findRole(attesters, address)
  if (roleFromAttesters) return roleFromAttesters

  return null
}

function findRole(entries: VecMapPermissionsEntry[], address: string): string | null {
  for (const entry of entries) {
    if (entry.fields.key.toLowerCase() === address.toLowerCase()) {
      const perms = entry.fields.value.fields.permissions
      for (const perm of perms) {
        for (const constraintEntry of perm.fields.constraints.fields.contents) {
          const key = constraintEntry.fields.key.fields.names[0]
          if (key === 'role') {
            const allowedValues = constraintEntry.fields.value.fields.allowed_values.fields.contents
            if (allowedValues.length > 0) {
              const textValue = allowedValues[0].fields.text
              if (textValue) return textValue
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
  governance: GovernanceContainer
  id: IdObject
  root_authorities: RootAuthority[]
}

export interface GovernanceContainer {
  type: string
  fields: GovernanceFields
}

export interface GovernanceFields {
  accreditors: VecMapPermissions
  attesters: VecMapPermissions
  id: IdObject
  trusted_constraints: TrustedConstraintsContainer
}

export interface TrustedConstraintsContainer {
  type: string
  fields: {
    data: VecMapTrustedConstraint
  }
}

export interface VecMapTrustedConstraint {
  type: string
  fields: {
    contents: VecMapTrustedConstraintEntry[]
  }
}

export interface VecMapTrustedConstraintEntry {
  type: string
  fields: {
    key: TrustedPropertyName
    value: TrustedConstraint
  }
}

export interface TrustedPropertyName {
  type: string
  fields: {
    names: string[]
  }
}

export interface TrustedConstraint {
  type: string
  fields: {
    allow_any: boolean
    allowed_values: VecSetTrustedPropertyValue
    expression: unknown | null
    property_name: TrustedPropertyName
    timespan: Timespan
  }
}

export interface VecSetTrustedPropertyValue {
  type: string
  fields: {
    contents: TrustedPropertyValue[]
  }
}

export interface TrustedPropertyValue {
  type: string
  fields: {
    number: number | null
    text: string | null
  }
}

export interface Timespan {
  type: string
  fields: {
    valid_from_ms: number | null
    valid_until_ms: number | null
  }
}

export interface VecMapPermissions {
  type: string
  fields: {
    contents: VecMapPermissionsEntry[]
  }
}

export interface VecMapPermissionsEntry {
  type: string
  fields: {
    key: string
    value: Permissions
  }
}

export interface Permissions {
  type: string
  fields: {
    permissions: Permission[]
  }
}

export interface Permission {
  type: string
  fields: {
    constraints: VecMapConstraints
    created_by: string
    federation_id: string
    id: IdObject
  }
}

export interface VecMapConstraints {
  type: string
  fields: {
    contents: VecMapConstraintEntry[]
  }
}

export interface VecMapConstraintEntry {
  type: string
  fields: {
    key: TrustedPropertyName
    value: TrustedConstraint
  }
}

export interface IdObject {
  id: string
}

export interface RootAuthority {
  type: string
  fields: {
    account_id: string
    id: IdObject
  }
}
