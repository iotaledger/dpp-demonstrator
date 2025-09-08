/*
Move Object Decoding Patterns:
┌─────────────────────────────────────────────────────────────┐
│                    Move Object Structure                    │
├─────────────────────────────────────────────────────────────┤
│ JSON-RPC Response                                           │
│ ┌─ result                                                   │
│   ├─ data ──────────────── Object Container                 │
│   │ ├─ objectId           │ Blockchain ID                   │
│   │ ├─ version            │ State Version                   │
│   │ ├─ digest             │ Content Hash                    │
│   │ └─ content ─────────── Move Object                      │
│     ├─ dataType           │ "moveObject"                    │
│     ├─ type               │ "package::module::Type"         │
│     └─ fields ──────────── Actual Data                      │
│       ├─ field1 ────────── Typed Field                      │
│       │ ├─ type           │ Full type path                  │
│       │ └─ fields         │ Nested data                     │
│       └─ field2...                                          │
├─────────────────────────────────────────────────────────────┤
│ Collection Patterns:                                        │
│ VecMap<K,V>: { contents: [{ key, value }] }                 │
│ VecSet<T>: { contents: [T, T, ...] }                        │
│ Vector: [T, T, ...]                                         │
│ Option<T>: T | null                                         │
├─────────────────────────────────────────────────────────────┤
│ Reference Patterns:                                         │
│ ID Object: { id: "0x..." }                                  │
│ Direct ID: "0x..."                                          │
│ Variant: { variant: "Name", fields: { pos0: value } }       │
└─────────────────────────────────────────────────────────────┘

Decoding Flow:
JSON-RPC → Parse Structure → Identify Patterns → Extract Data → JavaScript Object
*/

/**
 * Represents a decoded Move object with metadata and structured fields
 */
interface DecodedMoveObject {
  /** The blockchain object identifier */
  objectId: string;
  /** Version number of this object state */
  version: string;
  /** Cryptographic digest of the object content */
  digest: string;
  /** The Move type identifier (package::module::TypeName) */
  moveType: string;
  /** Decoded fields as native JavaScript objects */
  data: Record<string, any>;
  /** Original raw fields for debugging */
  raw?: any;
}

/**
 * Represents a typed Move field with decoded content
 */
interface DecodedMoveField {
  /** The Move type string */
  moveType: string;
  /** Decoded value in JavaScript-native format */
  value: any;
  /** Whether this field contains nested Move objects */
  isComplex: boolean;
}

/**
 * Configuration for Move type decoding behavior
 */
interface MoveDecodingConfig {
  /** Whether to preserve raw fields for debugging */
  preserveRaw?: boolean;
  /** Whether to recursively decode nested objects */
  deepDecode?: boolean;
  /** Custom type decoders for specific Move types */
  customDecoders?: Record<string, (data: any) => any>;
  /** Whether to convert Move IDs to simple strings */
  simplifyIds?: boolean;
}

/**
 * Decodes a complete Move object from JSON-RPC response
 * 
 * Decoding Process:
 * ┌─ JSON Input ─┐    ┌─ Parse Meta ─┐    ┌─ Decode Fields ─┐    ┌─ JS Object ─┐
 * │ Nested Move  │ →  │ ID, Version  │ →  │ Type Analysis   │ →  │ Clean Data  │
 * │ Structure    │    │ Type, Digest │    │ Pattern Match   │    │ Structure   │
 * └──────────────┘    └──────────────┘    └─────────────────┘    └─────────────┘
 * 
 * @param jsonRpcResponse - The raw JSON-RPC response from iota_getObject
 * @param config - Optional decoding configuration
 * @returns DecodedMoveObject with JavaScript-native data
 * 
 * @example
 * ```typescript
 * const response = await fetch('https://api.testnet.iota.cafe/', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     jsonrpc: "2.0",
 *     id: 1,
 *     method: "iota_getObject",
 *     params: ["0x93f6e173...", {"showContent": true}]
 *   })
 * });
 * const jsonData = await response.json();
 * const decoded = decodeMoveObject(jsonData);
 * 
 * // Access decoded data
 * console.log(decoded.data.governance.rootAuthorities);
 * ```
 */
function decodeMoveObject(jsonRpcResponse: any, config: MoveDecodingConfig = {}): DecodedMoveObject {
  const { preserveRaw = false, deepDecode = true, simplifyIds = true } = config;

  const data = jsonRpcResponse.result?.data;
  if (!data) {
    throw new Error('Invalid JSON-RPC response: missing result.data');
  }

  const content = data.content;
  if (!content || content.dataType !== 'moveObject') {
    throw new Error('Invalid Move object: missing or invalid content');
  }

  const decodedFields = deepDecode
    ? decodeFields(content.fields, config)
    : content.fields;

  return {
    objectId: data.objectId,
    version: data.version,
    digest: data.digest,
    moveType: content.type,
    data: decodedFields,
    ...(preserveRaw && { raw: content.fields })
  };
}

