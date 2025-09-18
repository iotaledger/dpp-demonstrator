import {
  CoreDID,
  DomainLinkageConfiguration,
  EcDSAJwsVerifier,
  IotaDID,
  IotaDocument,
  Jwt,
  JwtCredentialValidationOptions,
  JwtDomainLinkageValidator,
  LinkedDomainService,
  IdentityClientReadOnly,
} from '@iota/identity-wasm/node'
import { IotaClient } from '@iota/iota-sdk/client'
import { DomainLinkageResource } from '@/types/identity'
import { DAPP_URL, IOTA_IDENTITY_PKG_ID, NETWORK_URL } from '@/utils/constants';

export async function startingFromDid(did: string) {
  const identityClient = await getIdentityClient(IOTA_IDENTITY_PKG_ID!)

  const didDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(did))

  const linkedDomainServices: LinkedDomainService[] = didDocument
    .service()
    .filter((service) => LinkedDomainService.isValid(service))
    .map((service) => LinkedDomainService.fromService(service))

  const domains: string[] = linkedDomainServices[0].domains()

  const fetchedConfigurationResource = await fetchDidConfiguration(domains[0])

  const configurationResource = new DomainLinkageConfiguration([
    Jwt.fromJSON(fetchedConfigurationResource.linked_dids[0]),
  ])

  try {
    new JwtDomainLinkageValidator(new EcDSAJwsVerifier()).validateLinkage(
      didDocument,
      DomainLinkageConfiguration.fromJSON(configurationResource),
      domains[0],
      new JwtCredentialValidationOptions()
    )

    return true
  } catch {
    return false
  }
}

export async function startingFromDomain() {
  const identityClient = await getIdentityClient(IOTA_IDENTITY_PKG_ID!)
  const fetchedConfigurationResource = await fetchDidConfiguration(DAPP_URL!)
  const configurationResource = new DomainLinkageConfiguration([
    Jwt.fromJSON(fetchedConfigurationResource.linked_dids[0]),
  ])

  const issuers: Array<CoreDID> = configurationResource.issuers()
  const issuerDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(issuers[0].toString()))

  try {
    new JwtDomainLinkageValidator(new EcDSAJwsVerifier()).validateLinkage(
      issuerDocument,
      configurationResource,
      DAPP_URL!,
      new JwtCredentialValidationOptions()
    )

    return true
  } catch {
    return false
  }
}

export async function getIdentityClient(identityPackageId: string) {
  const iotaClient = new IotaClient({ url: NETWORK_URL! })

  return await IdentityClientReadOnly.createWithPkgId(iotaClient, identityPackageId)
}

export async function fetchDidConfiguration(dappUrl: string): Promise<DomainLinkageResource> {
  const configurationUrl = `${dappUrl}/.well-known/did-configuration.json`

  const response = await fetch(configurationUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch DID configuration: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}
