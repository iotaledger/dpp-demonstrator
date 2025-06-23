export default function (did: string) {
  const splittedString = did.split(':')
  const lastIndex = splittedString.length - 1

  return `https://explorer.iota.org/object/${splittedString[lastIndex]}?network=testnet`
}