/**
 * Recursively decodes Move fields based on their type patterns
 * 
 * Field Decoding Strategy:
 * ┌─ Field Analysis ─┐
 * │ Has "type"?      │ ─Yes→ ┌─ Type Pattern Match ─┐
 * │ Has "fields"?    │       │ VecMap → Map<K,V>    │
 * │ Has "variant"?   │       │ VecSet → Array<T>    │
 * │ Array?           │       │ ID → String          │
 * │ Primitive?       │       │ Enum → Value         │
 * └──────────────────┘       │ Custom → Decoder     │
 *          │                 └──────────────────────┘
 *          No
 *          ↓
 * ┌─ Direct Value ─┐
 * │ Return as-is   │
 * └────────────────┘
 * 
 * @param fields - Raw Move fields object
 * @param config - Decoding configuration
 * @returns Decoded fields object
 */
function decodeFields(fields: any, config: MoveDecodingConfig = {}): Record<string, any> {
  if (!fields || typeof fields !== 'object') {
    return fields;
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(fields)) {
    result[key] = decodeFieldValue(value, config);
  }

  return result;
}

/**
 * Decodes a single field value based on its structure
 * 
 * @param value - The field value to decode
 * @param config - Decoding configuration
 * @returns Decoded value
 */
function decodeFieldValue(value: any, config: MoveDecodingConfig = {}): any {
  if (value === null || value === undefined) {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => decodeFieldValue(item, config));
  }

  // Handle primitives
  if (typeof value !== 'object') {
    return value;
  }

  // Handle Move object with type information
  if (value.type) {
    return decodeMoveField(value, config);
  }

  // Handle variant (enum) types
  if (value.variant && value.fields) {
    return decodeMoveVariant(value, config);
  }

  // Handle ID objects
  if (value.id && config.simplifyIds !== false) {
    return value.id;
  }

  // Handle nested objects
  if (value.fields) {
    return decodeFields(value.fields, config);
  }

  // Handle plain objects recursively
  if (typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = decodeFieldValue(v, config);
    }
    return result;
  }

  return value;
}

/**
 * Decodes Move fields with type information using pattern matching
 * 
 * Type Pattern Recognition:
 * ┌─ Type String Analysis ─┐
 * │ "::vec_map::VecMap"    │ → extractVecMap()
 * │ "::vec_set::VecSet"    │ → extractVecSet()  
 * │ "::option::Option"     │ → extractOption()
 * │ Custom types           │ → Custom decoder or recursive decode
 * └────────────────────────┘
 * 
 * @param field - Move field with type and fields
 * @param config - Decoding configuration
 * @returns Decoded field value
 */
function decodeMoveField(field: any, config: MoveDecodingConfig = {}): any {
  const { customDecoders = {} } = config;
  const type = field.type;

  // Try custom decoder first
  if (customDecoders[type]) {
    return customDecoders[type](field);
  }

  // Pattern matching for known Move types
  if (type.includes('::vec_map::VecMap')) {
    return extractVecMapToObject(field);
  }

  if (type.includes('::vec_set::VecSet')) {
    return extractVecSetToArray(field);
  }

  if (type.includes('::option::Option')) {
    return extractOption(field);
  }

  // For other types, recursively decode the fields
  if (field.fields) {
    return decodeFields(field.fields, config);
  }

  return field;
}

/**
 * Decodes Move variant (enum) types
 * 
 * Variant Pattern:
 * { "variant": "EnumVariant", "fields": { "pos0": actualValue } }
 * ↓
 * { type: "EnumVariant", value: actualValue }
 * 
 * @param variant - Move variant object
 * @param config - Decoding configuration
 * @returns Decoded variant
 */
function decodeMoveVariant(variant: any, config: MoveDecodingConfig = {}): any {
  const variantName = variant.variant;
  const fields = variant.fields;

  // For simple variants with single value
  if (fields && fields.pos0 !== undefined) {
    return {
      type: variantName,
      value: decodeFieldValue(fields.pos0, config)
    };
  }

  // For complex variants
  return {
    type: variantName,
    fields: decodeFields(fields, config)
  };
}

/**
 * Extracts VecMap into a JavaScript Map or Object
 * 
 * VecMap Structure:
 * { fields: { contents: [{ fields: { key: K, value: V } }] } }
 * ↓
 * Map<K, V> or { [key]: value }
 * 
 * @param vecMap - VecMap Move object
 * @returns Map or object with key-value pairs
 */
