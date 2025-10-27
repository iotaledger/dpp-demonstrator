export default function (address = '', numOfCharacters = 4) {
  const firstPart = address.substring(0, numOfCharacters + 1)
  const secondPart = address.substring(address?.length - numOfCharacters)

  return `${firstPart}...${secondPart}`
}
