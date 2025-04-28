type HexAddress = `0x${string}`

interface VecMapEntry {
  fields: { key: HexAddress; value: boolean }
}

interface VecMapField {
  fields: { contents: VecMapEntry[] }
}

interface WhitelistContent {
  fields: { hasMinted: VecMapField }
}

function isWhitelistContent(arg: unknown): arg is WhitelistContent {
  if (typeof arg !== 'object' || arg === null) return false

  const hasMinted = (arg as Record<string, unknown>).fields as Record<string, unknown> | undefined
  if (typeof hasMinted !== 'object' || hasMinted === null) return false

  const vecMap = hasMinted.hasMinted as Record<string, unknown> | undefined
  if (typeof vecMap !== 'object' || vecMap === null) return false

  const contents = (vecMap.fields as Record<string, unknown> | undefined)?.contents

  return Array.isArray(contents)
}

export function isAddressInWhitelist(content: unknown, address: string): boolean {
  if (!isWhitelistContent(content)) return false

  const normalized = address.toLowerCase() as HexAddress

  return content.fields.hasMinted.fields.contents.some(({ fields: { key } }) => key.toLowerCase() === normalized)
}
