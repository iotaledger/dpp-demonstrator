export interface DomainLinkageResource {
  '@context': 'https://identity.foundation/.well-known/did-configuration/v1'
  linked_dids: string[]
}

export interface VerifyDomainLinkageResponse {
  fromDidCheck?: boolean
  fromDomainCheck?: boolean
  error?: string
}

export interface VerifyDomainLinkageRequest {
  did: string
}
