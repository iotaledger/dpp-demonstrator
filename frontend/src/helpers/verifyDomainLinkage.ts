import {
  DomainLinkageConfiguration,
  EcDSAJwsVerifier,
  IdentityClientReadOnly,
  IotaDID,
  IotaDocument,
  Jwt,
  JwtCredentialValidationOptions,
  JwtDomainLinkageValidator,
  LinkedDomainService,
  Service,
} from '@iota/identity-wasm/node';
import { IotaClient } from '@iota/iota-sdk/client';

import { DomainLinkageResource, Result } from '@/types/identity';
import { DAPP_URL, IOTA_IDENTITY_PKG_ID, NETWORK_URL } from '@/utils/constants';

export async function checkStartingFromDid(did: string) {
  const valid = true;
  const invalid = false;

  try {
    const identityClient = await getIdentityClient();
    const didDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(did));

    const firstValidService = didDocument
      .service()
      .filter((service: Service) => LinkedDomainService.isValid(service))
      .at(0);

    if (!firstValidService) {
      return invalid;
    }

    // For this application we guarantee the serviceEndpoint is a single string
    const serviceEndpoint = firstValidService!.serviceEndpoint() as unknown as string;

    const configurationResult = await fetchDidConfiguration(serviceEndpoint);
    if (configurationResult.isError) {
      return invalid;
    }

    const rawDomainLinkageConfiguration = configurationResult.data!.linked_dids.at(0);
    if (!rawDomainLinkageConfiguration) {
      return invalid;
    }

    const domainLinkageConfiguration = new DomainLinkageConfiguration([
      Jwt.fromJSON(rawDomainLinkageConfiguration),
    ]);

    // Throws if invalid
    new JwtDomainLinkageValidator(new EcDSAJwsVerifier()).validateLinkage(
      didDocument,
      domainLinkageConfiguration,
      serviceEndpoint,
      new JwtCredentialValidationOptions(),
    );

    return valid;
  } catch {
    console.error('Invalid Domain Linkage');
    return invalid;
  }
}

export async function checkStartingFromDomain() {
  const valid = true;
  const invalid = false;

  const identityClient = await getIdentityClient();
  const result = await fetchDidConfiguration(DAPP_URL!);
  if (result.isError) {
    return invalid;
  }

  try {
    const rawDomainLinkageConfiguration = result.data!.linked_dids.at(0);
    const domainLinkageConfiguration = new DomainLinkageConfiguration([
      Jwt.fromJSON(rawDomainLinkageConfiguration),
    ]);

    const issuer: string = domainLinkageConfiguration
      .issuers()
      .at(0)
      ?.toString() as unknown as string;
    const issuerDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(issuer));

    // Throws if invalid
    new JwtDomainLinkageValidator(new EcDSAJwsVerifier()).validateLinkage(
      issuerDocument,
      domainLinkageConfiguration,
      DAPP_URL!,
      new JwtCredentialValidationOptions(),
    );

    return valid;
  } catch {
    console.error('Invalid Domain Linkage');
    return invalid;
  }
}

export async function getIdentityClient() {
  const iotaClient = new IotaClient({ url: NETWORK_URL! });

  return await IdentityClientReadOnly.createWithPkgId(iotaClient, IOTA_IDENTITY_PKG_ID!);
}

export async function fetchDidConfiguration(
  dappUrl: string,
): Promise<Result<DomainLinkageResource>> {
  const configurationUrl = new URL('/.well-known/did-configuration.json', dappUrl);

  const response = await fetch(configurationUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    console.warn('Failed to get configuration URL', response.statusText);
    return {
      isSuccess: false,
      isError: true,
      errorMsg: 'Failed to fetch DID configuration.',
    };
  }

  return {
    isSuccess: true,
    isError: false,
    data: await response.json(),
  };
}