function extractVecMapToObject(vecMap: any): Record<string, any> {
  const contents = vecMap.fields?.contents || [];
  const result: Record<string, any> = {};

  for (const entry of contents) {
    if (entry.fields?.key !== undefined && entry.fields?.value !== undefined) {
      const key = String(entry.fields.key);
      result[key] = decodeFieldValue(entry.fields.value, {});
    }
  }

  return result;
}

/**
 * Extracts VecSet into a JavaScript Array
 * 
 * @param vecSet - VecSet Move object
 * @returns Array of decoded values
 */
function extractVecSetToArray(vecSet: any): any[] {
  const contents = vecSet.fields?.contents || [];
  return contents.map((item: any) => decodeFieldValue(item, {}));
}

/**
 * Extracts Option type (nullable value)
 * 
 * @param option - Option Move object
 * @returns The contained value or null
 */
function extractOption(option: any): any | null {
  if (option.fields?.vec && Array.isArray(option.fields.vec) && option.fields.vec.length > 0) {
    return decodeFieldValue(option.fields.vec[0], {});
  }
  return null;
}

/**
 * Utility function to get a decoded field by path
 * 
 * @param decodedObject - DecodedMoveObject to search in
 * @param path - Dot-separated path string
 * @returns Value at path or undefined
 * 
 * @example
 * ```typescript
 * const authorities = getDecodedFieldByPath(decoded, 'governance.rootAuthorities');
 * const firstRole = getDecodedFieldByPath(decoded, 'governance.properties.roles[0]');
 * ```
 */
