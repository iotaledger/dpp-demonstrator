// TODO: remove page implementation
import {
  CoreDID,
  DomainLinkageConfiguration,
  EcDSAJwsVerifier,
  IdentityClientReadOnly,
  IotaDID,
  IotaDocument,
  Jwt,
  JwtCredentialValidationOptions,
  JwtDomainLinkageValidator,
  LinkedDomainService,
} from '@iota/identity-wasm/node'
import { IotaClient } from '@iota/iota-sdk/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from "cors";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  origin: '*', // disabled, allows anonymous
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

import { DomainLinkageResource, VerifyDomainLinkageRequest, VerifyDomainLinkageResponse } from '@/types/identity';

const DAPP_URL = process.env.NEXT_PUBLIC_DAPP_URL as string
const IOTA_IDENTITY_PKG_ID = process.env.IOTA_IDENTITY_PKG_ID as string
const NETWORK_URL = process.env.NEXT_PUBLIC_NETWORK_URL as string

export default async function handler(req: NextApiRequest, res: NextApiResponse<VerifyDomainLinkageResponse>) {
  console.log('running middleware');
  // Run the middleware
  await runMiddleware(req, res, cors);

  if (!IOTA_IDENTITY_PKG_ID || !DAPP_URL) {
    return res.status(500).json({ error: 'Internal server configuration error' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { did }: VerifyDomainLinkageRequest = req.body

  if (!did) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  return res.status(200).json({ fromDidCheck: await startingFromDid(did), fromDomainCheck: await startingFromDomain() })
}

async function startingFromDid(did: string) {
  const identityClient = await getIdentityClient(IOTA_IDENTITY_PKG_ID)

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

async function startingFromDomain() {
  const identityClient = await getIdentityClient(IOTA_IDENTITY_PKG_ID)
  const fetchedConfigurationResource = await fetchDidConfiguration(DAPP_URL)
  const configurationResource = new DomainLinkageConfiguration([
    Jwt.fromJSON(fetchedConfigurationResource.linked_dids[0]),
  ])

  const issuers: Array<CoreDID> = configurationResource.issuers()
  const issuerDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(issuers[0].toString()))

  try {
    new JwtDomainLinkageValidator(new EcDSAJwsVerifier()).validateLinkage(
      issuerDocument,
      configurationResource,
      DAPP_URL,
      new JwtCredentialValidationOptions()
    )

    return true
  } catch {
    return false
  }
}

async function getIdentityClient(identityPackageId: string) {
  const iotaClient = new IotaClient({ url: NETWORK_URL })

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
