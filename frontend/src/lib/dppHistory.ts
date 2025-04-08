export interface VecMapEntry {
  type: string
  fields: {
    key: string
    value: string
  }
}

export interface VecMap {
  type: string
  fields: {
    contents: VecMapEntry[]
  }
}

export interface IssuerRole {
  type: string
  variant: string
  fields: Record<string, never>
}

export interface Fields {
  entry_data: VecMap
  id: {
    id: string
  }
  issuer_role: IssuerRole
  issuer_addr: string
  timestamp: string
}

export interface Content {
  dataType: string
  type: string
  fields: Fields
}

export interface DataObject {
  objectId: string
  version: string
  digest: string
  type: string
  content: Content
}

export interface DataItem {
  data: DataObject
}

export interface Result {
  data: DataItem[]
  nextCursor: string | null
  hasNextPage: boolean
}

export interface DppEntry {
  objectId: string
  version: string
  digest: string
  type: string
  entryData: Record<string, string>
  issuerRole: string
  issuerAddr: string
  timestamp: string
}

export class ProductEntriesParser {
  private productEntries: DppEntry[] = []

  private _hasNextPage = false

  private _nextCursor: string | null = null

  parseResponse(json: Result): void {
    if (!json?.data) return
    for (const item of json.data) {
      const d = item.data
      const f = d.content.fields
      const map: Record<string, string> = {}
      if (f.entry_data.fields.contents.length > 0) {
        for (const c of f.entry_data.fields.contents) {
          if (c.fields.key && c.fields.value) {
            map[c.fields.key] = c.fields.value
          }
        }
      }
      this.productEntries.push({
        objectId: d.objectId,
        version: d.version,
        digest: d.digest,
        type: d.type,
        entryData: map,
        issuerRole: f.issuer_role.variant,
        issuerAddr: f.issuer_addr,
        timestamp: f.timestamp,
      })
    }

    this.productEntries.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))

    this._hasNextPage = json.hasNextPage
    this._nextCursor = json.nextCursor
  }

  get entries(): DppEntry[] {
    return this.productEntries
  }

  get hasNextPage(): boolean {
    return this._hasNextPage
  }

  get nextCursor(): string | null {
    return this._nextCursor
  }
}
