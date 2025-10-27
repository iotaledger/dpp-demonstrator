export interface Result<T> {
  isSuccess?: boolean;
  isError?: boolean;
  errorMsg?: string;
  data?: T;
}

export interface DomainLinkageStatusCheck {
  isDidValid: boolean;
  isDomainValid: boolean;
}

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
