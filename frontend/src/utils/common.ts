
/**
 * Checks if `value`is an empty string.
 *
 * @param {string} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an empty string, `false` otherwise.
 */
export function isStringEmpty(value: string): boolean {
  if (!isString(value)) {
    throw new Error('The `value` property must be a string.');
  }

  return value.trim() === '';
}

/**
 * Checks if `value` is classified as a `String` primitive.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, `false` otherwise.
 */
export function isString(value: unknown): boolean {
  return typeof value === 'string';
}

/**
 * Convert a timestamp value either in `string` or `number` to formatted date as YYYY-MM-DD HH:mm:ss.
 *
 * @param {string|number|undefined} timestampMs The timestamp in miliseconds.
 * @returns {string} Returns a `string` representing the timestamp in the following date format: YYYY-MM-DD HH:mm:ss.
 */
export function fromPosixMsToUtcDateFormat(timestampMs: string | number | undefined): string {
  if (timestampMs == null) {
    return "";
  }

  const ts = typeof timestampMs === 'string' ? parseInt(timestampMs, 10) : timestampMs
  const date = new Date(ts)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function firstLetterUpperCase(value: string) {
  if (!isString(value)) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function truncateAddress(address?: string | null, numOfCharacters = 4) {
  if (address == null) return '';

  const firstPart = address.substring(0, numOfCharacters + 1)
  const secondPart = address.substring(address?.length - numOfCharacters)

  return `${firstPart}...${secondPart}`
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}
