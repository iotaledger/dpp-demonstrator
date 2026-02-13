/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IdentityClientReadOnly,
  IotaDID,
  IotaDocument,
  LinkedDomainService,
  Service,
} from '@iota/identity-wasm/web';
import { IotaClient } from '@iota/iota-sdk/client';

import { DID_CONFIGURATION_URL_PATH, IOTA_IDENTITY_PKG_ID, NETWORK_URL } from '@/utils/constants';

export async function getFirstDomainLinkageConfigurationUrl(did: string): Promise<string | null> {
  try {
    const identityClient = await getIdentityClient();
    const didDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(did));
    console.log('didDocument', didDocument);

    const firstValidService = didDocument
      .service()
      .filter((service: Service) => LinkedDomainService.isValid(service))
      .at(0);

    if (!firstValidService) {
      return null;
    }

    console.log('firstValidService', firstValidService);

    // For this application we guarantee the serviceEndpoint is a single string
    const serviceEndpoint = firstValidService!.serviceEndpoint() as unknown as string;
    console.log('serviceEndpoint', serviceEndpoint);

    const configurationUrl = getDidConfigurationUrl(serviceEndpoint).toString();
    console.log('configuration URL', configurationUrl);

    return configurationUrl;
  } catch {
    console.error('Invalid Domain Linkage');
    return null;
  }
}

export async function getIdentityClient() {
  const iotaClient = new IotaClient({ url: NETWORK_URL! });

  return await IdentityClientReadOnly.createWithPkgId(iotaClient, IOTA_IDENTITY_PKG_ID!);
}

export function getDidConfigurationUrl(endpoint: string): URL {
  return new URL(DID_CONFIGURATION_URL_PATH, endpoint);
}
