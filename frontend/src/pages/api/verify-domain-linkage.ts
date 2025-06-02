import {
  DomainLinkageConfiguration,
  EcDSAJwsVerifier,
  IdentityClientReadOnly,
  IotaDID,
  IotaDocument,
  JwtCredentialValidationOptions,
  JwtDomainLinkageValidator,
} from '@iota/identity-wasm/node'
import { IotaClient } from '@iota/iota-sdk/client'
import { NextApiRequest, NextApiResponse } from 'next'

interface RequestBody {
  did: string
}

const DAPP_URL = process.env.NEXT_PUBLIC_DAPP_URL
const IOTA_IDENTITY_PKG_ID = process.env.IOTA_IDENTITY_PKG_ID
const NETWORK_URL = 'testnet'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!IOTA_IDENTITY_PKG_ID || !DAPP_URL) {
    return res.status(500).json({ error: 'Internal server configuration error' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { did }: RequestBody = req.body

  if (!did) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const identityClient = await getIdentityClient(IOTA_IDENTITY_PKG_ID)

  const didDocument: IotaDocument = await identityClient.resolveDid(IotaDID.parse(did))

  const didConfiguration = await fetchDidConfiguration(DAPP_URL)
  const fetchedConfigurationResource = DomainLinkageConfiguration.fromJSON(didConfiguration)

  new JwtDomainLinkageValidator(new EcDSAJwsVerifier()).validateLinkage(
    didDocument,
    fetchedConfigurationResource,
    DAPP_URL,
    new JwtCredentialValidationOptions()
  )

  return res.status(200).json({ message: 'Successfully validated Domain Linkage' })
}

async function getIdentityClient(identityPackageId: string) {
  const iotaClient = new IotaClient({ url: NETWORK_URL })

  return await IdentityClientReadOnly.createWithPkgId(iotaClient, identityPackageId)
}

export async function fetchDidConfiguration(dappUrl: string): Promise<string> {
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

  const data = await response.json()

  return JSON.stringify(data)
}
