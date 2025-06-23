import truncateAddress from './truncateAddress'

export default function (did: string): string {
  const splittedString = did.split(':')
  const lastIndex = splittedString.length - 1
  splittedString[lastIndex] = truncateAddress(splittedString[lastIndex])

  return splittedString.join(':')
}