function getDecodedFieldByPath(decodedObject: DecodedMoveObject, path: string): any {
  const pathParts = path.split('.').flatMap(part => {
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      return [arrayMatch[1], parseInt(arrayMatch[2])];
    }
    return [part];
  });

  let current = decodedObject.data;

  for (const part of pathParts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof part === 'number') {
      current = current[part];
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Creates a type-safe decoder for specific Move types
 * 
 * @param moveType - The Move type to create decoder for
 * @param decoder - Decoder function
 * @returns Configured decoder function
 * 
 * @example
 * ```typescript
 * const federationDecoder = createMoveTypeDecoder(
 *   '::main::Federation',
 *   (data) => ({
 *     id: data.id,
 *     authorities: data.root_authorities.map(auth => ({
 *       accountId: auth.account_id,
 *       id: auth.id.id
 *     }))
 *   })
 * );
 * ```
 */
function createMoveTypeDecoder<T>(
  moveType: string,
  decoder: (data: any) => T
): (field: any) => T {
  return (field: any) => {
    if (!field.type.includes(moveType)) {
      throw new Error(`Expected type containing "${moveType}", got "${field.type}"`);
    }
    return decoder(field.fields || field);
  };
}

// Export all interfaces and functions
export {
  type DecodedMoveObject,
  type DecodedMoveField,
  type MoveDecodingConfig,
  decodeMoveObject,
  decodeFields,
  decodeFieldValue,
  decodeMoveField,
  decodeMoveVariant,
  extractVecMapToObject,
  extractVecSetToArray,
  extractOption,
  getDecodedFieldByPath,
  createMoveTypeDecoder
};

// Usage Examples with Federation JSON:
/*
┌─────────────────────────────────────────────────────────────┐
│                     Usage Examples                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. BASIC FEDERATION DECODING:                               │
│                                                             │
│ const federationResponse = await fetch(rpcUrl, {            │
│   method: 'POST',                                           │
│   body: JSON.stringify({                                    │
│     jsonrpc: "2.0",                                         │
│     id: 1,                                                  │
│     method: "iota_getObject",                               │
│     params: ["0x93f6e173...", {"showContent": true}]       │
│   })                                                        │
│ });                                                         │
│                                                             │
│ const jsonData = await federationResponse.json();          │
│ const decoded = decodeMoveObject(jsonData);                 │
│                                                             │
│ console.log('Federation ID:', decoded.objectId);           │
│ console.log('Federation Type:', decoded.moveType);         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 2. EXTRACT ALLOWED ROLES:                                  │
│                                                             │
│ // Direct path access                                       │
│ const roles = getDecodedFieldByPath(decoded,                │
│   'governance.properties.data.role.allowed_values');       │
│                                                             │
│ console.log('Allowed roles:', roles);                      │
│ // Output: ["manufacturer", "repairer"]                     │
│                                                             │
│ // Alternative: navigate decoded structure                  │
│ const governance = decoded.data.governance;                 │
│ const properties = governance.properties.data;             │
│ const roleProperty = Object.values(properties).find(       │
│   prop => prop.name && prop.name.names.includes('role')    │
│ );                                                          │
│ const allowedRoles = roleProperty?.allowed_values || [];   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 3. GET ROOT AUTHORITIES:                                    │
│                                                             │
│ const rootAuthorities = decoded.data.root_authorities;     │
│ console.log('Root authorities:');                          │
│ rootAuthorities.forEach(auth => {                          │
│   console.log(`- Account: ${auth.account_id}`);            │
│   console.log(`  ID: ${auth.id}`);                         │
│ });                                                         │
│                                                             │
│ // Or using path access                                     │
│ const firstAuthority = getDecodedFieldByPath(decoded,      │
│   'root_authorities[0].account_id');                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 4. EXTRACT ENTITY ACCREDITATIONS:                          │
│                                                             │
│ const accreditations = decoded.data.governance             │
│   .accreditations_to_attest;                               │
│                                                             │
│ Object.entries(accreditations).forEach(([entityId, data]) => { │
│   console.log(`Entity ${entityId}:`);                      │
│   data.accreditations.forEach(accred => {                  │
│     console.log(`- Accredited by: ${accred.accredited_by}`); │
│     console.log(`- Role: ${accred.properties.role?.value}`); │
│   });                                                       │
│ });                                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 5. CUSTOM DECODER FOR CLEAN EXTRACTION:                    │
│                                                             │
│ const federationDecoder = createMoveTypeDecoder(           │
│   '::main::Federation',                                     │
│   (data) => ({                                             │
│     federationId: data.id,                                 │
│     authorities: data.root_authorities.map(auth => ({      │
│       accountId: auth.account_id,                          │
│       id: auth.id                                          │
│     })),                                                    │
│     revokedAuthorities: data.revoked_root_authorities || [],│
│     allowedRoles: data.governance.properties.data.role     │
│       ?.allowed_values || []                               │
│   })                                                        │
│ );                                                          │
│                                                             │
│ const config: MoveDecodingConfig = {                       │
│   customDecoders: {                                        │
│     [decoded.moveType]: federationDecoder                  │
│   }                                                         │
│ };                                                          │
│                                                             │
│ const cleanDecoded = decodeMoveObject(jsonData, config);   │
│ console.log(cleanDecoded.data);                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 6. DEBUGGING WITH RAW DATA:                                │
│                                                             │
│ const debugDecoded = decodeMoveObject(jsonData, {          │
│   preserveRaw: true,                                       │
│   deepDecode: false                                        │
│ });                                                         │
│                                                             │
│ console.log('Raw fields:', debugDecoded.raw);              │
│ console.log('Decoded fields:', debugDecoded.data);         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 7. WORKING WITH VECMAP COLLECTIONS:                        │
│                                                             │
│ // VecMap becomes a regular JS object                      │
│ const accreditationsToAttest = decoded.data.governance     │
│   .accreditations_to_attest;                               │
│                                                             │
│ // Access by entity ID                                      │
│ const manufacturerAccreds = accreditationsToAttest[        │
│   '0xa77cc3269b20ed6e8dd08637feabb2c4eb177463bfb466fdff4b91a0291c729d' │
│ ];                                                          │
│                                                             │
│ console.log('Manufacturer accreditations:', manufacturerAccreds); │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 8. ERROR HANDLING:                                         │
│                                                             │
│ try {                                                       │
│   const decoded = decodeMoveObject(jsonData);              │
│   const roles = getDecodedFieldByPath(decoded, 'invalid.path'); │
│   if (!roles) {                                            │
│     console.log('Path not found');                         │
│   }                                                         │
│ } catch (error) {                                          │
│   console.error('Decoding failed:', error.message);       │
│ }                                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

FEDERATION-SPECIFIC HELPER FUNCTIONS:

function getFederationAllowedRoles(decoded: DecodedMoveObject): string[] {
  const roleProperty = getDecodedFieldByPath(decoded, 
    'governance.properties.data.role.allowed_values') || [];
  return roleProperty.map((role: any) => 
    typeof role === 'object' ? role.value : role
  );
}

function getFederationAuthorities(decoded: DecodedMoveObject) {
  return {
    active: decoded.data.root_authorities || [],
    revoked: decoded.data.revoked_root_authorities || []
  };
}

function getFederationAccreditations(decoded: DecodedMoveObject) {
  return {
    toAccredit: decoded.data.governance.accreditations_to_accredit || {},
    toAttest: decoded.data.governance.accreditations_to_attest || {}
  };
}

// Usage:
const decoded = decodeMoveObject(federationResponse);
const allowedRoles = getFederationAllowedRoles(decoded);
console.log('Federation allows these roles:', allowedRoles);
// Output: ["manufacturer", "repairer"]
*/
